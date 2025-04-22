import {EntityInfo} from '@libs/ui/business-base';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {
	ContactToExternalRoleDataService
} from '../../services/contact-to-external-role-data.service';
import {
	Contact2ExternalRoleLayoutService
} from '../../services/entity-info/contact-to-external-role-layout.service';
import { IContact2ExtRoleEntity } from '@libs/businesspartner/interfaces';

export const CONTACT_CONTACT2EXTERNALROLE_ENTITY_INFO = EntityInfo.create<IContact2ExtRoleEntity>({
	grid: {
		title: { text: 'External Roles', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.extRoleGridContainerTitle' },
	},
	form: {
		title: { text: 'External Role Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.extRoleDetailContainerTitle' },
		containerUuid: '62deafd634394d6d822b0bff9c7b87a3'
	},
	dataService: (ctx) => ctx.injector.get(ContactToExternalRoleDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerContactPascalCasedModuleName, typeName: 'Contact2ExtRoleDto' },
	permissionUuid: '8237f196f2fe42e8beb95667ef040119',
	layoutConfiguration: ctx => {
		return ctx.injector.get(Contact2ExternalRoleLayoutService).getLaoyout();
	}
});