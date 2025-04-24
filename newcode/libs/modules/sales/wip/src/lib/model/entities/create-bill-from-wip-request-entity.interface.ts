import { IEntityBase } from '@libs/platform/common';
import { IWipHeaderEntity } from './wip-header-entity.interface';

export interface ICreateBillFromWipRequestEntityGenerated extends IEntityBase {
	TypeFk : number;
	RubricCategoryFk : number;
	PreviousBillFk? :number;
	ConfigurationId? : number;
	BillNo: string;
	Description: string;
	BillTo: number;
	wipIds:[IWipHeaderEntity];
}