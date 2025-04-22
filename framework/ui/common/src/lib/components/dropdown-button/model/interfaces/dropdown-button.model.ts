/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export interface IDropDownButtonData {
	cssClass: string;
	showSVGTag: boolean;
	svgSprite: string;
	svgImage: string;
	svgCssClass: string;
	list: IDropDownButtonList;
	disabled?: boolean;
}

export interface IItems {
	id: string;
	captionString: string;
	type: string;
	cssClass: string;
	caption?: string;
	disabled?: boolean | null;
	isDisplayed?: boolean;
	svgSprite?: string;
	svgImage?: string;
	showSVGTag?: boolean;
	fn?: any;
}

export interface IDropDownButtonList {
	cssClass: string;
	items: Array<IItems>;
}
export interface IStatus {
	isOpen: boolean;
}

export interface IDropDownButton {
	dropDownButton: IDropDownButtonData;
	status: IStatus;
	disabled: boolean;
	toggleDropDown(event: Event): void;
	modal(id: string): void;
	closeDropDown(): void;
}
