/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { IEntityIdentification, Orientation, PlatformLazyInjectorService, ServiceLocator } from '@libs/platform/common';
import { PARENT_CHILD_LOOKUP_DIALOG_TOKEN } from './lookup-parent-child-token-provider';
import { getCustomDialogDataToken, StandardDialogButtonId } from '../../../dialogs';
import { IGridConfiguration } from '../../../grid';
import { IMenuItemsList } from '../../../model/menu-list/interface';
import { ILookupDialogView, ILookupViewResult } from '../../model/interfaces/lookup-view.interface';
import { ISplitGridParentChildSplitter } from './interfaces/split-grid-parent-child.interface';

@Component({
	selector: 'ui-common-parent-child-lookup-dialog',
	templateUrl: './parent-child-lookup-dialog.component.html',
	styleUrls: ['./parent-child-lookup-dialog.component.scss'],
})

/**
 * A generic parent-child lookup component that displays a parent grid and a child grid.
 * @typeparam PT - The type of the parent entity.
 * @typeparam CT - The type of the child entity.
 */
export class UiCommonParentChildLookupDialogComponent<PT extends IEntityIdentification, CT extends IEntityIdentification> implements OnInit, AfterViewInit, ILookupDialogView<CT> {

    
    /** The currently selected group entity, can be of type PT or null. */
	public selectedGroupEntity?: PT | null;

    /** The currently focused item, can be of type CT. */
	public focusedItem?: CT;

    /** Indicates whether the component is in a loading state. */
	public isLoading = false;

    /** Injects the custom dialog data token. */
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<CT>, UiCommonParentChildLookupDialogComponent<PT, CT>>());

    /** Injects the parent-child lookup dialog token. */
	private readonly PARENT_CHILD_LOOKUP_DIALOG_TOKEN = inject(PARENT_CHILD_LOOKUP_DIALOG_TOKEN);

    /** The data for the toolbar items, can be undefined. */
	public toolbarData: IMenuItemsList<void> | undefined;

    /** Gets the lazy injector service from the service locator. */
	private readonly lazyInjector = ServiceLocator.injector.get(PlatformLazyInjectorService);

    /** The configuration for the parent grid. */
	public parentGridStructure!: IGridConfiguration<object>;

    /** The configuration for the child grid. */
	public childGridStructure!: IGridConfiguration<object>;

    /** The splitter configuration. */
	protected splitter: ISplitGridParentChildSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [50, 50]
	};

    /** The result of the search, type is unknown. */
	public searchResult: string = 'cloud.common.searchResults';

    /** The search data string, initialized to an empty string. */
    public searchData: string = '';

	public constructor() {}

	 /**
     * Lifecycle hook that is called after Angular has initialized all data-bound properties.
     * Initializes the component by injecting necessary dependencies and setting up initial data.
     */
	 public async ngOnInit(): Promise<void> {
        
        const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = await this.lazyInjector.inject(this.PARENT_CHILD_LOOKUP_DIALOG_TOKEN);
        this.parentGridStructure = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.getParentGridStructure();
        this.childGridStructure = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.getChildGridStructure();
        this.toolbarData = await this.getToolbarData();
    }

    /**
     * Lifecycle hook that is called after Angular has fully initialized a component's view.
     * Sets up the component by calling the init method after a short delay.
     */
    public ngAfterViewInit(): void {

        setTimeout(() => {
            this.init();
        });
    }

    /**
     * Initializes the component by loading parent data and setting up the parent grid structure.
     * Sets the loading state while data is being fetched.
     */
    private async init() {

        const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = await this.lazyInjector.inject(this.PARENT_CHILD_LOOKUP_DIALOG_TOKEN);
        this.isLoading = true;
        const parentGridData = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.loadParentGridItems();
        parentGridData.subscribe((parentGridList) => {
            this.parentGridStructure = { ...this.parentGridStructure, items: parentGridList };
            this.isLoading = false;
        });
    }

    /**
     * Handles the event when a parent entity is switched.
     * Loads the corresponding child entities and updates the child grid structure.
     * @param selectedRows - The selected rows representing the parent entities.
     */
    public async onParentSwitched(selectedRows: object[]) {

        this.isLoading = true;
        const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = await this.lazyInjector.inject(this.PARENT_CHILD_LOOKUP_DIALOG_TOKEN);
        const childGridData = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.loadChildrenGridItems(selectedRows);
        childGridData.subscribe((childGridList) => {
            this.childGridStructure = { ...this.childGridStructure, items: childGridList };
            this.isLoading = false;
        });
    }

    /**
     * Handles the event when the selection changes in the grid.
     * Updates the focused item based on the selected child entities.
     * @param selections - The selected rows representing the child entities.
     */
    public onSelectionChanged(selections: object[]) {

        const selectedItems = selections as CT[];
        this.focusedItem = selectedItems.length > 0 ? selectedItems[0] : undefined;
    }

    /**
     * Applies the selected or focused child entity and closes the dialog.
     * @param dataItem - The child entity to apply. If not provided, the focused item is used.
     */
    public apply(dataItem?: CT) {
        
        // Use focusedItem if dataItem is not provided
        const item = dataItem || this.focusedItem;
    
        // If item is still not defined, exit the function
        if (!item) {
            return;
        }
    
        // Set the dialog result and close the dialog with the OK button ID
        this.dialogWrapper.value = {
            apply: true,
            result: item
        };
    
        this.dialogWrapper.close(StandardDialogButtonId.Ok);
    }
    

    /**
     * searches data
     */
    public async onSearch() {

        if(this.searchData === '') {
            this.init();
        } else {
        const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = await this.lazyInjector.inject(this.PARENT_CHILD_LOOKUP_DIALOG_TOKEN);
        this.isLoading = true;
        const parentGridData = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.getSearchResult(this.searchData);
        parentGridData.subscribe((parentGridList) => {
            this.parentGridStructure = { ...this.parentGridStructure, items: parentGridList };
            this.isLoading = false;
        });
    }
    }

    /**
     * Refreshes the component
     */
    public refresh(): void {

        this.onSearch(); 
     }

    /**
     * Retrieves the toolbar data by injecting the token configuration provider.
     * @returns A promise that resolves to the toolbar items.
     */
    public async getToolbarData() {

        const PARENT_CHILD_LOOKUP_DIALOG_TOKEN = await this.lazyInjector.inject(this.PARENT_CHILD_LOOKUP_DIALOG_TOKEN);
        const toolbarItems = PARENT_CHILD_LOOKUP_DIALOG_TOKEN.getToolbarItems();

        return toolbarItems;
    }
}

