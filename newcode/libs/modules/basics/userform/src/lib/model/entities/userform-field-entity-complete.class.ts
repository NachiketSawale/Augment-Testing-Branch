/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IFormFieldEntity } from './form-field-entity.interface';

/**
 * Represents the complete object holds all sub-entity modified data.
 */
export class UserformFieldEntityComplete implements CompleteIdentification<IFormFieldEntity> {
	public MainItemId: number = 0;
}