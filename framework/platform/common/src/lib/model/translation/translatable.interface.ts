/*
 * Copyright(c) RIB Software GmbH
 */

import { TranslationParamsSource } from './translation-params-source.type';

/**
 * An interface for translatable texts.
 * Used as output of translation methods (text and key properties are mandatory).
 *
 * @group Translation
 */
export interface ITranslated {
	/**
	 * The verbatim text, in case no translation is required.
	 */
	text: string;

	/**
	 * The translation key.
	 */
	key: string;

	/**
	 * An object that can be used to parametrize the translated text.
	 */
	params?: TranslationParamsSource;
}

/**
 * A type for translatable texts.
 * Can be used input of translation methods (text and key properties are marked as optional).
 *
 * @group Translation
 */
export type ITranslatable = Partial<ITranslated>;

/**
 * A type for translatable texts.
 * Instead of implementing the interface {@link ITranslatable} or {@link ITranslatablePartial}, it is also permissible to supply a simple string.
 * The string will then be considered equivalent to the {@link ITranslatable.key} field.
 *
 * The `Translatable` type should be used whenever a human-readable text is to be stored.
 * The type is defined as union of two interfaces (having key, text properties mandatory (`ITranslated`) or optional (`ITranslatable`)) and a string.
 *
 * The interface allows for specifying the verbatim text, or else a (possibly parametrized) translation key.
 * When only a translation key needs to be specified, the shorter string form can be used instead.
 *
 * ## ITranslatable, ITranslated
 *
 * The `ITranslatable` and `ITranslated` interfaces are available to process `Translatable` values that use the object structure rather than a simple string.
 * However, whenever you expect a translatable text as a field or a parameter, make sure to **always use `ITranslatable`**.
 *
 * ## Parametrized Texts
 *
 * When using a translation key, the key may point to a parametrized string.
 * In this case, the string contains one or more keywords enclosed in double braces (`{{}}`).
 * Along with the string, you will need to supply an object in the `params` property.
 * For each keyword in the string, a property of the same name will be retrieved from the `params` object, substituting the double-brace-enclosed keyword.
 *
 * ### Example
 *
 * **params Object:**
 *
 * ```typescript
 * {
 *     'fileCount': 42,
 *     'fileType': 'image'
 * }
 * ```
 *
 * **Translated Text**: `'{{fileCount}} file(s) of type {{fileType}} have been discovered.'`
 *
 * **Resulting Output:** *42 file(s) of type image have been discovered.*
 *
 * @group Translation
 */
export type Translatable = ITranslatable | ITranslated | string;

/**
 * Checks whether a given {@link Translatable} value is a {@link ITranslatable} object.
 * @param tr The translatable value.
 *
 * @group Translation
 */
export const isRequiredTranslatable = (tr: Translatable): tr is ITranslated => {
	return typeof tr === 'object' && 'key' in tr && 'text' in tr;
};

/**
 * Checks whether a given {@link Translatable} value is a Partial<ITranslatable> object.
 * @param tr The translatable value.
 *
 * @group Translation
 */
export const isPartialTranslatable = (tr: Translatable): tr is ITranslatable => {
	return typeof tr === 'object';
};

/**
 * Checks whether a given {@link Translatable} value is a simple translatable string.
 * @param tr The translatable value.
 *
 * @group Translation
 */
export const isSimpleTranslatable = (tr: Translatable): tr is string => {
	return typeof tr === 'string';
};