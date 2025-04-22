/*
 * Copyright(c) RIB Software GmbH
 */
import { IControlContext } from '../control-context.interface';
import { IAdditionalCustomTranslateOptions } from '../../../model/fields/additional/additional-custom-translate-options.interface';

export interface ICustomTranslateControlContext extends IControlContext<string>, IAdditionalCustomTranslateOptions {}
