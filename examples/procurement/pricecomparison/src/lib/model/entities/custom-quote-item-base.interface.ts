/*
 * Copyright(c) RIB Software GmbH
 */

import { IExtendableObject } from './extendable-object.interface';

export interface ICustomQuoteItemBase extends IExtendableObject {
	Id: number;
	QuoteKey: string;
	OwnQuoteKey: string;
	BusinessPartnerId: number;
	QtnVersion: number;
	RfqHeaderId: number;
	ReqHeaderId: number;
	PrcHeaderId: number;
	PrcItemId: number; // TODO-DRIZZLE: To be checked.
	QtnHeaderId: number;
	IsIdealBidder: boolean;
	ExchangeRate: number;
	ConfigurationId?: number | null;
	ProjectId?: number | null;
	RubricCategoryFk?: number | null;
	BillingSchemaFk?: number | null;
	PrcItemEvaluationId?: number;
	ExQtnIsEvaluated?: boolean;
}