/*
 * Copyright(c) RIB Software GmbH
 */

import {ProviderToken, StaticProvider, Type} from '@angular/core';
import {AsyncCtxFactoryEnabled, IIdentificationData, Translatable} from '@libs/platform/common';
import {IPopupOptions} from '../../../popup';
import {ILookupClientSideFilter, ILookupClientSideAsyncFilter} from './lookup-client-side-filter.interface';
import {ILookupServerSideFilter} from './lookup-server-side-filter.interface';
import {IUiCommonLookupBtn} from './lookup-btn.interface';
import {ILookupEvent, ILookupMultiSelectEvent} from './lookup-event.interface';
import {ILookupReadonlyDataService} from './lookup-readonly-data-service.interface';
import {ICustomDialog, IDialogOptions} from '../../../dialogs/base';
import {ILookupAlert} from './lookup-alert.interface';
import {ILookupDialogView, ILookupPopupView, ILookupViewResult} from './lookup-view.interface';
import {IGridConfiguration, IGridTreeConfiguration} from '../../../grid';
import { ILookupContext } from './lookup-context.interface';
import { ILookupDialogSearchForm } from './lookup-dialog-search-form.interface';
import { ILookupImageSelector } from './lookup-image-selector.interface';
import { LookupEventType } from '../enums/lookup-event-type.enum';
import { INumberInputConfig, ITextInputTextConfig } from '../../../input-config';

/**
 * Lookup value type
 */
export type LookupInputType = number | string | IIdentificationData | null | undefined;

/**
 * Lookup input model type enum
 */
export enum LookupInputModelType {
	/**
	 * number value type, bind value property
	 */
	Number = 0,
	/**
	 * composite object type, bind compositeValue property
	 */
	IdentificationData = 1
}

/**
 * Supported data type for lookup free input
 */
export type LookupFreeInputType = string | number;

/**
 * Supported lookup free input model type
 */
export enum LookupFreeInputModelType {
	/**
	 * Input type is text with lookup dropdown, default value
	 */
	Text = 'text',
	/**
	 * Input type is number with lookup dropdown
	 */
	Number = 'number'
}

/**
 * Lookup options
 */
export interface ILookupOptions<TItem extends object, TEntity extends object> {
	/**
	 * uuid to identify the lookup
	 */
	uuid?: string;
	/**
	 * property name, specify identifier for data items, default to value member property.
	 */
	idProperty?: string;
	/**
	 * property name, get value from this property for applying edit value.
	 */
	valueMember?: string;
	/**
	 * property name, get value from this property for displaying dropdown.
	 */
	displayMember?: string;
	/**
	 * lookup input type, default is number value
	 */
	inputType?: LookupInputModelType;
	/**
	 * deprecated, The pkey1 property from entity, use inputType instead
	 */
	pkey1Property?: string;
	/**
	 * deprecated, The pkey2 property from entity, use inputType instead
	 */
	pkey2Property?: string;
	/**
	 * deprecated, The pkey3 property from entity, use inputType instead
	 */
	pkey3Property?: string;
	/**
	 * Client side filter
	 */
	clientSideFilter?: ILookupClientSideFilter<TItem, TEntity>;
	/**
	 * Client side filter
	 */
	clientSideAsyncFilter?: ILookupClientSideAsyncFilter<TItem, TEntity>;
	/**
	 * Server side filter
	 */
	serverSideFilter?: ILookupServerSideFilter<TItem, TEntity>;
	/**
	 * Client side filter
	 */
	clientSideFilterToken?: ProviderToken<ILookupClientSideFilter<TItem, TEntity>>
	/**
	 * Client side filter
	 */
	clientSideAsyncFilterToken?: ProviderToken<ILookupClientSideAsyncFilter<TItem, TEntity>>;
	/**
	 * Server side filter
	 */
	serverSideFilterToken?: ProviderToken<ILookupServerSideFilter<TItem, TEntity>>;
	/**
	 * string array, properties to search when input change
	 */
	inputSearchMembers?: string[];
	/**
	 * the interval time for input search, in millisecond
	 */
	searchInterval?: number;
	/**
	 * enable searching synchronously in case fast input in grid
	 */
	searchSync?: boolean;
	/**
	 * don't show popup window while input search
	 */
	disablePopupOnSearch?: boolean;
	/**
	 * boolean, is sensitive to upper or lower case when searching.
	 */
	isCaseSensitiveSearch?: boolean;
	/**
	 * boolean, search lookup items which is the same as search value
	 */
	isExactSearch?: boolean;
	/**
	 * boolean, complete edit value automatically.
	 */
	autoComplete?: boolean;
	/**
	 * boolean, search data items according to edit value automatically.
	 */
	autoSearch?: boolean;
	/**
	 * boolean, enable client side search.
	 */
	isClientSearch?: boolean;
	/**
	 * function, used to build search string for search dialog, it is valid only in search dialog.
	 * @param searchText
	 */
	buildSearchString?: (searchText: string) => string;
	/**
	 * simple drop down view
	 */
	comboComponent?: Type<ILookupPopupView<TItem>>,
	/**
	 * grid drop down view
	 */
	gridComponent?: Type<ILookupPopupView<TItem>>,
	/**
	 * grid dialog view
	 */
	dialogComponent?: Type<ILookupDialogView<TItem>>,
	/**
	 * Custom providers for view component
	 */
	viewProviders?: StaticProvider[]
	/**
	 * popup options
	 */
	popupOptions?: Partial<IPopupOptions>;
	/**
	 * dialog options
	 */
	dialogOptions?: Partial<IDialogOptions<ICustomDialog<ILookupViewResult<TItem>, ILookupDialogView<TItem>>>> & ILookupDialogOptions;
	/**
	 * grid configuration
	 */
	gridConfig?: AsyncCtxFactoryEnabled<IGridConfiguration<TItem>>;
	/**
	 * boolean, give the custom lookup also a chance to disable caching....
	 */
	disableDataCaching?: boolean;
	/**
	 * boolean, show custom input content.
	 */
	showCustomInputContent?: boolean;
	/**
	 * place holder
	 */
	placeholder?: Translatable,
	/**
	 * Display content formatter
	 */
	formatter?: {
		/**
		 * if showCustomInputContent is false, it should return plain string, don't support html string.
		 * if showCustomInputContent is true, it can return html string.
		 * @param dataItem
		 * @param context
		 */
		format(dataItem: TItem, context: ILookupContext<TItem, TEntity>): string;
	}

