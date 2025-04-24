/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyTransactionEntity } from '@libs/basics/interfaces';
import { IEntityBase } from '@libs/platform/common';

export interface IPrcCommonAccrualEntity extends IEntityBase {
    
    /*
     * Id
     */
    Id?: number | null;
    
    /*
     * PesHeaderFk
     */
    PesHeaderFk: number | null;
    
    /*
     * DateEffective
     */
    DateEffective: Date | null;
    
    /*
     * CompanyTransactionFk
     */
    CompanyTransactionFk: number | null;

    /*
     * CompanyTransaction
     */
    CompanyTransaction: ICompanyTransactionEntity;

}    
