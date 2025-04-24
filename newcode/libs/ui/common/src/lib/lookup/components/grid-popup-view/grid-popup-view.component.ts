/*
 * Copyright(c) RIB Software GmbH
 */
import {Observable} from 'rxjs';
import {Component, inject, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {ActivePopup} from '../../../popup';
import {LookupContext} from '../../model/lookup-context';
import {LookupGridViewBase} from '../base/lookup-grid-view-base';
import {ILookupPopupView} from '../../model/interfaces/lookup-view.interface';
import {LookupSearchResponseFacade} from '../../model/lookup-search-response-facade';
import { IGridApi } from '../../../grid/model/grid-api.interface';
import { MouseEvent } from '../../../grid/model/events/grid-mouse-event.class';

/**
 * Default grid popup view
 */
@Component({
	selector: 'ui-common-grid-popup-view',
	templateUrl: './grid-popup-view.component.html',
	styleUrls: ['./grid-popup-view.component.scss'],
})
export class UiCommonGridPopupViewComponent <TItem extends object, TEntity extends object> extends LookupGridViewBase<TItem, TEntity> implements ILookupPopupView<TItem>, AfterViewInit, OnDestroy {
	private activePopup = inject(ActivePopup);
	protected lookupContext = inject(LookupContext<TItem, TEntity>);

	@ViewChild('grid') private grid!: IGridApi<TItem>;

	public async prepare() {
		await this.loadGridConfig();
	}

	/**
	 * component destroying
	 */
	public ngOnDestroy() {
		this.destroy();
	}

	public ngAfterViewInit(): void {
		if (this.grid) {
			this.subscriber.addSubscription('gridMouseClick', this.grid.mouseClick.subscribe((e: MouseEvent<TItem>) => {
				e.originalEvent.stopImmediatePropagation();
				if (this.grid.selection.length > 0) {
					this.apply(this.grid.selection[0]);
				}
			}));
			this.subscriber.addSubscription('gridMouseEnter', this.grid.mouseEnter.subscribe((e: MouseEvent<TItem>) => {
				if(this.canApply(e.item)) {
					this.focus([e.item]);
				}
			}));
		}
	}

	protected override select(dataItem: TItem | number) {
		this.activePopup.close({
			apply: true,
			result: dataItem
		});
	}

	/**
	 * Searching
	 * @param input
	 */
	public search(input: string): Observable<TItem | null> {
		return new Observable(observer => {
			this.subscriber.addSubscription('search', this.lookupFacade.search(input, true).subscribe(res => {
				const response = res as LookupSearchResponseFacade<TItem>;
				this.setList(response.items, response.completeItem);
				observer.next(response.completeItem);
			}));
		});
	}

	protected override focus(dataItems: TItem[], visible?: boolean) {
		super.focus(dataItems, visible);
		// todo - workaround, setting selection immediately after updating grid list doesn't work because grid data view is still empty in this stage
		setTimeout(() => {
			this.grid.selection = dataItems;
		}, 200);
	}

	protected override scrollIntoView(dataItem: TItem) {

	}

	/**
	 * Resize popup window.
	 */
	public resize() {
		this.grid.resizeGrid();
	}

	/**
	 * Collapse selected tree node
	 */
	public collapse() {
		if (this.focusedItem) {
			this.grid.collapse(this.focusedItem);
		}
	}

	/**
	 * Expand selected tree node
	 */
	public expand() {
		if (this.focusedItem) {
			this.grid.expand(this.focusedItem);
		}
	}
}
