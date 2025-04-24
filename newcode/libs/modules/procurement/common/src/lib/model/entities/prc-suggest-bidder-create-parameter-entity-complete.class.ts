/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinessPartnerLookupVEntity } from '@libs/businesspartner/interfaces';
import { Dictionary } from '@libs/platform/common';
/**
 * The common suggest bidder entity interface
 */
export interface IPrcSuggestedBidderCreateParameter {
	MainItemId: number;
	businessPartnerList: BusinessPartnerLookupVEntity[];
	bpMapContactDic: Dictionary<number, number>;
	bpMapSubsidiaryDic: Dictionary<number, number>;
}