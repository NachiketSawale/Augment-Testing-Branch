/*
 * Copyright(c) RIB Software GmbH
 */

import {get, isBoolean} from 'lodash';
import {debounceTime, Subject} from 'rxjs';
import {
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Renderer2
} from '@angular/core';

import {
	IEntityContext,
	IIdentificationData,
	MinimalEntityContext,
	KeyboardCode
} from '@libs/platform/common';

import {ILookupOptions,ILookupConfig} from '../../model/interfaces/lookup-options.interface';
import {ILookupReadonlyDataService} from '../../model/interfaces/lookup-readonly-data-service.interface';
import {ILookupViewResult, ILookupPopupView} from '../../model/interfaces/lookup-view.interface';
import {LookupReadonlyDataServiceFacade} from '../../model/lookup-readonly-data-service-facade';
import {PopupService} from '../../../popup/services/popup.service';
import {ActivePopup} from '../../../popup/model/active-popup';
import {LookupEvent, LookupMultiSelectEvent} from '../../model/lookup-event';
import {LookupSearchResponseFacade} from '../../model/lookup-search-response-facade';
import {LookupContext} from '../../model/lookup-context';
import {UiCommonDialogService} from '../../../dialogs/base/services/dialog.service';
import {LookupSubscriber} from '../../model/lookup-subscriber';
import { ILookupInput } from '../../model/interfaces/lookup-input.interface';
import { UiCommonLookupViewService } from '../../services/lookup-view.service';
import {ILookupBtnRefs} from '../../model/interfaces/lookup-btn-refs.interface';
import { LookupFormatterService } from '../../services/lookup-formatter.service';
import { LookupEventType } from '../../model/enums/lookup-event-type.enum';
import { ResizeEvent } from '../../../popup';
import { LookupStaticProviderService } from '../../services/lookup-static-provider.service';
import { ILookupViewData } from '../../model/interfaces/lookup-storage.interface';
import { ILookupIdentificationData } from '../../model/interfaces/lookup-identification-data.interface';

export abstract class UiCommonLookupInputBase<TItem extends object, TEntity extends object> implements ILookupInput<TItem, TEntity> {
	private $selectedItem?: TItem | null;
	private $focusedItem?: TItem | null;
	private $isSearching = false;
	private $searchString?: string;

	protected userInputSubject = new Subject<string>();
	protected keydownSubject = new Subject<KeyboardEvent>();
	protected activePopup?: ActivePopup;
	protected activePopupView?: ILookupPopupView<TItem>;

	protected abstract dataService: ILookupReadonlyDataService<TItem, TEntity>;
	protected abstract options?: ILookupOptions<TItem, TEntity>;
	protected abstract readonly?: boolean;
	protected abstract container: ElementRef;
	protected abstract buttons: ILookupBtnRefs;

	protected abstract selectedItemChanged: EventEmitter<LookupEvent<TItem, TEntity>>;
	protected abstract inputGroupClick: EventEmitter<LookupEvent<TItem, TEntity>>;
	protected abstract popupOpened: EventEmitter<LookupEvent<TItem, TEntity>>;
	protected abstract popupClosed: EventEmitter<LookupEvent<TItem, TEntity>>;

	public abstract input: ElementRef;
	public abstract entityContext: IEntityContext<TEntity>;

	public inputValue?: string;
	public config!: ILookupConfig<TItem, TEntity>;
	public context!: LookupContext<TItem, TEntity>;
	public dataFacade!: LookupReadonlyDataServiceFacade<TItem, TEntity>;

	private viewData?: ILookupViewData | null;
	private minimalEntityContext?: MinimalEntityContext<TEntity>;

	public get effectiveEntityContext(): IEntityContext<TEntity> {
		if (this.entityContext) {
			return this.entityContext;
		}

		if (!this.minimalEntityContext) {
			this.minimalEntityContext = new MinimalEntityContext<TEntity>();
		}
		return this.minimalEntityContext;
	}

	public get selectedItem() {
		return this.$selectedItem;
	}

	public set selectedItem(value) {
		this.$selectedItem = value;
		this.onSelectedItemChanged(value);
	}

	public get description() {
		if(this.config.descriptionMember) {
			return get(this.selectedItem, this.config.descriptionMember, '');
		}
		throw new Error('descriptionMember option is not configured!');
	}

	public get descriptionMembers() {
		const descriptionMemberSet = new Set<string>();

		if (this.config.descriptionMember) {
			descriptionMemberSet.add(this.config.descriptionMember);
		}

		if (this.config.descriptionMembers) {
			this.config.descriptionMembers.forEach(e => descriptionMemberSet.add(e));
		}

		return descriptionMemberSet;
	}

	protected readonly popupService = inject(PopupService);
	protected readonly hostElement = inject(ElementRef);
	protected readonly renderer = inject(Renderer2);
	protected readonly injector = inject(Injector);
	protected readonly dialogService = inject(UiCommonDialogService);
	protected readonly lookupViewService = inject(UiCommonLookupViewService);
	protected readonly formatterService = inject(LookupFormatterService);
	protected readonly staticProviderService = inject(LookupStaticProviderService);

