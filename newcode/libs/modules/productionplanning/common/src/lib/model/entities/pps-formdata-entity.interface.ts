import { IUserFormDataEntity } from '@libs/basics/shared';

export interface IPpsUserFormDataEntity extends IUserFormDataEntity {
	Belonging: number
}

export enum BelongingType {
	parentUnit = 1,
	currentUnit
}