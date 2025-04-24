/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyTransheaderDataService } from '../services/basics-company-transheader-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyTransheaderEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_TRANSHEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyTransheaderEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listTransheaderTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailTransheaderTitle' },
			    containerUuid: 'a7f63cb15a8e4820a0dd673e457360c6',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyTransheaderDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyTransheaderDto'},
                permissionUuid: '4b65cdfbf33b45e683d06779a5e05574',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['CompanyTransheaderFk', 'CompanyFk','TransactionTypeFk','Description','PostingDate','CommentText','ReturnValue','IsSuccess','CompanyTransheaderStatusFk'],
						 }
					 ],
					 overloads: {
						 //TO DO 'CompanyTransheaderFk', 'CompanyFk'
						 TransactionTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideTransactionTypeLookupOverload(true),
						 CompanyTransheaderStatusFk:BasicsSharedCustomizeLookupOverloadProvider.provideCompanyTransheaderStatusLookupOverload(true),
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 TransactionTypeFk: {key: 'entityTransactionTypeFk'},
							 PostingDate: {key: 'entityPostingDate'},
							 CommentText: {key: 'entityComment'},
							 Description: {key: 'description'},

						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 CompanyTransheaderFk: {key: 'entityTransheader'},
							 CompanyFk: {key: 'entityBasCompanyFk'},
							 ReturnValue: {key: 'entityReturnValue'},
							 IsSuccess: {key: 'entityIsSuccess'},
							 CompanyTransheaderStatusFk: {key: 'companyTransheaderStatusFk'},
						}),
					 }
				 }

            });