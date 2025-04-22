/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IWipValidationEntity } from './entities/wip-validation-entity.interface';

export class SalesWipValidationComplete implements CompleteIdentification<IWipValidationEntity> {

	public Id: number = 0;

	public ValidationEntityToSave: IWipValidationEntity[] | null = [];

}
