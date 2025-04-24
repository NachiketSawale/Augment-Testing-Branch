/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';
import { IQtnBillingSchemaRowEntity } from './qtn-billing-schema-row-entity.interface';
import { IEvaluationEntity } from '@libs/businesspartner/interfaces';

export interface ICustomCompareColumnEntity {
	Id: string;
	CompareColumnFk: string;
	RfqHeaderId: number;
	QuoteHeaderId: number;
	QtnHeaderFk: number;
	BusinessPartnerId: number;
	BusinessPartnerFk: number;
	QuoteVersion: number;
	Description: string;
	EvaluationResult: number;
	BillingSchemaList: IQtnBillingSchemaRowEntity[];
	EvaluationList: IEvaluationEntity[];
	ProjectId?: number;
	CurrencyId?: number;
	IsHighlightChanges: boolean;
	IsDeviationRef: boolean;
	IsIdealBidder: boolean;
	IsCountInTarget: boolean;
	BackgroundColor?: number;
	Children?: ICustomCompareColumnEntity[];
	Visible?: boolean;
	PrcItemEvaluationId?: number;
	ApplyReqChangesToQuote?: boolean;
	DescriptionInfo: IDescriptionInfo;

	QuoteKey?: string;
	QuoteCode?: string;
	Width?: number | null;
	GroupSequence?: number | null;
}