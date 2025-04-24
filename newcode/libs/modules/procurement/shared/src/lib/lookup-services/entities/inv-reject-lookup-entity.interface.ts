/*
 * Copyright(c) RIB Software GmbH
 */



export interface IInvRejectLookupEntity{
	Id:number;
	Description:string;
	AmountNet:number;
	AmountNetOc:number;
	Quantity:number;
	QuantityAskedFor:number;
	QuantityConfirmed:number;
	UomFk:number;
	CommentText:string;
	Remark:string;
	TaxCodeFk:number;
	PriceAskedFor:number;
	PriceAskedForOc:number;
	PriceConfirmed:number;
	PriceConfirmedOc:number;
	InvRejectionReasonFk:number;
	InvHeaderFk:number;
	Itemreference:string;
	InvRejectionReason:string;
	Code:string;
	BusinessPartnerFk:number|null;
	ConHeaderFk:number|null;
	ProjectFk:number|null;
	CompanyFk:number;
	DateInvoiced:string|null;
	Reference:string
	DateReceived:string|null;
	AmountNetTotal:number;
	AmountNetTotalOc:number;
}
