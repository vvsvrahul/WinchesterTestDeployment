export type LoginState = {
  login: boolean;
  username: string;
};

export type LoginActions = {
  setLogin: (login: boolean) => void;
};
