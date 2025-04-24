/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyICPartnerCardDataService } from '../services/basics-company-icpartner-card-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyICPartnerEntity } from '@libs/basics/interfaces';


 export const BASICS_COMPANY_ICPARTNER_CARD_ENTITY_INFO: EntityInfo = EntityInfo.create<ICompanyICPartnerEntity> ({
                grid: {
                    title: {key: 'basics.company' + '.iCPartnerCardTitle'}
                },
                form: {
			    title: { key: 'basics.company' + '.iCPartnerCardTitleDetail' },
			    containerUuid: '1898F3361D2B4DFDB83BCA24DA5E608F',
		        },
                dataService: ctx => ctx.injector.get(BasicsCompanyICPartnerCardDataService),
                dtoSchemeId: {moduleSubModule: 'Basics.Company', typeName: 'CompanyICPartnerDto'},
                permissionUuid: 'B94FE596A551410DA31E115B8EB8B43A',
	             layoutConfiguration: {
					 groups: [
						 {
							 gid: 'Basic Data',
							 attributes: ['Id', 'BasCompanyPartnerFk','BpdCustomerFk','BpdSupplierFk','AccountRevenue','AccountCost','MdcControllingunitIcFk'
								 ,'PrcConfigurationBilFk','MdcBillSchemaBilFk','PrcConfigurationInvFk','MdcBillSchemaInvFk'],
						 }
					 ],
					 overloads: {
						 //To do BasCompanyPartnerFk,BpdCustomerFk,BpdSupplierFk,MdcControllingunitIcFk
						 MdcBillSchemaBilFk:BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
						 MdcBillSchemaInvFk:BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
					 },
					 labels: {
						 ...prefixAllTranslationKeys('basics.company.', {
							 Id: {key: 'entityId'},
							 BasCompanyPartnerFk: {key: 'entityCompanyICPartner'},
							 BpdCustomerFk: {key: 'entityCustomer'},
							 BpdSupplierFk: {key: 'entitySupplier'},
							 AccountRevenue: {key: 'entityICRevenueAccount'},
							 AccountCost: {key: 'entityICCostAccount'},
							 MdcControllingunitIcFk: {key: 'entityClearingControllingUnit'},
							 PrcConfigurationBilFk: {key: 'entityPrcConfigurationBilFk'},
							 MdcBillSchemaBilFk: {key: 'entityMdcBillSchemaBilFk'},
							 PrcConfigurationInvFk: {key: 'entityPrcConfigurationInvFk'},
							 MdcBillSchemaInvFk: {key: 'entityMdcBillSchemaInvFk'},
						 }),
					 }
				 }

            });