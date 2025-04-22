/*
 * Copyright(c) RIB Software GmbH
 */

import {IControlContext} from './control-context.interface';
import { PropertyType } from '@libs/platform/common';
import {
	IAdditionalCustomComponentOptions
} from '../../model/fields/additional/additional-custom-component-options.interface';

export interface ICustomComponentControlContext extends IControlContext<PropertyType>, IAdditionalCustomComponentOptions {}