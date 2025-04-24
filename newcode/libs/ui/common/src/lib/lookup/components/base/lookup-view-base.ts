/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injector} from '@angular/core';
import {LookupReadonlyDataServiceFacade} from '../../model/lookup-readonly-data-service-facade';
import {LookupContext} from '../../model/lookup-context';
import {LookupSubscriber} from '../../model/lookup-subscriber';
import { IInitializationContext, InitializationContext } from '@libs/platform/common';
import { LookupIdentificationData } from '../../model/lookup-identification-data';

/**
 * The basic class for lookup data view which share common logic like paging, refreshing and so on
 */
export abstract class LookupViewBase<TItem extends object, TEntity extends object> {
	/**
	 * Initialize context
	 * @private
	 */
	private _initializeContext?: IInitializationContext;
    /**
     * Is lookup view destroyed
     * @protected
     */
    protected isDestroyed = false;
    /**
     * Is loading data or configuration
     */
    public isLoading = false;
    /**
     * Focused data item which will be applied
     */
    public focusedItem?: TItem;
    /**
     * Focused data items which will be applied
     */
    public focusedItems: TItem[] = [];
    /**
     * Selected data item
     */
    public selectedItem?: TItem;
	/**
	 * The loaded data items
	 */
	public dataItems: TItem[] = [];
    /**
     * Angular service injector
     * @protected
     */
    protected readonly injector = inject(Injector);

    /**
     * manager subscription in lookup.
     * @protected
     */
    protected subscriber = new LookupSubscriber();

    /**
     * Get lookup context object
     * @protected
     */
    protected abstract get lookupContext(): LookupContext<TItem, TEntity>;

    /**
     * Apply data item without validating data
     * @param dataItem
     * @protected
     */
    protected abstract select(dataItem: TItem): void;

    /**
     * Make passed data item visible on the view
     * @param dataItem
     * @protected
     */
    protected abstract scrollIntoView(dataItem: TItem): void;

	/**
	 * Set data list into view
	 * @param list
	 * @param focusedItem
	 * @protected
	 */
	protected setList(list: TItem[], focusedItem?: TItem | null): void {
		this.dataItems = list;

		if (focusedItem) {
			this.focus([focusedItem], true);
		}
	}

    /**
     * Focus data item on lookup view
     * @param dataItem
     * @param visible
     * @protected
     */
    protected focus(dataItems: TItem[], visible?: boolean) {
        this.focusedItems = dataItems;

        if (dataItems.length > 0) {
            this.focusedItem = dataItems[0];
        } else {
            this.focusedItem = undefined;
        }
        if (visible && this.focusedItem) {
            this.scrollIntoView(this.focusedItem);
        }
    }

    /**
     * Get data facade object
     * @protected
     */
    protected get lookupFacade(): LookupReadonlyDataServiceFacade<TItem, TEntity> {
        return this.lookupContext.lookupFacade;
    }

	 protected get initializeContext(): IInitializationContext {
		 if (!this._initializeContext) {
			 this._initializeContext = new InitializationContext(this.injector);
		 }
		 return this._initializeContext as IInitializationContext;
	 }

    /**
     * Apply data item with validating
     * @param dataItem
     */
    public apply(dataItem?: TItem) {
	    if (!dataItem) {
		    dataItem = this.focusedItem;
	    }
	    if (!dataItem) {
		    return;
	    }
	    if (this.canApply(dataItem)) {
		    this.select(dataItem);
	    }
    }

	/**
	 * Can apply data item?
 	 * @param dataItem
	 */
	public canApply(dataItem?: TItem): boolean {
		if (!dataItem) {
			dataItem = this.focusedItem;
		}
		if (!dataItem) {
			return false;
		}
		return this.lookupFacade.canSelect(dataItem);
	}

    /**
     * Load all data items into view
     */
    public load() {
        this.subscriber.addSubscription('load', this.lookupFacade.load().subscribe((res) => {
            this.setList(res.items, this.findSelectedItem(res.items));
        }));
    }

    /**
     * Clear data cache and refresh data items from server
     */
    public refresh() {
        this.lookupFacade.cache.clear();
        this.load();
    }

    /**
     * Load next page data
     */
    public loadNextPage() {
        this.subscriber.addSubscription('loadNextPage', this.lookupFacade.loadNextPage().subscribe((res) => {
            this.setList(res.items);
        }));
    }

    /**
     * Load previous page data
     */
    public loadPreviousPage() {
        this.subscriber.addSubscription('loadPreviousPage', this.lookupFacade.loadPreviousPage().subscribe((res) => {
            this.setList(res.items);
        }));
    }

    protected loadSelectedItem() {
        if (!this.lookupContext.selectedId) {
            return;
        }

        this.subscriber.addSubscription('loadDataItemById', this.lookupFacade.loadDataItemById(this.lookupContext.selectedId).subscribe(dataItem => {
            this.setList([dataItem]);
        }));
    }

	protected findSelectedItem(dataItems: TItem[]): TItem | undefined {
		const selectedId = this.lookupContext.selectedId;

		if (!selectedId || !dataItems?.length) {
			return undefined;
		}

		return dataItems.find(item => {
			const id = this.lookupFacade.identify(item);
			return LookupIdentificationData.equal(id, selectedId);
		});
	}

	public next() {
		if (!this.dataItems.length) {
			return;
		}

		let focused = this.focusedItem;

		if (!focused) {
			focused = this.dataItems[0];
		} else {
			const index = this.dataItems.indexOf(focused) + 1;
			if (index < this.dataItems.length) {
				focused = this.dataItems[index];
			}
		}

		if (focused !== this.focusedItem) {
			this.focus([focused], true);
		}
	}

	public prev() {
		if (!this.dataItems.length) {
			return;
		}

		let focused = this.focusedItem;

		if (!focused) {
			focused = this.dataItems[0];
		} else {
			const index = this.dataItems.indexOf(focused) - 1;
			if (index > -1) {
				focused = this.dataItems[index];
			}
		}

		if (focused !== this.focusedItem) {
			this.focus([focused], true);
		}
	}

    protected destroy() {
        this.isDestroyed = true;
        this.subscriber.clearAllSubscriptions();
    }
}