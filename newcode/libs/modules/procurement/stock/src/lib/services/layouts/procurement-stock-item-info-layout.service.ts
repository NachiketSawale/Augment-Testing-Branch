/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IInitializationContext, prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedConStatusLookupService,BasicsSharedPesStatusLookupService, BasicsSharedStatusIconService} from '@libs/basics/shared';
import { IBasicsCustomizeConStatusEntity, IBasicsCustomizePesStatusEntity } from '@libs/basics/interfaces';

import { IStockItemInfoVEntity } from '../../model/entities/stock-item-info-ventity.interface';

/**
 * Procurement Stock item info layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockItemInfoLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(context: IInitializationContext): ILayoutConfiguration<IStockItemInfoVEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: [
						'ItemNo',
						'MatCode',
						'MatDescriptionInfo',
						'StockMatCode',
						'MaterialStockDescription',
						'PesCode',
						'PesDescription',
						'ConCode',
						'ConDescription',
						'ConQuantity',
						'DeliveredQuantity',
						'Quantity',
						'AlternativeQuantity',
						'ItemDate',
						'ConStatusFk',
						'PesStatusFk',
					],
				},
			],

			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					ItemNo: { key: 'prcItemItemNo', text: 'Item Number' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					MatCode: { key: 'entityMaterialCode', text: 'Material Code' },
				}),
				...prefixAllTranslationKeys('procurement.stock.', {
					MatDescriptionInfo: {
						key: 'itemInfo.matDescription',
						text: 'Material Description',
					},
					StockMatCode: {
						key: 'itemInfo.matStockCode',
						text: 'Stock Material Code',
					},
					DescriptionInfo: {
						key: 'itemInfo.matStockDescription',
						text: 'Material Stock Description',
					},
					PesCode: {
						key: 'itemInfo.pesCode',
						text: 'PES Code',
					},
					PesDescription: {
						key: 'itemInfo.pesDes',
						text: 'PES Description',
					},
					ConCode: {
						key: 'itemInfo.conCode',
						text: 'Contract Code',
					},
					ConDescription: {
						key: 'itemInfo.conDes',
						text: 'Contract Description',
					},
					ConQuantity: {
						key: 'itemInfo.conQuantity',
						text: 'Contracted Item Quantity',
					},
					DeliveredQuantity: {
						key: 'itemInfo.deliveredQuantity',
						text: 'Delivered Item Quantity',
					},
					Quantity: {
						key: 'itemInfo.quantity',
						text: 'Outstanding Item Quantity',
					},
					AlternativeQuantity: {
						key: 'itemInfo.alternativeQuantity',
						text: 'Alternative Quantity',
					},
					ItemDate: {
						key: 'itemInfo.itemDate',
						text: 'Item Header Date',
					},
					ConStatusFk: {
						key: 'itemInfo.conStatus',
						text: 'Contract Status',
					},
					PesStatusFk: {
						key: 'itemInfo.pesStatus',
						text: 'PES Status',
					},
				}),
			},
			overloads: {
				ItemNo: {
					readonly: true,
				},
				MatCode: {
					readonly: true,
				},
				MatDescriptionInfo: {
					readonly: true,
				},
				StockMatCode: {
					readonly: true,
				},
				DescriptionInfo: {
					readonly: true,
				},
				PesCode: {
					readonly: true,
				},
				PesDescription: {
					readonly: true,
				},
				ConCode: {
					readonly: true,
				},
				ConDescription: {
					readonly: true,
				},
				ConQuantity: {
					readonly: true,
					type: FieldType.Quantity,
				},
				DeliveredQuantity: {
					readonly: true,
					type: FieldType.Quantity,
				},
				Quantity: {
					readonly: true,
					type: FieldType.Quantity,
				},
				AlternativeQuantity: {
					readonly: true,
					type: FieldType.Quantity,
				},
				ItemDate: {
					readonly: true,
				},
				ConStatusFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockItemInfoVEntity, IBasicsCustomizeConStatusEntity>({
						dataServiceToken: BasicsSharedConStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: context.injector.get(BasicsSharedStatusIconService<IBasicsCustomizeConStatusEntity, IStockItemInfoVEntity>)
					}),
				},
				PesStatusFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockItemInfoVEntity, IBasicsCustomizePesStatusEntity>({
						dataServiceToken:BasicsSharedPesStatusLookupService,
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: context.injector.get(BasicsSharedStatusIconService<IBasicsCustomizePesStatusEntity, IStockItemInfoVEntity>)
					}),
				},
			},
		};
	}
}
