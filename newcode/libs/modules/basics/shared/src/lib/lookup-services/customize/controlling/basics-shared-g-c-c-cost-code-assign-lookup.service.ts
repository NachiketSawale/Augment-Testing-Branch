/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { FieldType, LookupFormatterService, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeGCCCostCodeAssignEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeGCCCostCodeAssignEntity from customize module
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedGCCCostCodeAssignLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeGCCCostCodeAssignEntity, T>  {
	public constructor(protected formatterService: LookupFormatterService) {
		super({
			httpRead: { route: 'basics/customize/gcccostcodeassign/', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: 'a6ea4d89aa2a4e3e9ef0614abad445fe',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: formatterService.createTranslationFormatter((x: IBasicsCustomizeGCCCostCodeAssignEntity) => x.DescriptionInfo),
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
						id: 'ContextFk',
						model: 'ContextFk',
						type: FieldType.Quantity,
						label: { text: 'ContextFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CostCodeCostFk',
						model: 'CostCodeCostFk',
						type: FieldType.Quantity,
						label: { text: 'CostCodeCostFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CostCodeBudgetFk',
						model: 'CostCodeBudgetFk',
						type: FieldType.Quantity,
						label: { text: 'CostCodeBudgetFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CostCodeBudgetShiftFk',
						model: 'CostCodeBudgetShiftFk',
						type: FieldType.Quantity,
						label: { text: 'CostCodeBudgetShiftFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CostCodeAdditionalExpenseFk',
						model: 'CostCodeAdditionalExpenseFk',
						type: FieldType.Quantity,
						label: { text: 'CostCodeAdditionalExpenseFk' },
						sortable: true,
						visible: true,
						readonly: true
					},
					{
						id: 'CommentText',
						model: 'CommentText',
						type: FieldType.Description,
						label: { text: 'CommentText' },
						sortable: true,
						visible: true,
						readonly: true
					}
				]
			}
		});
	}
}
