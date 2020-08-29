import ts from 'typescript';

export function collectImportStatement(importSegments: any) {
  return importSegments.reduce((acc: string, segment: ts.Node) => {
    const text = segment.getText();
    if (acc === '') {
      return text;
    }
    if (text === ';') {
      return `${acc}${text}`;
    }

    return `${acc} ${text}`;
  }, '');
}
