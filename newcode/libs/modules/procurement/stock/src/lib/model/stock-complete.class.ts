/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { PrjStockOrderProposalComplete } from './prj-stock-order-proposal-complete.class';

import { CompleteIdentification } from '@libs/platform/common';
import { IStockHeaderVEntity } from './entities/stock-header-ventity.interface';
import { StockTotalComplete } from './entities/stock-total-complete';

export class StockComplete implements CompleteIdentification<IStockHeaderVEntity>{

 /*
  * CalculateErrorMesssage
  */
  public CalculateErrorMesssage?: string | null = '' ;

 /*
  * PrjStockOrderProposalToSave
  */
  public PrjStockOrderProposalToSave?: PrjStockOrderProposalComplete[] | null = [];

 /*
  * StockHeaderV
  */
  public StockHeaderV?: IStockHeaderVEntity | null;

 /*
  * StockTotalVToSave
  */
  public StockTotalVToSave?: StockTotalComplete[] | null;
}
