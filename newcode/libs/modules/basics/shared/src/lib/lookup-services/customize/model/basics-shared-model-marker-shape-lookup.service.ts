/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeModelMarkerShapeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeModelMarkerShapeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedModelMarkerShapeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeModelMarkerShapeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/modelmarkershape/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a2939a1fd4164b08876925f25364522b',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeModelMarkerShapeEntity) => x.DescriptionInfo),
			gridConfig: {
				columns: [
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
						id: 'Geometry3d',
						model: 'Geometry3d',
						type: FieldType.Quantity,
						label: { text: 'Geometry3d' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Geometry3dFormat',
						model: 'Geometry3dFormat',
						type: FieldType.Quantity,
						label: { text: 'Geometry3dFormat' },
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
					}
				]
			}
		});
	}
}
