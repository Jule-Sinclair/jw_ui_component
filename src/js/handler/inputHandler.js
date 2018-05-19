import { KEYCODE, KEY_TYPE } from '../constants/keycode';

export default class Input {
  constructor(targetInput, targetDisplayer) {
    this.input = targetInput;
    this.dpElement = targetDisplayer;
    this.domWrapper = this.dpElement.find('.js_num_wrapper');
    this.valueChecker = {
      currentValue: '0',
      insertedNumber: null,
    };
    this.isTransition = false;
    this.interval = null;

    this.focusEvent = this.setFocus.bind(this);
    this.focusOutEvent = this.setBlur.bind(this);
    this.insertEvent = this.insertedNumberFunc.bind(this);
    this.keyUpEvent = this.keyUpFunc.bind(this);

    this.setEvent();
  }

  setEvent() {
    this.input
      .on('keydown', this.insertEvent)
      .on('keyup', this.keyUpEvent);
    this.input.on('blur', this.focusOutEvent);
    this.dpElement.on('click', this.focusEvent);
  }

  setBlur() {
    this.dpElement.removeClass('focus');
  }

  setFocus(e) {
    $(e.currentTarget).addClass('focus');
    return this.input.focus();
  }

  checkIsNotChangeAvailable() {
    return (
      this.valueChecker.insertedNumber === undefined ||
      this.valueChecker.insertedNumber === null ||
      (this.valueChecker.insertedNumber === KEY_TYPE.DELETE && this.valueChecker.currentValue === '0')
    );
  }

  updateInputValue() {
    this.input.val(parseInt(this.valueChecker.currentValue, 10));
  }

  deleteAction() {
    this.valueChecker.currentValue =
      this.valueChecker.currentValue.length <= 1 ?
        '0' :
        this.valueChecker.currentValue.slice(0, -1);


    const lastChild = this.domWrapper.find('.num').last();
    if (this.valueChecker.currentValue !== '0') {
      this.isTransition = true;
      lastChild.on('transitionend', () => {
        this.isTransition = false;
        lastChild.remove();
      }).removeClass('added');
    } else {
      lastChild.html('0');
    }
  }

  clearAction() {
    const zeroChild = this.domWrapper.find('.num').last().clone().html('0').addClass('added');
    this.domWrapper.html(zeroChild);
    this.valueChecker.currentValue = '0';
    this.updateInputValue();
    this.isTransition = false;
  }

  insertAction() {
    if (this.valueChecker.currentValue === '0') {
      this.valueChecker.currentValue = '';
      $('.num').remove();
    }
    this.valueChecker.currentValue = `${this.valueChecker.currentValue}${this.valueChecker.insertedNumber}`;

    let addedDom = null;
    addedDom = `<span class="num">${this.valueChecker.insertedNumber}</span>`;
    this.domWrapper.append(addedDom);
    setTimeout(() => {
      this.isTransition = true;
      $('.num').last().on('transitionend', () => {
        this.isTransition = false;
      }).addClass('added');
    }, 0);
  }

  longPressedFunc() {
    if (this.valueChecker.insertedNumber === KEY_TYPE.DELETE) {
      this.clearAction();
    } else {
      return false;
    }
  }

  keyUpFunc() {
    clearInterval(this.interval);
    this.interval = null;
    return false;
  }

  insertedNumberFunc(e) {
    this.valueChecker.insertedNumber = KEYCODE[e.keyCode];
    if (!this.interval) {
      this.interval = setInterval(() => {
        e.preventDefault();
        this.longPressedFunc();
      }, 1000);
    }
    console.log(this.valueChecker);
    if (this.isTransition || this.checkIsNotChangeAvailable()) return;
    if (this.valueChecker.insertedNumber === KEY_TYPE.DELETE) {
      this.deleteAction();
    } else {
      this.insertAction();
    }
    this.updateInputValue();
  }
}
