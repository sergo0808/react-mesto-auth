import authLogoErorr from "../images/error_reg.svg";
import authLogo from "../images/success_reg.svg";

function InfoTooltip(props) {
  console.log(props.message);
  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen && "popup_opened"}`}>
      <div className="popup__container popup__container-avatar">
        <form className="popup__form" name={props.name} onSubmit={props.onSubmit} noValidate>
          <button
            className="popup__close-button popup__close-button_avatar "
            type="button"
            aria-label="close-btn"
            onClick={props.onClose}
          ></button>
          {props.message ? (
            <img className="popup__warning" src={authLogoErorr} alt="статус регистрации"></img>
          ) : (
            <img className="popup__warning" src={authLogo} alt="статус регистрации"></img>
          )}
          {props.message ? (
            <p className="popup__text">Что-то пошло не так! Попробуйте ещё раз.</p>
          ) : (
            <p className="popup__text">Вы успешно зарегистрировались!</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default InfoTooltip;
