/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseValidationService, DragDropTarget, IEntityCreate, IEntityDataCreateConfiguration, IEntityDelete, IEntityList, IEntityModification, IEntityNavigation, IEntitySelection } from '@libs/platform/data-access';
import { DragDropTargetDirective, GridComponent, IFieldValueChangeInfo, IGridConfiguration, IResizeArgs, ReportingPrintService } from '@libs/ui/common';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { EntityContainerBaseComponent } from '../entity-container-base/entity-container-base.component';
import { IGridContainerLink } from '../../model/grid-container-link.interface';
import { UiBusinessBaseEntityGridService } from '../../services/ui-business-base-entity-grid.service';
import { IEntityContainerBehavior } from '../../model/entity-container-link.model';
import { DragDropBase, PlatformDragDropService } from '@libs/platform/common';

/**
 * The base class for grid-based entity containers.
 *
 * @typeParam T The entity type handled by the container.
 * @typeParam L The container link type used by the container.
 */
@Component({
	template: ''
})
export abstract class GridContainerBaseComponent<T extends object, L extends IGridContainerLink<T>> extends EntityContainerBaseComponent<T> implements OnInit, AfterViewInit, OnDestroy {

	/**
	 * Holds the column configuration used to render the grid
	 */
	public config: IGridConfiguration<T> = {
		uuid: '',
		columns: [],
		items: [],
	};

	/**
	 * Holds the data that will be passed into the grid.
	 */
	public gridData: T[] = [];

	@ViewChild(GridComponent<T>)
	protected gridHost: GridComponent<T> | undefined;

	@ViewChild(DragDropTargetDirective)
	protected uiCommonDragDropTarget: DragDropTargetDirective<T> | undefined;

	private readonly entityGridService = inject(UiBusinessBaseEntityGridService);
	private readonly dragDropService = inject(PlatformDragDropService);
	private readonly reportingPrintService = inject(ReportingPrintService);

	protected readonly layout = inject(this.injectionTokens.layoutConfigurationToken);

	protected containerLink?: L;

	private customBehavior?: IEntityContainerBehavior<L, T>;

	/**
	 * Initializes a new instance.
	 */
	protected constructor() {
		super();
		this.config.uuid = this.containerDefinition.uuid;
		this.config.idProperty = this.entityIdProperty;
		this.config.dragDropAllowed = !!this.entityDragDropService;
		this.config.entityRuntimeData = this.entityRuntimeDataRegistry;
		this.uiAddOns.resizeMessenger.register(this.onSizeChanged);
		this.registerFinalizer(() => this.uiAddOns.resizeMessenger.unregister(this.onSizeChanged));
	}

	/**
	 * Generates a grid container link object for the container.
	 *
	 * @returns The grid container link object.
	 */
	protected createGridContainerLink(): IGridContainerLink<T> {
		// It is impossible to access the outer object without a reference.
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		return {
			get uuid(): string {
				return that.containerDefinition.uuid;
			},
			get gridConfig(): IGridConfiguration<T> {
				return that.config;
			},
			set gridConfig(value: IGridConfiguration<T>) {
				that.config = value;
			},
			get uiAddOns(): IContainerUiAddOns {
				return that.uiAddOns;
			},
			get gridData(): T[] | undefined {
				return that.config.items;
			},
			set gridData(value: T[]) {
				that.config = {
					...that.config,
					items: value
				};
			},
			get entitySelection(): IEntitySelection<T> {
				return that.entitySelection;
			},
			get entityModification(): IEntityModification<T> | undefined {
				return that.entityModification;
			},
			get entityCreate(): IEntityCreate<T> | undefined {
				return that.entityCreate;
			},
			get entityDataConfiguration(): IEntityDataCreateConfiguration<T> | undefined {
				return that.entityDataConfiguration;
			},
			get entityDelete(): IEntityDelete<T> | undefined {
				return that.entityDelete;
			},
			get entityList(): IEntityList<T> | undefined {
				return that.entityList;
			},
			get entityValidationService(): BaseValidationService<T> | undefined {
				return that.entityValidationService;
			},
			get entityDragDropService(): DragDropBase<T> | undefined {
				return that.entityDragDropService;
			},
			get entityNavigation(): IEntityNavigation<T> | undefined {
				return that.entityNavigation;
			},
			get grid(): GridComponent<T>{
				return that.gridHost as GridComponent<T>;
			},
			columnSearch() {
				that.gridHost?.columnSearch();
			},
			searchPanel() {
				that.gridHost?.searchPanel();
			},
			groupPanel() {
				that.gridHost?.groupPanel();
			},
			registerFinalizer(finalizer: () => void) {
				that.registerFinalizer(finalizer);
			},
			registerSubscription(subscription: Subscription) {
				that.registerSubscription(subscription);
			},
			print(){
				that.reportingPrintService.printGrid(that.gridHost as GridComponent<T>);
			}
		};
	}

