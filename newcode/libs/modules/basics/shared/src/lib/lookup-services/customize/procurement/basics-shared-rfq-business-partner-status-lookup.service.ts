/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeRfqBusinessPartnerStatusEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeRfqBusinessPartnerStatusEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedRfqBusinessPartnerStatusLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeRfqBusinessPartnerStatusEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/rfqbusinesspartnerstatus/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'b75091cbd9774393b2376dd3a78a5077',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeRfqBusinessPartnerStatusEntity) => x.DescriptionInfo),
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
						id: 'IsRequested',
						model: 'IsRequested',
						type: FieldType.Boolean,
						label: { text: 'IsRequested' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsCanceled',
						model: 'IsCanceled',
						type: FieldType.Boolean,
						label: { text: 'IsCanceled' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsQuoted',
						model: 'IsQuoted',
						type: FieldType.Boolean,
						label: { text: 'IsQuoted' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'IsDenied',
						model: 'IsDenied',
						type: FieldType.Boolean,
						label: { text: 'IsDenied' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
