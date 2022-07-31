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
  const [userData, setUserData] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();

  const signOut = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    history.push("/signin");
  };

  const auth = async (token) => {
    const content = await CardAuth.getContent(token).then((data) => {
      if (data) {
        setLoggedIn(true);
        setUserData(data.data.email);
      }
    });
    return content;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      auth(token);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      history.push("/");
    }
  }, [loggedIn]);

  const onLogin = ({ email, password }) => {
    return CardAuth.authorize(email, password).then((res) => {
      if (res.token) {
        localStorage.setItem("token", res.token);
        setLoggedIn(true);
      }
    });
  };

  const onRegister = ({ email, password }) => {
    return CardAuth.register(email, password)
      .then((res) => {
        setMessage(res.error);
        setIsWarningPopupOpen(true);
      })
      .catch((res) => {
        setMessage(res.error);
        setIsWarningPopupOpen(true);
      });
  };

  function getUserInfo() {
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
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

  const handleWarningPopupClick = () => {
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
    setIsWarningPopupOpen(false);
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
        <Header userData={userData} signOut={signOut} />
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
        <InfoTooltip
          message={message}
          typeWarning="error"
          name="Confirm"
          isOpen={isWarningPopupOpen}
          onWarningPopup={handleWarningPopupClick}
          onClose={closeAllPopups}
        />

        <PopupWithForm title="Вы уверены ?" name="Confirm" />
        <PopupWithConfirm></PopupWithConfirm>

        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
