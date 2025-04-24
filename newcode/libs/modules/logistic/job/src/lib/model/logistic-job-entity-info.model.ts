/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IJobEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {  BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { LogisticJobDataService } from '../services/logistic-job-data.service';


export const LOGISTIC_JOB_ENTITY_INFO: EntityInfo = EntityInfo.create<IJobEntity>({
	grid: {
		title: {key: 'logistic.job' + '.listJobTitle'},
	},
	form: {
		title: {key: 'logistic.job' + '.detailJobTitle'},
		containerUuid: 'b0e4433e826b44c69f422d42e9788e49',
	},
	dataService: ctx => ctx.injector.get(LogisticJobDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.Job', typeName: 'JobDto'},
	permissionUuid: '11091450f3e94dc7ae58cbb563dfecad',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['LogisticContextFk', 'DivisionFk', 'JobTypeFk', 'RubricCategoryFk',/*'ProjectFk','ControllingUnitFk',*/
					'Code', 'CompanyFk', 'IsLive', 'ValidFrom', 'ValidTo', 'CalendarFk', 'AddressFk', 'JobStatusFk', 'JobGroupFk',
					/*'PlantGroupFk','SettledByTypeFk',*/'LastSettlementDate', 'PlantFk'/*,'BusinessPartnerFk','SubsidiaryFk'*/,
					'CustomerFk',/*'PriceConditionFk',*/'CurrencyFk'/*,'AddressPrjFk'*/, 'CommentText', 'Remark',/*'CostCodePriceListFk','CostCodePriceVersionFk',*/
					/*'DeliveryAddressRemark','DeliveryAddressBlobFk','DeliveryAddressContactFk',*/'IsProjectDefault', 'IncotermFk',/*'ClerkOwnerFk','ClerkResponsibleFk',
					'SiteFk','EtmPlantComponentFk',*/'PlantEstimatePriceListFk',/*'BillingJobFk',*/'HasLoadingCost',/*'CalEstimateFk',*/'PricingGroupFk'
				],
			},
			{
				gid: 'userDefTextGroup',
				attributes: ['Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
			}
		],
		overloads: {
			LogisticContextFk: BasicsSharedCustomizeLookupOverloadProvider.provideLogisticsContextLookupOverload(true),
			CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
			DivisionFk: BasicsSharedCustomizeLookupOverloadProvider.provideEquipmentDivisionLookupOverload(true),
			JobTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobTypeLookupOverload(true),
			RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
			//TODO: ProjectFk ,
			//TODO: Have to implement it using provider class for ControllingUnitFk
			CompanyFk: BasicsSharedCustomizeLookupOverloadProvider.provideCompanyTypeLookupOverload(true),
			AddressFk: BasicsSharedCustomizeLookupOverloadProvider.provideAddressTypeLookupOverload(true),
			JobStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobStatusReadonlyLookupOverload(),
			JobGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideJobGroupLookupOverload(true),
			//TODO: PlantGroupFk lookup overloads
			//TODO: SettledByTypeFk lookup overloads
			PlantFk: BasicsSharedLookupOverloadProvider.provideEstimationTypeLookupOverload(true),
			//TODO: BusinessPartnerFk lookup overloads
			//TODO: SubsidiaryFk lookup overloads
			CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
			//TODO: PriceConditionFk lookup overloads
			//TODO: AddressPrjFk lookup overloads
			//TODO: CostCodePriceListFk lookup overloads
			//TODO: DeliveryAddressBlobFk lookup overloads
			//TODO: DeliveryAddressContactFk lookup overloads
			IncotermFk: BasicsSharedCustomizeLookupOverloadProvider.provideIncoTermLookupOverload(true),
			//TODO: ClerkOwnerFk lookup overloads
			//TODO: ClerkResponsibleFk lookup overloads
			//TODO: SiteFk lookup overloads
			//TODO: EtmPlantComponentFk lookup overloads
			PlantEstimatePriceListFk: BasicsSharedCustomizeLookupOverloadProvider.providePlantEstimatePriceListLookupOverload(true),
			//TODO: BillingJobFk lookup overloads
			//TODO: CalEstimateFk lookup overloads
			PricingGroupFk: BasicsSharedLookupOverloadProvider.provideEquipmentPricingGroupLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('logistic.job.', {
				LogisticContextFk: {key: 'entityLogisticContextFk'},
				DivisionFk: {key: 'equipmentDivision'},
				IsDefault: {key: 'entityIsDefault'},
				IsLive: {key: 'entityIsLive'},
				JobTypeFk: {key: 'equipmentJobTypeFk'},
				CalendarFk: {key: 'entityCalCalendarFk'},
				//ProjectFk: {key: 'entityProject'},
				//PlantGroupFk: {key: 'plantGroup'},
				//SettledByTypeFk: {key: 'settledByType'},
				LastSettlementDate: {key: 'lastSettlementDate'},
				PlantFk: {key: 'plant'},
				//AddressPrjFk: {key: 'addressPrj'},
				//CostCodePriceListFk: {key: 'costCodePriceList'},
				CostCodePriceVersionFk: {key: 'costCodePriceVersion'},
				DeliveryAddressRemark: {key: 'deliveryAddressRemark'},
				//DeliveryAddressBlobFk: {key: 'DeliveryAddressBlobFk'},
			   //DeliveryAddressContactFk:  {key: 'deliveryAddressContact'},
				IsProjectDefault:  {key: 'isProjectDefault'},
				IncotermFk:  {key: 'entityIncoterm'},
				//ClerkOwnerFk:  {key: 'entityClerkOwner'},
				//ClerkResponsibleFk:  {key: 'entityClerkResponsible'},
				//SiteFk:  {key: 'entityClerkResponsible'},
				//EtmPlantComponentFk:  {key: 'entityPlantComponent'},
				//BillingJobFk:  {key: 'entityBillingJob'},
				HasLoadingCost:  {key: 'entityHasLoadingCost'},
				//CalEstimateFk:  {key: 'entityCalEstimate'},
				PricingGroupFk:  {key: 'entityCalEstimate'},
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				Code: {key: 'entityCode'},
				userDefTextGroup: {key: 'UserDefinedText'},
				Userdefined1: {key: 'entityUserDefined', params: {'p_0': '1'}},
				Userdefined2: {key: 'entityUserDefined', params: {'p_0': '2'}},
				Userdefined3: {key: 'entityUserDefined', params: {'p_0': '3'}},
				Userdefined4: {key: 'entityUserDefined', params: {'p_0': '4'}},
				Userdefined5: {key: 'entityUserDefined', params: {'p_0': '5'}},
				CurrencyFk: {key: 'entityCurrencyFk'},
				RubricCategoryFk: {key: 'baseRubricCategory'},
				//AddressFk: {key: 'entityAddress'},
			   //BusinessPartnerFk: {key: 'businessPartner'},
				//SubsidiaryFk: {key: 'entitySubsidiary'},
				CustomerFk: {key: 'entityCustomer'},
				//PriceConditionFk: {key: 'entityPriceCondition'},
				CommentText: {key: 'entityCommentText'},
				Remark: {key: 'entityRemark'},
			}),
			...prefixAllTranslationKeys('basics.company.', {
				CompanyFk: {key: 'entityBasCompanyFk'},
				ValidFrom: {key: 'entityValidfrom'},
				ValidTo: {key: 'entityValidto'}
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				JobStatusFk: {key: 'jobstatus'},
				JobGroupFk: {key: 'jobgroup'},
				PlantEstimatePriceListFk: {key: 'plantestimatepricelist'},
			}),
		}
	},
});