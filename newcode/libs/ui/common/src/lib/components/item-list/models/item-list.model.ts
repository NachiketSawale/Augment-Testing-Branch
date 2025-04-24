/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ITreeItems {
	id: string | number;
	displayName: string;
	Description: string;
	cssClass: string;
	redirect?: string;
	headerClickKey?: string;
	disabled?: boolean;
	type: number;
	imgUrl?: string;
	expanded?: boolean;
	tabs?: ITabs;
	hasChildren?: boolean;
}

export interface ITabs {
	items: Array<IItem>;
}

export interface IItem {
	Id: number;
	BasModuleFk: number;
	Description: string;
	Sorting: number;
	Isvisible: boolean;
	InsertedAt: string;
	InsertedBy: number;
	Version: number;
	Visibility: number;
	$$hashKey: string;
}
