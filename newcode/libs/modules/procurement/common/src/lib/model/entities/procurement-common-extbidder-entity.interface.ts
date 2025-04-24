/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProcurementCommonExtBidderEntity extends IEntityBase,IEntityIdentification{
	PrcPackageFk:number;
	BpdStatusFk:number;
	BusinessPartnerFk?:number;
	ContactFk?:number;
	SubsidiaryFk?:number;
	BpName1:string;
	BpName2:string;
	Street:string;
	City:string;
	Zipcode:string;
	Email:string;
	CountryFk?:number;
	Telephone:string;
	RoleFk:number;
	UserDefined1:string;
	UserDefined2:string;
	UserDefined3:string;
	UserDefined4:string;
	UserDefined5:string;
	CommentText:string;
	Remark:string;
}