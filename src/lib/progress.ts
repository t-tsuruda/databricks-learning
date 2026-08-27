import { prisma } from "@/lib/prisma";
import type { LessonType, ProgressStatus } from "@prisma/client";

export type LessonSummary = {
  id: string;
  slug: string;
  title: string;
  type: LessonType;
  orderIndex: number;
  isCompleted: boolean;
  relatedJobs: string[];
};

export type CourseSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  missionText: string;
  level: number;
  orderIndex: number;
  lessons: LessonSummary[];
  totalLessons: number;
  completedLessons: number;
  percent: number;
  status: ProgressStatus;
};

export type Badge = {
  id: string;
  label: string;
  description: string;
  achieved: boolean;
};

export type ProgressSummary = {
  courses: CourseSummary[];
  totalLessons: number;
  totalCompleted: number;
  overallPercent: number;
  currentLevel: number;
  nextGoal: { course: CourseSummary; lesson: LessonSummary } | null;
  achievedOutcomes: string[];
  relatedJobs: string[];
  nextLevelJobs: string[];
  badges: Badge[];
  completedCoursesCount: number;
};

function splitJobs(value: string): string[] {
  return value
    .split(",")
    .map((job) => job.trim())
    .filter(Boolean);
}

export async function getProgressSummary(userId: string): Promise<ProgressSummary> {
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: [{ level: "asc" }, { orderIndex: "asc" }],
    include: { lessons: { orderBy: { orderIndex: "asc" } } },
  });

  const completedLessonProgress = await prisma.userLessonProgress.findMany({
    where: { userId, isCompleted: true },
    orderBy: { completedAt: "desc" },
    include: { lesson: true },
  });

  const completedLessonIds = new Set(completedLessonProgress.map((lp) => lp.lessonId));

  let totalLessons = 0;
  let totalCompleted = 0;

  const courseSummaries: CourseSummary[] = courses.map((course) => {
    const lessons: LessonSummary[] = course.lessons.map((lesson) => ({
      id: lesson.id,
      slug: lesson.slug,
      title: lesson.title,
      type: lesson.type,
      orderIndex: lesson.orderIndex,
      isCompleted: completedLessonIds.has(lesson.id),
      relatedJobs: splitJobs(lesson.relatedJobs),
    }));

    const completed = lessons.filter((lesson) => lesson.isCompleted).length;
    totalLessons += lessons.length;
    totalCompleted += completed;

    const percent = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;
    const status: ProgressStatus =
      lessons.length > 0 && percent === 100 ? "COMPLETED" : completed > 0 ? "IN_PROGRESS" : "NOT_STARTED";

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      missionText: course.missionText,
      level: course.level,
      orderIndex: course.orderIndex,
      lessons,
      totalLessons: lessons.length,
      completedLessons: completed,
      percent,
      status,
    };
  });

  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const firstIncompleteCourse = courseSummaries.find((course) => course.status !== "COMPLETED");
  const currentLevel = firstIncompleteCourse ? firstIncompleteCourse.level : 4;

  let nextGoal: ProgressSummary["nextGoal"] = null;
  if (firstIncompleteCourse) {
    const nextLesson = firstIncompleteCourse.lessons.find((lesson) => !lesson.isCompleted);
    if (nextLesson) {
      nextGoal = { course: firstIncompleteCourse, lesson: nextLesson };
    }
  }

  const outcomeSet = new Set<string>();
  for (const progress of completedLessonProgress) {
    if (outcomeSet.size >= 5) break;
    try {
      const outcomes = JSON.parse(progress.lesson.outcomesJson) as unknown;
      if (Array.isArray(outcomes)) {
        for (const outcome of outcomes) {
          if (typeof outcome === "string" && outcomeSet.size < 5) {
            outcomeSet.add(outcome);
          }
        }
      }
    } catch {
      // ignore malformed outcomes JSON
    }
  }

  const jobSet = new Set<string>();
  for (const progress of completedLessonProgress) {
    for (const job of splitJobs(progress.lesson.relatedJobs)) {
      jobSet.add(job);
    }
  }
  const relatedJobs = Array.from(jobSet).slice(0, 8);

  const nextLevelJobs = firstIncompleteCourse
    ? Array.from(new Set(firstIncompleteCourse.lessons.flatMap((lesson) => lesson.relatedJobs))).slice(0, 8)
    : [];

  const completedCoursesCount = courseSummaries.filter((course) => course.status === "COMPLETED").length;

  const badges: Badge[] = [
    {
      id: "first_lesson",
      label: "はじめの一歩",
      description: "最初のレッスンを完了した",
      achieved: totalCompleted >= 1,
    },
    {
      id: "first_course",
      label: "初コース修了",
      description: "1つのコースを最後まで完了した",
      achieved: completedCoursesCount >= 1,
    },
    {
      id: "halfway",
      label: "折り返し地点",
      description: "全体の学習の半分を完了した",
      achieved: overallPercent >= 50,
    },
    {
      id: "databricks_ready",
      label: "Databricks入門突破",
      description: "Level 2（Databricks入門）に到達した",
      achieved: currentLevel >= 2,
    },
    {
      id: "all_complete",
      label: "全課程修了",
      description: "現在公開されている全コースを完了した",
      achieved: totalLessons > 0 && overallPercent === 100,
    },
  ];

  return {
    courses: courseSummaries,
    totalLessons,
    totalCompleted,
    overallPercent,
    currentLevel,
    nextGoal,
    achievedOutcomes: Array.from(outcomeSet),
    relatedJobs,
    nextLevelJobs,
    badges,
    completedCoursesCount,
  };
}

export async function recomputeCourseProgress(userId: string, courseId: string) {
  const [totalLessons, completedLessons] = await Promise.all([
    prisma.lesson.count({ where: { courseId } }),
    prisma.userLessonProgress.count({
      where: { userId, isCompleted: true, lesson: { courseId } },
    }),
  ]);

  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const status: ProgressStatus = percent === 100 && totalLessons > 0 ? "COMPLETED" : completedLessons > 0 ? "IN_PROGRESS" : "NOT_STARTED";

  await prisma.userCourseProgress.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      status,
      progressPercent: percent,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
    update: {
      status,
      progressPercent: percent,
      completedAt: status === "COMPLETED" ? new Date() : null,
    },
  });
}
