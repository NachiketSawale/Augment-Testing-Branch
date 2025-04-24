/*
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase, IEntityIdentification} from '@libs/platform/common';

/**
 * The common suggest bidder entity interface
 */
export interface IPrcSuggestedBidderEntity extends IEntityBase, IEntityIdentification {
	PrcHeaderFk: number;
	BusinessPartnerFk?: number;
	ContactFk?: number;
	SubsidiaryFk?: number;
	BpName1?: string;
	BpName2?: string;
	Street?: string;
	City?: string;
	Zipcode?: string;
	Email?: string;
	CountryFk?: number;
	Telephone?: string;
	UserDefined1?: string;
	UserDefined2?: string;
	UserDefined3?: string;
	UserDefined4?: string;
	UserDefined5?: string;
	CommentText?: string;
	Remark?: string;
	SupplierFk?: number;
	IsHideBpNavWhenNull?: boolean;
}