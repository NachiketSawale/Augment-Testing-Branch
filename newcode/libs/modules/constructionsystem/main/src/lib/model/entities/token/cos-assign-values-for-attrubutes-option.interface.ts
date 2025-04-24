import { InjectionToken } from '@angular/core';

export const COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN = new InjectionToken<ICosAssignValuesForAttrubutesOption>('COS_ASSIGN_VALUES_FOR_ATTRUBUTES_OPTION_TOKEN');

export interface IValues2Assign {
	id: number,
	PropertyKeyFk: string,
	Delete: boolean,
	Value: string,
	UoMFk: number
}

export interface ICosAssignValuesForAttrubutesOption {
	Values: IValues2Assign[],
	OverwriteValues: true,
	ObjectIds: number[],
}