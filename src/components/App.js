import React from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../utils/Api";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import PopupWithConfirm from "./PopupWithConfirm";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import * as CardAuth from "../utils/Auth";

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isWarningPopupOpen, setIsWarningPopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({});
  const history = useHistory();

  const auth = async (jwt) => {
    const content = await CardAuth.getContent(jwt).then((res) => {
      if (res) {
        console.log(setUserData);
        const { email, password } = res;
        setLoggedIn(true);
        setUserData({
          email,
          password,
        });
      }
    });
    return content;
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth(jwt);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn]);

  const onLogin = ({ email, password }) => {
    return CardAuth.authorize(email, password).then((res) => {
      if (res.jwt) {
        console.log(res);
        localStorage.setItem("jwt", res.jwt);
        setLoggedIn(true);
      }
    });
  };

  const onRegister = ({ email, password }) => {
    return CardAuth.register(email, password).then((res) => {
      if (!res || res.statusCode === 400) throw new Error("Что-то пошло не так");
      return res;
    });
  };

  function getUserInfo() {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([data, response]) => {
        setCurrentUser({ ...currentUser, name: data.name, about: data.about, avatar: data.avatar, _id: data._id });
        setCards(
          response.map((item) => ({
            _id: item._id,
            link: item.link,
            name: item.name,
            likes: item.likes,
            owner: item.owner,
          }))
        );
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  function handleCardDelete(card) {
    api
      .deleteCardApi(card._id)
      .then((deleteCard) => {
        setCards((state) => state.filter((deleteCard) => deleteCard._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => item._id === currentUser._id);
    api
      .likeCardApi(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  }

  const handleCardClick = (card) => setSelectedCard(card);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleWarnihPopupClick = () => {
    setIsWarningPopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  };

  function handleUpdateUser({ name, about }) {
    api
      .updateUserInfom({ name, about })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddCard(data) {
    api
      .addCardApi(data)
      .then((data) => {
        setCards([data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar({ avatar }) {
    api
      .updateAvatarApi({ avatar })
      .then((data) => {
        setCurrentUser(data);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header loggedIn={loggedIn} />
        <Switch>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />
          <Route path="/signin">
            <Login onLogin={onLogin} />
          </Route>
          <Route path="/signup">
            <Register onRegister={onRegister} />
          </Route>
          <Route path="/">{loggedIn ? <Redirect to="/" /> : <Redirect to="/signin" />}</Route>
        </Switch>
        <ImagePopup card={selectedCard} onClose={closeAllPopups}></ImagePopup>
        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddCard={handleAddCard} />
        <PopupWithForm title="Вы уверены ?" name="Confirm" />
        <PopupWithConfirm></PopupWithConfirm>
        <InfoTooltip
          name="Confirm"
          isOpen={isWarningPopupOpen}
          onWarningPopup={handleWarnihPopupClick}
          onClose={closeAllPopups}
          typeWarning="error"
        />
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
