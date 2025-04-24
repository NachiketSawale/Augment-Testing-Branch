/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { ICompositeBaseEntity } from '../entities/composite-base-entity.interface';

export class CompositeCompleteBaseEntity<T extends ICompositeBaseEntity<T>> implements CompleteIdentification<T> {
	public MainItemId: number = 0;
	public Id: number = 0;
}