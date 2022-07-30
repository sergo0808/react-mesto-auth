import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handlesubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password })
      .then(() => {
        history.push("/");
      })
      .catch();
  };

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handlesubmit}>
        <h2 className="login__title">Вход</h2>
        <input
          type="Email"
          className="login__input popup__input_email_active"
          id="email-profile"
          name="email"
          placeholder="Email"
          minLength="2"
          maxLength="40"
          onChange={({ target }) => setEmail(target.value)}
          autoComplete="on"
          required
        />
        {/* <span className="popup__error" id="name-email-error"></span> */}
        <input
          type="password"
          className="login__input popup__input_password_active"
          id="passwod-profile"
          name="password"
          placeholder="Пароль"
          minLength="2"
          maxLength="200"
          onChange={({ target }) => setPassword(target.value)}
          autoComplete="on"
          required
        />
        {/* <span className="popup__error" id="password-profile-error"></span> */}
        <button className="login__submit">Войти</button>
      </form>
    </div>
  );
};

export default Login;
