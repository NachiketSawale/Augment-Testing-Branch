/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ConcreteMenuItem, createLookup, FieldType, IGridConfiguration, ILookupContext, ILookupSearchRequest, ILookupSearchResponse, IMenuItemsList, IParentChildLookupDialog, ItemType, LookupContext, LookupSearchResponse, MenuListContent, PARENT_CHILD_LOOKUP_DIALOG_TOKEN, UiCommonLookupBtn, UiCommonLookupInputComponent, UiCommonLookupReadonlyDataService, UiCommonLookupViewService, UiCommonParentChildLookupDialogComponent } from '@libs/ui/common';
import { IEntityContext, IIdentificationData, LazyInjectable, LazyInjectionToken, ServiceLocator } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { get } from 'lodash';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { IEstLineItemEntity, IPlant2EstimateEntity, IPlantAssemblyLineItemEntiy } from '@libs/estimate/interfaces';
import { BasicsSharedCostCodeLookupService, BasicsSharedMaterialSimpleLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { EstimateMainPlantAssemblyTemplateSearchService } from './services/estimate-main-plant-assembly-template-search.service';
import { EstimateMainPlantAssemblyTemplateGroupService } from './services/estimate-main-plant-assembly-template-group.service';

export const PLANT_ASSEMBLY_TEMPLATE_LOOKUP = new LazyInjectionToken<IParentChildLookupDialog>('plant-assembly-template-lookup');
@Injectable({
	providedIn: 'root',
})
@LazyInjectable<IParentChildLookupDialog>({
	token: PLANT_ASSEMBLY_TEMPLATE_LOOKUP,
	useAngularInjection: true,
})

/**
 * Estimate Main Plant Assembly Template Lookup Service
 */
export class EstimateMainPlantAssemblyTemplateLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IEstLineItemEntity, TEntity> implements IParentChildLookupDialog {
	private readonly estimateMainContextService = inject(EstimateMainContextService);
	protected groupService = ServiceLocator.injector.get(EstimateMainPlantAssemblyTemplateGroupService);
	public projectId = this.estimateMainContextService.getSelectedEstHeaderId();

	public constructor() {
		const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<IEstLineItemEntity, TEntity>) => {
			this.dialogButtonOnExecute(context);
		});
		dialogBtn.css = {
			class: 'control-icons ico-input-lookup',
		};

		super({
			uuid: 'd9a7bad1ffd74002b1db662a6b2c2893',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: PLANT_ASSEMBLY_TEMPLATE_LOOKUP }],
			showDialog: false,
			buttons: [dialogBtn],
			dialogOptions: {
				headerText: {
					text: 'Plant Assembly Template',
					key: 'estimate.main.lookupAssignPlantAssemblyDialog',
				},
				resizeable: false,
			},
			gridConfig: {
				columns: [],
			},
		});
	}

	/**
	 * Gets the parent grid structure.
	 * @returns The parent grid structure
	 */
	public getParentGridStructure(): IGridConfiguration<object> {
		const parentGridStructure: IGridConfiguration<IPlant2EstimateEntity> = {
			uuid: '806215153cb149379eca8221a10ea3c2',
			items: [],
			enableCopyPasteExcel: true,
			columns: [
				{
					id: 'Code',
					model: 'Code',
					type: FieldType.Translation,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode',
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 130,
				},
				{
					id: 'Description',
					model: 'DescriptionInfo',
					type: FieldType.Translation,
					label: {
						text: 'Code',
						key: 'cloud.common.entityDescription',
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160,
				},
				{
					id: 'PlantGroupFk',
					model: 'PlantGroupFk',
					type: FieldType.Translation,
					label: {
						text: 'Plant Group',
						key: 'basics.customize.plantgroupfk',
					},
					sortable: true,
					visible: true,
					readonly: true,
				},
			],
		};

		return parentGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Gets the child grid structure.
	 * @returns The child grid structure
	 */
	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IPlantAssemblyLineItemEntiy> = {
			uuid: '015039777d6f4a1ca0bf9eec6e9d244g',
			columns: [
				{
					id: 'EstPlantGroupFk',
					model: 'PlantGroupFk',
					type: FieldType.Translation,
					label: {
						text: 'Plant Group',
						key: 'estimate.main.estPlantGroup',
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160,
				},
				{
					id: 'EstPlantFk',
					model: 'PlantFk',
					type: FieldType.Translation, // Ensure this is a valid FieldType
					label: {
						text: 'PlantMaster',
						key: 'estimate.main.estPlantMaster',
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160,
				},
				{
					id: 'Code',
					model: 'Code',
					type: FieldType.Code,
					grouping: {
						title: 'cloud.common.entityCode',
						getter: 'Code',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Code', key: 'cloud.common.entityCode' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
				{
					id: 'Description',
					model: 'DescriptionInfo',
					type: FieldType.Translation,
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription',
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160,
				},
				{
					id: 'uom',
					model: 'BasUomFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showDescription: true,
						descriptionMember: 'UoM',
						showClearButton: true,
					}),
					grouping: {
						title: 'cloud.common.entityUoM',
						getter: 'BasUomFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Code', key: 'cloud.common.entityUoM' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},

				{
					id: 'costunit',
					model: 'CostUnit',
					type: FieldType.Money,
					grouping: {
						title: 'estimate.main.costUnit',
						getter: 'CostUnit',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'CostUnit', key: 'estimate.main.costUnit' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
				{
					id: 'MdcCostCodeFk',
					model: 'MdcCostCodeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCostCodeLookupService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
					}),
					grouping: {
						title: 'Cost Code',
						getter: 'MdcCostCodeFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Cost Code', key: 'estimate.main.costCode' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
				{
					id: 'MdcMaterialFk',
					model: 'MdcMaterialFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialSimpleLookupService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true,
					}),
					grouping: {
						title: 'Material Code',
						getter: 'MdcMaterialFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Material Code', key: 'basics.common.entityMaterialCode' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
				{
					id: 'PlantAssemblyTypeFk',
					model: 'PlantAssemblyTypeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainPlantAssemblyTemplateLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true,
					}),
					grouping: {
						title: 'Plant Assembly Category',
						getter: 'PlantAssemblyTypeFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Plant Assembly Type', key: 'basics.customize.plantassemblytype' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80,
				},
			],
			items: [],
			iconClass: null,
			skipPermissionCheck: false,
			enableColumnReorder: false,
			enableCopyPasteExcel: false,
		};
		return childGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Gets the toolbar items.
	 * @returns The toolbar items
	 */
	public getToolbarItems(): IMenuItemsList<void> | undefined {
		const toolbarItems: ConcreteMenuItem<void>[] = [
			{
				caption: { key: 'cloud.common.taskBarGrouping' },
				iconClass: 'tlb-icons ico-group-columns ng-pristine ng-untouched ng-valid ng-empty',
				hideItem: false,
				id: 'grouping',
				sort: 0,
				type: ItemType.Item,

				disabled: false,
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-config-system',
				hideItem: false,
				id: 'delete',
				sort: 10,
				type: ItemType.Item,
				disabled: false,
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-config-system',
				hideItem: false,
				id: 'dropdown',
				sort: 10,
				type: ItemType.Item,
				disabled: false,
			},
			{
				caption: { key: 'cloud.common.gridlayout' },
				iconClass: 'd tlb-icons ico-settings',
				hideItem: false,
				id: 'layout',
				sort: 10,
				type: ItemType.Item,
				disabled: false,
			},
		];
		const toolbarContent = new MenuListContent();
		toolbarContent.addItems(toolbarItems);
		return toolbarContent.items;
	}

	/**
	 * Loads the parent grid items.
	 * @returns The parent grid items
	 */
	public loadParentGridItems(): Observable<object[]> {
		// This method will be implemented in the future
		const parentList = [{}];
		return new Observable<object[]>((observer) => {
			observer.next(parentList);
			observer.complete();
		});
	}

	/**
	 * Loads the children grid items.
	 * @param entity
	 * @returns
	 */
	public loadChildrenGridItems(entity: IPlant2EstimateEntity): Observable<object[]> {
		// This method will be implemented in the future
		const staticChildrenData = [{}];
		return new Observable<object[]>((observer) => {
			observer.next(staticChildrenData);
			observer.complete();
		});
	}

	/**
	 * Executes actions when the dialog button is clicked.
	 * @param context The lookup context.
	 * @private
	 */
	private dialogButtonOnExecute(context?: ILookupContext<IEstLineItemEntity, TEntity>) {
		const lookUpContext = context as LookupContext<IEstLineItemEntity, TEntity>;
		if (lookUpContext) {
			const lookupInput = lookUpContext.lookupInput as UiCommonLookupInputComponent<IEstLineItemEntity, TEntity, number>;
			const lookUpViewService = ServiceLocator.injector.get(UiCommonLookupViewService);
			if (lookupInput) {
				lookUpViewService.openDialog(lookUpContext, lookupInput.config)?.then((e) => {
					if (e.closingButtonId === 'ok' && e.value && e.value.apply) {
						if (e.value.result != null) {
							lookupInput.apply(e.value.result);
						}
					}
				});
			}
		}
	}

	/**
	 * Gets the search result.
	 * @param inputParameter
	 * @returns
	 */
	public getSearchResult(inputParameter: string): Observable<object[]> {
		const searchResult = [{}];
		return new Observable<object[]>((observer) => {
			observer.next(searchResult);
			observer.complete();
		});
	}

	/**
	 * Retrieves a list of line items.
	 * @returns An observable of line item entities.
	 */
	public override getList() {
		return new Observable<IEstLineItemEntity[]>((observer) => {
			ServiceLocator.injector
				.get(EstimateMainPlantAssemblyTemplateSearchService) // change
				.getList(this.projectId)
				.subscribe((res) => {
					observer.next(res);
					observer.complete();
				});
		});
	}

	/**
	 * Searches for line items based on the provided request.
	 * @param request The search request parameters.
	 * @returns An observable of the search response.
	 */
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IEstLineItemEntity>> {
		const projectId = get(request.additionalParameters, 'projectId');
		this.projectId = projectId ?? 1;

		return new Observable((observer) => {
			ServiceLocator.injector
				.get(EstimateMainPlantAssemblyTemplateSearchService)
				.getList(this.projectId)
				.subscribe((list) => {
					observer.next(new LookupSearchResponse(list));
					observer.complete();
				});
		});
	}

	/**
	 * Retrieves an item by its key.
	 * @param key The identification data for the item.
	 * @param context The entity context.
	 * @returns An observable of the requested line item entity.
	 */
	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IEstLineItemEntity> {
		return new Observable<IEstLineItemEntity>((observer) => {
			const entity = context?.entity as IEstLineItemEntity;
			if (entity) {
				observer.next(entity);
			}
			observer.complete();
		});
	}
}
