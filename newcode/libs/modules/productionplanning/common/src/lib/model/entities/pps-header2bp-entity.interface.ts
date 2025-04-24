import {IEntityBase} from '@libs/platform/common';

export interface IPpsHeader2BpEntity extends IEntityBase {
	Id: number;
	HeaderFk: number;
	BusinessPartnerFk: number;
	RoleFk: number;
	SubsidiaryFk: number;
	Remark: string;
	IsLive: boolean;
}