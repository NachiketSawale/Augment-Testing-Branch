/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IInvInvoiceImportEntity } from './entities';

export class InvImportComplete implements CompleteIdentification<IInvInvoiceImportEntity>{
    /*
     * MainItemId
     */
    public MainItemId?: number | null;
}