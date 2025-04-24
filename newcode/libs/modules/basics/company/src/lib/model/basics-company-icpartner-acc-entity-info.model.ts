/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyICPartnerAccDataService } from '../services/basics-company-icpartner-acc-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyICPartnerAccEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_ICPARTNER_ACC_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyICPartnerAccEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.iCPartnerAccountingTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.iCPartnerAccountingDetailTitle' },
			    containerUuid: '377C03BE56EC4D458AEE88DEA388B93E',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyICPartnerAccDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyICPartnerAccDto'},
                permissionUuid: 'DC54A929EB6341AB9B2BA8CB2152D989',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['Id', 'BasCompanyIcpartnerFk','PrcStructureFk','AccountRevenue','AccountCost','SurchargePercent','AccountRevenueSurcharge']
						 }
					 ],
					 overloads: {
						 PrcStructureFk:BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
						 //TO DO BasCompanyIcpartnerFk
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 Id: {key: 'entityId'},
							 BasCompanyIcpartnerFk: {key: 'contentProcurementStructure'},
							 PrcStructureFk: {key: 'entityStructure'},
							 AccountRevenue: {key: 'entityICRevenueAccount'},
							 AccountCost: {key: 'entityICCostAccount'},
							 SurchargePercent: {key: 'entitySurcharge'},
							 AccountRevenueSurcharge: {key: 'entityICRevenueAccountSurcharge'},

						 }),
					 }
				 }

            });