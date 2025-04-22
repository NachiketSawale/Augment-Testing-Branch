/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {createLookup, FieldType, UiCommonLookupTypeLegacyDataService} from '@libs/ui/common';
import {IPrcItemLookupVEntity} from '@libs/procurement/interfaces';
import {BasicsSharedMaterialLookupService} from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementSharedPrcItemLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IPrcItemLookupVEntity, TEntity> {
	public constructor() {
		super('PrcItem', {
			uuid: '19c1fb4964374ba99f621385506240fe',
			valueMember: 'Id',
			displayMember: 'MaterialCode',
			gridConfig: {
				columns: [
					{
						id: 'itemNo', model: 'ItemNO', label: 'procurement.common.prcItemItemNo',
						type: FieldType.Description,
						sortable: true,
						visible: true,
					},
					{
						id: 'desc', model: 'PrcItemDescription', width: 200, label: 'cloud.common.entityDescription',
						type: FieldType.Description,
						sortable: true,
						visible: true,
					},
					{
						id: 'mdcMaterialFk',
						model: 'MdcMaterialFk',
						label: 'cloud.common.prcItemMaterialNo',
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedMaterialLookupService
						}),
						sortable: true,
						visible: true,
					},
					{
						id: 'MaterialDescription',
						model: 'MaterialDescription',
						width: 200,
						label: 'procurement.common.entityMaterialDescription',
						type: FieldType.Description,
						searchable: false,
						sortable: true,
						visible: true,
					}
				]
			},
			dialogOptions: {
				headerText: 'procurement.common.dialogTitleItem'
			}
		});
	}
}