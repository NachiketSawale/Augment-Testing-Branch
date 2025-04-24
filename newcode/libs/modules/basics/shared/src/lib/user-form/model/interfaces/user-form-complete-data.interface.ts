/*
 * Copyright(c) RIB Software GmbH
 */

import { IUserFormData } from './user-form-data.interface';

export interface IUserFormCompleteData {
	FormId: number;

	FormDataId?: number;

	ContextFk?: number;

	UserFormData: Array<IUserFormData>;

	IsReadonly: boolean;

	Description: string;

	WorkflowTemplateFk?: number;

	RubricFk?: number;

	IntersectionId?: number;
}