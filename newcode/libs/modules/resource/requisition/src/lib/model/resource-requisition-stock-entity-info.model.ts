/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ResourceRequisitionStockDataService } from '../services/resource-requisition-stock-data.service';
import { IStockTotalVEntity } from '@libs/resource/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const RESOURCE_REQUISITION_STOCK_ENTITY_INFO: EntityInfo = EntityInfo.create<IStockTotalVEntity>({
	grid: {
		title: {key: 'resource.requisition' + '.stockListTitle'},
	},
	form: {
		title: {key: 'resource.requisition' + '.stockDetailTitle'},
		containerUuid: '22babd8bf191404ab940bb9d5b29b5f9',
	},
	dataService: ctx => ctx.injector.get(ResourceRequisitionStockDataService),
	dtoSchemeId: {moduleSubModule: 'Resource.Requisition', typeName: 'StockTotalVDto'},
	permissionUuid: 'df4eaad0581d44e1a18fde037c1c835d',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['StockFk', 'CatalogCode', 'CatalogDescription', 'MaterialCode', 'StructureFk', 'MaterialGroupId', 'MaterialFk', 'Description2',
					'BrandDescription', 'Quantity', 'Modelname', 'BrandDescription', 'ProvisionTotal', 'ProvisionPercent', 'ProvisionPeruom', 'IslotManagement',
					'MinQuantity', 'MaxQuantity', 'QuantityReceipt', 'QuantityConsumed', 'TotalReceipt', 'TotalConsumed', 'Total', 'QuantityReserved',
					'QuantityAvailable', 'ProvisionReceipt', 'ProvisionConsumed', 'ExpenseTotal'],
			},
			{
				gid: 'Reconciliation',
				attributes: [],//TODO
			}
		],
		//TODO lookups:BasBlobsFk,ProductFk
		overloads: {
			StockFk: BasicsSharedLookupOverloadProvider.providePrcStockTransactionTypeLookupOverload(true),
			StructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
			MaterialFk: BasicsSharedLookupOverloadProvider.provideMaterialLookupOverload(true),
		},
		labels: {
			...prefixAllTranslationKeys('procurement.stock.', {
				CatalogCode: {key: 'stocktotal.materialcatalog'},
				CatalogDescription: {key: 'stocktotal.materialcatalogdescription'},
				MaterialCode: {key: 'stocktotal.MdcMaterialFk'},
				Description1: {key: 'stocktotal.MdcMaterialdescription1'},
				Description2: {key: 'stocktotal.MdcMaterialdescription2'},
				Modelname: {key: 'stocktotal.Modelname'},
				BrandDescription: {key: 'stocktotal.Brand'},
				ProvisionTotal: {key: 'stocktotal.ProvisionTotal'},
				ProvisionPercent: {key: 'stocktotal.ProvisionPercent'},
				ProvisionPeruom: {key: 'stocktotal.ProvisionPeruom'},
				IslotManagement: {key: 'stocktotal.IslotManagement'},
				MinQuantity: {key: 'stocktotal.MinQuantity'},
				MaxQuantity: {key: 'stocktotal.MaxQuantity'},
				QuantityReceipt: {key: 'stocktotal.QuantityReceipt'},
				QuantityConsumed: {key: 'stocktotal.QuantityConsumed'},
				TotalReceipt: {key: 'stocktotal.TotalReceipt'},
				TotalConsumed: {key: 'stocktotal.TotalConsumed'},
				QuantityReserved: {key: 'stocktotal.QuantityReserved'},
				QuantityAvailable: {key: 'stocktotal.QuantityAvailable'},
				ProvisionReceipt: {key: 'stocktotal.ProvisionReceipt'},
				ProvisionConsumed: {key: 'stocktotal.ProvisionConsumed'},
				ExpenseTotal: {key: 'stocktotal.ExpenseTotal'},

			}), ...prefixAllTranslationKeys('basics.requisition.', {
				StockFk: {key: 'entityStock'},

			}), ...prefixAllTranslationKeys('basics.equipment.', {
				Total: {key: 'entityTotal'},

			}), ...prefixAllTranslationKeys('basics.common.', {
				StructureFk: {key: 'entityPrcStructureFk'},
				Quantity: {key: 'entityQuantity'},

			}), ...prefixAllTranslationKeys('basics.material.', {
				MaterialFk: {key: 'record.materialGroup'},

			})

		}
	},

});