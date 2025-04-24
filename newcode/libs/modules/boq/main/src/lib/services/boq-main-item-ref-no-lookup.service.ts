/* eslint-disable prefer-const */
import { IEntityContext, IIdentificationData, LazyInjectable, PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import {
	ConcreteMenuItem, FieldType, IGridConfiguration,
	ILookupContext, ILookupSearchRequest, ILookupSearchResponse,
	IMenuItemsList,
	IParentChildLookupDialog,
	ItemType, LookupContext,
	MenuListContent,
	PARENT_CHILD_LOOKUP_DIALOG_TOKEN,
	UiCommonLookupBtn, UiCommonLookupInputComponent,
	UiCommonLookupReadonlyDataService, UiCommonLookupViewService,
	UiCommonParentChildLookupDialogComponent
} from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { BOQ_ITEM_LOOKUP, IBoqItemEntity } from '@libs/boq/interfaces';

// TODO-BOQ: eslint any (deactivated)
/*
interface SearchResponse {
	dtos: IBoqItemEntity[];
}
*/

@Injectable({
	providedIn: 'root'
})

@LazyInjectable<IParentChildLookupDialog>({
	token: BOQ_ITEM_LOOKUP,
	useAngularInjection: true
})

export class BoqItemLookupService<TEntity extends object> extends UiCommonLookupReadonlyDataService<IBoqItemEntity, TEntity> implements IParentChildLookupDialog {
	private readonly estimateMainContextService = inject(EstimateMainContextService);

	public constructor(http : PlatformHttpService) {
		const dialogBtn = new UiCommonLookupBtn('', '', (context?: ILookupContext<IBoqItemEntity, TEntity>) => {
			this.dialogButtonOnExecute(context);
		});
		dialogBtn.css = {
			class: 'control-icons ico-input-lookup'
		};

		super({
			uuid: 'f068ac8be1714d05aec0b8de825cd97f',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Reference',
			dialogComponent: UiCommonParentChildLookupDialogComponent,
			/**
			 * Specifies the view providers for the component.
			 * This configuration provides the `TokenConfigProvider` with the value `BOQ_ITEM_LOOKUP`.
			 */
			viewProviders: [{ provide: PARENT_CHILD_LOOKUP_DIALOG_TOKEN, useValue: BOQ_ITEM_LOOKUP }],
			showDialog: false,
			buttons: [dialogBtn],
			dialogOptions: {
				headerText: 'estimate.main.lookupAssignBoqItem',
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
			uuid: '015039777d6f4a1ca0bf9eec6e9d244f',
			columns: [
				{
					id: 'ReferenceNo',
					model: 'Reference',
					type: FieldType.Integer,
					label: 'boq.main.Reference',
					sortable: true,
					width: 80
				},
				{
					id: 'OutlineSpecification',
					model: 'BriefInfo.Translated',
					type: FieldType.Description,
					label: 'boq.main.BriefInfo',
					sortable: true,
					width: 80
				}
			],
			items: [],
			iconClass: null,
			skipPermissionCheck: false,
			enableColumnReorder: false,
			enableCopyPasteExcel: false
		};

		return parentGridStructure as IGridConfiguration<object>;
	}

	/**
	 * Retrieves the configuration for the child grid structure.
	 * @returns The grid configuration object for the child grid.
	 */
	public getChildGridStructure(): IGridConfiguration<object> {
		const childGridStructure: IGridConfiguration<IBoqItemEntity> = {
			uuid: '3a55b53e9555453596e83acf9830c76a',
			items: [],
			enableCopyPasteExcel: true,
			columns: [
				{
					id: 'reference',
					model: 'Reference',
					type: FieldType.Integer,
					label: 'boq.main.Reference',
					grouping: {
						title: 'boq.main.Reference',
						getter: 'Reference',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					sortable: true,
					width: 130
				},
				{
					id: 'reference2',
					model: 'Reference2',
					type: FieldType.Integer,
					label: 'boq.main.Reference2',
					grouping: {
						title: 'boq.main.Reference2',
						getter: 'Reference2',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					sortable: true,
					width: 130
				},
				{
					id: 'briefInfo',
					model: 'BriefInfo.Translated',
					type: FieldType.Description,
					label: 'boq.main.BriefInfo',
					grouping: {
						title: 'boq.main.BriefInfo',
						getter: 'Description',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					sortable: true,
					width: 130
				},
				{
					id: 'quantity',
					model: 'Quantity',
					type: FieldType.Money,
					label: 'boq.main.Quantity',
					grouping: {
						title: 'boq.main.Quantity',
						getter: 'Quantity',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true,
					},
					sortable: true,
					width: 130
				},
				{
					id: 'uom',
					model: 'BasUomFk',
					type: FieldType.Description,
					label: 'cloud.common.entityUoM',
					grouping: {
						title: 'cloud.common.entityUoM',
						getter: 'BasUomFk',
						aggregators: [],
						aggregateCollapsed: true,
						generic: true
					},
					sortable: true,
					width: 130
				},
			],
			treeConfiguration: {
				parent: (entity: IBoqItemEntity) => entity.BoqItemParent ?? null,
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
				caption: 'cloud.common.taskBarDeleteRecord',
				iconClass: 'dropdown-toggle dropdown-caret tlb-icons  tlb-icons ico-config-system',
				id: 'dropdown',
				sort: 10,
				type: ItemType.Item
			},
			{
				caption: 'cloud.common.gridlayout',
				iconClass: 'd tlb-icons ico-settings',
				id: 'layout',
				sort: 11,
				type: ItemType.Item
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
	 * @returns An Observable of an array of parent boq item entities.
	 */
	public loadParentGridItems(): Observable<IBoqItemEntity[]> {
		//TODO-PRJ :ProjectMainService.getselected() will be added once migrated.
		//TODO-EST: estimateMainBoqHeaderService.loadBoqHeader(prjId) will be added soon.
		// Here passed static ID as above functions are still to be migrated.
		// const Id = 11854717;
		return new Observable((observer) => {
			// TODO-BOQ: eslint any (deactivated)
			/*
			this.http.post<SearchResponse>('boq/main/GetBoqItemTreeByIds',[Id]).subscribe((res: any) => {
				console.log('res',res);
				observer.next(res);
				observer.complete();
			});
			*/
		});
	}

	/**
	 * Loads the children entities for a given BoqItem entity.
	 * @param entity - The BoqItem entity for which to load children.
	 * @returns An Observable of an array of Boq Item entities.
	 */
	public loadChildrenGridItems(entity: IBoqItemEntity): Observable<IBoqItemEntity[]> {
		//TODO-PRJ :ProjectMainService.getSelected() will be added once migrated.
		//TODO-EST: estimateMainBoqHeaderService.loadBoqHeader(prjId) will be added soon.
		// Here passed static ID as above functions are still to be migrated.
		// let Id = 11854717;
		return new Observable((observer) => {
			// TODO-BOQ: eslint any (deactivated)
			/*
			this.http.post<SearchResponse>('boq/main/GetBoqItemTreeByIds',[Id]).subscribe((res: any) => {
				console.log('res', res);
				observer.next(res);
				observer.complete();
			});
			*/
		});
	}

	/**
	 * Retrieves the search result based on the input parameter.
	 * @param inputParameter
	 * @returns
	 */
	public getSearchResult(inputParameter:string): Observable<object[]> {
		const projectId = this.estimateMainContextService.getProjectId();
		if(projectId && projectId === -1){
			//TODO: projectMainService.getSelected() will be injected here & then passed projectId
		}
		//TODO: Have to add function from Estimate which returns BoqHeaderId below 'boqItemDataService' is for testing
		// let boqItemDataService = inject(BoqItemDataService);
		// let selectedboqHeaderId = boqItemDataService.getSelectedBoqHeaderId();

		return new Observable((observer) => {
			// TODO-BOQ: eslint any (deactivated)
			/*
			this.http.get<SearchResponse>('boq/project/getboqsearchlist?projectId=' + projectId + '&filterValue='+inputParameter+'&boqHeaderId='+selectedboqHeaderId + '&isGcBoq=' + true).subscribe((res: any) => {
				console.log('res of getSearchList', res);
				observer.next(res);
				observer.complete();
			});
			*/
		});
	}

    public override getList(): Observable<IBoqItemEntity[]> {
        throw new Error('Method not implemented.');
    }

	/**
	 * Searches for boq items based on the provided request.
	 * @param request The search request parameters.
	 * @returns An observable of the search response.
	 */
	public override getSearchList(request: ILookupSearchRequest): Observable<ILookupSearchResponse<IBoqItemEntity>> {
		return new Observable((observer) => {
			observer.next();
			observer.complete();
		});
	}

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