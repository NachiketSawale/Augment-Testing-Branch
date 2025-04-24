/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntityRuntimeData } from '@libs/platform/data-access';
import {
	ColumnDef,
	createLookup,
	FieldType,
	IDialogButtonBase,
	IFormConfig,
	StandardDialogButtonId,
	// ILookupContext, 
	// ServerSideFilterValueType
} from '@libs/ui/common';
import {
	BasicsSharedDialogLookupBaseComponent,
	// BasicsSharedLineItemLookupService,
	CustomDialogLookupOptions,
	ICustomFormEditorDialog,
	ICustomSearchDialogOptions,
	// IEstimateMainLineItemLookupDialogEntity,
	ISearchEntity,
} from '@libs/basics/shared';
import { PpsEstResourceLookupService } from '../../services/pps-est-resource-lookup.service';
import { IEstHeaderEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import {
	EstimateShareDocumentProjectLookupService,
} from '@libs/estimate/shared';

@Component({
	selector: 'productionplanning-header-est-resource-dialog-lookup',
	templateUrl: './pps-est-resource-dialog-lookup.component.html',
	styleUrls: ['./pps-est-resource-dialog-lookup.component.scss'],
})
export class PpsEstResourceDialogLookupComponent extends BasicsSharedDialogLookupBaseComponent<IEstResourceEntity, IEstResourceEntity> {
	/**
	 * Initialize custom dialog options.
	 */
	public initializeOptions(): Observable<CustomDialogLookupOptions<IEstResourceEntity, IEstResourceEntity>> {
		const searchOptions: ICustomSearchDialogOptions<IEstResourceEntity, object> = this.provideSearchOptions();

		const options: CustomDialogLookupOptions<IEstResourceEntity, IEstResourceEntity> = {
			uuid: '130ce965b8694db9890e5becddc4fc2b',
			displayMember: 'Id',
			descriptionMember: 'Code',
			dataServiceToken: PpsEstResourceLookupService,
			readonly: false,
			showEditButton: true,
			showClearButton: true,
			cloneOnly: true,
			searchOptions: searchOptions,
		};

		// todo: add filterOptions after platform is supported...
		// filterOptions: {
		// 	serverSide: true,
		// 	serverKey: 'package-item-assignment-est-resource-filter',
		// 	fn: function () {
		// 		const filterParams = ppsPlannedQuantityEstResourceLookupDialogDataService.getFilterParams();
		// 		return {
		// 			estHeaderFk: filterParams.EstHeaderFk,
		// 			estLineItemFk: filterParams.EstLineItemFk,
		// 			notIncludedResourceIds: [],
		// 		};
		// 	},
		// },

		return of(options);
	}

	private provideSearchOptions(): ICustomSearchDialogOptions<IEstResourceEntity, object> {
		const searchFormEntityRuntimeData: EntityRuntimeData<ISearchEntity> = new EntityRuntimeData<ISearchEntity>();
		const searchFormConfig: IFormConfig<ISearchEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [{
				id: 'estimateHeaderFk',
				label: {
					text: 'Estimate Line Item',
					key: 'procurement.package.estimateHeaderGridControllerTitle'
				},
				type: FieldType.Lookup,
				model: 'EstHeaderFk',
				lookupOptions: createLookup<ISearchEntity, IEstHeaderEntity>({
					dataServiceToken: EstimateShareDocumentProjectLookupService,
					showClearButton: true,
					// todo
					// serverSideFilter: {
					// 	key: 'package-item-assignment-est-header-filter',
					// 	execute(context: ILookupContext<IEstHeaderEntity, ISearchEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
					// 		const headerDataServ = context.injector.get('PpsHeaderDataService');
					// 		const selection = headerDataServ.getSelection();
					// 		return { projectId: selection[0].ProjectFk };
					// 	},
					// },
				}),
			},
			// {
			// 	id: 'estimateLineItemFk',
			// 	label: {
			// 		text: 'Estimate Header',
			// 		key: 'procurement.package.estimateHeaderGridControllerTitle'
			// 	},
			// 	type: FieldType.Lookup,
			// 	model: 'EstLineItemFk',
			// 	lookupOptions: createLookup<ISearchEntity, IEstimateMainLineItemLookupDialogEntity>({
			// 		dataServiceToken: BasicsSharedLineItemLookupService,
			// 		showClearButton: true,
			// 		// todo(met question about ISearchEntity and IEstResourceEntity)
			// 		// serverSideFilter: {
			// 		// 	key: 'package-item-assignment-est-lineitem-filter',
			// 		// 	execute(context: ILookupContext<IEstimateMainLineItemLookupDialogEntity, IEstResourceEntity>): ServerSideFilterValueType | Promise<ServerSideFilterValueType> {
			// 		// 		return {
			// 		// 			estHeaderId: context.entity?.EstHeaderFk,
			// 		// 		};
			// 		// 	},
			// 		// },
			// 	}),
			// },
			]
		};

		return {
			headerText: {
				text: 'Estimate Resource Search Dialog',
				key: 'productionplanning.formulaconfiguration.plannedQuantity.estResourceSearchDialogTitle'
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
					uuid: 'c68a07a6cdbc4079a1fbacc1ae36f13f',
					columns: [{
						id: 'code',
						label: {
							text: 'Code',
							key: 'cloud.common.entityCode'
						},
						type: FieldType.Code,
						model: 'Code',
						maxLength: 20,
						sortOrder: 1,
						readonly: false,
						width: 100,
						visible: true,
						searchable: true,
					},

					] as ColumnDef<IEstResourceEntity>[]
				}
			},
			resizeable: true,
			width: '500px'
		};
	}

	private provideButtons(): IDialogButtonBase<ICustomFormEditorDialog<IEstResourceEntity>>[] {
		return [{
			id: StandardDialogButtonId.Ok
		}, {
			id: StandardDialogButtonId.Cancel
		}];
	}
}
