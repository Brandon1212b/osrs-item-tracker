export type CatalogItem = {
  name: string;
  /** Filter tags for subset navigation. */
  tags: string[];
};

export type CatalogGroup = {
  id: string;
  label: string;
  kind: "gear" | "skilling";
  note: string;
  items: CatalogItem[];
};
