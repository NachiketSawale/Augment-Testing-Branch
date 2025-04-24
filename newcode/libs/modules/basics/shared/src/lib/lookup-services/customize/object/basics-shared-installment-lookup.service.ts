/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeInstallmentEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeInstallmentEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedInstallmentLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeInstallmentEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/installment/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'aa6885be2e3749a9b18636fad8017fc0',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeInstallmentEntity) => x.DescriptionInfo),
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
						id: 'InstallmentagreementFk',
						model: 'InstallmentagreementFk',
						type: FieldType.Quantity,
						label: { text: 'InstallmentagreementFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Installment',
						model: 'Installment',
						type: FieldType.Quantity,
						label: { text: 'Installment' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'InstallmentPercent',
						model: 'InstallmentPercent',
						type: FieldType.Quantity,
						label: { text: 'InstallmentPercent' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description1',
						model: 'Description1',
						type: FieldType.Description,
						label: { text: 'Description1' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Description2',
						model: 'Description2',
						type: FieldType.Description,
						label: { text: 'Description2' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Comment,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Remark',
						model: 'Remark',
						type: FieldType.Remark,
						label: { text: 'Remark' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'Specification',
						model: 'Specification',
						type: FieldType.Remark,
						label: { text: 'Specification' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
