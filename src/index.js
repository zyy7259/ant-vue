import Alert, { install as installAlert } from './component/alert';
import Button, { install as installButton } from './component/btn';
import Icon, { install as installIcon } from './component/icon';
import InputNumber, {
  install as installInputNumber
} from './component/input-number';
import Loading, { install as installLoading } from './component/loading';
import Modal, { install as installModal } from './component/modal';
import Select, { install as installSelect } from './component/select';

export { Alert, Button, Icon, InputNumber, Loading, Modal, Select };

export function install(Vue, options = {}) {
  installAlert(Vue, options.alert);
  installButton(Vue, options.btn);
  installIcon(Vue, options.icon);
  installInputNumber(Vue, options.inputNumber);
  installLoading(Vue, options.loading);
  installModal(Vue, options.modal);
  installSelect(Vue, options.select);
}
