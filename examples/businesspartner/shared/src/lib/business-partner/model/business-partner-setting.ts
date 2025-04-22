/*
 * Copyright(c) RIB Software GmbH
 */

import { ISearchCharacteristicFilter, ISearchDateOrderedFilter, ISearchEvaluationFilter, ISearchFilter, ISearchGrandTotalFilter, ISearchLocationFilter, ISearchStatusFilter } from './interface/business-partner-search-attribute.interface';
import { CertificateInfo, LocationDistanceParameters } from './business-partner-request';


/**
 * Business Partner search request model
 */
export class BusinessPartnerSetting {

	public SearchText: string = '';
	public PrcStructure: ISearchFilter = {};
	public Location: ISearchLocationFilter = {IsRegionalActive: false};
	public Evaluation: ISearchEvaluationFilter = {};
	public Characteristic: ISearchCharacteristicFilter = {};
	public GrandTotal: ISearchGrandTotalFilter = {};
	public DateOrdered: ISearchDateOrderedFilter = {};
	public Status: ISearchStatusFilter = {};
	public Status2: ISearchFilter = {};
	public HeaderId: number | undefined;//  maybe PrcHeader or rfqHeader(from rfq wizard)
	public showCopyBidder: boolean | undefined;
	public CheckBidderCopy: boolean | undefined;
	public HasSuggestedBidders: boolean | undefined;
	public isEnhanceBidder: boolean | undefined;//isCommonBidder  by angularjs
	public DistanceParameters: LocationDistanceParameters | undefined;
	public Certificate: CertificateInfo | undefined;
}


