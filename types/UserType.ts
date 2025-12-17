import { Theme } from "./themeType";

export type Link = {
  $id: string;
  title: string;
  href: string;
  position: number;
  users?: string;
  userId: string;
};

export type User = {
  $id: string;
  username: string;
  profileUrl: string;
  description: string;
  theme?: Theme;
  links: Link[];
  forgotVerificationCode?: string;
  forgotVerificationTime?: Date | string;
};
