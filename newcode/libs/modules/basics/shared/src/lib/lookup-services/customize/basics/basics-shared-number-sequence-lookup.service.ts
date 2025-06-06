/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeNumberSequenceEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeNumberSequenceEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedNumberSequenceLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeNumberSequenceEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/numbersequence/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b5a3a89fe3e44dd6a31bcb66abd74b76',
			valueMember: 'Id',
			displayMember: 'SequenceName',
			gridConfig: {
				columns: [
					{
						id: 'SequenceName',
						model: 'SequenceName',
						type: FieldType.Description,
						label: { text: 'SequenceName' },
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
						id: 'StartValue',
						model: 'StartValue',
						type: FieldType.Quantity,
						label: { text: 'StartValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaxValue',
						model: 'MaxValue',
						type: FieldType.Quantity,
						label: { text: 'MaxValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'LastValue',
						model: 'LastValue',
						type: FieldType.Quantity,
						label: { text: 'LastValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IncrementValue',
						model: 'IncrementValue',
						type: FieldType.Quantity,
						label: { text: 'IncrementValue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HeaderId',
						model: 'HeaderId',
						type: FieldType.Quantity,
						label: { text: 'HeaderId' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'EntityId',
						model: 'EntityId',
						type: FieldType.Comment,
						label: { text: 'EntityId' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsNumeric',
						model: 'IsNumeric',
						type: FieldType.Boolean,
						label: { text: 'IsNumeric' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CharStartvalue',
						model: 'CharStartvalue',
						type: FieldType.Comment,
						label: { text: 'CharStartvalue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ChartEndvalue',
						model: 'ChartEndvalue',
						type: FieldType.Comment,
						label: { text: 'ChartEndvalue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ChartLastvalue',
						model: 'ChartLastvalue',
						type: FieldType.Comment,
						label: { text: 'ChartLastvalue' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isautogenerated',
						model: 'Isautogenerated',
						type: FieldType.Boolean,
						label: { text: 'Isautogenerated' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Perioddate',
						model: 'Perioddate',
						type: FieldType.DateUtc,
						label: { text: 'Perioddate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Isdatedriven',
						model: 'Isdatedriven',
						type: FieldType.Boolean,
						label: { text: 'Isdatedriven' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CodegensequenceTypeFk',
						model: 'CodegensequenceTypeFk',
						type: FieldType.Quantity,
						label: { text: 'CodegensequenceTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'NumberSequenceFk',
						model: 'NumberSequenceFk',
						type: FieldType.Quantity,
						label: { text: 'NumberSequenceFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
