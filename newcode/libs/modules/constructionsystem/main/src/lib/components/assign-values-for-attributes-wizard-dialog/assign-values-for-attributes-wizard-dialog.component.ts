/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { createLookup, FieldType, GridComponent, IGridConfiguration, UiCommonModule } from '@libs/ui/common';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { ConstructionSystemSharedPropertyKeyLookupService } from '@libs/constructionsystem/shared';
import {
	COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN, IValues2Assign
} from '../../model/entities/token/cos-assign-values-for-attrubutes-option.interface';

@Component({
	selector: 'constructionsystem-main-assign-values-for-attributes-wizard-dialog',
	templateUrl: './assign-values-for-attributes-wizard-dialog.component.html',
	styleUrls: ['./assign-values-for-attributes-wizard-dialog.component.scss'],
	standalone: true,
	imports: [UiCommonModule, PlatformCommonModule, ReactiveFormsModule, FormsModule, GridComponent],
})
export class AssignValuesForAttributesWizardDialogComponent implements OnInit{
	public objectSource!: number;
	public value2AssignGridConfig! : IGridConfiguration<IValues2Assign>;
	public IsOverwriteValues: boolean = false;
	public settings = inject(COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN);

	public constructor() {}

	public ngOnInit() {
		this.setGridData();
	}

	private setGridData() {
		this.value2AssignGridConfig = {
			uuid: '564404a9c4da421191ca92fe7d73c810',
			idProperty: 'id',
			columns: [
				{
					id: 'PropertyKeyFk',
					label: { key: 'model.main.propertyKey', text: 'Attribute'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedPropertyKeyLookupService
					}),
					model: 'PropertyKeyFk',
					sortable: true,
					sortOrder: 1,
					width: 200,
					visible: true,
				},
				{
					id: 'IsDeleteValues',
					label: { key: 'model.main.propKeysBulkAssignment.delete', text: 'Delete Values'},
					type: FieldType.Boolean,
					model: 'IsDeleteValues',
					sortable: true,
					sortOrder: 2,
					width: 90,
					visible: true,
				},
				{
					id: 'Value',
					label: { key: 'model.main.propertyValue', text: 'Value'},
					type: FieldType.Description,
					model: 'Value',
					sortable: true,
					sortOrder: 3,
					width: 200,
					visible: true,
				},
				{
					id: 'UoMFk',
					label: { key: 'cloud.common.entityUoM', text: 'UoM'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					}),
					model: 'UoMFk',
					sortable: true,
					sortOrder: 4,
					width: 150,
					visible: true,
				}
			],
			items: this.settings.Values
		};
	}

}
