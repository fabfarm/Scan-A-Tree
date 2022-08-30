export const scopeEval = (scope: Record<string, any>, script: string) => {
  try {
    // eslint-disable-next-line no-new-func
    return Function(`"use strict";return (${script || null})`).bind(scope)();
  } catch (e) {
    console.log({ script, scope });
    throw e;
  }
};
