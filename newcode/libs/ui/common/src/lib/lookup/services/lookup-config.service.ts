/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import { ILookupConfig, LookupFreeInputModelType } from '../model/interfaces/lookup-options.interface';
import {UiCommonComboPopupViewComponent} from '../components/combo-popup-view/combo-popup-view.component';
import {UiCommonGridPopupViewComponent} from '../components/grid-popup-view/grid-popup-view.component';
import {UiCommonGridDialogViewComponent} from '../components/grid-dialog-view/grid-dialog-view.component';

/**
 * Global lookup configuration service which maintains global configuration of lookup
 */
@Injectable({
	providedIn: 'root',
})
export class LookupConfigService<TItem extends object, TEntity extends object = object> implements ILookupConfig<TItem, TEntity> {
	public uuid = '';

	public idProperty = 'id';
	public valueMember = 'id';
	public displayMember = 'description';

	public isClientSearch = false;
	public isCaseSensitiveSearch = false;
	public isExactSearch = false;
	public autoSearch = true;
	public searchInterval = 800;
	public disablePopupOnSearch = false;

	public autoComplete = true;
	public disableDataCaching = false;
	public showCustomInputContent = false;
	public showEditButton = true;

	public comboComponent = UiCommonComboPopupViewComponent<TItem, TEntity>;
	public gridComponent = UiCommonGridPopupViewComponent<TItem, TEntity>;
	public dialogComponent = UiCommonGridDialogViewComponent<TItem, TEntity>;

	public placeholder = '';
	public clearButtonCss = 'control-icons ico-input-delete';
	public popupButtonCss = 'control-icons ico-down';
	public dialogButtonCss = 'control-icons ico-input-lookup lookup-ico-dialog';

	public clearButtonCaption = 'ui.common.lookup.clear';
	public editButtonCaption = 'ui.common.lookup.edit';

	public freeInputType = LookupFreeInputModelType.Text;
}