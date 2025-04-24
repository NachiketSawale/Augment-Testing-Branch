/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeDocumentTypeEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedDocumentTypeLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeDocumentTypeEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/documenttype/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '5fbd85c8ba574f7bb0d41a69cc2944f8',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeDocumentTypeEntity) => x.DescriptionInfo),
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
						id: 'IsDefault',
						model: 'IsDefault',
						type: FieldType.Boolean,
						label: { text: 'IsDefault' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Extention',
						model: 'Extention',
						type: FieldType.Comment,
						label: { text: 'Extention' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaxByte',
						model: 'MaxByte',
						type: FieldType.Quantity,
						label: { text: 'MaxByte' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaxLength',
						model: 'MaxLength',
						type: FieldType.Quantity,
						label: { text: 'MaxLength' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'MaxWidth',
						model: 'MaxWidth',
						type: FieldType.Quantity,
						label: { text: 'MaxWidth' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Is2DModel',
						model: 'Is2DModel',
						type: FieldType.Boolean,
						label: { text: 'Is2DModel' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Is3DModel',
						model: 'Is3DModel',
						type: FieldType.Boolean,
						label: { text: 'Is3DModel' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowUpload',
						model: 'AllowUpload',
						type: FieldType.Boolean,
						label: { text: 'AllowUpload' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'AllowPreview',
						model: 'AllowPreview',
						type: FieldType.Boolean,
						label: { text: 'AllowPreview' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'ValidateFileSignature',
						model: 'ValidateFileSignature',
						type: FieldType.Boolean,
						label: { text: 'ValidateFileSignature' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
