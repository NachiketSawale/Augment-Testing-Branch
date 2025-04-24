/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	ConcreteMenuItem,
	createLookup,
	FieldType,
	IGridConfiguration,
	ILookupContext,
	ILookupSearchRequest,
	ILookupSearchResponse,
	IMenuItemsList,
	IParentChildLookupDialog,
	ItemType,
	LookupContext,
	LookupSearchResponse,
	MenuListContent,
	PARENT_CHILD_LOOKUP_DIALOG_TOKEN,
	UiCommonLookupBtn,
	UiCommonLookupInputComponent,
	UiCommonLookupReadonlyDataService,
	UiCommonLookupViewService,
	UiCommonParentChildLookupDialogComponent
} from '@libs/ui/common';
import { CollectionHelper, IEntityContext, IIdentificationData, LazyInjectable, LazyInjectionToken, ServiceLocator } from '@libs/platform/common';
import { Observable } from 'rxjs';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { IEstAssemblyCatEntity } from '@libs/estimate/interfaces';
import { EstimateMainAssemblyTemplateGroupService } from './services/estimate-main-aseembly-template-group.service';
import { BasicsSharedCostCodeLookupService, BasicsSharedMaterialSimpleLookupService, BasicsSharedUomLookupService } from '@libs/basics/shared';
import { get } from 'lodash';


export const ASSEMBLY_TEMPLATE_LOOKUP = new LazyInjectionToken<IParentChildLookupDialog>('assembly-template-lookup');
@Injectable({
	providedIn: 'root'
})

@LazyInjectable<IParentChildLookupDialog>({
	token: ASSEMBLY_TEMPLATE_LOOKUP,
	useAngularInjection: true
})

/**
 * Estimate Main Assembly Template Lookup Service
 */
export class EstimateMainAssemblyTemplateLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IEstLineItemEntity, TEntity> implements IParentChildLookupDialog {

	private readonly estimateMainContextService = inject(EstimateMainContextService);
	protected groupService = ServiceLocator.injector.get(EstimateMainAssemblyTemplateGroupService);
	public projectId = this.estimateMainContextService.getSelectedEstHeaderId();

