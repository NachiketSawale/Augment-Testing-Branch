/*
 * Copyright(c) RIB Software GmbH
 */
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcHeaderEntity } from '@libs/procurement/interfaces';
import { PrcCommonItemComplete } from '../procurement-common-item-complete.class';
import { IPrcItemEntity } from './prc-item-entity.interface';

export class ProcurementCommonComplete<T extends IEntityIdentification> implements CompleteIdentification<T>{
	public Id!: number;
	public MainItemId!: number;
	public PrcHeader!: IPrcHeaderEntity;
	public PrcItemToSave!: PrcCommonItemComplete[];
	public PrcItemToDelete!: IPrcItemEntity[];
}