	/**
	 * object array
	 * show extra buttons in edit box for special command
	 * button object properties include:
	 * @caption: string
	 * @execute: function
	 * @canExecute: function
	 * @img: string, background image url
	 */
	buttons?: IUiCommonLookupBtn<TItem, TEntity>[],

	// object array same as buttons, but it's not control by readonly property.
	//extButtons: [],

	/**
	 * boolean, read only.
	 */
	readonly?: boolean,
	/**
	 * boolean, disable input and button.
	 */
	disabled?: boolean,
	/**
	 * boolean, disable user input, only select value from drop down window.
	 */
	disableInput?: boolean,
	/**
	 * boolean, disable button.
	 */
	disableButton?: boolean,
	/**
	 * boolean, whether show clear button or not.
	 */
	showClearButton?: boolean,
	/**
	 * boolean, whether show edit button or not.
	 */
	showEditButton?: boolean,
	/**
	 * object or angular service name, an object like { select: function(item,entity){ ... } }, provide image urls.
	 */
	imageSelector?: ILookupImageSelector<TItem, TEntity>,
	/**
	 * object array
	 * event listeners, each lister should be an object as { name: '', handler: null },
	 * @name: value one of 'onEditValueChanged'
	 * @handler: a function.
	 */
	events?: {
		name: string | LookupEventType,
		handler: (e: ILookupEvent<TItem, TEntity> | ILookupMultiSelectEvent<TItem, TEntity>) => void
	}[],
	/**
	 * check if data item selectable before apply it
	 * @param item
	 * @param context
	 */
	selectableCallback?: (item: TItem, context: ILookupContext<TItem, TEntity>) => boolean,
	/**
	 * Css class for clear button
	 */
	clearButtonCss?: string;
	/**
	 * Caption for clear button
	 */
	clearButtonCaption?: Translatable;
	/**
	 * Css class for edit button
	 */
	editButtonCss?: string;
	/**
	 * Caption for edit button
	 */
	editButtonCaption?: Translatable;
	/**
	 * Default css class for edit button in popup
	 */
	popupButtonCss?: string;
	/**
	 * Default css class for edit button in dialog
	 */
	dialogButtonCss?: string;
	/**
	 * Data service
	 */
	dataService?: ILookupReadonlyDataService<TItem, TEntity>;
	/**
	 * Data service provider token
	 */
	dataServiceToken?: ProviderToken<ILookupReadonlyDataService<TItem, TEntity>>;
	/**
	 * Show description column on the right of lookup input
	 */
	showDescription?: boolean;
	/**
	 * Description member of lookup entity
	 */
	descriptionMember?: string;
	/**
	 * Description members of lookup entity, will be displayed side by side
	 */
	descriptionMembers?: string[];
	/**
	 * show grid view
	 */
	showGrid?: boolean;
	/**
	 * show dialog view
	 */
	showDialog?: boolean;
	/**
	 * Can list all entities with getList method
	 */
	canListAll?: boolean;
	/**
	 * How to combine lookup config from different level, use extend strategy by default, enable merge strategy here
	 */
	mergeConfig?: boolean;
	/**
	 * Whether translate display member field
	 */
	translateDisplayMember?: boolean;

	/**
	 * Lookup tree data configuration
	 */
	treeConfig?: ILookupTreeConfig<TItem>;

	/**
	 * The search form config in dialog-based lookup.
	 */
	dialogSearchForm?: AsyncCtxFactoryEnabled<ILookupDialogSearchForm<TEntity>>;

	/**
	 * property name, get free value from this property for applying in lookup free input.
	 */
	freeValueMember?: string;

	/**
	 * Lookup free input data type
	 */
	freeInputType?: LookupFreeInputModelType;

	/**
	 * Lookup input config object
	 */
	inputConfig?: ITextInputTextConfig | INumberInputConfig;
}

/**
 * Lookup config interface
 */
export interface ILookupConfig<TItem extends object, TEntity extends object = object> extends ILookupOptions<TItem, TEntity> {
	/**
	 * uuid, required
	 */
	uuid: string;
	/**
	 * value member, required
	 */
	valueMember: string;
	/**
	 * display member, required
	 */
	displayMember: string;
}

/**
 * Additional dialog options for lookup
 */
export interface ILookupDialogOptions {
	/**
	 * Alerts under the grid in dialog
	 */
	alerts?: ILookupAlert[],
	/**
	 * Custom providers for view component
	 */
	providers?: StaticProvider[]
}

/**
 * Lookup tree data configuration
 */
export type ILookupTreeConfig<TItem extends object> = {
	/**
	 * Parent foreign key field in lookup entity
	 */
	parentMember: keyof TItem;

	/**
	 * Child field in lookup entity
	 */
	childMember?: keyof TItem;
} & Partial<IGridTreeConfiguration<TItem>>;