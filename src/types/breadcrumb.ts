export type Crumb = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

export type BreadcrumbState = {
  crumbs: Crumb[];
};

export type BreadCrumbActions = {
  setCrumbs: (crumbs: Crumb[]) => void;
  addCrumb: (crumb: Crumb) => void;
};