	/**
	 * manager subscription in lookup.
	 * @protected
	 */
	protected subscriber = new LookupSubscriber();

	public getDescription(descriptionMember: string) {
		return get(this.selectedItem, descriptionMember, '');
	}

	public mergeSettings() {
		this.initDataService();
		this.config = this.lookupViewService.combineConfig(this.dataService, this.options);
		this.context = new LookupContext<TItem, TEntity>(this.injector, this);
		this.dataFacade = new LookupReadonlyDataServiceFacade(this.dataService, this.context);

		if (isBoolean(this.config.readonly)) {
			this.readonly = this.config.readonly;
		}
		if (this.config.imageSelector) {
			this.config.showCustomInputContent = true;
		}
		if (!this.config.editButtonCss) {
			if (this.config.showDialog) {
				this.config.editButtonCss = this.config.dialogButtonCss;
			} else {
				this.config.editButtonCss = this.config.popupButtonCss;
			}
		}
	}

	protected initDataService() {
		if (this.options) {
			if (this.options.dataService) {
				this.dataService = this.options.dataService;
			} else if (this.options.dataServiceToken) {
				this.dataService = this.injector.get(this.options.dataServiceToken);
			}
		}
	}

	protected openLookup() {
		if (this.config.showDialog) {
			this.openDialog();
		} else {
			this.togglePopup();
		}
	}

	protected openDialog() {
		// close popup window first if exists
		this.closePopup();

		this.lookupViewService.openDialog(this.context, this.config)?.then(e => {
			if (e.closingButtonId === 'ok' && e.value && e.value.apply) {
				this.apply(e.value.result);
			}
		});
	}

	private togglePopup() {
		if (this.activePopup) {
			this.closePopup();
		} else {
			this.openPopup();
		}
	}

	private async openPopup(triggerFromSearch?: boolean): Promise<ActivePopup> {
		if (this.activePopup) {
			return this.activePopup;
		}

		this.config.popupOptions = {
			relatedElement: this.buttons.editBtn,
			...this.config.popupOptions
		};

		const storageService = this.staticProviderService.getStorageService();

		if (!this.viewData) {
			this.viewData = await storageService.getViewData(this.config.uuid);
		}

		if (this.viewData?.popup) {
			this.config.popupOptions.width = this.viewData.popup.width;
			this.config.popupOptions.height = this.viewData.popup.height;
		}

		this.activePopup = this.lookupViewService.openPopup(this.input, this.context, this.config) as ActivePopup;

		const popupView = this.activePopup.component.instance as ILookupPopupView<TItem>;
		if (popupView.prepare) {
			await popupView.prepare();
		}

		this.subscribePopup(this.activePopup, triggerFromSearch);
		return this.activePopup;
	}

	private closePopup() {
		if (this.activePopup) {
			this.activePopup.dismiss();
		}
	}

	private subscribePopup(popup: ActivePopup, triggerFromSearch?: boolean) {
		const popupView = popup.component.instance as ILookupPopupView<TItem>;
		this.activePopupView = popupView;

		if (triggerFromSearch) {
			// TODO: implement this case
		} else {
			popupView.load();
		}

		this.subscriber.addSubscription('popupOpened', popup.opened.subscribe(() => {
			this.onPopupOpened();
		}));

		this.subscriber.addSubscription('popupClosed', popup.closed.subscribe(result => {
			this.activePopup = undefined;
			this.activePopupView = undefined;
			this.onPopupClosed(result);
		}));

		this.subscriber.addSubscription('popupResized', popup.resized.subscribe(async e => {
			await this.onPopupResized(e);
		}));
	}

	private async onPopupResized(e: ResizeEvent) {
		this.activePopupView?.resize();

		this.viewData = {
			popup: {
				width: e.width,
				height: e.height
			}
		};
		const storageService = this.staticProviderService.getStorageService();
		await storageService.setViewData(this.config.uuid, this.viewData);
	}

	protected onInputChange(input: string) {
		this.$isSearching = true;
		this.$searchString = input;
		this.$focusedItem = undefined;
		this.userInputSubject.next(input);
	}

	public onInputBlur(e: FocusEvent) {
		this.$isSearching = false;
		if (e.target) {
			this.resetInputValue(e.target as HTMLInputElement);
		}
	}

	protected onKeyDown(e: KeyboardEvent) {
		this.keydownSubject.next(e);
	}

	protected subscribeUserInput() {
		this.subscriber.addSubscription('input.change', this.userInputSubject.pipe(
			debounceTime(this.config.searchInterval || 0)
		).subscribe(input => this.search(input)));
	}

