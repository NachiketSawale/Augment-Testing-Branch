/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInstallmentAgreementEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInstallmentAgreementEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInstallmentAgreementLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInstallmentAgreementEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/installmentagreement/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a805dd63473a4140bb9a7c829738bd19',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInstallmentAgreementEntity) => x.DescriptionInfo),
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
					}
				]
			}
		});
	}
}
