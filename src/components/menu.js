const getMenuHtml = (menuName) => {
  return (`
    <a class="trip-tabs__btn" href="#">${menuName}</a>
  `);
};

const createMenuItems = (menuNames) => {
  const menuContainer = document.createDocumentFragment();
  menuContainer.innerHTML = ``;

  for (const menuName of menuNames) {
    menuContainer.innerHTML += getMenuHtml(menuName);
  }

  return menuContainer.innerHTML;
};

export const createMenuTemplate = (menuNames) => {
  return (`
    <nav class="trip-controls__trip-tabs  trip-tabs">
      ${createMenuItems(menuNames)}
    </nav>
  `);
};

export const setMenuItemActive = (menuElement) => {
  const menuItems = document.querySelectorAll(`.trip-tabs__btn`);

  for (const menuItem of menuItems) {
    if (menuItem.classList.contains(`trip-tabs__btn--active`)) {
      menuItem.classList.remove(`trip-tabs__btn--active`);
      break;
    }
  }

  menuElement.classList.add(`trip-tabs__btn--active`);
};
