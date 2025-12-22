"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useRef, useEffect } from "react";

interface MarkdownRendererProps {
  content: string;
  onContentChange?: (newContent: string) => void;
  editable?: boolean;
  searchQuery?: string;
}

export function MarkdownRenderer({
  content,
  onContentChange,
  editable = false,
  searchQuery,
}: MarkdownRendererProps) {
  const [localContent, setLocalContent] = useState(content);
  const checkboxLinesRef = useRef<number[]>([]);

  // Update local content when prop changes
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  // Pre-calculate checkbox line numbers before rendering
  useEffect(() => {
    const lines = localContent.split('\n');
    const checkboxLines: number[] = [];
    lines.forEach((line, index) => {
      if (line.match(/^\s*-\s*\[[ xX]\]/)) {
        checkboxLines.push(index);
      }
    });
    checkboxLinesRef.current = checkboxLines;
  }, [localContent]);

  const handleCheckboxToggle = (lineNumber: number) => {
    if (!editable || !onContentChange) return;

    const lines = localContent.split('\n');
    const line = lines[lineNumber];

    if (!line || !line.match(/^\s*-\s*\[[ xX]\]/)) return;

    // Toggle this checkbox
    if (line.match(/\[\s\]/)) {
      lines[lineNumber] = line.replace(/\[\s\]/, '[x]');
    } else if (line.match(/\[[xX]\]/)) {
      lines[lineNumber] = line.replace(/\[[xX]\]/, '[ ]');
    }

    const newContent = lines.join('\n');
    setLocalContent(newContent);
    onContentChange(newContent);
  };

  // Helper to highlight search query in text
  const highlightText = (text: string) => {
    if (!searchQuery || !text) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-2xl prose-h1:mt-4 prose-h1:mb-3 prose-h2:text-xl prose-h2:mt-3 prose-h2:mb-2 prose-h3:text-lg prose-h3:mt-2 prose-h3:mb-2 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted prose-ul:my-2 prose-ul:pl-0 prose-ol:my-2 prose-li:my-1">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Highlight text nodes when searchQuery is present
          p: ({ node, children, ...props }) => {
            if (searchQuery && typeof children === 'string') {
              return <p {...props}>{highlightText(children)}</p>;
            }
            return <p {...props}>{children}</p>;
          },
          strong: ({ node, children, ...props }) => {
            if (searchQuery && typeof children === 'string') {
              return <strong {...props}>{highlightText(children)}</strong>;
            }
            return <strong {...props}>{children}</strong>;
          },
          em: ({ node, children, ...props }) => {
            if (searchQuery && typeof children === 'string') {
              return <em {...props}>{highlightText(children)}</em>;
            }
            return <em {...props}>{children}</em>;
          },
          ul: ({ node, ...props }) => {
            return <ul className="pl-0" {...props} />;
          },
          li: ({ node, children, ...props }) => {
            // Check if this li contains a checkbox
            const hasCheckbox = node?.children?.some(
              (child: any) => child.type === 'element' && child.tagName === 'input'
            );

            if (hasCheckbox && editable) {
              // Find which checkbox this is by matching against our pre-calculated list
              const checkboxIndex = node?.position?.start?.line ? node.position.start.line - 1 : -1;

              // Check if checkbox is checked by looking at the actual markdown content
              const lines = localContent.split('\n');
              const isChecked = checkboxIndex >= 0 && lines[checkboxIndex]?.match(/\[[xX]\]/);

              return (
                <li
                  className={`ml-0 pl-0 cursor-pointer hover:bg-accent/50 rounded transition-colors ${isChecked ? 'line-through text-muted-foreground' : ''}`}
                  style={{
                    listStyleType: 'none',
                    marginLeft: 0,
                    paddingLeft: 0,
                    ...(isChecked ? { textDecoration: 'line-through', opacity: 0.6 } : {})
                  }}
                  onClick={(e) => {
                    // Only toggle if clicking on the li itself or the checkbox
                    const target = e.target as HTMLElement;
                    if (target.tagName === 'LI' || target.tagName === 'INPUT') {
                      e.preventDefault();
                      if (checkboxIndex >= 0) {
                        handleCheckboxToggle(checkboxIndex);
                      }
                    }
                  }}
                  {...props}
                >
                  {children}
                </li>
              );
            }

            // For non-editable checkboxes, check the node properties
            const isChecked = node?.children?.some(
              (child: any) => child.type === 'element' && child.tagName === 'input' && child.properties?.checked
            );

            return (
              <li
                className={`${hasCheckbox ? 'ml-0 pl-0' : ''} ${isChecked ? 'line-through text-muted-foreground' : ''}`}
                style={hasCheckbox ? { listStyleType: 'none', marginLeft: 0, paddingLeft: 0 } : undefined}
                {...props}
              >
                {children}
              </li>
            );
          },
          input: ({ node, checked, type, ...props }) => {
            if (type === 'checkbox') {
              if (editable) {
                return (
                  <input
                    type="checkbox"
                    checked={checked}
                    readOnly
                    className="mr-2 cursor-pointer"
                  />
                );
              }
              return <input type="checkbox" checked={checked} disabled className="mr-2" />;
            }
            return <input type={type} checked={checked} {...props} />;
          },
        }}
      >
        {localContent}
      </ReactMarkdown>
    </div>
  );
}
