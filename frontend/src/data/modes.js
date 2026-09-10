// Central definition of the five RAG modes. All are enabled — each
// currently talks to the same dummy backend endpoints, differentiated
// only by the `mode` value sent in the request payload.

export const MODES = [
  {
    id: "normal",
    index: "01",
    name: "None",
    description: "Standard RAG without any defense.",
    status: "available",
    route: "/target-llm/normal",
    featured: false,
  },
  {
    id: "perplexity",
    index: "02",
    name: "Perplexity Detection",
    description: "Perplexity-based poisoning detection.",
    status: "available",
    route: null,
    featured: false,
  },
  {
    id: "knowledge-extension",
    index: "03",
    name: "Knowledge Extension",
    description: "Knowledge-extension defense.",
    status: "available",
    route: null,
    featured: false,
  },
  {
    id: "repeated-text-filtering",
    index: "04",
    name: "Repeated Text Filtering",
    description: "Filters documents with anomalously repeated text.",
    status: "available",
    route: null,
    featured: false,
  },
  {
    id: "ragshield",
    index: "05",
    name: "RAG-Shield",
    description: "Our proposed RAG poisoning defense.",
    status: "available",
    route: null,
    featured: true,
  },
];
