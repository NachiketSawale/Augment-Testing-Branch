/*
 * Copyright(c) RIB Software GmbH
 */
import {
	Component,
	inject,
	OnDestroy,
	OnInit,
	AfterViewInit,
	ViewChild,
	ElementRef
} from '@angular/core';
import { isAsyncCtxFactory, KeyboardCode } from '@libs/platform/common';

import {getCustomDialogDataToken } from '../../../dialogs/base';

import {LookupContext} from '../../model/lookup-context';
import {LookupGridViewBase} from '../base/lookup-grid-view-base';
import {ILookupAlert, lookupAlertDefaultConfig} from '../../model/interfaces/lookup-alert.interface';
import {ILookupDialogView, ILookupViewResult} from '../../model/interfaces/lookup-view.interface';
import { UiCommonGridDialogSearchFormComponent } from '../grid-dialog-search-form/grid-dialog-search-form.component';
import { ILookupDialogSearchForm } from '../../model/interfaces/lookup-dialog-search-form.interface';


/**
 * Default lookup grid dialog
 */
@Component({
	selector: 'ui-common-grid-dialog-view',
	templateUrl: './grid-dialog-view.component.html',
	styleUrls: ['./grid-dialog-view.component.scss'],
})
export class UiCommonGridDialogViewComponent<TItem extends object, TEntity extends object> extends LookupGridViewBase<TItem, TEntity> implements OnInit, AfterViewInit, OnDestroy, ILookupDialogView<TItem> {
	private readonly dialogWrapper = inject(getCustomDialogDataToken<ILookupViewResult<TItem>, UiCommonGridDialogViewComponent<TItem, TEntity>>());
	protected lookupContext = inject(LookupContext<TItem, TEntity>);

	protected get alerts() {
		const dialogOptions = this.lookupContext.lookupConfig.dialogOptions;

		if (dialogOptions && dialogOptions.alerts) {
			return dialogOptions.alerts.map((e: ILookupAlert) => {
				return {
					...lookupAlertDefaultConfig[e.theme],
					...e
				};
			});
		}

		return [];
	}

	@ViewChild('input')
	public input!: ElementRef<HTMLInputElement>;

	@ViewChild(UiCommonGridDialogSearchFormComponent<TEntity>)
	public searchFormCtrl?: UiCommonGridDialogSearchFormComponent<TEntity>;

	/**
	 * user input string
	 */
	public userInput: string = '';
	public searchForm?: ILookupDialogSearchForm<TEntity>;

	private async loadSearchFormConfig() {
		// TODO: How to handle it if the config has different type between data service and use case?
		// TODO: For example, the base config defined in data service is an async function to produce the options.
		// TODO: For the use case, it is also a async function to produce the custom options that contains only partial info to override the base config.
		const searchForm = this.lookupFacade.config.dialogSearchForm;
		if (searchForm && isAsyncCtxFactory(searchForm)) {
			this.searchForm = await searchForm(this.initializeContext);
		} else {
			this.searchForm = searchForm as ILookupDialogSearchForm<TEntity>;
		}
	}

	/**
	 * initialization
	 */
	public ngOnInit(): void {
		//this.loadSelectedItem();

		Promise.all([this.loadGridConfig(), this.loadSearchFormConfig()]).then(() => {
			if (this.lookupContext.inputValue) {
				this.userInput = this.lookupContext.inputValue;
				this.search(this.userInput);
			}
		});
	}

	/**
	 * on destroy component
	 */
	public ngOnDestroy() {
		this.destroy();
	}

	/**
	 * Handle user input event
	 * @param e
	 */
	public handleUserInput(e: KeyboardEvent) {
		switch (e.code) {
			case KeyboardCode.ENTER: {
				e.stopPropagation();
				this.search(this.userInput);
			}
				break;
		}
	}

	protected override select(dataItem: TItem) {
		this.dialogWrapper.value = {
			apply: true,
			result: dataItem
		};

		this.dialogWrapper.close('ok');
	}

	/**
	 * Searching
	 * @param value
	 */
	public search(value: string) {
		this.subscriber.addSubscription('search', this.lookupFacade.search(value, false, this.searchFormCtrl?.formEntity).subscribe(e => {
			this.setList(e.items);
		}));
	}

	/**
	 * Refresh grid dialog data
	 */
	public override refresh() {
		this.lookupFacade.cache.clear();
		this.search(this.userInput);
	}

	public ngAfterViewInit() {
		// focus search input after dialog opened to let user type search string directly
		// delay 100ms to avoid focus lost, here dialog close button seems also will get focus
		setTimeout(() => {
			this.focusSearchInput();
		}, 200);
	}

	private focusSearchInput() {
		this.input.nativeElement.focus();
	}

	protected override scrollIntoView(dataItem: TItem) {

	}
}