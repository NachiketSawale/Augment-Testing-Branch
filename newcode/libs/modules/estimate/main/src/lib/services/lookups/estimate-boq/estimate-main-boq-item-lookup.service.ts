/*
 * Copyright(c) RIB Software GmbH
 */


import {
	CollectionHelper, IEntityContext,
	IIdentificationData,
	LazyInjectable,
	ServiceLocator
} from '@libs/platform/common';
import {
	ConcreteMenuItem,
	createLookup,
	FieldType,
	IGridConfiguration,
	ILookupContext, ILookupSearchRequest, ILookupSearchResponse,
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
import { inject, Injectable } from '@angular/core';
import { EstimateMainBoqHeaderService } from './estimate-main-boq-header.service';
import { IBoqItemEntity } from '@libs/boq/interfaces';
import { BasicsSharedUomLookupService } from '@libs/basics/shared';
import { Observable } from 'rxjs';
import { get } from 'lodash';
import { ProjectMainDataService } from '@libs/project/shared';
import { ESTBOQ_TEMPLATE_LOOKUP } from '@libs/estimate/interfaces';


@Injectable({
	providedIn: 'root'
})

@LazyInjectable<IParentChildLookupDialog>({
	token: ESTBOQ_TEMPLATE_LOOKUP,
	useAngularInjection: true
})
export class EstimateMainBoqItemLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBoqItemEntity, TEntity> implements IParentChildLookupDialog  {
	private readonly projectMainDataService = inject(ProjectMainDataService);
	protected groupService = ServiceLocator.injector.get(EstimateMainBoqHeaderService);
	public projectId = this.projectMainDataService.getSelectedEntity()?.Id?? 0;
	public constructor() {
		const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<IBoqItemEntity, TEntity>) => {
			this.dialogButtonOnExecute(context);
		});
		dialogBtn.css = {
			class: 'control-icons ico-input-lookup'
		};

		super({
			uuid: '0e1f5ac18b114eka9413547b7d8514be',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			/**
			 * Specifies the view providers for the component.
			 * This configuration provides the `TokenConfigProvider` with the value `ESTBOQ_TEMPLATE_LOOKUP`.
			 */
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: ESTBOQ_TEMPLATE_LOOKUP }],
			showDialog: false,
			buttons: [dialogBtn],
			dialogOptions: {
				headerText: {
					text: 'BoQ Item Ref. No.',
					key: 'estimate.main.boqItemFk'
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
		const parentGridStructure: IGridConfiguration<IBoqItemEntity> = {
			uuid: '3a55b53e9555453596e83acf9830c76a',
			items: [],
			enableCopyPasteExcel: true,
			columns: [
				{
					id: 'Reference',
					model: 'Reference',
					type: FieldType.Code, // Ensure this is a valid FieldType
					label: {
						text: 'Reference',
						key: 'estimate.main.Reference'
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 130
				},
				{
					id: 'brief',
					model: 'BriefInfo',
					type: FieldType.Translation, // Ensure this is a valid FieldType
					label: {
						text: 'Brief',
						key: 'boq.main.BriefInfo'
					},
					sortable: true,
					visible: true,
					readonly: true,
					width: 160
				},
			],
		};

		return parentGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the configuration for the child grid structure.
	 * @returns The grid configuration object for the child grid.
	 */
	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IBoqItemEntity> = {
			uuid: '015039777d6f4a1ca0bf9eec6e9d244f',
			columns: [
				{
					id: 'Reference',
					model: 'Reference',
					type: FieldType.Description,
					grouping: {
						title: 'estimate.main.Reference',
						getter: 'Reference',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					label: { text: 'Reference', key: 'estimate.main.Reference' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				},
				{
					id: 'Reference2',
					model: 'Reference2',
					type: FieldType.Description,
					grouping: {
						title: 'boq.main.Reference2',
						getter: 'Reference2',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Reference2', key: 'boq.main.Reference2' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				},
				{
					id: 'BriefInfo',
					model: 'BriefInfo',
					type: FieldType.Translation,
					grouping: {
						title: 'boq.main.Reference2',
						getter: 'Outline Specification',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					label: { text: 'Reference2', key: 'boq.main.Brief' },
					sortable: true,
					visible: true,
					readonly: true,
					width: 80
				},
				{
					id: 'BasUomFk',
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
			],
			treeConfiguration: {
				parent: (entity: IBoqItemEntity) => {
					if (entity.BoqItemFk) {
						return childGridStructure.items?.find((item: { Id: number | null | undefined }) => item.Id === entity.BoqItemFk) || null;
					}
					return null;
				},
				children: (entity: IBoqItemEntity) => entity.BoqItems ?? [],
				width: 70
			}
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
	private dialogButtonOnExecute(context?: ILookupContext<IBoqItemEntity, TEntity>) {
		const lookUpContext = context as LookupContext<IBoqItemEntity, TEntity>;
		if (lookUpContext) {
			const lookupInput = lookUpContext.lookupInput as UiCommonLookupInputComponent<IBoqItemEntity, TEntity, number>;
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
	 * @returns An Observable of an array of parent boq header  entities.
	 */
	public loadParentGridItems(): Observable<IBoqItemEntity[]> {
		const projectId = this.projectMainDataService.getSelectedEntity()?.Id?? 0;
		return this.groupService.getListByprojectId(projectId);

	}
	/**
	 * Loads the children entities for a given boq header entity.
	 * @param entity - The boq header entity for which to load children.
	 * @returns An Observable of an array of boq item entities.
	 */
	public loadChildrenGridItems(entity: IBoqItemEntity[]): Observable<IBoqItemEntity[]> {
		const projectId = this.projectMainDataService.getSelectedEntity()?.Id?? 0;
		if (entity && projectId) {
			 CollectionHelper.Flatten(entity, (item: IBoqItemEntity) => {
				return item.BoqItems || [];
			});
			const boqHeaderFk = entity[0].BoqHeaderFk;
			const filter = '';
			return this.groupService.search(projectId, boqHeaderFk,filter); // change

		}
		return new Observable<IBoqItemEntity[]>((observer) => {
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
	 * Retrieves a list of boq items.
	 * @returns An observable of boq item entities.
	 */
	public override getList(): Observable<IBoqItemEntity[]> {
		return new Observable<IBoqItemEntity[]>((observer) => {
			ServiceLocator.injector
				.get(EstimateMainBoqHeaderService)
				.getList(this.projectId)
				.subscribe((res) => {
					observer.next(res);
					observer.complete();
				});
		});
	}
	/**
	 * Searches for boq items based on the provided request.
	 * @param request The search request parameters.
	 * @returns An observable of the search response.
	 */
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IBoqItemEntity>> {
		const projectId = get(request.additionalParameters, 'projectId');
		this.projectId = projectId ?? 1;

		return new Observable((observer) => {
			ServiceLocator.injector
				.get(EstimateMainBoqHeaderService)
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
	 * @returns An observable of the requested boq item entity.
	 */
	public override getItemByKey(key: IIdentificationData, context?: IEntityContext<TEntity>): Observable<IBoqItemEntity> {
		return new Observable<IBoqItemEntity>((observer) => {
			const entity = context?.entity as IBoqItemEntity;
			if (entity) {
				observer.next(entity);
			}
			observer.complete();
		});
	}
}