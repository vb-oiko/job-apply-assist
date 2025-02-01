import { NavigateFunction } from "react-router-dom";
import { ROUTES } from "./routes";

export class Navigation {
  constructor(private navigate: NavigateFunction) {}

  toHome = () => {
    this.navigate(ROUTES.HOME);
  };

  toLogin = () => {
    this.navigate(ROUTES.LOGIN);
  };

  toSignup = () => {
    this.navigate(ROUTES.SIGNUP);
  };

  toPositions = {
    list: () => {
      this.navigate(ROUTES.POSITIONS.LIST);
    },
    create: () => {
      this.navigate(ROUTES.POSITIONS.CREATE);
    },
    edit: (id: string) => {
      this.navigate(ROUTES.POSITIONS.EDIT(id));
    },
  };
}

export const createNavigation = (navigate: NavigateFunction) => new Navigation(navigate);
