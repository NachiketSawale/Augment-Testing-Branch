/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvoiceAccrualEntity } from './entities/invoice-accrual-entity.interface';

export class InvAccrualComplete implements CompleteIdentification<IInvoiceAccrualEntity>{
    /*
     * MainItemId
     */
    public MainItemId?: number | null;

    public InvoiceAccrualEntity? : IInvoiceAccrualEntity |null;
}