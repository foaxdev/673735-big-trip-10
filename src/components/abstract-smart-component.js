import AbstractComponent from "./abstract-component";

export default class AbstractSmartComponent extends AbstractComponent {

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.element;
    const parent = oldElement.parentElement;

    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, oldElement);

    this.recoveryListeners();
  }
}
