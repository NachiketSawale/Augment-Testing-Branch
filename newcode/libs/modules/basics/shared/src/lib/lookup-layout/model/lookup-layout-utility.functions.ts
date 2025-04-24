/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { ITypedAdditionalLookupField } from '@libs/ui/common';

/**
 * Creates a translatable label for an additional lookup description.
 *
 * @param propertyKey - The key of the property to be translated.
 * @returns A `Translatable` object containing the translation key and parameters.
 */
export function createAdditionalLookupDescriptionLabel(propertyKey: string): Translatable {
	return {
		key: 'basics.shared.lookupAdditionalDescription',
		params: (context) => {
			return {
				lookup: context.translator.instant(propertyKey).text,
			};
		},
	};
}

/**
 * Creates a typed additional lookup field with a translatable label.
 *
 * @template T - The type of the object associated with the lookup field.
 * @param propertyKey - The key of the property to be used for generating the label.
 * @param displayMember - (Optional) The property name to be displayed. Defaults to 'DescriptionInfo.Translated'.
 * @returns An `ITypedAdditionalLookupField` object containing the field configuration.
 */
export function createAdditionalLookupDescriptionField<T extends object>(propertyKey: string, displayMember?: string): ITypedAdditionalLookupField<T> {
	return {
		displayMember: displayMember ?? 'DescriptionInfo.Translated',
		label: createAdditionalLookupDescriptionLabel(propertyKey),
		column: true,
		singleRow: true,
	};
}
