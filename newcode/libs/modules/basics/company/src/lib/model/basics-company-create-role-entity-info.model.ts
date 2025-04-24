/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyCreateRoleDataService } from '../services/basics-company-create-role-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyRoleBas2FrmEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_CREATE_ROLE_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyRoleBas2FrmEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listCreateRoleTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailCreateRoleTitle' },
			    containerUuid: '26a0309eaa0843ccab4eb2f60c1ac508',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyCreateRoleDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyRoleBas2FrmDto'},
                permissionUuid: '53ce3acd0703462abe01e899b4b9c4fa',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['CommentText','ClerkRoleFk','AccessRoleFk'],
						 }
					 ],
					 overloads: {
						 ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
						 AccessRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideFrmAccessRoleCategoryLookupOverload(true),

					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 CommentText: {key: 'entityComment'}
						}),
						 ...prefixAllTranslationKeys('basics.company.', {
							 ClerkRoleFk: {key: 'entityRole'},
							 AccessRoleFk: {key: 'entityAccessRoleFk'}
						 }),
					 }
				 }

            });