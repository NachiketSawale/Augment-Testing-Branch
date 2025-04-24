/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDangerClassEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDangerClassEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDangerClassLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDangerClassEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/dangerclass/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '43cd2f8893854a0189b0ab0615053008',
			valueMember: 'Id',
			displayMember: 'Code',
			gridConfig: {
				columns: [
					{
						id: 'Code',
						model: 'Code',
						type: FieldType.Code,
						label: { text: 'Code' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DescriptionInfo',
						model: 'DescriptionInfo',
						type: FieldType.Translation,
						label: { text: 'DescriptionInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RegulationNameInfo',
						model: 'RegulationNameInfo',
						type: FieldType.Translation,
						label: { text: 'RegulationNameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DangerCategoryInfo',
						model: 'DangerCategoryInfo',
						type: FieldType.Translation,
						label: { text: 'DangerCategoryInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'HazardLabelInfo',
						model: 'HazardLabelInfo',
						type: FieldType.Translation,
						label: { text: 'HazardLabelInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PackageGroupInfo',
						model: 'PackageGroupInfo',
						type: FieldType.Translation,
						label: { text: 'PackageGroupInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'TunnelRestrictionCodeInfo',
						model: 'TunnelRestrictionCodeInfo',
						type: FieldType.Translation,
						label: { text: 'TunnelRestrictionCodeInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'DangerNameInfo',
						model: 'DangerNameInfo',
						type: FieldType.Translation,
						label: { text: 'DangerNameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UomCapacityFk',
						model: 'UomCapacityFk',
						type: FieldType.Quantity,
						label: { text: 'UomCapacityFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RiskFactor',
						model: 'RiskFactor',
						type: FieldType.Quantity,
						label: { text: 'RiskFactor' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'PackageTypeFk',
						model: 'PackageTypeFk',
						type: FieldType.Quantity,
						label: { text: 'PackageTypeFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefText01',
						model: 'UserDefText01',
						type: FieldType.Description,
						label: { text: 'UserDefText01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefText02',
						model: 'UserDefText02',
						type: FieldType.Description,
						label: { text: 'UserDefText02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefText03',
						model: 'UserDefText03',
						type: FieldType.Description,
						label: { text: 'UserDefText03' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefText04',
						model: 'UserDefText04',
						type: FieldType.Description,
						label: { text: 'UserDefText04' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefText05',
						model: 'UserDefText05',
						type: FieldType.Description,
						label: { text: 'UserDefText05' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefInt01',
						model: 'UserDefInt01',
						type: FieldType.Quantity,
						label: { text: 'UserDefInt01' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefInt02',
						model: 'UserDefInt02',
						type: FieldType.Quantity,
						label: { text: 'UserDefInt02' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefInt03',
						model: 'UserDefInt03',
						type: FieldType.Quantity,
						label: { text: 'UserDefInt03' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefInt04',
						model: 'UserDefInt04',
						type: FieldType.Quantity,
						label: { text: 'UserDefInt04' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'UserDefInt05',
						model: 'UserDefInt05',
						type: FieldType.Quantity,
						label: { text: 'UserDefInt05' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
