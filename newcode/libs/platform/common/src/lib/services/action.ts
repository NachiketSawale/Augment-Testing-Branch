//import * as _ from 'lodash';
//import { Platform } from './platform';

// TODO: remove?
/*
export class Action {
	key: any;
	description: any;
	description$tr$: any;
	visible: any;
	disabled: any;
	fn: any;
	iconCSS: any;
	group: any;
	sortOrder: any;
	permission: any;
	constructor(actionKey?: any, actionGroup?: any, actionTranslateString?: any, actionIconCSS?: any, isVisible?: any, isDisabled?: any, actionSortOrder?: any, actionFunction?: any, actionPermission?: any) {
		// jshint ignore:line
		this.key = actionKey || 'nokey';
		this.description = actionTranslateString || '';
		this.description$tr$ = actionTranslateString || '';
		this.visible = isVisible !== undefined ? isVisible : true;
		this.disabled = isDisabled !== undefined ? isDisabled : false;
		this.fn = actionFunction || _.noop;
		this.iconCSS = actionIconCSS || '';
		this.group = actionGroup;
		this.sortOrder = actionSortOrder !== undefined ? actionSortOrder : 999;
		this.permission = actionPermission;
		// this.sync()
		//this.clone();
		//this.getMenuListItem();
		// var data: any = {
		//     'key': actionKey || 'nokey',
		//     'description': actionTranslateString || '',
		//     'description$tr$': actionTranslateString || '',
		//     'visible': isVisible !== undefined ? isVisible : true,
		//     'disabled': isDisabled !== undefined ? isDisabled : false,
		//     'fn': actionFunction || _.noop,
		//     'iconCSS': actionIconCSS || '',
		//     'group': actionGroup,
		//     'sortOrder': actionSortOrder !== undefined ? actionSortOrder : 999,
		//     'permission': actionPermission,
		// }
	}
	sync(action: any) {
		this.key = action.key;
		this.description = action.description || '';
		this.description$tr$ = action.description$tr$ || '';
		this.visible = action.visible !== undefined ? action.visible : true;
		this.disabled = action.disabled || false;
		this.fn = action.fn || _.noop;
		this.iconCSS = action.iconCSS || '';
		this.group = action.group || Platform.data.ActionGroup.navBarActions;
		this.sortOrder = action.sortOrder !== undefined ? action : 9999;
		this.permission = action.permission;

		return this;
	}

	clone() {
		return new Action(this.key, this.group, this.description, this.iconCSS, this.visible, this.disabled, this.sortOrder, this.fn, this.permission);
	}

	getMenuListItem() {
		return {
			caption: this.description,
			key: this.key,
			type: 'item',
			cssClass: this.iconCSS,
			fn: this.fn,
			visible: this.visible,
			disabled: this.disabled,
			permission: this.permission,
		};
	}
}*/
