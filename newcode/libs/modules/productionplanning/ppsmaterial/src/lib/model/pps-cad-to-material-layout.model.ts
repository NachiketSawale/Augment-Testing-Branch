/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPpsCad2mdcMaterialEntity } from './models';

export const PPS_CAD_TO_MATERIAL_LAYOUT: ILayoutConfiguration<IPpsCad2mdcMaterialEntity> = {
	groups: [
		{
			gid: 'header',
			attributes: ['CadProducttype', 'MdcMaterialFk', 'CadAddSpecifier', 'CommentTxt',]
		},

	],
	labels: {
		...prefixAllTranslationKeys('cloud.common.', {
			CommentTxt: { key: 'entityComment', text: '*Comment' },
		}),
		...prefixAllTranslationKeys('basics.material.', {
			MdcMaterialFk: { key: 'record.material', text: '*Material' },
		}),
		...prefixAllTranslationKeys('productionplanning.ppsmaterial.', {
			CadProducttype: { key: 'ppsCadToMaterial.cadProductType', text: '*CAD Product Type' },
			CadAddSpecifier: { key: 'ppsCadToMaterial.cadAddSpecifier', text: '*Additional Specifier' },
		}),

	},
	overloads: {
		MdcMaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
		CadAddSpecifier: {
			maxLength: 252
		}
	}

};
