/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

/**
 * User from data intersection entity.
 */
export interface IUserFormDataIntersection extends IEntityBase, IEntityIdentification {
	FormFk?: number;
	ContextFk: number;
	FormDataFk: number;
	Code?: string;
	Comment?: string;
	DescriptionInfo: IDescriptionInfo;
}

/**
 * User form data entity.
 */
export interface IUserFormDataEntity extends IEntityBase, IEntityIdentification {
	FormFk: number;
	RubricFk: number;
	IsReadonly: boolean;
	FormDataStatusFk?: number;
	Description?: IDescriptionInfo;
	FormDataIntersection: IUserFormDataIntersection;
}
