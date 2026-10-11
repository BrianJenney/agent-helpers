import noComments from "./no-comments.mjs";
import noFetchInEffect from "./no-fetch-in-effect.mjs";
import noHardcodedSecrets from "./no-hardcoded-secrets.mjs";

const local = {
  meta: { name: "paved-path-local" },
  rules: {
    "no-comments": noComments,
    "no-fetch-in-effect": noFetchInEffect,
    "no-hardcoded-secrets": noHardcodedSecrets,
  },
};

export default local;
