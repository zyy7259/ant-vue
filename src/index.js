import Alert from './component/alert';
import Btn from './component/btn';
import Icon from './component/icon';
import InputNumber from './component/input-number';
import Loading from './component/loading';
import Modal from './component/modal';
import Sel from './component/select';

export { Alert, Btn, Icon, InputNumber, Loading, Modal, Sel };

export function install(Vue, options = {}) {
  Vue.use(Alert, options.alert);
  Vue.use(Btn, options.btn);
  Vue.use(Icon, options.icon);
  Vue.use(InputNumber, options.inputNumber);
  Vue.use(Loading, options.loading);
  Vue.use(Modal, options.modal);
  Vue.use(Sel, options.select);
}
