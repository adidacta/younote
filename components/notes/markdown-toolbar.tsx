"use client";

import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Code2,
  Link,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MarkdownToolbarProps {
  onInsert: (before: string, after?: string) => void;
}

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const tools = [
    {
      group: "formatting",
      items: [
        {
          icon: Bold,
          label: "Bold",
          onClick: () => onInsert("**", "**"),
          shortcut: "Cmd+B",
        },
        {
          icon: Italic,
          label: "Italic",
          onClick: () => onInsert("*", "*"),
          shortcut: "Cmd+I",
        },
        {
          icon: Strikethrough,
          label: "Strikethrough",
          onClick: () => onInsert("~~", "~~"),
        },
        {
          icon: Code2,
          label: "Inline Code",
          onClick: () => onInsert("`", "`"),
        },
      ],
    },
    {
      group: "headers",
      items: [
        {
          icon: Heading1,
          label: "Heading 1",
          onClick: () => onInsert("# ", ""),
        },
        {
          icon: Heading2,
          label: "Heading 2",
          onClick: () => onInsert("## ", ""),
        },
        {
          icon: Heading3,
          label: "Heading 3",
          onClick: () => onInsert("### ", ""),
        },
      ],
    },
    {
      group: "lists",
      items: [
        {
          icon: List,
          label: "Bullet List",
          onClick: () => onInsert("- ", ""),
        },
        {
          icon: ListOrdered,
          label: "Numbered List",
          onClick: () => onInsert("1. ", ""),
        },
        {
          icon: CheckSquare,
          label: "Checkbox",
          onClick: () => onInsert("- [ ] ", ""),
        },
      ],
    },
    {
      group: "code-link",
      items: [
        {
          icon: Code,
          label: "Code Block",
          onClick: () => onInsert("```\n", "\n```"),
        },
        {
          icon: Link,
          label: "Link",
          onClick: () => onInsert("[", "](url)"),
        },
      ],
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border rounded-md bg-muted/30 overflow-x-auto">
      {tools.map((group, groupIndex) => (
        <div key={group.group} className="flex items-center gap-1 flex-shrink-0">
          {group.items.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.label}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={tool.onClick}
                title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          {groupIndex < tools.length - 1 && (
            <Separator orientation="vertical" className="h-6 mx-1 flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );
}
