import { FieldType, UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IHsqChkListTemplateEntity } from '@libs/hsqe/interfaces';

@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistTemplateLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IHsqChkListTemplateEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('HsqeCheckListTemplate', {
			uuid: '1c8d62c519a54a3aaf3bd3b5946fe69a',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: true,
			dialogOptions: {
				headerText: {
					text: 'CheckList Template Search Dialog',
					key: 'hsqe.checklisttemplate.LookupDialogTitle',
				},
			},
			gridConfig: {
				columns: [
					{
						type: FieldType.Code,
						id: 'code',
						model: 'Code',
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						width: 180,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'description',
						model: 'DescriptionInfo.Translated',
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 200,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Text,
						id: 'commentText',
						model: 'CommentText',
						label: { text: 'CommentText', key: 'cloud.common.entityCommentText' },
						width: 200,
						sortable: true,
						visible: true,
					},
				],
			},
		});
	}
}
