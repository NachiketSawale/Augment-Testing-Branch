import { IEntityBase } from '@libs/platform/common';

export interface IPpsProcessSimpleLookupEntity extends IEntityBase {
	Id: number,
	Code: string,
	Description?: string | null;
}