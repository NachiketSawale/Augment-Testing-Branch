/*
 * Copyright(c) RIB Software GmbH
 */
import { IPaymentTermEntity } from './payment-term-entity.interface';
import { CompleteIdentification } from '@libs/platform/common';

export interface IPaymentTermComplete extends CompleteIdentification<IPaymentTermEntity> {

	Payment: IPaymentTermEntity | null;
}
