import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {IBasicsCustomizeExternalRoleEntity} from '@libs/basics/interfaces';
import {BasicsSharedExternalRoleLookupService} from '@libs/basics/shared';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {Injectable} from '@angular/core';
import { IContact2ExtRoleEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class Contact2ExternalRoleLayoutService {
	public getLaoyout(): ILayoutConfiguration<IContact2ExtRoleEntity> {
		return {
			groups: [
				{
					gid: 'default-group',
					attributes: ['ExternalRoleFk']
				},
			],
			overloads: {
				ExternalRoleFk: {
					type: FieldType.Lookup,
					lookupOptions:  createLookup<IContact2ExtRoleEntity, IBasicsCustomizeExternalRoleEntity>( {
						dataServiceToken: BasicsSharedExternalRoleLookupService
					})
				},
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.', {
					ExternalRoleFk: { key: 'ExternalRoleFk' },
				}),
			}
		};
	}
}