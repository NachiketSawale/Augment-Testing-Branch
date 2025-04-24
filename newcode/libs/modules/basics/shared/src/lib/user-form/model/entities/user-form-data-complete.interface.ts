/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IUserFormDataEntity } from './user-form-data-entity.interface';

/**
 * Represents the complete object that holds the children's data will be saved and deleted.
 */
export interface IUserFormDataComplete extends CompleteIdentification<IUserFormDataEntity> {
	EntitiesCount: number;
	FormDataToDelete: IUserFormDataEntity[];
	FormDataToSave: IUserFormDataEntity[];
	MainItemId: number;
}