import {
  LoginActions,
  LoginState,
  BreadCrumbActions,
  BreadcrumbState,
  Crumb,
} from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * a store to manage breadcrumb state
 * each crumb has a label and a href
 */
export const useBreadcrumbStore = create<BreadcrumbState & BreadCrumbActions>()(
  persist(
    (set) => ({
      crumbs: [],
      setCrumbs: (crumbs: Crumb[]) => set({ crumbs }),
      addCrumb: (crumb: Crumb) =>
        set((state) => ({ crumbs: [...state.crumbs, crumb] })),
    }),
    {
      name: "sideNav",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useLoginStore = create<LoginState & LoginActions>()(
  persist(
    (set) => ({
      login: false,
      username: "Amar Matta",
      setLogin: (login: boolean) => set({ login, username: "Amar Matta" }),
    }),
    {
      name: "login",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
