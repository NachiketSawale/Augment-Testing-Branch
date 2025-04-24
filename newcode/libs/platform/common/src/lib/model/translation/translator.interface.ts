/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Translatable,
	ITranslated
} from './translatable.interface';
import { TranslationParamsSource } from './translation-params-source.type';

/**
 * An interface for objects that can translate strings.
 */
export interface ITranslator {

	/**
	 * Returns a translation instantly from the internal state of loaded translation.
	 * @param item Translatable token.
	 * @param interpolateParams An object hash for placeholder values
	 */
	instant(item: Translatable, interpolateParams?: TranslationParamsSource): ITranslated;

	/**
	 * Returns an array of translation instantly from the internal state of loaded translation.
	 * @param items Translatable token(s).
	 * @param interpolateParams An object hash for placeholder values
	 */
	instant(items: Array<Translatable>, interpolateParams?: TranslationParamsSource): Array<ITranslated>;

	/**
	 * Instantly translate given properties of an object/array of objects
	 * @param obj array of objects or object-tree
	 * @param properties name of properties to be translated
	 * @param recursive if true, translate given properties in sub-objects
	 * @returns translated object
	 */
	translateObject(obj: [] | object, properties: string[], recursive?: boolean): [] | object;
}
