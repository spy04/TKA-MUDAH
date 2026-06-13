"use client";

import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { convertLatexToMarkup } from "mathlive/ssr";

type MathRichTextProps = {
  text: string;
  className?: string;
  inline?: boolean;
};

type Segment =
  | { type: "text"; value: string }
  | { type: "image"; alt: string; src: string };

type ParagraphBlock = {
  type: "paragraph";
  text: string;
};

type TableBlock = {
  type: "table";
  rows: string[][];
};

type ContentBlock = ParagraphBlock | TableBlock;

function looksLikeMathContent(text: string) {
  return /\\[a-zA-Z]+|[{}_^]|(?:\d+\s*\/\s*\d+)|\$\$?/.test(text);
}

function parseContentSegments(text: string): Segment[] {
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const segments: Segment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(imagePattern)) {
    const [rawValue, alt, src] = match;
    const startIndex = match.index ?? 0;

    if (startIndex > lastIndex) {
      segments.push({
        type: "text",
        value: text.slice(lastIndex, startIndex),
      });
    }

    segments.push({
      type: "image",
      alt: alt || "Gambar soal",
      src,
    });

    lastIndex = startIndex + rawValue.length;
  }

  if (lastIndex < text.length) {
    segments.push({
      type: "text",
      value: text.slice(lastIndex),
    });
  }

  return segments.filter((segment) => (segment.type === "image" ? true : Boolean(segment.value.trim())));
}

function isTableLine(line: string) {
  return /^\|.+\|$/.test(line.trim());
}

function parseTableRow(line: string) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseTextBlocks(text: string): ContentBlock[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const blocks: ContentBlock[] = [];
  let paragraphBuffer: string[] = [];
  let tableRows: string[][] = [];

  function flushParagraph() {
    const paragraph = paragraphBuffer.join("\n").trim();

    if (paragraph) {
      blocks.push({
        type: "paragraph",
        text: paragraph,
      });
    }

    paragraphBuffer = [];
  }

  function flushTable() {
    if (tableRows.length > 0) {
      blocks.push({
        type: "table",
        rows: tableRows,
      });
    }

    tableRows = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (isTableLine(line)) {
      flushParagraph();
      tableRows.push(parseTableRow(line));
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushTable();
      continue;
    }

    flushTable();
    paragraphBuffer.push(line);
  }

  flushParagraph();
  flushTable();
  return blocks;
}

function renderInlineText(text: string, key: string, inline: boolean) {
  if (!text.trim()) {
    return <Fragment key={key} />;
  }

  if (!looksLikeMathContent(text)) {
    return <Fragment key={key}>{text}</Fragment>;
  }

  const markup = convertLatexToMarkup(text, {
    defaultMode: inline ? "inline-math" : "math",
  });

  return <span key={key} dangerouslySetInnerHTML={{ __html: markup }} />;
}

function renderParagraph(text: string, blockKey: string) {
  return (
    <p key={blockKey} className="question-preview-text">
      {text.split("\n").map((line, lineIndex, allLines) => (
        <Fragment key={`${blockKey}-line-${lineIndex}`}>
          {renderInlineText(line, `${blockKey}-content-${lineIndex}`, true)}
          {lineIndex < allLines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </p>
  );
}

function renderTable(block: TableBlock, key: string) {
  const [headRow, ...bodyRows] = block.rows;

  return (
    <div key={key} className="question-preview-table-wrap">
      <table className="question-preview-table">
        {headRow ? (
          <thead>
            <tr>
              {headRow.map((cell, index) => (
                <th key={`${key}-head-${index}`}>{renderInlineText(cell, `${key}-head-text-${index}`, true)}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={`${key}-row-${rowIndex}`}>
              {row.map((cell, cellIndex) => (
                <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>
                  {renderInlineText(cell, `${key}-cell-text-${rowIndex}-${cellIndex}`, true)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTextBlocks(text: string) {
  const blocks = parseTextBlocks(text);

  if (blocks.length === 0) {
    return text;
  }

  return blocks.map((block, index): ReactNode => {
    const key = `block-${index}`;

    if (block.type === "table") {
      return renderTable(block, key);
    }

    return renderParagraph(block.text, key);
  });
}

export function MathRichText({ text, className, inline = false }: MathRichTextProps) {
  const Container = inline ? "span" : "div";
  const segments = parseContentSegments(text);

  if (segments.some((segment) => segment.type === "image")) {
    return (
      <Container className={className}>
        {segments.map((segment, index) => {
          if (segment.type === "image") {
            return (
              <Image
                key={`${segment.src}-${index}`}
                src={segment.src}
                alt={segment.alt}
                width={1200}
                height={900}
                unoptimized
                className={inline ? "mt-3 max-h-40 rounded-xl border border-[#dce6f5] object-contain" : "mt-4 max-h-[360px] rounded-[20px] border border-[#dce6f5] bg-white object-contain"}
              />
            );
          }

          if (inline) {
            return renderInlineText(segment.value, `text-${index}`, true);
          }

          return <Fragment key={`block-${index}`}>{renderTextBlocks(segment.value)}</Fragment>;
        })}
      </Container>
    );
  }

  if (inline) {
    return <Container className={className}>{renderInlineText(text, "inline-root", true)}</Container>;
  }

  return <Container className={className}>{renderTextBlocks(text)}</Container>;
}
