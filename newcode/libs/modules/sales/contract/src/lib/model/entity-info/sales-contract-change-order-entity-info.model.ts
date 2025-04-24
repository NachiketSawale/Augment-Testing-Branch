import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { SalesContractChangeOrderBehavior } from '../../behaviors/sales-contract-change-order-behavior.service';
import { SalesContractChangeOrderDataService } from '../../services/sales-contract-change-order-data.service';
import { SalesContractCustomizeLookupOverloadProvider } from '../../lookup-helper/sales-contract-lookup-overload-provider.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_CHANGE_ORDER_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdHeaderEntity> ({
	grid: {
		title: {key: 'procurement.contract.changeOrderTitle'},
		behavior: ctx => ctx.injector.get(SalesContractChangeOrderBehavior),
		treeConfiguration: ctx => {
			return {
				parent: function (entity: IOrdHeaderEntity) {
					const service = ctx.injector.get(SalesContractChangeOrderDataService);
					return service.parentOf(entity);
				},
				children: function (entity: IOrdHeaderEntity) {
					const service = ctx.injector.get(SalesContractChangeOrderDataService);
					return service.childrenOf(entity);
				}
			} as IGridTreeConfiguration<IOrdHeaderEntity>;
		}
	},
	dataService: ctx => ctx.injector.get(SalesContractChangeOrderDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdHeaderDto'},
	permissionUuid: 'b941ffdf8c954f5abc7fdfbbdc12d64f',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: ['TypeFk', 'Code', 'RubricCategoryFk', 'ConfigurationFk', 'CompanyFk', 'BillingSchemaFk', 'ProjectFk', 'LanguageFk', 'OrdStatusFk', 'OrderDate', 'PlannedStart', 'PlannedEnd', 'WipFirst', 'WipFrom', 'WipUntil', 'DateEffective',
					'UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']
			},
		],
		overloads: {
			TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderTypeReadonlyLookupOverload(),
			OrdStatusFk: SalesContractCustomizeLookupOverloadProvider.provideOrdStatusLookupOverload(false, true),
			RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryLookupOverload(false),
			LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(true),
			ConfigurationFk: {
				readonly: true,
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
				}),
			}
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				TypeFk: {key: 'entityContractTypeFk'},
				OrdStatusFk: {key: 'entityOrdStatus'},
				LanguageFk: {key: 'entityLanguage'},
				BankFk: {key: 'entityBank'},
				CustomerFk: {key: 'entityCustomer'},
				TaxCodeFk: {key: 'entityTaxCode'},
				RubricCategoryFk: {key: 'entityRubricCategory'},
				ConfigurationFk: {key: 'entityConfigurationFk', text: 'Configuration'},
				BillingSchemaFk: {key: 'containerBillingschema'},
				ProjectFk: {key: 'entityProject'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				CompanyFk: {key: 'entityCompany'}
			}),
		},
	}
});