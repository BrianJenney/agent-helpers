const noComments = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      comment:
        "Comments are banned. Rename or restructure the code so it explains itself.",
    },
  },
  create(context) {
    return {
      Program() {
        for (const comment of context.sourceCode.getAllComments()) {
          if (comment.type === "Shebang") continue;
          context.report({ loc: comment.loc, messageId: "comment" });
        }
      },
    };
  },
};

export default noComments;
