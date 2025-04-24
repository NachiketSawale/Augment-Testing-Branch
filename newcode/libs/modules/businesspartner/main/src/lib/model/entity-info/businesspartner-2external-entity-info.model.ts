import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartner2ExternalDataService } from '../../services/businesspartner-2external-data.service';
import { IBp2externalEntity } from '@libs/businesspartner/interfaces';

export const BUSINESSPARTNER_2EXTERNAL_ENTITY = EntityInfo.create<IBp2externalEntity>({
	grid: {
		title: { text: 'Business Partner to External', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.entityExternal' },
	},
	form: {
		title: { text: 'Business Partner to External Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.entityExternalDetail' },
		containerUuid: '489a6f1ecc1b406e842466e0a0fc9920'
	},
	dataService: (ctx) => ctx.injector.get(BusinessPartner2ExternalDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'Bp2externalDto' },
	permissionUuid: '72a2227e86964a35a4072dc3fda7b45a',
	layoutConfiguration: {
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['BasExternalsourceFk','ExternalId','ExternalDescription']
			}
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				ExternalId: {key: 'externalid'},
				ExternalDescription: {key: 'externaldescription'},
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.basicsCustomizeModuleName + '.', {
				BasExternalsourceFk: {key: 'externalsource'},
			}),
		},
		overloads: {
			BasExternalsourceFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalSourceTypeLookupOverload(false),
		}
	}
});