/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyUrlDataService } from '../services/basics-company-url-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyUrlEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_URL_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyUrlEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listCompanyUrlTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailCompanyUrlTitle' },
			    containerUuid: '94bdf16eaa544517805a0c02a9d584b4',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyUrlDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyUrlDto'},
                permissionUuid: 'd61ab24bcd2b4985a86d129e1a172747',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['CompanyUrltypeFk','url','UrlUser','UrlPassword'],
						 }
					 ],
					 overloads: {
						 CompanyUrltypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideCompanyUrlTypeLookupOverload(true),
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 CompanyUrltypeFk: {key: 'entityCompanyUrltypeFk'},
							 url: {key: 'entityUrl'},
							 UrlUser: {key: 'entityUrlUser'},
							 UrlPassword: {key: 'entityUrlPassword'},
						 }),
					 }
				 }

            });