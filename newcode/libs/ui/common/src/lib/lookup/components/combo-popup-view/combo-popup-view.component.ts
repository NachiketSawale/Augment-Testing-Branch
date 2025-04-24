/*
 * Copyright(c) RIB Software GmbH
 */
import {get} from 'lodash';
import {debounceTime, Observable, Subject} from 'rxjs';
import {Component, ElementRef, OnInit, AfterViewInit, inject, OnDestroy} from '@angular/core';

import {IEntityContext, KeyboardCode} from '@libs/platform/common';

import {ActivePopup} from '../../../popup/model/active-popup';
import {ILookupConfig} from '../../model/interfaces/lookup-options.interface';
import {LookupSearchResponseFacade} from '../../model/lookup-search-response-facade';
import {ILookupPopupView} from '../../model/interfaces/lookup-view.interface';
import {LookupContext} from '../../model/lookup-context';
import {LookupViewBase} from '../base/lookup-view-base';

@Component({
	selector: 'ui-common-combo-popup-view',
	templateUrl: './combo-popup-view.component.html',
	styleUrls: ['./combo-popup-view.component.scss'],
})
export class UiCommonComboPopupViewComponent<TItem extends object, TEntity extends object> extends LookupViewBase<TItem, TEntity> implements OnInit, AfterViewInit, OnDestroy, ILookupPopupView<TItem> {
	private dataItemIndexes = new Map<unknown, number>();
	private userInputSubject = new Subject<string>();
	private keydownSubject = new Subject<KeyboardEvent>();

	public inputValue: string = '';

	public get entityContext(): IEntityContext<TEntity> {
		return this.lookupContext;
	}

	public get config(): ILookupConfig<TItem, TEntity> {
		return this.lookupContext.lookupConfig as ILookupConfig<TItem, TEntity>;
	}

	private hostElement = inject(ElementRef);
	private activePopup = inject(ActivePopup);
	protected lookupContext = inject(LookupContext<TItem, TEntity>);

	public ngOnInit(): void {
		if (this.config.showCustomInputContent) {
			this.subscribeUserInput();
			this.subscribeKeyDown();
		}
	}

	public ngAfterViewInit() {
		setTimeout(() => {
			this.focusFilterInput();
		});
	}

	public ngOnDestroy() {
		this.destroy();
	}

	private focusFilterInput() {
		const input = this.hostElement.nativeElement.querySelector('.filter-input');
		if (input) {
			input.focus();
		}
	}

	protected select(dataItem?: TItem) {
		this.activePopup.close({
			apply: true,
			result: dataItem
		});
	}

	protected override setList(dataItems: TItem[], focusedItem?: TItem | null) {
		super.setList(dataItems, focusedItem);
		this.refreshIndex();
	}

	private refreshIndex() {
		this.dataItemIndexes.clear();

		this.dataItems.forEach((d, index) => {
			this.dataItemIndexes.set(d, index);
		});
	}

	protected override scrollIntoView(dataItem: TItem) {
		const key = this.generateKey(dataItem);
		const element = this.hostElement.nativeElement.querySelector('#' + key);

		if (element && !this.isInView(element)) {
			element.scrollIntoView();
		}
	}

	private isInView(element: HTMLElement): boolean {
		const viewport = this.hostElement.nativeElement.querySelector('.popup-content');
		const bcr = element.getBoundingClientRect();
		const vp = viewport.getBoundingClientRect();
		return bcr.top > vp.top && bcr.bottom < vp.bottom;
	}

	private dismiss() {
		this.activePopup.dismiss();
	}

	private format(dataItem: unknown) {
		return get(dataItem, this.config.displayMember);
	}

	public itemBg(item: TItem) {
		let bg = 'initial';

		if (item === this.focusedItem) {
			if (this.canApply(item)) {
				bg = 'lightskyblue';
			} else {
				bg = '#dcdcdc';
			}
		} else if (item === this.selectedItem) {
			bg = 'skyblue';
		}

		return bg;
	}

	public generateKey(dataItem: unknown) {
		return 'd' + this.dataItemIndexes.get(dataItem);
	}

	private subscribeUserInput() {
		this.subscriber.addSubscription('userInputChange', this.userInputSubject.pipe(
			debounceTime(this.config.searchInterval || 0)
		).subscribe(input => this.searchList(input)));
	}

	private subscribeKeyDown() {
		this.subscriber.addSubscription('userInputKeydown', this.keydownSubject.subscribe((e: KeyboardEvent) => {
			switch (e.code) {
				case KeyboardCode.UP: {
					this.prev();
				}
					break;
				case KeyboardCode.DOWN: {
					this.next();
				}
					break;
				case KeyboardCode.TAB: {
					this.apply(this.focusedItem);
				}
					break;
				case KeyboardCode.ENTER: {
					this.apply(this.focusedItem);
				}
					break;
			}
		}));
	}

	public onInputChange(input: string) {
		this.userInputSubject.next(input);
	}

	public onKeyDown(e: KeyboardEvent) {
		this.keydownSubject.next(e);
	}

	private searchList(input: string) {
		this.subscriber.addSubscription('search', this.search(input).subscribe(dataItem => {
			this.autoComplete(dataItem);
		}));
	}

	private autoComplete(dataItem: unknown) {
		const input = this.hostElement.nativeElement.querySelector('.filter-input');
		const length = input.value.length;
		const value = get(dataItem, this.config.displayMember);

		if (value && value.length > length) {
			input.value = value;
			input.setSelectionRange(length, value.length);
		}
	}

	public search(input: string): Observable<TItem | null> {
		return new Observable(observer => {
			const subscription = this.lookupFacade.search(input, true).subscribe(res => {
				const response = res as LookupSearchResponseFacade<TItem>;
				this.setList(response.items, response.completeItem);
				observer.next(response.completeItem);
			});
			this.subscriber.addSubscription('searchData', subscription);
			return subscription;
		});
	}

	public resize() {

	}
}