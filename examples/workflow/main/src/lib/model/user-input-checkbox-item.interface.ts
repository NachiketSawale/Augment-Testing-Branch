/*
 * Copyright(c) RIB Software GmbH
 */


/**
 * checkbox options for user-input-action-editor.
 */
export interface IUserInputCheckboxItem {
	[key: string]: boolean;
	IsPopUp: boolean;
	IsNotification: boolean;
	EvaluateProxy: boolean;
	DisableRefresh: boolean;
	AllowReassign: boolean;
}
