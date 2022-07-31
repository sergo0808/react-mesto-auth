import React from "react";
import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Register = ({ onRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ email, password }).then(() => history.push("/signin"));
  };

  return (
    <div className="login__container">
      <form className="login__form" onSubmit={handleSubmit}>
        <h2 className="login__title">Регистрация</h2>
        <input
          type="Email"
          className="login__input popup__input_email_active"
          id="email-profile"
          name="email"
          placeholder="Email"
          minLength="2"
          maxLength="40"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
          autoComplete="on"
          required
        />

        <input
          type="password"
          className="login__input login__input_password_active"
          id="password-profile"
          name="password"
          autoComplete="on"
          placeholder="Пароль"
          minLength="2"
          maxLength="200"
          required
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <button type="submit" className="login__submit">
          Зарегистрироваться
        </button>
        <Link to="signin" className="login__link  ">
          Уже зарегистрированы? Войти
        </Link>
      </form>
    </div>
  );
};

export default Register;
