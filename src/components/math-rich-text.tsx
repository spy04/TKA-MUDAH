"use client";

import { convertLatexToMarkup } from "mathlive/ssr";

type MathRichTextProps = {
  text: string;
  className?: string;
  inline?: boolean;
};

function looksLikeMathContent(text: string) {
  return /\\[a-zA-Z]+|[{}_^]|(?:\d+\s*\/\s*\d+)|\$\$?/.test(text);
}

export function MathRichText({ text, className, inline = false }: MathRichTextProps) {
  const Container = inline ? "span" : "div";

  if (!looksLikeMathContent(text)) {
    return <Container className={className}>{text}</Container>;
  }

  const markup = convertLatexToMarkup(text, {
    defaultMode: inline ? "inline-math" : "math",
  });

  return <Container className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}
