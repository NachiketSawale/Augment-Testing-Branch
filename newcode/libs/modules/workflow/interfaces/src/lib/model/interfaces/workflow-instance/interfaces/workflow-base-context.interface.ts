/*
 * Copyright(c) RIB Software GmbH
 */

import { IException } from '@libs/platform/common';
import { TValue } from '../workflow-custom-types.type';


/**
 * IBaseContext represents the base context data common for all debug actions.
 */
export interface IBaseContext {
	ClientId: number;
	PermissionClientId: number;
	PermissionRoleId: number;
	DataLanguageId: number;
	Culture: string;
	UserId: number;
	SignedInClientId: number;
	StartDate: string;
	CompanyId: number;
	OwnerId: number | null;
	KeyUserId: number | null;
	TemplateId: number;
	UseTextModuleTranslation: boolean;
	VersionId: number;
	Exception: IException;
}

/**
 * a custom union type for storing debug context of base as well as dynamic properties.
 */
export type DebugContext = IBaseContext & Record<string, TValue>;

/**
 * DebugActionResponse stores the response of each debug action from action/debug API
 */
export type DebugActionResponse = {
	context: DebugContext;
	result: Record<string, TValue>;
};