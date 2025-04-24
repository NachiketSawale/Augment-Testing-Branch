/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementInventoryGridDataService } from '../services/procurement-inventory-grid-data.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcInventoryEntity } from './entities/prc-inventory-entity.interface';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedMaterialCatalogLookupService, BasicsSharedMaterialLookupService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { IPrcStockTransactionTypeEntity, PrcStockTransactionTypeLookupService } from '@libs/procurement/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';

/**
 * Procurement Inventory Grid Entity Info
 */
export const PROCUREMENT_INVENTORY_GRID_ENTITY_INFO: EntityInfo = EntityInfo.create<IPrcInventoryEntity>({
	grid: {
		title: { key: 'procurement.inventory.title' },
		containerUuid: '414d9e8881c648faa99ffc2b9bd17cb4',
	},
	form: {
		title: { key: 'procurement.inventory.detailTitle' },
		containerUuid: '814dd84a43de4c0fb6549aaf202c66a8',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInventoryGridDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Inventory', typeName: 'PrcInventoryDto' },
	permissionUuid: '414d9e8881c648faa99ffc2b9bd17cb4',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: [
					'MdcMaterialFk',
					'Description2',
					'CatalogFk',
					'BasUomFk',
					'PrjStockLocationFk',
					'LotNo',
					'PrcStocktransactiontypeFk',
					'ProductCode',
					'ProductDescription',
					'StockQuantity',
					'StockTotal',
					'StockProvisionTotal',
					'ActualQuantity',
					'ActualTotal',
					'ActualProvisionTotal',
					'QuantityDifference',
					'TotalDifference',
					'ProvisionDifference',
					'Price',
					'Status',
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'UserDefined4',
					'UserDefined5',
					'ExpirationDate',
					'RecordedUomFk',
					'RecordedQuantity',
					'IsCounted',
					'Quantity1',
					'Quantity2',
					'ClerkFk1',
					'ClerkFk2',
					'DifferenceClerkQuantity',
				],
			},
		],
		labels: {
			...prefixAllTranslationKeys('procurement.inventory.', {
				MdcMaterialFk: { key: 'mdcmaterialfk' },
				Description2: { key: 'materialfurtherdes', text: 'Further Description' },
				CatalogFk: { key: 'catalog' },
				BasUomFk: { key: 'uom' },
				PrjStockLocationFk: { key: 'prjstocklocationfk' },
				LotNo: { key: 'lotno' },
				StockQuantity: { key: 'stockquantity' },
				StockTotal: { key: 'header.stockTotal' },
				StockProvisionTotal: { key: 'stockprovisiontotal' },
				ActualQuantity: { key: 'actualquantity' },
				ActualTotal: { key: 'actualtotal' },
				ActualProvisionTotal: { key: 'actualprovisiontotal' },
				QuantityDifference: { key: 'quantitydifference' },
				TotalDifference: { key: 'totaldifference' },
				ProvisionDifference: { key: 'provisiondifference' },
				UserDefined1: { key: 'header.userDefined1' },
				UserDefined2: { key: 'header.userDefined2' },
				UserDefined3: { key: 'header.userDefined3' },
				UserDefined4: { key: 'header.userDefined4' },
				UserDefined5: { key: 'header.userDefined5' },
				ProductCode: { key: 'productcode' },
				ProductDescription: { key: 'productdes' },
				Price: { key: 'price' },
				Status: { key: 'status' },
				PrcStocktransactiontypeFk: { key: 'header.prcStockTransactionTypeFk' },
				ExpirationDate: { key: 'ExpirationDate' },
				RecordedUomFk: { key: 'recordedUomFk' },
				RecordedQuantity: { key: 'recordedQuantity' },
				IsCounted: { key: 'isCounted' },
				Quantity1: { key: 'quantity1' },
				Quantity2: { key: 'quantity2' },
				ClerkFk1: { key: 'clerk1' },
				ClerkFk2: { key: 'clerk2' },
				DifferenceClerkQuantity: { key: 'differenceClerkQuantity' },
			}),
		},
		overloads: {
			MdcMaterialFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IPrcInventoryEntity, IMaterialSearchEntity>({
					dataServiceToken: BasicsSharedMaterialLookupService,
				}),
				additionalFields: [
					{
						id: 'Description',
						displayMember: 'DescriptionInfo.Translated',
						label: {
							key: 'procurement.inventory.materialdes',
							text: 'Material Description',
						},
						column: true,
						singleRow: true,
					},
				],
			},
			CatalogFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedMaterialCatalogLookupService,
					showDescription: true,
					descriptionMember: 'DescriptionInfo.Translated',
				}),
				readonly: true,
			},
			BasUomFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedUomLookupService,
				}),
				additionalFields: [
					{
						id: 'Description',
						displayMember: 'DescriptionInfo.Description',
						label: {
							key: 'procurement.inventory.uomdes',
							text: '"UoM-Description',
						},
						column: true,
						singleRow: true,
					},
				],
			},
			PrcStocktransactiontypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup<IPrcInventoryEntity, IPrcStockTransactionTypeEntity>({
					dataServiceToken: PrcStockTransactionTypeLookupService,
					showGrid: false,
				}),
			},
			PrjStockLocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationReadonlyLookupOverload(),
		},
	},
});
