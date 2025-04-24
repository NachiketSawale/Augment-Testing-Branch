/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProjectStockMaterialDataService, ProjectStockMaterialValidationService } from '@libs/project/stock';
import { IProjectStock2MaterialEntity } from '@libs/project/interfaces';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';


export const projectStockMaterialEntityInfo: EntityInfo = EntityInfo.create<IProjectStock2MaterialEntity>({
	grid: {
		title: {key: 'project.stock.stockMaterialListContainerTitle'},
	},
	form: {
		title: {key: 'project.stock.stockMaterialDetailContainerTitle'},
		containerUuid: 'ca05a162837b4e01b1416116a8a846be',
	},
	dataService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockMaterialDataService),
	validationService: (ctx: IInitializationContext) => ctx.injector.get(ProjectStockMaterialValidationService),
	dtoSchemeId: {moduleSubModule: 'Project.Stock', typeName: 'ProjectStock2MaterialDto'},
	permissionUuid: '562132b3f18e470f8eef6b9dbe5dc9d4',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['MaterialCatalogFk', 'MaterialFk', 'MinQuantity', 'MaxQuantity',
					'ProvisionPercent', 'ProvisionPeruom', 'IsLotManagement', 'StockLocationFk',
					'StandardCost', 'LoadingCostPercent','Stock2MaterialStatusFk'],
			}
		],
		overloads: {
			MaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogReadOnlyLookupOverload(true),
			MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
			StockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationLookupOverload(true),
			Stock2MaterialStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStock2MaterialStatusLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.',{
				Code :{ key: 'entityCode'},
				DescriptionInfo: { key: 'entityDescription'},
			}),
			...prefixAllTranslationKeys('project.stock.',{
				MinQuantity :{ key: 'minQuantity'},
				MaxQuantity: { key: 'maxQuantity'},
				ProvisionPercent: { key: 'provisionPercent'},
				ProvisionPeruom: { key: 'provisionPerUoM'},
				IsLotManagement: { key: 'isLotManagement'},
				StockLocationFk: { key: 'stockLocation'},
				StandardCost: { key: 'standardCost'},
				LoadingCostPercent: { key: 'loadingCostPercent'},
				Stock2MaterialStatusFk: { key: 'stock2MaterialStatusFk'},
			}),
			...prefixAllTranslationKeys('basics.material.',{
				MaterialCatalogFk :{ key: 'record.materialCatalog'},
				MaterialFk: { key: 'record.material'}
			})
		}
	},
});