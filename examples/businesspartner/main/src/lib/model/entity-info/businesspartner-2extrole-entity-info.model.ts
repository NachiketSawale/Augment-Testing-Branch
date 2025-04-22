import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinessPartner2ExtRoleDataService } from '../../services/businesspartner-2extrole-data.service';
import { IBusinessPartner2ExtRoleEntity } from '@libs/businesspartner/interfaces';

export const BUSINESSPARTNER_2EXTROLE_ENTITY = EntityInfo.create<IBusinessPartner2ExtRoleEntity>({
	grid: {
		title: { text: 'External Roles', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.extRoleGridContainerTitle' },
	},
	form: {
		title: { text: 'External Role Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.extRoleDetailContainerTitle' },
		containerUuid: '11e2f705378446e79d5c3b03e9680906'
	},
	dataService: (ctx) => ctx.injector.get(BusinessPartner2ExtRoleDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'BusinessPartner2ExtRoleDto' },
	permissionUuid: '1414a9157fb94a6ca70ff26717b5a759',
	layoutConfiguration: {
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['ExternalRoleFk']
			}
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				ExternalRoleFk: {key: 'ExternalRoleFk'},
			}),
		},
		overloads: {
			ExternalRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideExternalRoleLookupOverload(false),
		}
	}
});