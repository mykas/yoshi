export default <TemplateOptions>(
  literals: TemplateStringsArray,
  ...expressions: Array<(opts: TemplateOptions) => string>
) => {
  return (opts: TemplateOptions): string => {
    let string = '';
    for (const [i, val] of expressions.entries()) {
      const execVal = typeof val === 'function' ? val(opts) : val;
      string += literals[i] + execVal;
    }
    string += literals[literals.length - 1];
    return string;
  };
};
