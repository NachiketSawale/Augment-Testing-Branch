import { IPrcItemEntity } from '@libs/procurement/common';

export interface IReqItemEntity extends IPrcItemEntity {
	IsChecked: boolean
	BpdContactFk: number;
}
