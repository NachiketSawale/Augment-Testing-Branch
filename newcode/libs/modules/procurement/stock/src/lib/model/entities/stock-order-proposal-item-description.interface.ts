/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IStockOrderProposalItemDescriptionGenerated } from './stock-order-proposal-item-description-generated.interface';

export interface IStockOrderProposalItemDescription extends IStockOrderProposalItemDescriptionGenerated {
	Description: string;
	IsSuffixes: boolean;
	MaterialDescription: string;
}
