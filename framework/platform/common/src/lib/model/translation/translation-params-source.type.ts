/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslationContext } from './translation-context.interface';

export type TranslationParamsSource = object | ((context: ITranslationContext) => object);
