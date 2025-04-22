import {IControlContext} from './control-context.interface';
import {IAdditionalStringOptions} from '../../model/fields/additional/additional-string-options.interface';
import { PropertyType } from '@libs/platform/common';

export interface IStringControlContext<P extends PropertyType> extends IControlContext<P>, IAdditionalStringOptions {}