	public constructor() {
		console.log('constructor called of EstimateMainAssemblyTemplateLookupService');
		const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<IEstLineItemEntity, TEntity>) => {
			this.dialogButtonOnExecute(context);
		});
		dialogBtn.css = {
			class: 'control-icons ico-input-lookup'
		};

		super({
			uuid: '0e1f1ac18b114eba9413547b7d8517be',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			/**
			 * Specifies the view providers for the component.
			 * This configuration provides the `TokenConfigProvider` with the value `ASSEMBLY_TEMPLATE_LOOKUP`.
			 */
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: ASSEMBLY_TEMPLATE_LOOKUP }],
			showDialog: false,
			buttons: [dialogBtn],
			dialogOptions: {
				headerText: {
					text: 'Assembly Template',
					key: 'estimate.main.estAssemblyFk'
				},
				resizeable: false
			},
			gridConfig: {
				columns: []
			}
		});
	}

	/**
	 * Retrieves the configuration for the parent grid structure.
	 * @returns The grid configuration object for the parent grid.
	 */
	public getParentGridStructure(): IGridConfiguration<object> {
		const parentGridStructure: IGridConfiguration<IEstAssemblyCatEntity> = {
			uuid: '3a55b53e9555453596e83acf9830c76a',
			items: [],
			enableCopyPasteExcel: true,
			columns: [
				{
					id: 'Code',
					model: 'Code',
					type: FieldType.Translation, // Ensure this is a valid FieldType
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode'
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 130
				},
				{
					id: 'Description',
					model: 'DescriptionInfo',
					type: FieldType.Translation, // Ensure this is a valid FieldType
					label: {
						text: 'Description',
						key: 'cloud.common.entityDescription'
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160
				},
				{
					id: 'EstAssemblyTypeFk',
					model: 'EstAssemblyTypeFk',
					type: FieldType.Lookup, // Ensure this is a valid FieldType
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainAssemblyTemplateLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true
					}),
					label: {
						text: 'Assembly Type',
						key: 'estimate.assemblies.entityEstAssemblyTypeFk'
					},
					sortable: true,
					visible: true,
					readonly: true
				},
			],
			treeConfiguration: {
				parent: (entity: IEstAssemblyCatEntity) => {
					if (entity.EstAssemblyCatFk) {
						return parentGridStructure.items?.find((item: { Id: number | null | undefined }) => item.Id === entity.EstAssemblyCatFk) || null;
					}
					return null;
				},
				children: (entity: IEstAssemblyCatEntity) => entity.AssemblyCatChildren ?? [],
				width: 70
			}
		};

		return parentGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the configuration for the child grid structure.
	 * @returns The grid configuration object for the child grid.
	 */
	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IEstLineItemEntity> = {
			uuid: '015039777d6f4a1ca0bf9eec6e9d244f',
			columns: [
				{
					id: 'EstAssemblyCatFk',
					model: 'EstAssemblyCatFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EstimateMainAssemblyTemplateLookupService,
						showDescription: true,
						descriptionMember: 'Description',
						showClearButton: true
					}),
					grouping: {
						title: 'Assembly Category',
						getter: 'EstAssemblyCatFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Assembly Category', key: 'estimate.assemblies.estAssemblyCat' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
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
					width: 80
				},
				{
					id: 'uom',
					model: 'BasUomFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService,
						showDescription: true,
						descriptionMember: 'UoM',
						showClearButton: true
					}),
					grouping: {
						title: 'cloud.common.entityUoM',
						getter: 'BasUomFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Code', key: 'cloud.common.entityUoM' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
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
						generic: true
					},
					label: { text: 'CostUnit', key: 'estimate.main.costUnit' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				},
				{
					id: 'MdcCostCodeFk',
					model: 'MdcCostCodeFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCostCodeLookupService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true
					}),
					grouping: {
						title: 'Cost Code',
						getter: 'MdcCostCodeFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Cost Code', key: 'estimate.main.costCode' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				},
				{
					id: 'MdcMaterialFk',
					model: 'MdcMaterialFk',
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMaterialSimpleLookupService,
						showDescription: true,
						descriptionMember: 'Code',
						showClearButton: true
					}),
					grouping: {
						title: 'Material Code',
						getter: 'MdcMaterialFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Material Code', key: 'basics.common.entityMaterialCode' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				}
			],
			items: [],
			iconClass: null,
			skipPermissionCheck: false,
			enableColumnReorder: false,
			enableCopyPasteExcel: false
		};
		return childGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the toolbar items for the UI.
	 * @returns An array of toolbar menu items or undefined if no items are available.
	 */
	public getToolbarItems(): IMenuItemsList<void> | undefined {
		// Define the toolbar items with their properties
		const toolbarItems: ConcreteMenuItem<void>[] = [
			{
				caption: { key: 'cloud.common.taskBarGrouping' },
				iconClass: 'tlb-icons ico-group-columns ng-pristine ng-untouched ng-valid ng-empty',
				hideItem: false,
				id: 'grouping',
				sort: 0,
				type: ItemType.Item,
				disabled: false
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-config-system',
				hideItem: false,
				id: 'delete',
				sort: 10,
				type: ItemType.Item,
				disabled: false
			},
			{
				caption: { key: 'cloud.common.taskBarDeleteRecord' },
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-config-system',
				hideItem: false,
				id: 'dropdown',
				sort: 10,
				type: ItemType.Item,
				disabled: false
			},
			{
				caption: { key: 'cloud.common.gridlayout' },
				iconClass: 'd tlb-icons ico-settings',
				hideItem: false,
				id: 'layout',
				sort: 10,
				type: ItemType.Item,
				disabled: false
			}
		];

		// Create a new menu list content and add the toolbar items to it
		const toolbarContent = new MenuListContent();
		toolbarContent.addItems(toolbarItems);

		// Return the items from the toolbar content
		return toolbarContent.items;
	}

	/**
	 * Executes the dialog button action within the lookup context.
	 * @param context - The lookup context containing the entity and other relevant information.
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
	 * Loads the parent entities for the current project.
	 * @returns An Observable of an array of parent assembly category entities.
	 */
	public loadParentGridItems(): Observable<IEstAssemblyCatEntity[]> {
		const projectId = this.estimateMainContextService.getSelectedEstHeaderId();
		const parentList = this.groupService.getListByprojectId(projectId);
		return parentList;
	}

	/**
	 * Loads the children entities for a given assembly category entity.
	 * @param entity - The assembly category entity for which to load children.
	 * @returns An Observable of an array of line item entities.
	 */
	public loadChildrenGridItems(entity: IEstAssemblyCatEntity): Observable<IEstLineItemEntity[]> {
		const projectId = this.estimateMainContextService.getSelectedEstHeaderId();
		if (entity && projectId) {
			const flattenEntities = CollectionHelper.Flatten(entity, (item: IEstAssemblyCatEntity) => {
				return item.AssemblyCatChildren || [];
			});
			const headerJobFk = this.estimateMainContextService.LineItemJobFk;
			const lgmJobFk = this.estimateMainContextService.LineItemJobFk;
			const filter = '';
			const filterByCatStructure = flattenEntities.map((e) => e.Id).join(',');
			const itemsPerPage = 200;
			const result = this.groupService.search(projectId, headerJobFk, lgmJobFk, filter, filterByCatStructure, itemsPerPage); // change
			return result;
		}
		return new Observable<IEstLineItemEntity[]>((observer) => {
			observer.next([]);
			observer.complete();
		});
	}
	/**
	 * Retrieves the search result based on the input parameter.
	 * @param inputParameter 
	 * @returns 
	 */
	public getSearchResult(inputParameter:string): Observable<object[]> {
		return new Observable<object[]>((observer) => {
			observer.next();
			observer.complete();
		});
	}

	/**
	 * Retrieves a list of line items.
	 * @returns An observable of line item entities.
	 */
	public override getList(): Observable<IEstLineItemEntity[]> {
		return new Observable<IEstLineItemEntity[]>((observer) => {
			ServiceLocator.injector
				.get(EstimateMainAssemblyTemplateGroupService)
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
				.get(EstimateMainAssemblyTemplateGroupService)
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

