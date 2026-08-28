export type CatalogItem = {
  name: string;
  tags: string[];
};

export type CatalogGroup = {
  id: string;
  label: string;
  kind: "gear" | "skilling";
  note: string;
  items: CatalogItem[];
};
