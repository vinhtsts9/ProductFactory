export type OntologyConcept = {
  label: string;
  vi: string;
  desc: string;
  count: string;
  color: string;
  bg: string;
  rel?: {
    label: string;
    card: string;
  };
};

export type OntologyTypeGroup = {
  famName: string;
  famColor: string;
  items: {
    code: string;
    name: string;
    active?: boolean;
  }[];
};

export type OntologyCurrentType = {
  code: string;
  name: string;
  famName: string;
  famColor: string;
};

export type OntologyDecomposition = {
  etName: string;
  elName: string;
  elCode: string;
  identify?: boolean;
};

export type OntologyVocabItem = {
  code: string;
  name: string;
  short: string;
  desc: string;
  identify?: boolean;
  open?: boolean;
  elements: {
    code: string;
    name: string;
    usedBy: string;
    current?: boolean;
  }[];
};

export type OntologyOverview = {
  concepts: OntologyConcept[];
  typeGroups: OntologyTypeGroup[];
  currentType: OntologyCurrentType;
  decomposition: OntologyDecomposition[];
  vocab: OntologyVocabItem[];
};
