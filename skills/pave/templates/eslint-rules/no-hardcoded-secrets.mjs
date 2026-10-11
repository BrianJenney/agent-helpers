const secretShapes = [
  /[a-z]+:\/\/[^\s:/@]+:[^\s@/]+@/i,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(sk|pk|rk)_(live|test)_[0-9a-zA-Z]{10,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./,
];

const secretName = /(secret|password|passwd|token|api_?key|private_?key)/i;

function stringValue(node) {
  if (!node) return null;
  if (node.type === "CallExpression" && node.callee.type === "MemberExpression") {
    const isDefault = node.callee.property.type === "Identifier" && node.callee.property.name === "default";
    const fromArguments = isDefault ? node.arguments.map(stringValue).find((value) => value !== null) : undefined;
    return fromArguments ?? stringValue(node.callee.object);
  }
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis.map((quasi) => quasi.value.cooked ?? "").join("");
  }
  return null;
}

function looksLikeCredential(value) {
  return value.length >= 8 && !/\s/.test(value);
}

function keyName(node) {
  if (node.type === "Identifier") return node.name;
  if (node.type === "Literal" && typeof node.value === "string") return node.value;
  return null;
}

const noHardcodedSecrets = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      secretShape: "This string looks like a secret. Read it from an env var through @/env.",
      secretName: "Do not hard-code '{{name}}'. Read it from an env var through @/env.",
    },
  },
  create(context) {
    function checkShape(node, value) {
      if (secretShapes.some((shape) => shape.test(value))) {
        context.report({ node, messageId: "secretShape" });
      }
    }
    function checkNamed(name, valueNode) {
      const value = stringValue(valueNode);
      if (name && value && looksLikeCredential(value) && secretName.test(name)) {
        context.report({ node: valueNode, messageId: "secretName", data: { name } });
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === "string") checkShape(node, node.value);
      },
      TemplateElement(node) {
        checkShape(node, node.value.cooked ?? "");
      },
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") checkNamed(node.id.name, node.init);
      },
      Property(node) {
        checkNamed(keyName(node.key), node.value);
      },
    };
  },
};

export default noHardcodedSecrets;
