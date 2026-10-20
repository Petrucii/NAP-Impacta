import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = { children: string };

export function Markdown({ children }: Props) {
  return (
    <div className="prose-nap">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...rest }) => (
            <a {...rest} target={rest.href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer" />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
