/*
 * Copyright(c) RIB Software GmbH
 */

import { Injector } from '@angular/core';
import { ITranslator } from './translator.interface';

/**
 * Provides context information on the active context when a translation key is being resolved.
 */
export interface ITranslationContext {

	/**
	 * The Angular injector currently available.
	 */
	readonly injector: Injector;

	/**
	 * Provides an object that can be used to translate translation keys.
	 */
	readonly translator: ITranslator;
}
