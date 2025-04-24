/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { COS_INSTANCE_LIST_TOKEN } from '../../model/entities/token/cos-instance-list.interface';
import { ColumnDef, FieldType, GridComponent, IGridConfiguration } from '@libs/ui/common';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';

@Component({
	selector: 'constructionsystem-main-cos-save-as-template',
	templateUrl: './cos-save-as-template.component.html',
	styleUrls: ['./cos-save-as-template.component.scss'],
	standalone: true,
	imports: [GridComponent],
})
export class CosSaveAsTemplateComponent {
	protected readonly instanceListToken = inject(COS_INSTANCE_LIST_TOKEN);
	protected gridConfig: IGridConfiguration<ICosInstanceEntity> = {
		uuid: '32da0768c298449c99367bdf66a9b376',
		columns: [],
		items: [],
		iconClass: null,
		skipPermissionCheck: false,
		enableColumnReorder: false,
		enableCopyPasteExcel: true,
	};
	public constructor() {
		this.prepareGrid();
	}

	private prepareGrid(): void {
		const columns: ColumnDef<ICosInstanceEntity>[] = [
			{
				id: 'code',
				model: 'Code',
				label: {
					text: 'Code',
					key: 'constructionsystem.main.saveAsTemplate.instanceCode',
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
			},
			{
				id: 'cos.instance.description',
				model: 'DescriptionInfo',
				label: {
					text: 'Description (Instance)',
					key: 'constructionsystem.main.saveAsTemplate.instanceDescription',
				},
				type: FieldType.Translation,
				sortable: true,
				visible: true,
			},
			{
				id: 'cos.template.description',
				model: 'DescriptionInfo.Translated',
				label: {
					text: 'Description (Template)',
					key: 'constructionsystem.main.saveAsTemplate.templateDescription',
				},
				type: FieldType.Description,
				sortable: true,
				visible: true,
			},
		];
		this.gridConfig = {
			...this.gridConfig,
			columns: columns,
			items: this.instanceListToken.instances,
		};
	}
}
///todo:there are two additional lines shown in grid, check later
