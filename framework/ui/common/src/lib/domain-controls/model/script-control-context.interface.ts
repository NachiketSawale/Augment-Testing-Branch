/*
 * Copyright(c) RIB Software GmbH
 */

import {IControlContext} from './control-context.interface';
import { IAdditionalScriptOptions } from '../../model/fields/additional/additional-script-options.interface';
import { PropertyType } from '@libs/platform/common';

export interface IScriptControlContext extends IControlContext<PropertyType>, IAdditionalScriptOptions  {

}
