
import { IControlContext } from './control-context.interface';
import { IAdditionalActionOptions } from '../../model/fields';
import { ConcreteMenuItem } from '../../model/menu-list/interface';


export interface IActionControlContext<T extends object> extends IControlContext<ConcreteMenuItem<T>[] | ConcreteMenuItem<T>>, IAdditionalActionOptions<T> {
}
