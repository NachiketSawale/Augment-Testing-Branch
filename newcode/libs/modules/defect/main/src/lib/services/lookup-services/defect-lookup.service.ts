import { createLookup, FieldType, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { IDfmDefectEntity } from '@libs/defect/interfaces';
import { BasicsSharedDefectStatusLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeDefectStatusEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class DfmDefectLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<IDfmDefectEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('DfmDefect', {
			uuid: '8e8ee2e121aa4595bab73628f58e509e',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: true,
			dialogOptions: {
				headerText: {
					text: 'Assign Defect',
					key: 'defect.main.defectLookupDialogueTitle',
				},
			},
			gridConfig: {
				columns: [
					{
						type: FieldType.Code,
						id: 'code',
						model: 'Code',
						label: { text: 'Code', key: 'cloud.common.entityCode' },
						width: 100,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'description',
						model: 'Description',
						label: { text: 'Description', key: 'cloud.common.entityDescription' },
						width: 150,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'projectNo',
						model: 'ProjectNo',
						label: { text: 'Project', key: 'cloud.common.entityProject' },
						width: 150,
						sortable: true,
						visible: true,
					},
					{
						id: 'status',
						model: 'StatusId',
						label: { text: 'Status', key: 'cloud.common.entityStatus' },
						width: 150,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedDefectStatusLookupService,
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: {
								select(item: IBasicsCustomizeDefectStatusEntity): string {
									return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
								},
								getIconType() {
									return 'css';
								},
							},
						}),
						sortable: true,
						visible: true,
						readonly: true,
					},
					{
						type: FieldType.Description,
						id: 'defectType',
						model: 'TypeDescriptionInfo.Translated',
						label: { text: 'Type', key: 'defect.main.entityBasDefectTypeFk' },
						width: 150,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'defectGroup',
						model: 'GroupDescInfo.Translated',
						label: { text: 'Group', key: 'defect.main.entityDfmGroupFk' },
						width: 100,
						sortable: true,
						visible: true,
					},
					{
						type: FieldType.Description,
						id: 'priority',
						model: 'PriorityDescriptionInfo.Translated',
						label: { text: 'Priority', key: 'defect.main.entityBasDefectPriorityFk' },
						width: 100,
						sortable: true,
						visible: true,
						searchable: false,
					},
					{
						type: FieldType.Description,
						id: 'severity',
						model: 'SeverityDescInfo.Translated',
						label: { text: 'Severity', key: 'defect.main.entityBasDefectSeverityFk' },
						width: 100,
						sortable: true,
						visible: true,
						searchable: false,
					},
					{
						type: FieldType.Description,
						id: 'warrantyStatus',
						model: 'WarrantyStatusDescInfo.Translated',
						label: { text: 'Warranty Status', key: 'defect.main.entityBasWarrantyStatusFk' },
						width: 100,
						sortable: true,
						visible: true,
						searchable: false,
					},
					{
						type: FieldType.Description,
						id: 'rubricCategory',
						model: 'RubricCategoryDescInfo.Translated',
						label: { text: 'Rubric Category', key: 'cloud.common.entityRubricCategoryDescription' },
						width: 100,
						sortable: true,
						visible: true,
						searchable: false,
					},
				],
			},
		});
		this.paging.enabled = true;
	}
}
