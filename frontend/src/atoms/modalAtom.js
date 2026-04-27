import { atom } from "recoil";

const createPostModalAtom = atom({
  key: "createPostModalAtom",
  default: false, // Modal is closed by default
});

export default createPostModalAtom;