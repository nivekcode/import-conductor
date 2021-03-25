export const detectLineEnding = (value: string) => {
  if (typeof value !== 'string') {
    throw new TypeError('Expected a string for new line detection');
  }
  const newlines = value.match(/(?:\r?\n)/g) || [];

  if (newlines.length === 0) {
    return;
  }

  const crlf = newlines.filter((newline) => newline === '\r\n').length;
  const lf = newlines.length - crlf;
  console.log(crlf > lf ? 'returning r and n' : 'returning r');
  return crlf > lf ? '\r\n' : '\n';
};
