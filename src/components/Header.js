import React from "react";
import { Link, Route } from "react-router-dom";
import headerLogo from "../images/logo.svg";

function Header(props) {
  return (
    <div className="header">
      <img className="header__logo" src={headerLogo} alt="Логотип" />
      <div className="header__info">
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
        <Route exact path="/">
          <p className="header__email">{props.userData}</p>
          <button onClick={props.signOut} className="header__btn-exit">
            Выйти
          </button>
        </Route>
      </div>
    </div>
  );
}

export default Header;
