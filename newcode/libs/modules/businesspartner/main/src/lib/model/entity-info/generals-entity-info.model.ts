import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { GeneralsDataService } from '../../services/generals-data.service';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';
import { IGeneralsEntity } from '@libs/businesspartner/interfaces';

export const GENERALS_ENTITY_INFO = EntityInfo.create<IGeneralsEntity>({
	grid: {
		title: {
			text: 'Generals',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.general.grid',
		},
		containerUuid: 'cef553146d2047759e0a10a9c51efbea'
	},
	form: {
		title: {
			text: 'Generals Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.general.Detail',
		},
		containerUuid: 'dcce6b88c6634ab39703a2f1de0b2442',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(GeneralsDataService),
	dtoSchemeId: { moduleSubModule: 'BusinessPartner.Main', typeName: 'GeneralsDto' },
	permissionUuid: 'cef553146d2047759e0a10a9c51efbea',
	layoutConfiguration:{
		groups:[
			{gid: 'basicData', attributes:['PrcGeneralstypeFk', 'ControllingUnitFk', 'TaxCodeFk', 'ValueType', 'ValueAbsolute', 'CommentText']},
		],
		overloads: {
			PrcGeneralstypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideGeneralTypeLookupOverload(false),
			ControllingUnitFk: BasicsSharedLookupOverloadProvider.provideControllingUnitLookupOverload(true, 'cloud.common.entityControllingUnitDesc'),
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
			ValueType: BasicsSharedCustomizeLookupOverloadProvider.provideValueTypeReadonlyLookupOverload(),
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				PrcGeneralstypeFk: { key: 'entityType'},
				ControllingUnitFk: { key: 'entityControllingUnitCode'},
				TaxCodeFk: { key: 'entityTaxCode'},
				CommentText: { key: 'entityCommentText'}
			}),
			...prefixAllTranslationKeys('procurement.common.', {
				ValueAbsolute: { key: 'generalsValue', text: 'generalsValue'},
				ValueType: { key: 'generalsValueType', text: 'generalsValueType'}
			})
		}
	}
});