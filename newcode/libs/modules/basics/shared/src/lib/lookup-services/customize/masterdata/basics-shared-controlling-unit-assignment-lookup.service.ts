/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeControllingUnitAssignmentEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeControllingUnitAssignmentEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedControllingUnitAssignmentLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeControllingUnitAssignmentEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/controllingunitassignment/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '11dd17d2b160431fb8be4c8c0877a1e0',
			valueMember: 'Id',
			displayMember: 'ContextFk',
			gridConfig: {
				columns: [
					{
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment01Name',
						model: 'Assignment01Name',
						type: FieldType.Description,
						label: { text: 'Assignment01Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment01Transfer',
						model: 'Assignment01Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment01Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup1Fk',
						model: 'Controllinggroup1Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup1Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment02Name',
						model: 'Assignment02Name',
						type: FieldType.Description,
						label: { text: 'Assignment02Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment02Transfer',
						model: 'Assignment02Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment02Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup2Fk',
						model: 'Controllinggroup2Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup2Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment03Name',
						model: 'Assignment03Name',
						type: FieldType.Description,
						label: { text: 'Assignment03Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment03Transfer',
						model: 'Assignment03Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment03Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup3Fk',
						model: 'Controllinggroup3Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup3Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment04Name',
						model: 'Assignment04Name',
						type: FieldType.Description,
						label: { text: 'Assignment04Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment04Transfer',
						model: 'Assignment04Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment04Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup4Fk',
						model: 'Controllinggroup4Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup4Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment05Name',
						model: 'Assignment05Name',
						type: FieldType.Description,
						label: { text: 'Assignment05Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment05Transfer',
						model: 'Assignment05Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment05Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup5Fk',
						model: 'Controllinggroup5Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup5Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment06Name',
						model: 'Assignment06Name',
						type: FieldType.Description,
						label: { text: 'Assignment06Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment06Transfer',
						model: 'Assignment06Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment06Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup6Fk',
						model: 'Controllinggroup6Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup6Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment07Name',
						model: 'Assignment07Name',
						type: FieldType.Description,
						label: { text: 'Assignment07Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment07Transfer',
						model: 'Assignment07Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment07Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup7Fk',
						model: 'Controllinggroup7Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup7Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment08Name',
						model: 'Assignment08Name',
						type: FieldType.Description,
						label: { text: 'Assignment08Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment08Transfer',
						model: 'Assignment08Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment08Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup8Fk',
						model: 'Controllinggroup8Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup8Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment09Name',
						model: 'Assignment09Name',
						type: FieldType.Description,
						label: { text: 'Assignment09Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment09Transfer',
						model: 'Assignment09Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment09Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup9Fk',
						model: 'Controllinggroup9Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup9Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment10Name',
						model: 'Assignment10Name',
						type: FieldType.Description,
						label: { text: 'Assignment10Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Assignment10Transfer',
						model: 'Assignment10Transfer',
						type: FieldType.Boolean,
						label: { text: 'Assignment10Transfer' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Controllinggroup10Fk',
						model: 'Controllinggroup10Fk',
						type: FieldType.Quantity,
						label: { text: 'Controllinggroup10Fk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Nominaldimension1Name',
						model: 'Nominaldimension1Name',
						type: FieldType.Description,
						label: { text: 'Nominaldimension1Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Nominaldimension2Name',
						model: 'Nominaldimension2Name',
						type: FieldType.Description,
						label: { text: 'Nominaldimension2Name' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Nominaldimension3Name',
						model: 'Nominaldimension3Name',
						type: FieldType.Description,
						label: { text: 'Nominaldimension3Name' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
