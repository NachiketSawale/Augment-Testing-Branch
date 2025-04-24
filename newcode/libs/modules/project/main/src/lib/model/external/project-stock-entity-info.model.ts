/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStockDataService, ProjectStockValidationService } from '@libs/project/stock';
import { IProjectStockEntity } from '@libs/project/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedAddressDialogComponent, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, createFormDialogLookupProvider } from '@libs/basics/shared';
import { createLookup, FieldType } from '@libs/ui/common';


export const projectStockEntityInfo: EntityInfo = EntityInfo.create<IProjectStockEntity>({
	grid: {
		title: {key: 'project.stock.stockListContainerTitle'},
	},
	form: {
		title: {key: 'project.stock.stockDetailContainerTitle'},
		containerUuid: '82554e69247e442e82175ccd48147b81',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockDataService),
	validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStockDto'},
	permissionUuid: '84f41825c88a463286c9502f983b4e90',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['Code','AddressFk','Description','IsDefault', 'IsLocationMandatory', 'IsProvisionAllowed',
				'StockValuationRuleFk', 'StockAccountingTypeFk', 'CurrencyFk', 'ClerkFk', 'ControllingUnitFk', 'StockTypeFk'],
			}
		],
		overloads: {
			ClerkFk:BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			StockAccountingTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockAccountingTypeLookupOverload(true),
			StockTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockTypeLookupOverload(true),
			CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
			StockValuationRuleFk:BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockValuationRuleLookupOverload(true),
			ControllingUnitFk: {
				// TODO: filter is missing
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareControllingUnitLookupService
				})
			},
			AddressFk: {
				type: FieldType.CustomComponent,
				componentType: BasicsSharedAddressDialogComponent,
				providers: createFormDialogLookupProvider({
					showSearchButton: true,
					showPopupButton: true
				}),
			},
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code :{ key: 'entityCode'},
				Description: {key: 'entityDescription'},
				ClerkFk: {key: 'entityClerk'},
				AddressFk: {key: 'entityAddress'},
				IsDefault: {key: 'entityIsDefault'}

			}),
			...prefixAllTranslationKeys('project.stock.', {
				IsLocationMandatory: {key: 'isLocationMandatory'},
				IsProvisionAllowed: {key: 'isProvisionAllowed'},
				StockTypeFk: {key: 'stockTypeFk'}
			})
		},
	},
});