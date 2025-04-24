import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCurrencyLookupService, BasicsSharedEstStatusLookupService, BasicsSharedLineItemContextLookupService, } from '@libs/basics/shared';
import { IEstHeaderEntity } from '@libs/estimate/interfaces';

export const EST_HEADER_LAYOUT: ILayoutConfiguration<IEstHeaderEntity> = {
	groups: [
		{
			gid: 'HeaderGroupHeader',
			attributes: ['EstStatusFk', 'Code', 'DescriptionInfo', 'MdcLineItemContextFk', 'BasCurrencyFk'],
		},
	],
	overloads: {
		EstStatusFk: {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedEstStatusLookupService,
				displayMember: 'DescriptionInfo.Translated',
			}),
		},
		Code: {
			readonly: true,
			//TODO - navigator
		},
		DescriptionInfo: {
			readonly: true,
		},
		MdcLineItemContextFk: {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedLineItemContextLookupService,
				displayMember: 'DescriptionInfo.Translated',
			}),

		},
		BasCurrencyFk: {
			readonly: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCurrencyLookupService,
				displayMember: 'Currency',
			}),
		},
	},
	labels: {
		...prefixAllTranslationKeys('procurement.package.', {
			MdcLineItemContextFk: { key: 'entityMdcLineItemContextFk' },
		}),
		...prefixAllTranslationKeys('cloud.common.', {
			BasCurrencyFk: { key: 'entityCurrency' },
			EstStatusFk: { key: 'entityStatus' },
			Code: { key: 'entityCode' },
			DescriptionInfo: { key: 'entityDescription' },
		}),
	},
};
