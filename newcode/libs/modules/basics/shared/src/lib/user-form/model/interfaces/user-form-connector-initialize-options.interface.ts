/*
 * Copyright(c) RIB Software GmbH
 */

import { UserFormDisplayMode } from './user-form-display-mode.enum';

export interface IUserFormConnectorInitializeOptions extends IUserFormDisplayOptions {
	preview?: boolean;
	userInfo?: { UserId: string };
	companyInfo?: { id: string; companyName: string; }
}

/**
 *
 */
export interface IUserFormDisplayOptions {
	getDataSource?: () => {
		[key: string]: unknown
	};
	formId: number;
	formDataId?: number;
	contextId?: number;
	context1Id?: number;
	tempContextId?: number;
	fromModule?: number;
	rubricFk?: number;
	intersectionId?: number;
	editable?: boolean;
	isReadonly?: boolean;
	modal?: boolean;
	description?: string;
	displayMode: UserFormDisplayMode;
	iframe?: HTMLIFrameElement;
	container?: HTMLDivElement;
	initialData?: unknown;
}