/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyClerkDataService } from '../services/basics-company-clerk-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompany2ClerkEntity } from '@libs/basics/interfaces';
import { BasicsCompanyClerkValidationService } from '../services/basics-company-clerk-validation.service';


 export const BASICS_COMPANY_CLERK_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompany2ClerkEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listClerksTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailClerksTitle' },
			    containerUuid: '0a559d46ddd94140832c7e36e2adbf0f',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyClerkDataService),
	             validationService: (ctx) => ctx.injector.get(BasicsCompanyClerkValidationService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'Company2ClerkDto'},
                permissionUuid: '1ED887BEC41F43CEA694ADA8C4C25254',
	            layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['ClerkFk', 'ValidFrom','ValidTo'],
						 }
					 ],
					 overloads: {
						 ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 ClerkFk: {key: 'entityClerkFk'},
							 ValidFrom: {key: 'entityValidfrom'},
							 ValidTo: {key: 'entityValidto'},
						 }),
					 }
				 }

            });