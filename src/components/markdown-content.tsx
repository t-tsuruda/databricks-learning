import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-content max-w-none text-sm leading-relaxed text-foreground">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: (props) => <h3 className="mt-4 mb-2 text-base font-semibold" {...props} />,
          h3: (props) => <h4 className="mt-3 mb-1 font-semibold" {...props} />,
          p: (props) => <p className="mb-3" {...props} />,
          ul: (props) => <ul className="mb-3 list-disc space-y-1 pl-5" {...props} />,
          ol: (props) => <ol className="mb-3 list-decimal space-y-1 pl-5" {...props} />,
          code: (props) => (
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs" {...props} />
          ),
          pre: (props) => (
            <pre className="mb-3 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100" {...props} />
          ),
          table: (props) => (
            <div className="mb-3 overflow-x-auto">
              <table className="min-w-full border-collapse text-xs" {...props} />
            </div>
          ),
          th: (props) => <th className="border border-border bg-slate-50 px-2 py-1 text-left" {...props} />,
          td: (props) => <td className="border border-border px-2 py-1" {...props} />,
          a: (props) => (
            <a className="text-brand underline hover:no-underline" target="_blank" rel="noopener noreferrer" {...props} />
          ),
          img: (props) => (
            // eslint-disable-next-line @next/next/no-img-element -- content images are admin-uploaded data: URIs or arbitrary external URLs, not optimizable by next/image
            <img className="mb-3 max-w-full rounded-lg border border-border" alt={props.alt ?? ""} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
