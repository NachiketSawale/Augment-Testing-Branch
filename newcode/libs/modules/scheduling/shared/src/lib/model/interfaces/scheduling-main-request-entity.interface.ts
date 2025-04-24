import { IIdentificationData, ISearchPayload } from '@libs/platform/common';

export interface ISchedulingActivityRequestEntity extends ISearchPayload {
	furtherFilters?: { Token: string, Value: number | IIdentificationData | string }[] | null;
	projectContextId: number | null;
	pKeys?: number[] | IIdentificationData[];
}