	/**
	 * Attaches the container to some of the entity services, if present.
	 */
	protected attachToEntityServices() {
		if (this.entityList) {
			this.config = {
				...this.config,
				items: this.entityList.getList()
			};
			const listSubscription = this.entityList.listChanged$.subscribe(items => {
				this.config = {
					...this.config,
					items: [...items]
				};
			});
			this.registerFinalizer(() => listSubscription.unsubscribe());
		}

		if (this.entitySelection) {
			const selectionSubscription = this.entitySelection.selectionChanged$.subscribe(entities => {
				if (this.gridHost !== undefined) {
					this.gridHost.selection = entities;
				}
			});
			this.registerFinalizer(() => selectionSubscription.unsubscribe());
		}

		if (this.entityModification) {
			const modificationSubscription = this.entityModification.entitiesUpdated$.subscribe(entities => {
				if (this.gridHost !== undefined) {
					this.gridHost.invalidate(entities);
				}
			});
			this.registerFinalizer(() => modificationSubscription.unsubscribe());
		}
	}

	/**
	 * Loads the schema of the entity.
	 */
	protected generateGridColumns() {
		this.config = {
			...this.config,
			columns: this.entityGridService.generateGridConfig(this.loadEntitySchema(), this.layout, this.entityValidationService)
		};
	}

	private readonly onSizeChanged = (args: IResizeArgs) => {
		// console.warn(`resize-grid-${this.config.uuid} => ${JSON.stringify(args)}`);
		// TODO: Just for test the resize events.
		this.config = {
			...this.config,
		};
		this.gridHost?.resizeGrid();
	};

	/**
	 * Initialize the drag drop features and directive
	 * @protected
	 */
	protected initDragDrop() {
		if (this.config.uuid && this.uiCommonDragDropTarget && this.entityDragDropService) {

			this.dragDropService.registerDragDropBase(this.entityDragDropService);

			const dragDropTarget = new DragDropTarget<T>(this.config.uuid);
			this.uiCommonDragDropTarget.setDragDropTarget(dragDropTarget);
		}
	}

	/**
	 * Used to pass the selected data from the grid to the dataservice
	 * @param selectedRows
	 */
	public onSelectionChanged(selectedRows: T[]) {
		this.entitySelection.select(selectedRows);
	}

	protected initCustomBehavior() {
		this.customBehavior = inject(this.injectionTokens.getEntityContainerBehaviorToken<L>());

		if (this.customBehavior.onCreate && this.containerLink) {
			this.customBehavior.onCreate(this.containerLink);
		}
	}

	public ngOnInit() {
		if (this.customBehavior?.onInit && this.containerLink) {
			this.customBehavior?.onInit(this.containerLink);
		}
	}

	public ngAfterViewInit() {
		this.initDragDrop();
	}

	public override ngOnDestroy() {
		if (this.customBehavior?.onDestroy && this.containerLink) {
			this.customBehavior?.onDestroy(this.containerLink);
		}
		if (this.entityDragDropService) {
			this.dragDropService.unregisterDragDropBase(this.entityDragDropService);
		}

		super.ngOnDestroy();
	}

	/**
	 * Retrieves the parent of a hierarchical item.
	 *
	 * @param entity The item.
	 *
	 * @returns The parent, or `null` if the item is on the root level.
	 *
	 * @throws The data service for the entity is not a hierarchical data service.
	 */
	protected retrieveEntityParent(entity: T): T | null {
		if (this.entityTree) {
			return this.entityTree.parentOf(entity);
		}

		throw new Error('The entity does not use a hierarchical data service.');
	}

	/**
	 * Retrieves the children of a hierarchical item.
	 *
	 * @param entity The item.
	 *
	 * @returns The child items.
	 *
	 * @throws The data service for the entity is not a hierarchical data service.
	 */
	protected retrieveEntityChildren(entity: T): T[] {
		if (this.entityTree) {
			return this.entityTree.childrenOf(entity);
		}

		throw new Error('The entity does not use a hierarchical data service.');
	}

	/**
	 * Notifies the data service that the entity object has been modified.
	 * @param info An information object about the change.
	 */
	public onValueChanged(info: IFieldValueChangeInfo<T>) {
		this.entityModification?.setModified(info.entity);
	}
}
