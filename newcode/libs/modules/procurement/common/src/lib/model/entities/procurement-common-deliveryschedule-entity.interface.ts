/*
 * Copyright(c) RIB Software GmbH
 */
import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IProcurementCommonDeliveryScheduleEntity extends IEntityBase,IEntityIdentification{
	AddressDto?:IAddressEntity;
	BasAddressFk?:number|null;
	CommentText:string;
	DateRequired:Date;
	DeliverdateConfirm?:Date|null;
	Description:IDescriptionInfo;
	NewDateRequired?:Date|null;
	PrcItemFk:number;
	PrcItemstatusFk:number;
	Quantity:number;
	QuantityConfirm:number;
	RunningNumber:number;
	TimeRequired?:Date|null;
	openQuantity?:number|null;
	quantityScheduled?:number|null;
	totalQuantity?:number|null;
}