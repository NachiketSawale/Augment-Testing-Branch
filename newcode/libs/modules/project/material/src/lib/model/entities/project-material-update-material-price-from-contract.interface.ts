/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {IBaseMaterialPriceOfQuoteNContrat} from './project-material-update-price-complate.interface';

export interface IUpdateMaterialPriceFromContract extends IBaseMaterialPriceOfQuoteNContrat{

    ContractFk: number;

    ContractDescription: string;

    ConStatusFk: number;

    OrderedDate: unknown;

    DateOrdered: unknown;

    ContractTypeFk: number;

    ConTypeFk: number;

    Address: string;
}