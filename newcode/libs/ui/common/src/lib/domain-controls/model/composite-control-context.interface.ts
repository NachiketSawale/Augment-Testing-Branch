/*
 * Copyright(c) RIB Software GmbH
 */
import { PropertyType } from '@libs/platform/common';
import { IControlContext } from './control-context.interface';
import { IAdditionalCompositeOptions } from '../../model/fields/additional/additional-composite-options.interface';

export interface ICompositeControlContext<T extends object> extends IControlContext<PropertyType>, IAdditionalCompositeOptions<T> {}
