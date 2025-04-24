/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IPrcItemMergedLookupEntity } from '../../model/entities';
import { Injectable } from '@angular/core';

/**
 * Prc item lookup data service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementSharedPrcItemMergedLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IPrcItemMergedLookupEntity, TEntity> {
	public constructor() {
		super('PrcItemMergedLookup', {
			uuid: '4d8dcd9bdc1e4b7abd16c63cede309c1',
			valueMember: 'Id',
			displayMember: 'Itemno',
			gridConfig: {
				columns: [
					{
						id: 'ItemNO',
						model: 'ItemNO',
						label: {
							key: 'procurement.common.prcItemItemNo',
						},
						type: FieldType.Code,
						sortable: true,
						visible: true,
					},
					{
						id: 'MaterialCode',
						model: 'MaterialCode',
						label: {
							key: 'procurement.common.prcItemMaterialNo',
						},
						type: FieldType.Code,
						sortable: true,
						visible: true,
					},
					{
						id: 'PrcItemDescription',
						model: 'PrcItemDescription',
						label: {
							key: 'cloud.common.entityDescription',
						},
						type: FieldType.Description,
						sortable: true,
						visible: true,
					},
					{
						id: 'Quantity',
						model: 'Quantity',
						label: {
							key: 'procurement.common.orderQuantity',
						},
						type: FieldType.Quantity,
						sortable: true,
						visible: true,
					},
					{
						id: 'Uom',
						model: 'Uom',
						label: {
							key: 'cloud.common.entityUoM',
						},
						type: FieldType.Code,
						sortable: true,
						visible: true,
					},
					{
						id: 'PriceValue',
						model: 'PriceValue',
						label: {
							key: 'procurement.common.price',
						},
						type: FieldType.Quantity,
						sortable: true,
						visible: true,
					},
					{
						id: 'TotalPrice',
						model: 'TotalPrice',
						label: {
							key: 'procurement.common.totalPrice',
						},
						type: FieldType.Quantity,
						sortable: true,
						visible: true,
					},
				],
			},
			showDialog: true,
			dialogOptions: {
				headerText: { text: 'Contract Item', key: 'procurement.pes.entityPrcItemFk' },
			},
		});

		this.paging.enabled = true;
	}

	protected override getPropertiesToSort() {
		return ['ItemNo'];
	}
}
