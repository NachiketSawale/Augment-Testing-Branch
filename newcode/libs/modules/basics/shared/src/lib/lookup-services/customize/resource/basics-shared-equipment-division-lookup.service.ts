/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeEquipmentDivisionEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeEquipmentDivisionEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedEquipmentDivisionLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeEquipmentDivisionEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/equipmentdivision/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '05f1644c5a7046b6a322ef629d2bd33f',
			valueMember: 'Id',
			displayMember: 'Description',
			gridConfig: {
				columns: [
					{
						id: 'Description',
						model: 'Description',
						type: FieldType.Description,
						label: { text: 'Description' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PlantContextFk',
						model: 'PlantContextFk',
						type: FieldType.Quantity,
						label: { text: 'PlantContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomFk',
						model: 'UomFk',
						type: FieldType.Quantity,
						label: { text: 'UomFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LogisticContextFk',
						model: 'LogisticContextFk',
						type: FieldType.Quantity,
						label: { text: 'LogisticContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CurrencyFk',
						model: 'CurrencyFk',
						type: FieldType.Quantity,
						label: { text: 'CurrencyFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCalculationBasedOnThirtyDays',
						model: 'IsCalculationBasedOnThirtyDays',
						type: FieldType.Boolean,
						label: { text: 'IsCalculationBasedOnThirtyDays' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCalcBasedOnWorkdays',
						model: 'IsCalcBasedOnWorkdays',
						type: FieldType.Boolean,
						label: { text: 'IsCalcBasedOnWorkdays' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsChargingNegativQuantity',
						model: 'IsChargingNegativQuantity',
						type: FieldType.Boolean,
						label: { text: 'IsChargingNegativQuantity' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TimesheetContextFk',
						model: 'TimesheetContextFk',
						type: FieldType.Quantity,
						label: { text: 'TimesheetContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsAggregatedByUom',
						model: 'IsAggregatedByUom',
						type: FieldType.Boolean,
						label: { text: 'IsAggregatedByUom' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
