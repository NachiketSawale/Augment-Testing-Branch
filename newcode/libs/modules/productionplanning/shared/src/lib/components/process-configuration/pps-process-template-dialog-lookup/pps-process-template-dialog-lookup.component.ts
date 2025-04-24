/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BasicsSharedDialogLookupBaseComponent, CustomDialogLookupOptions, ICustomFormEditorDialog, ICustomSearchDialogOptions, ISearchEntity } from '@libs/basics/shared';
import { ProductionplanningSharedProcessTemplateLookupService } from '../../../services/process-configuration/pps-process-template-lookup.service';
import { IPpsProcessTemplateSimpleLookupEntity } from '../../../model/process-configuration/pps-process-template-simple-lookup-entity.interface';
import { EntityRuntimeData } from '@libs/platform/data-access';
import {
	ColumnDef,
	FieldType,
	IDialogButtonBase,
	IFormConfig,
	StandardDialogButtonId
} from '@libs/ui/common';

@Component({
	selector: 'productionplanning-shared-process-template-dialog-lookup',
	templateUrl: './pps-process-template-dialog-lookup.component.html',
	styleUrls: ['./pps-process-template-dialog-lookup.component.scss'],
})
export class PpsProcessTemplateDialogLookupComponent extends BasicsSharedDialogLookupBaseComponent<IPpsProcessTemplateSimpleLookupEntity, IPpsProcessTemplateSimpleLookupEntity> {
	/**
	 * Initialize custom dialog options.
	 */
	public initializeOptions(): Observable<CustomDialogLookupOptions<IPpsProcessTemplateSimpleLookupEntity, IPpsProcessTemplateSimpleLookupEntity>> {
		const searchOptions: ICustomSearchDialogOptions<IPpsProcessTemplateSimpleLookupEntity, object> = this.provideSearchOptions();

		const options: CustomDialogLookupOptions<IPpsProcessTemplateSimpleLookupEntity, IPpsProcessTemplateSimpleLookupEntity> = {
			uuid: 'a48fe5d87b514a5a945ba8173fd8a5ff',
			displayMember: 'Id',
			descriptionMember: 'DescriptionInfo.Translated',
			dataServiceToken: ProductionplanningSharedProcessTemplateLookupService,
			readonly: false,
			showEditButton: true,
			showClearButton: true,
			cloneOnly: true,
			searchOptions: searchOptions,
		};

		return of(options);
	}

	private provideSearchOptions(): ICustomSearchDialogOptions<IPpsProcessTemplateSimpleLookupEntity, object> {
		const searchFormEntityRuntimeData: EntityRuntimeData<ISearchEntity> = new EntityRuntimeData<ISearchEntity>();
		const searchFormConfig: IFormConfig<ISearchEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: []
		};

		return {
			headerText: {
				text: 'Process Template Lookup',
				key: 'productionplanning.processconfiguration.processTemplateGridContainerTitle'
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
					uuid: '98ab0897f4134def9c17ba8641843282',
					columns: [{
						id: 'description',
						model: 'DescriptionInfo',
						type: FieldType.Description,
						label: {
							text: 'Description',
							key: 'cloud.common.entityDescription'
						},
						readonly: true,
						visible: true,
						sortable: true,
						searchable: true,
						formatterOptions: {
							field: 'DescriptionInfo.Translated'
						}
					}

					] as ColumnDef<IPpsProcessTemplateSimpleLookupEntity>[]
				}
			},
			resizeable: true,
			width: '500px'
		};
	}

	private provideButtons(): IDialogButtonBase<ICustomFormEditorDialog<IPpsProcessTemplateSimpleLookupEntity>>[] {
		return [{
			id: StandardDialogButtonId.Ok
		}, {
			id: StandardDialogButtonId.Cancel
		}];
	}
}
