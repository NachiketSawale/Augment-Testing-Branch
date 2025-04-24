import { IEntityBase } from '@libs/platform/common';

export interface IPrcCommonExtBidder2contactEntity extends IEntityBase{
	PrcPackage2extbidderFk :number;
	BpdContactFk?:number;
	BpdContactRoleFk?:number;
}