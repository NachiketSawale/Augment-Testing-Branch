/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Available lookup event type
 */
export enum LookupEventType {
	/**
	 * Fired when selected lookup item is changed
	 */
	SelectedItemChanged = 'onSelectedItemChanged',
	/**
	 * Fired when lookup input container is clicked
	 */
	InputGroupClick = 'onInputGroupClick',
	/**
	 * Fired when lookup input initialization is done
	 */
	Initialized = 'onInitialized',
	/**
	 * Fired when selected lookup items are changed, only useful for ui-common-lookup-multiple-input
	 */
	SelectedItemsChanged = 'onSelectedItemsChanged',
}
