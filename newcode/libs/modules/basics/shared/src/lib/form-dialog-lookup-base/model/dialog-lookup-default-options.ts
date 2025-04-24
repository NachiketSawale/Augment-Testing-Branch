/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CustomDialogLookupOptions } from '../model/dialog-lookup.interface';
import { BasicsSharedPopupDialogBodyComponent } from '../components/popup-dialog-body/popup-dialog-body.component';

/**
 * Create default custom options.
 */
export function defaultCustomDialogLookupOptions<TItem extends object, TEntity extends object>(): CustomDialogLookupOptions<TItem, TEntity> {
	return {
		/**
		 *
		 */
		uuid: '',

		/**
		 *
		 */
		valueMember: 'Id',

		/**
		 *
		 */
		displayMember: 'Description',

		/**
		 *
		 */
		descriptionMember: 'Description',

		/**
		 *
		 */
		buttons: [],

		/**
		 *
		 */
		showClearButton: true,
		/**
		 *
		 */
		showEditButton: true,

		/**
		 *
		 */
		clearButtonCss: 'control-icons ico-input-delete',

		/**
		 *
		 */
		editButtonCss: 'control-icons ico-input-lookup lookup-ico-dialog',

		/**
		 *
		 */
		searchButtonCss: 'control-icons ico-indicator-search',

		/**
		 *
		 */
		popupButtonCss: 'control-icons ico-down',

		/**
		 *
		 */
		disabled: false,

		/**
		 *
		 */
		disableButton: false,

		/**
		 *
		 */
		popupOptions: {
			gridView: BasicsSharedPopupDialogBodyComponent,
			options: {
				resizable: true,
				showFooter: true,
				hasDefaultWidth: true
			}
		},

		/**
		 *
		 */
		searchOptions: {
			form: {
				title: {
					key: 'cloud.common.advancedCriteria',
					text: 'Advanced Criteria'
				},
			}
		}
	};
}