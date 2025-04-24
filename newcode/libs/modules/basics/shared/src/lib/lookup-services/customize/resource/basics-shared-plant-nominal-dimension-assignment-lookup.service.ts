/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizePlantNominalDimensionAssignmentEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizePlantNominalDimensionAssignmentEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedPlantNominalDimensionAssignmentLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizePlantNominalDimensionAssignmentEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/plantnominaldimensionassignment/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '83d39ece2ad74dc78975e6cbc78093ac',
			valueMember: 'Id',
			displayMember: 'EtmContextFk',
			gridConfig: {
				columns: [
					{
						id: 'EtmContextFk',
						model: 'EtmContextFk',
						type: FieldType.Quantity,
						label: { text: 'EtmContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0101Name',
						model: 'NominalDimension0101Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0101Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0102Name',
						model: 'NominalDimension0102Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0102Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0103Name',
						model: 'NominalDimension0103Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0103Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0201Name',
						model: 'NominalDimension0201Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0201Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0202Name',
						model: 'NominalDimension0202Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0202Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0203Name',
						model: 'NominalDimension0203Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0203Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0301Name',
						model: 'NominalDimension0301Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0301Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0302Name',
						model: 'NominalDimension0302Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0302Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0303Name',
						model: 'NominalDimension0303Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0303Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0401Name',
						model: 'NominalDimension0401Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0401Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0402Name',
						model: 'NominalDimension0402Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0402Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0403Name',
						model: 'NominalDimension0403Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0403Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0501Name',
						model: 'NominalDimension0501Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0501Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0502Name',
						model: 'NominalDimension0502Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0502Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0503Name',
						model: 'NominalDimension0503Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0503Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0601Name',
						model: 'NominalDimension0601Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0601Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0602Name',
						model: 'NominalDimension0602Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0602Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NominalDimension0603Name',
						model: 'NominalDimension0603Name',
						type: FieldType.Description,
						label: { text: 'NominalDimension0603Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0101Fk',
						model: 'ControllingGroup0101Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0101Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0102Fk',
						model: 'ControllingGroup0102Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0102Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0103Fk',
						model: 'ControllingGroup0103Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0103Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0201Fk',
						model: 'ControllingGroup0201Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0201Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0202Fk',
						model: 'ControllingGroup0202Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0202Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0203Fk',
						model: 'ControllingGroup0203Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0203Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0301Fk',
						model: 'ControllingGroup0301Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0301Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0302Fk',
						model: 'ControllingGroup0302Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0302Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0303Fk',
						model: 'ControllingGroup0303Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0303Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0401Fk',
						model: 'ControllingGroup0401Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0401Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0402Fk',
						model: 'ControllingGroup0402Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0402Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0403Fk',
						model: 'ControllingGroup0403Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0403Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0501Fk',
						model: 'ControllingGroup0501Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0501Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0502Fk',
						model: 'ControllingGroup0502Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0502Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0503Fk',
						model: 'ControllingGroup0503Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0503Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0601Fk',
						model: 'ControllingGroup0601Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0601Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0602Fk',
						model: 'ControllingGroup0602Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0602Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ControllingGroup0603Fk',
						model: 'ControllingGroup0603Fk',
						type: FieldType.Quantity,
						label: { text: 'ControllingGroup0603Fk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
