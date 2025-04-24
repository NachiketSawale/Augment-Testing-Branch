/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * simple qto detail: to Reduce the size of the transfer
 */
export interface IQtoDetailSimpleInterface {
    Id: number;
    WipHeaderFk: number;
    BilHeaderFk: number;
    PesHeaderFk: number;
    QtoHeaderFk: number;
    PageNumber: number;
    LineReference: string;
    LineIndex: number;
    QtoDetailReference: string;
    Version: number;
}