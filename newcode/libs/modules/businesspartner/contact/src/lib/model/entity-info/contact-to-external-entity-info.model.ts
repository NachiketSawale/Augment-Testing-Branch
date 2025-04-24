import {EntityInfo} from '@libs/ui/business-base';
import {
	MODULE_INFO_BUSINESSPARTNER
} from '@libs/businesspartner/common';
import {createLookup, FieldType} from '@libs/ui/common';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {
	BasicsSharedExternalSourceLookupService
} from '@libs/basics/shared';
import {IBasicsCustomizeExternalSourceEntity} from '@libs/basics/interfaces';
import {ContactToExternalDataService} from '../../services/contact-to-external-data.service';
import { IContact2ExternalEntity } from '@libs/businesspartner/interfaces';

export const CONTACT2EXTERNAL_ENTITY_INFO = EntityInfo.create<IContact2ExternalEntity>({
	grid: {
		title: { text: 'Contact External', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.contact2ExternalGridContainerTitle' },
	},
	form: {
		title: { text: 'Contact External Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.contact2ExternalDetailContainerTitle' },
		containerUuid: 'ddcddcacde1a4598a681a5ef06002d49'
	},
	dataService: (ctx) => ctx.injector.get(ContactToExternalDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactPascalCasedModuleName, typeName: 'Contact2ExternalDto' },
	permissionUuid: '5f94846fb7794244909f181e6ca7640c',
	layoutConfiguration: {
		groups: [
			{
				gid: 'default-group',
				attributes: ['ExternalId', 'ExternalDescription', 'ExternalSourceFk']
			},
		],
		overloads: {
			ExternalSourceFk: {
				type: FieldType.Lookup,
				lookupOptions:  createLookup<IContact2ExternalEntity, IBasicsCustomizeExternalSourceEntity>( {
					dataServiceToken: BasicsSharedExternalSourceLookupService,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.', {
				ExternalId: {key: 'ExternalId'},
				ExternalSourceFk: { key: 'externalSourceFk' },
				ExternalDescription: { key: 'externalDescription' },
			}),
		}
	}
});