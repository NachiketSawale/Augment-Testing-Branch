import { BasicsSharedDialogLookupBaseComponent, BasicsSharedMaterialLookupService, CustomDialogLookupOptions, ICreateOptions, ICustomFormEditorDialog, ICustomSearchDialogOptions, IMaterialSearchEntity, ISearchEntity } from '@libs/basics/shared';
import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntityRuntimeData } from '@libs/platform/data-access';
import { ColumnDef, createLookup, FieldType, IDialogButtonBase, IFormConfig, StandardDialogButtonId } from '@libs/ui/common';
import { PpsProductTemplateLookupService } from '../../services/product-template/pps-product-template-lookup.service';
import { IPpsProductTemplateSimpleLookupEntity } from '../../model/product-template/pps-product-template-simple-lookup-entity';
import { PpsSharedDrawingDialogLookupService } from '../../services';

@Component({
	selector: 'productionplanning-shared-product-template-dialog-lookup',
	templateUrl: 'pps-product-template-dialog-lookup.component.html',
	styleUrls: ['pps-product-template-dialog-lookup.component.css'],
})
export class PpsProductTemplateDialogLookupComponent extends BasicsSharedDialogLookupBaseComponent<IPpsProductTemplateSimpleLookupEntity, object> {
	public initializeOptions(): Observable<CustomDialogLookupOptions<IPpsProductTemplateSimpleLookupEntity, object>> {
		const createOptions: ICreateOptions<IPpsProductTemplateSimpleLookupEntity, object> = this.provideCreateOptions();
		const searchOptions: ICustomSearchDialogOptions<IPpsProductTemplateSimpleLookupEntity, object> = this.provideSearchOptions();

		const options: CustomDialogLookupOptions<IPpsProductTemplateSimpleLookupEntity, object> = {
			uuid: '1755911412d942b28101fdc775bc775c',
			displayMember: 'Code',
			descriptionMember: 'Description',
			dataServiceToken: PpsProductTemplateLookupService,
			//serverSideFilter: {
			// key: 'pps-product-description-filter',
			// execute: (context: IEntityContext<IPpsProductTemplateSimpleLookupEntity>) => {
			// 	return {
			// 		PKey1:  as number
			// 	};
			// }
			//},
			readonly: false,
			showEditButton: true,
			showClearButton: true,
			cloneOnly: true,
			createOptions: createOptions,
			searchOptions: searchOptions,
		};

		return of(options);
	}

	private provideCreateOptions(): ICreateOptions<IPpsProductTemplateSimpleLookupEntity, object> {
		const createFormEntityRuntimeData: EntityRuntimeData<IPpsProductTemplateSimpleLookupEntity> = new EntityRuntimeData<IPpsProductTemplateSimpleLookupEntity>();
		const createFormConfig: IFormConfig<IPpsProductTemplateSimpleLookupEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				// {
				// 	id: 'mdcProductDescriptionFk',
				// 	type: FieldType.Lookup,
				// 	model: 'MdcProductDescriptionFk',
				// 	lookupOptions: createLookup({
				// 		dataServiceToken: ,
				// 		showClearButton: true,
				// 	})
				// },
				{
					id: 'code',
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode',
					},
					type: FieldType.Code,
					model: 'Code',
					maxLength: 20,
					sortOrder: 1,
					readonly: false,
				},
			],
		};

		return {
			createUrl: 'productionplanning/producttemplate/productdescription/create',
			formDialogOptions: {
				id: 'B844C1FC8F3E49BE8DABC7DB15785C36',
				headerText: { key: 'cloud.common.taskBarNewRecord' },
				formConfiguration: createFormConfig,
				entityRuntimeData: createFormEntityRuntimeData,
				buttons: this.provideButtons(),
			},
		};
	}

	private provideSearchOptions(): ICustomSearchDialogOptions<IPpsProductTemplateSimpleLookupEntity, object> {
		const searchFormEntityRuntimeData: EntityRuntimeData<ISearchEntity> = new EntityRuntimeData<ISearchEntity>();
		const searchFormConfig: IFormConfig<ISearchEntity> = {
			formId: 'cloud.common.dialog.default.form',
			showGrouping: false,
			addValidationAutomatically: false,
			rows: [
				{
					id: 'project',
					label: {
						text: '*Project',
						key: 'cloud.common.entityProject',
					},
					type: FieldType.Integer,
					model: 'ProjectId',
					sortOrder: 1,
					readonly: false,
				},
				{
					id: 'drawing',
					label: {
						text: '*Drawing',
						key: 'productionplanning.drawing.entityDrawing',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: PpsSharedDrawingDialogLookupService,
						showClearButton: false,
					}),
					model: 'DrawingId',
					sortOrder: 2,
					readonly: false,
				},
				{
					id: 'materialId',
					label: {
						text: '*Material',
						key: 'productionplanning.common.mdcMaterialFk',
					},
					type: FieldType.Lookup,
					lookupOptions: createLookup<IPpsProductTemplateSimpleLookupEntity, IMaterialSearchEntity>({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true,
					}),
					model: 'MaterialId',
					sortOrder: 3,
					readonly: false,
				},
			],
		};

		return {
			headerText: {
				text: 'Product Template Lookup',
				key: 'productionplanning.producttemplate.productDescriptionListTitle',
			},
			form: {
				configuration: searchFormConfig,
				entityRuntimeData: searchFormEntityRuntimeData,
				entity: (entity: object) => {
					return {};
				},
			},
			grid: {
				config: {
					uuid: '7ba1bdd236984bedac609b05fb15346a',
					columns: [
						{
							id: 'code',
							label: {
								text: 'Code',
								key: 'cloud.common.entityCode',
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
						{
							id: 'description',
							label: {
								text: 'Description',
								key: 'cloud.common.entityDescription',
							},
							type: FieldType.Description,
							model: 'Description',
							sortOrder: 2,
							readonly: false,
							width: 100,
							visible: true,
							searchable: true,
						},
					] as ColumnDef<IPpsProductTemplateSimpleLookupEntity>[],
				},
			},
			resizeable: true,
			minWidth: '600px',
			width: '940px',
		};
	}

	private provideButtons(): IDialogButtonBase<ICustomFormEditorDialog<IPpsProductTemplateSimpleLookupEntity>>[] {
		return [
			{
				id: StandardDialogButtonId.Ok,
			},
			{
				id: StandardDialogButtonId.Cancel,
			},
		];
	}
}
