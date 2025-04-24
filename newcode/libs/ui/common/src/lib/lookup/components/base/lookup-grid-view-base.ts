/*
 * Copyright(c) RIB Software GmbH
 */

import {LookupViewBase} from './lookup-view-base';
import {IGridConfiguration} from '../../../grid';
import {IInitializationContext, isAsyncCtxFactory} from '@libs/platform/common';

/**
 * The base class for lookup grid view
 */
export abstract class LookupGridViewBase<TItem extends object, TEntity extends object> extends LookupViewBase<TItem, TEntity> {
    /**
     * Grid uuid
     */
    public uuid!: string;

    /**
     * Grid configuration
     */
    public gridConfig!: IGridConfiguration<TItem>;

    /**
     * Holds the data that will be passed into the grid.
     */
    public gridData: TItem[] = [];

    /**
     * Load the grid configuration as soon as lookup view opening
     * @protected
     */
    protected async loadGridConfig() {
	    const lookupConfig = this.lookupContext.lookupConfig;
	    let gridConfig = lookupConfig.gridConfig as IGridConfiguration<TItem>;

	    if (!gridConfig) {
		    throw new Error('gridConfig is undefined!');
	    }

	    this.isLoading = true;
	    this.uuid = lookupConfig.uuid;

	    if (isAsyncCtxFactory(gridConfig)) {
		    this.gridConfig = {
			    uuid: lookupConfig.uuid,
			    globalEditorLock: false,
			    treeConfiguration: this.createTreeConfiguration([]),
		    };

		    const gridConfigFactory = gridConfig as ((context: IInitializationContext) => IGridConfiguration<TItem> | Promise<IGridConfiguration<TItem>>);
		    gridConfig = await gridConfigFactory(this.initializeContext);
		    // Only load grid config once, override it with real grid configuration
		    lookupConfig.gridConfig = gridConfig;

		    this.gridConfig = {
			    ...this.gridConfig,
			    ...gridConfig,
		    };
	    } else {
		    this.gridConfig = {
			    uuid: lookupConfig.uuid,
			    globalEditorLock: false,
			    treeConfiguration: this.createTreeConfiguration([]),
			    ...gridConfig,
		    };
	    }

	    this.uuid = this.gridConfig.uuid!;
	    this.isLoading = false;
    }

    /**
     * Handle data selection changed
     * @param selections
     */
    public handleSelectionChanged(selections: TItem[]) {
        this.focus(selections);
    }

    protected override setList(list: TItem[], focusedItem?: TItem | null) {
	    super.setList(list, focusedItem);
	    this.gridData = list;
	    this.gridConfig = {
		    ...this.gridConfig,
		    items: list,
		    treeConfiguration: this.createTreeConfiguration(list)
	    };
    }

    protected createTreeConfiguration(list: TItem[]) {
        if (this.lookupFacade.tree && this.lookupContext.lookupConfig.treeConfig) {
            return this.lookupFacade.tree.createTreeConfig(list, this.lookupContext.lookupConfig.treeConfig);
        }
        return undefined;
    }
}