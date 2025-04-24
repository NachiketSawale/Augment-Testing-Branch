// TODO: remove?
//import { Action } from './action';

export class Platform {
	public static data = {
		replaceImageToSvg: Platform.replaceImageToSvg,
		// TODO: remove?
		//Action: Action,
		ActionGroup: {
			navBarActions: 'navBar',
			defaultOptionsAction: 'defaultOptions',
			moduleOptionsAction: 'moduleOptions',
		},
	};
	private key!: string;
	// TODO: remove?
	//finaldata: any;

	// TODO: The $tr$ pattern should not occur anymore - use Translatable
	private description!: string;
	private description$tr$!: string;
	private visible!: boolean;
	private disabled!: boolean;
	private iconCSS!: string;
	private group!: string;
	// TODO: remove?
	//sortOrder: any;
	private permission?: string;
	private ActionGroup = {
		navBarActions: 'navBar',
		defaultOptionsAction: 'defaultOptions',
		moduleOptionsAction: 'moduleOptions',
	};
	private Action(actionKey: string, actionGroup: string, actionTranslateString: string, actionIconCSS: string, isVisible: boolean, isDisabled: boolean, actionSortOrder: number) {
		return {
			key: actionKey || 'nokey',
			description: actionTranslateString || '',
			description$tr$: actionTranslateString || '',
			visible: isVisible !== undefined ? isVisible : true,
			disabled: isDisabled !== undefined ? isDisabled : false,
			iconCSS: actionIconCSS || '',
			group: actionGroup,
			sortOrder: actionSortOrder !== undefined ? actionSortOrder : 999,
		};
	}
	private getMenuListItems() {
		return {
			caption: this.description,
			key: this.key,
			type: 'item',
			cssClass: this.iconCSS,

			visible: this.visible,
			disabled: this.disabled,
			permission: this.permission,
		};
	}
	public static replaceImageToSvg() {}
}
