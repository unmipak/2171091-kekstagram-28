import {pictures} from './pictures.js';
import {isEscapeKey} from './util.js';

const body = document.querySelector('body');
const popupScreen = document.querySelector('.big-picture');
const popupScreenClose = popupScreen.querySelector('.big-picture__cancel');
const pictureContainer = document.querySelector('.pictures');
const commentsCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');
const commentsList = document.querySelector('.social__comments');
/*шаблон комментария (добавила в разметку)*/
const commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');


const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

/*заполнить popup данными фото*/
const renderPictureData = (({url, likes, comments, description}) => {
  popupScreen.querySelector('.big-picture__img img').src = url;
  popupScreen.querySelector('.likes-count').textContent = likes;
  popupScreen.querySelector('.comments-count').textContent = comments.length;
  popupScreen.querySelector('.big-picture__img img').alt = description;
  popupScreen.querySelector('.social__caption').textContent = description;
});

/*заполнить popup данными комментария*/
const renderCommentData = (({avatar, name, message}) => {
  const createdComment = commentTemplate.cloneNode(true);
  createdComment.querySelector('.social__picture').src = avatar;
  createdComment.querySelector('.social__picture').alt = name;
  createdComment.querySelector('.social__text').textContent = message;
  return createdComment;
});

/*показать комментарии частями*/
const COMMENTS_PART = 5;
let commentsShown = 0;
let comments = [];

const renderComments = () => {
  commentsShown += COMMENTS_PART;

  if(commentsShown >= comments.length) {
    commentsLoader.classList.add('hidden');
    commentsShown = comments.length;
  } else {
    commentsLoader.classList.remove('hidden');
  }

  const fragment = document.createDocumentFragment();
  for (let i = 0; i < commentsShown; i++) {
    const commentElement = renderCommentData(comments[i]);
    fragment.appendChild(commentElement);
  }

  commentsList.innerHTML = '';
  commentsList.appendChild(fragment);
  commentsCount.innerHTML = `${commentsShown} из <span class="comments-count">${comments.length}</span> комментариев`;
};

/*функция открыть картинку*/
const showBigPicture = (data) => {
  popupScreen.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
  renderPictureData(data);
  comments = data.comments;
  if (comments.length > 0) {
    renderComments();
  }
};

/*функция закрыть картинку*/
const closeBigPicture = () => {
  popupScreen.classList.add('hidden');
  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

};

/*обработчик с делегированием*/
pictureContainer.addEventListener('click', (evt) => {
  const createdPicture = evt.target.closest('[data-picture-id]');
  if (!createdPicture) {
    return;
  }
  evt.preventDefault();
  const picture = pictures.find(
    (item) => item.id === +createdPicture.dataset.pictureId
  );
  showBigPicture(picture);
});

/*обработчик на нажатие на крестик*/
popupScreenClose.addEventListener('click', () => {
  closeBigPicture ();
});

/*обработчик Загрузить еще*/
const onCommentsLoaderClick = (evt) => {
  evt.preventDefault();
  renderComments();
};