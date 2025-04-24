/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {IBaseMaterialPriceOfQuoteNContrat} from './project-material-update-price-complate.interface';

export interface IUpdateMaterialPriceFromQuote extends IBaseMaterialPriceOfQuoteNContrat {


    QuoteFk: number;

    QuoteDescription: string;

    Version: string;

    QuotedDate: unknown;

    QuoteVersion: string;
}

export interface IUpdateMaterialPriceFromQuoteForm{
    ProjectId: number;
    StatusFk: number;
}