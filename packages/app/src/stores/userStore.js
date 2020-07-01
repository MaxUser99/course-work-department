import { atom, selector } from 'recoil';

export const userState = atom({
  key: 'user',
  default: null,
});

export const userEditState = selector({
  key: 'userEditState',
  get: ({ get }) => {
    const user = get(userState);
    return !!user && user.allowEdit;
  }
});
