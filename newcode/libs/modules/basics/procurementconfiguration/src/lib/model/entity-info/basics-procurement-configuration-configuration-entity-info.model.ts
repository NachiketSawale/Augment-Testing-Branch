/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo, ISplitGridConfiguration, SplitGridConfigurationToken, SplitGridContainerComponent } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import {
	BasicsSharedProcurementConfigurationHeaderLookupService,
	BasicsSharedRubricCategoryLookupService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import { BasicsProcurementConfigConfigurationDataService } from '../../services/basics-procurement-config-configuration-data.service';
import { BasicsProcurementConfigRubricCategoryDataService } from '../../services/basics-procurement-config-rubric-category-data.service';
import { IPrcConfigurationEntity } from '../entities/prc-configuration-entity.interface';
import { IRubricEntity } from '../entities/rubric-entity.interface';

export const BASICS_PROCUREMENT_CONFIGURATION_CONFIGURATION_ENTITY_INFO = EntityInfo.create<IPrcConfigurationEntity>({
	grid: {
		title: {
			text: '',
			key: 'basics.procurementconfiguration.configurationGridTitle',
		},
		containerType: SplitGridContainerComponent,
		providers: (ctx) => [
			{
				provide: SplitGridConfigurationToken,
				useValue: <ISplitGridConfiguration<IPrcConfigurationEntity, IRubricEntity>>{
					parent: {
						uuid: '8708d4b939b944fba20f850cbe937185',
						columns: [
							{
								id: 'description',
								model: 'DescriptionInfo',
								type: FieldType.Translation,
								label: {
									text: 'Description',
									key: 'cloud.common.entityDescription',
								},
								sortable: true,
								visible: true,
								readonly: true,
								formatterOptions: {
									field: 'DescriptionInfo.Translated',
								},
							},
						],
						dataServiceToken: BasicsProcurementConfigRubricCategoryDataService,
						treeConfiguration: {
							parent: function (entity: IRubricEntity) {
								const service = ctx.injector.get(BasicsProcurementConfigRubricCategoryDataService);
								return service.parentOf(entity);
							},
							children: function (entity: IRubricEntity) {
								const service = ctx.injector.get(BasicsProcurementConfigRubricCategoryDataService);
								return service.childrenOf(entity);
							},
						},
					},
				},
			},
		],
	},
	permissionUuid: 'ecf49aee59834853b0f78ee871676e38',
	dataService: (ctx) => ctx.injector.get(BasicsProcurementConfigConfigurationDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.ProcurementConfiguration', typeName: 'PrcConfigurationDto' },
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data',
				},
				attributes: [
					'DescriptionInfo',
					'Sorting',
					'IsDefault',
					'PrcAwardMethodFk',
					'PrcContractTypeFk',
					'PaymentTermFiFk',
					'PaymentTermPaFk',
					'ProvingPeriod',
					'ProvingDealdline',
					'ApprovalPeriod',
					'ApprovalDealdline',
					'BaselineIntegration',
					'PrjContractTypeFk',
					'IsMaterial',
					'IsService',
					'IsLive',
					'IsNotAccrualPrr',
				],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				DescriptionInfo: {
					key: 'entityDescription',
					text: 'Description',
				},
				Sorting: {
					key: 'entitySorting',
					text: 'Sorting',
				},
				PrcAwardMethodFk: {
					key: 'entityAwardMethod',
					text: 'Award Method',
				},
				PaymentTermFiFk: {
					key: 'entityPaymentTermFI',
					text: 'Payment Term (FI)',
				},
				PaymentTermPaFk: {
					key: 'entityPaymentTermPA',
					text: 'Payment Term (PA)',
				},
			}),
			...prefixAllTranslationKeys('basics.procurementconfiguration.', {
				IsDefault: {
					key: 'entityIsDefault',
					text: 'Is Default',
				},
				PrcContractTypeFk: {
					key: 'configuration.prccontracttypeFk',
					text: 'Contract Type',
				},
				ProvingPeriod: {
					key: 'entityProvingPeriod',
					text: 'Proving Period',
				},
				ProvingDealdline: {
					key: 'entityProvingDealdline',
					text: 'Proving Deadline',
				},
				ApprovalPeriod: {
					key: 'entityApprovalPeriod',
					text: 'Approval Period',
				},
				ApprovalDealdline: {
					key: 'entityApprovalDealdline',
					text: 'Approval Deadline',
				},
				BaselineIntegration: {
					key: 'entityBaselineIntegration',
					text: 'Baseline Integration',
				},
				PrjContractTypeFk: {
					key: 'configuration.prjcontracttypeFk',
					text: 'Project Contract Type',
				},
				IsMaterial: {
					key: 'entityIsMaterial',
					text: 'Is Material',
				},
				IsService: {
					key: 'entityIsService',
					text: 'Is Service',
				},
				IsLive: {
					key: 'entityIsLive',
					text: 'Is Live',
				},
				IsNotAccrualPrr: {
					key: 'IsNotAccrualPrr',
					text: 'Is Not Accrual',
				},
			}),
		},
		overloads: {
			DescriptionInfo: {
				type: FieldType.Translation,
				// todo - mandatory
				formatterOptions: {
					field: 'DescriptionInfo.Translated',
				},
			},
			Sorting: {
				// todo - mandatory
			},
			PrcAwardMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideAwardMethodLookupOverload(false),
			PrcContractTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
			PrjContractTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideProjectContractTypeLookupOverload(false),
			PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(false),
			PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(false),
		},
		// todo - additional lookup columns
	},
	lookup: {
		gridLayout: {
			groups: [
				{
					gid: 'basicData',
					attributes: ['DescriptionInfo', 'RubricCategoryFk', 'PrcConfigHeaderFk'],
				},
			],
			labels: {
				RubricCategoryFk: { text: 'Rubric Category', key: 'cloud.common.entityBasRubricCategoryFk' },
				PrcConfigHeaderFk: { text: 'Configuration Header', key: 'project.main.entityConfigHeader' },
			},
			overloads: {
				DescriptionInfo: {
					readonly: true,
				},
			},
			transientFields: [
				{
					id: 'RubricCategoryFk',
					model: 'RubricCategoryFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryLookupService,
					}),
				},
				{
					id: 'PrcConfigHeaderFk',
					model: 'PrcConfigHeaderFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementConfigurationHeaderLookupService,
					}),
				},
			],
		},
	},
});
