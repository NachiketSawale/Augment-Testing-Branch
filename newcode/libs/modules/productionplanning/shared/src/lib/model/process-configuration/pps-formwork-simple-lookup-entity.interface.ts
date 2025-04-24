import { IEntityBase } from '@libs/platform/common';

export interface IPpsFormworkSimpleLookupEntity extends IEntityBase {
	Id: number,
	Code: string,
	Description?: string | null;
}