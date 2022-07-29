import React from "react";
import { Link, Route } from "react-router-dom";
import headerLogo from "../images/logo.svg";

function Header(props) {
  return (
    <div className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип" />
      <Route path="/signup">
        <Link className="header__link" to="signin">
          Войти
        </Link>
      </Route>
      <Route path="/signin">
        <Link className="header__link" to="signup">
          Регистрация
        </Link>
      </Route>
    </div>
  );
}

export default Header;
