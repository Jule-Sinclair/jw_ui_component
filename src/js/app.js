import Input from './handler/inputHandler';
import '../../export/jquery-number';

$(() => {
  const $input = $('.js_amount_form_input');
  const $inputDisplayer = $('.js_amount_form_inserted');
  const inputClass = new Input($input, $inputDisplayer);
});
