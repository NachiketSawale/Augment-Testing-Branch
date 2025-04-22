/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IPrjStockOrderProposalEntity } from './entities/prj-stock-order-proposal-entity.interface';

export class PrjStockOrderProposalComplete implements CompleteIdentification<IPrjStockOrderProposalEntity>{

 /*
  * MainItemId
  */
  public MainItemId?: number | null;

 /*
  * PrjStockOrderProposal
  */
  public PrjStockOrderProposal?: IPrjStockOrderProposalEntity | null;
}
