import { create } from "zustand";

type Store = {
  selected: string;
  setSelected: (selected: string) => void;
};

const useNavigationStore = create<Store>()((set) => ({
  selected: "inbound",
  setSelected: (selected) => set(() => ({ selected })),
}));

export default useNavigationStore;
