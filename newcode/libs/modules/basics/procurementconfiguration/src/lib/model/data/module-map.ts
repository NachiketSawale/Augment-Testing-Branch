/*
 * Copyright(c) RIB Software GmbH
 */

import { Rubric } from '@libs/basics/shared';

/**
 *
 * Module Map Entity
 */
export interface IModuleMapEntity {
    id: number;
    value: string;
}


export const ModuleMap: IModuleMapEntity[] = [
    {id: Rubric.Requisition, value: 'procurement.requisition'},
    {id: Rubric.RFQs, value: 'procurement.rfq'},
    {id: Rubric.Quotation, value: 'procurement.quote'},
    {id: Rubric.Contract, value: 'procurement.contract'},
    {id: Rubric.PerformanceEntrySheets, value: 'procurement.pes'},
    {id: Rubric.Invoices, value: 'procurement.invoice'},
    {id: Rubric.Package, value: 'procurement.package'},

    {id: Rubric.Bid, value: 'sales.bid'},
    {id: Rubric.Bill, value: 'sales.billing'},
    {id: Rubric.Order, value: 'sales.contract'},
    {id: Rubric.WIP, value: 'sales.wip'}
];

