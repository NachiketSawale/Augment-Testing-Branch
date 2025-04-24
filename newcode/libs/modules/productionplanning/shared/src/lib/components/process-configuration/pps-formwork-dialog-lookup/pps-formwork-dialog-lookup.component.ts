/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BasicsSharedDialogLookupBaseComponent, CustomDialogLookupOptions, ICustomFormEditorDialog, ICustomSearchDialogOptions, ISearchEntity } from '@libs/basics/shared';
import { PpsFormworkLookupService } from '../../../services/process-configuration/pps-formwork-lookup.service';
import { IPpsFormworkSimpleLookupEntity } from '../../../model/process-configuration/pps-formwork-simple-lookup-entity.interface';
import { EntityRuntimeData } from '@libs/platform/data-access';
import {
	ColumnDef,
	FieldType,
	IDialogButtonBase,
	IFormConfig,
	StandardDialogButtonId
} from '@libs/ui/common';

@Component({
	selector: 'productionplanning-shared-process-dialog-lookup',
	templateUrl: './pps-formwork-dialog-lookup.component.html',
	styleUrls: ['./pps-formwork-dialog-lookup.component.scss'],
})
export class PpsFormworkDialogLookupComponent extends BasicsSharedDialogLookupBaseComponent<IPpsFormworkSimpleLookupEntity, IPpsFormworkSimpleLookupEntity> {
	/**
	 * Initialize custom dialog options.
	 */
	public initializeOptions(): Observable<CustomDialogLookupOptions<IPpsFormworkSimpleLookupEntity, IPpsFormworkSimpleLookupEntity>> {
		const searchOptions: ICustomSearchDialogOptions<IPpsFormworkSimpleLookupEntity, object> = this.provideSearchOptions();

		const options: CustomDialogLookupOptions<IPpsFormworkSimpleLookupEntity, IPpsFormworkSimpleLookupEntity> = {
			uuid: '6253d833f2a94e97a7fa7df40303067d',
			displayMember: 'Id',
			descriptionMember: 'Description',
			dataServiceToken: PpsFormworkLookupService,
			readonly: false,
			showEditButton: true,
			showClearButton: true,
			cloneOnly: true,
			searchOptions: searchOptions,
		};

		return of(options);
	}

	private provideSearchOptions(): ICustomSearchDialogOptions<IPpsFormworkSimpleLookupEntity, object> {
		const searchFormEntityRuntimeData: EntityRuntimeData<ISearchEntity> = new EntityRuntimeData<ISearchEntity>();
		const searchFormConfig: IFormConfig<ISearchEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: []
		};

		return {
			headerText: {
				text: 'Formworks',
				// key: '', to do after relevant translation json file is updated
			},
			form: {
				configuration: searchFormConfig,
				entityRuntimeData: searchFormEntityRuntimeData,
				entity: (entity: object) => {
					return {};
				}
			},
			grid: {
				config: {
					uuid: '92af23c42c514fd99f804de294a3975c',
					columns: [{
						id: 'code',
						model: 'Code',
						type: FieldType.Code,
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						readonly: true,
						visible: true,
						sortable: true,
						searchable: true,
						width: 180,
					}, {
						id: 'description',
						model: 'Description',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						readonly: true,
						visible: true,
						sortable: true,
						searchable: true,
						width: 380,
					}

					] as ColumnDef<IPpsFormworkSimpleLookupEntity>[]
				}
			},
			resizeable: true,
			width: '500px',
		};
	}

	private provideButtons(): IDialogButtonBase<ICustomFormEditorDialog<IPpsFormworkSimpleLookupEntity>>[] {
		return [{
			id: StandardDialogButtonId.Ok
		}, {
			id: StandardDialogButtonId.Cancel
		}];
	}
}
