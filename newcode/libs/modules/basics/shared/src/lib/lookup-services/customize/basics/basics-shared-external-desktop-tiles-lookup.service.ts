/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeExternalDesktopTilesEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeExternalDesktopTilesEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedExternalDesktopTilesLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeExternalDesktopTilesEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/externaldesktoptiles/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '8b113dda60ef479186f8bdb39d49368a',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeExternalDesktopTilesEntity) => x.DescriptionInfo),
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
						id: 'NameInfo',
						model: 'NameInfo',
						type: FieldType.Translation,
						label: { text: 'NameInfo' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Url',
						model: 'Url',
						type: FieldType.Remark,
						label: { text: 'Url' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'RunspaceIframe',
						model: 'RunspaceIframe',
						type: FieldType.Boolean,
						label: { text: 'RunspaceIframe' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Imagefilename',
						model: 'Imagefilename',
						type: FieldType.Comment,
						label: { text: 'Imagefilename' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'BlobImageFk',
						model: 'BlobImageFk',
						type: FieldType.Quantity,
						label: { text: 'BlobImageFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AccessrightDescriptorFk',
						model: 'AccessrightDescriptorFk',
						type: FieldType.Quantity,
						label: { text: 'AccessrightDescriptorFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SsoJwtTemplate',
						model: 'SsoJwtTemplate',
						type: FieldType.Comment,
						label: { text: 'SsoJwtTemplate' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'SsoJwtParametername',
						model: 'SsoJwtParametername',
						type: FieldType.Comment,
						label: { text: 'SsoJwtParametername' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ExternalConfigFk',
						model: 'ExternalConfigFk',
						type: FieldType.Quantity,
						label: { text: 'ExternalConfigFk' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
