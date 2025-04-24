/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompany2BasClerkEntity } from '@libs/basics/interfaces';
import { BasicsCompany2basClerkDataService } from '../services/basics-company-2bas-clerk-data.service';
import { BasicsCompany2basClerkValidationService } from '../services/basics-company-2bas-clerk-validation.service';


 export const BASICS_COMPANY2_BAS_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompany2BasClerkEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.basListClerksTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.basDetailClerksTitle' },
			    containerUuid: 'd6f4fc0fb41f43e48bcb8976961f5339',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompany2basClerkDataService),
	             validationService: (ctx) => ctx.injector.get(BasicsCompany2basClerkValidationService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'Company2BasClerkDto'},
                permissionUuid: '60355de3d08848ebaadf73aaeac28f92',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['ClerkRoleFk', 'ClerkFk','ValidFrom','ValidTo','CommentText'],
						 }
					 ],
					 overloads: {
						 ClerkRoleFk:BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(true),
						 ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
					},
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 CommentText: {key: 'entityComment'}
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 ClerkRoleFk: {key: 'entityRole'},
							 ClerkFk: {key: 'entityClerkFk'},
							 ValidFrom: {key: 'entityValidfrom'},
							 ValidTo: {key: 'entityValidto'}
						 }),
					 }
				 }

            });