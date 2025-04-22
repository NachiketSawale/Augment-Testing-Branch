/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IGroupedListCfg {
	groups: IGroups[];
	module?: {
		_invokeQueue: [];
		_configBlocks: [];
		_runBlocks: [];
		requires: [];
		name: string;
	};
	context: IContext[];
	userInfo: IUserInfo;
	showSelected: boolean;
	selectedId?: number;
}

export interface IReports {
	id: number;
	groupId: number;
	name: string;
	text: string | null;
	filename: string;
	path: string;
	parameters: number;
}

export interface IContext {
	Id: number;
	description$tr$: string;
	description: string;
}

export interface IUserInfo {
	userValid: boolean;
	LogonName: string;
	UserId: number;
	UserName: string;
	Email: string;
	Idp: string;
	IdpName: string;
	IsPasswordChangeRequired: boolean;
	PasswordExpiration: null | string;
	ExplicitAccess: boolean;
	UserDataLanguageId: number;
	UiLanguage: string;
	UiCulture: null | string;
	ExternalProviderUserId: null | string;
	IntegratedAccess: boolean;
}

export interface IGroups {
	id: number;
	name: string;
	visible: boolean;
	icon: string;
	reports: IReports[];
	count: number;
}