	protected subscribeKeyDown() {
		this.subscriber.addSubscription('input.keydown', this.keydownSubject.subscribe((e: KeyboardEvent) => {
			switch (e.code) {
				case KeyboardCode.UP: {
					e.stopPropagation();
					if (this.activePopupView) {
						this.activePopupView.prev();
					}
				}
					break;
				case KeyboardCode.DOWN: {
					e.stopPropagation();
					if (this.activePopupView) {
						this.activePopupView.next();
					} else {
						this.openLookup();
					}
				}
					break;
				case KeyboardCode.LEFT: {
					if (this.activePopupView && this.activePopupView.collapse) {
						this.activePopupView.collapse();
					}
				}
					break;
				case KeyboardCode.RIGHT: {
					if (this.activePopupView && this.activePopupView.expand) {
						this.activePopupView.expand();
					}
				}
					break;
				case KeyboardCode.ESCAPE: {
					if (this.activePopup) {
						this.activePopup.dismiss();
					}
				}
					break;
				case KeyboardCode.TAB:
				case KeyboardCode.ENTER: {
					if (this.$isSearching) {
						if (this.config.searchSync && this.$searchString) {
							const response = this.dataFacade.searchSync(this.$searchString, true);
							this.$focusedItem = response.completeItem;
							this.apply(this.$focusedItem);
							this.$isSearching = false;
						}
					} else {
						if (this.activePopupView && this.activePopupView.focusedItem) {
							this.activePopupView.apply(this.activePopupView.focusedItem);
						} else if (this.$focusedItem) {
							this.apply(this.$focusedItem);
						}
					}
					this.closePopup();
				}
					break;
			}
		}));
	}

	private async search(input: string) {
		if (!this.config.autoSearch || !this.$isSearching) {
			return;
		}

		if (this.config.disablePopupOnSearch) {
			this.subscriber.addSubscription('dataFacade.search', this.dataFacade.search(input, true).subscribe(res => {
				const response = res as LookupSearchResponseFacade<TItem>;
				if (response.completeItem) {
					this.autoComplete(response.completeItem);
					this.$focusedItem = response.completeItem;
				}
				this.$isSearching = false;
			}));
		} else {
			const popup = await this.openPopup(true);
			const popupContent = popup.component.instance as ILookupPopupView<TItem>;
			this.subscriber.addSubscription('popup.search', popupContent.search(input).subscribe(dataItem => {
				if (dataItem) {
					this.autoComplete(dataItem);
					this.$focusedItem = dataItem;
				}
				this.$isSearching = false;
			}));
		}
	}

	private autoComplete(dataItem: TItem) {
		if (!this.config.autoComplete) {
			return;
		}

		const input = this.input.nativeElement;
		const length = input.value.length;
		const value = this.format(dataItem);

		if (value && value.length > length) {
			input.value = value;
			input.setSelectionRange(length, value.length);
		}
	}

	public convert(item: TItem) {
		return get(item, this.config.valueMember);
	}

	protected format(item: TItem): string {
		return this.formatterService.getPlainText(item, this.context);
	}

	protected loadSelectedItem(value: number | string | IIdentificationData) {
		this.subscriber.addSubscription('loadDataItemById', this.dataFacade.loadDataItemById(value).subscribe(data => {
			this.selectedItem = data;
		}));
	}

	protected clearSelectedItem() {
		this.selectedItem = null;
	}

	protected onSelectedItemChanged(value?: TItem | null) {
		const event = new LookupEvent(this.context, value);
		this.selectedItemChanged.emit(event);
		this.emitEvent(LookupEventType.SelectedItemChanged, event);
	}

	protected onInputGroupClick(e: MouseEvent) {
		const event = new LookupEvent(this.context, this.selectedItem, e);
		this.inputGroupClick.emit(event);
		this.emitEvent(LookupEventType.InputGroupClick, event);
	}

	protected emitEvent(name: string, event: LookupEvent<TItem, TEntity> | LookupMultiSelectEvent<TItem, TEntity>) {
		if (this.config.events) {
			event.instance = this;
			this.config.events.forEach(e => {
				if (e.name === name) {
					e.handler(event);
				}
			});
		}
	}

	private resetInputValue(input: HTMLInputElement) {
		let value = '';
		if (this.selectedItem) {
			value = this.format(this.selectedItem);
		}
		if (this.inputValue !== value) {
			this.inputValue = value;
		}
		if (input.value !== value) {
			input.value = value;
		}
	}

	protected onPopupClosed(result: unknown) {
		const r = result as ILookupViewResult<TItem>;

		if (r && r.apply) {
			this.apply(r.result);
		}
	}

	public destroy() {
		this.subscriber.clearAllSubscriptions();
		if (this.activePopup) {
			this.activePopup.destroy();
			this.activePopup = undefined;
		}
	}

	protected abstract onPopupOpened(): void;

	/**
	 * Apply data item
	 * @param item
	 */
	public abstract apply(item: unknown): void;

	/**
	 * Clear current value
	 */
	public abstract clear(): void;

	/**
	 * Get id from selected data item
	 */
	public abstract getSelectedId(): ILookupIdentificationData | null;
}
