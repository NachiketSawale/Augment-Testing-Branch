/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyDebtorDataService } from '../services/basics-company-debtor-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyDebtorEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_DEBTOR_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyDebtorEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.listDebtorTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.detailDebtorTitle' },
			    containerUuid: '3dac85c30d4c468c9678d9f010a8501a',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyDebtorDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyDebtorDto'},
                permissionUuid: '21ea54ddccde46cea63aeaa86eb82b1b',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['SubledgerContextFk','LedgerContextFk','CustomerFk','TaxCodeFk','CommentText'],
						 }
					 ],
					 overloads: {
						 SubledgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideSubledgerContextLookupOverload(true),
						 LedgerContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLedgerContextLookupOverload(true),
						 TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
						 // TO DO CustomerFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('cloud.common.', {
							 CustomerFk: {key: 'entityCustomer'}
						 }),
						 ...prefixAllTranslationKeys('basics.company.', {
							 SubledgerContextFk: {key: 'entityBpdSubledgerContextFk'},
							 TaxCodeFk: {key: 'entityTaxCodeFk'},
							 CommentText: {key: 'entityComment'}
						 }),
					 }
				 }

            });