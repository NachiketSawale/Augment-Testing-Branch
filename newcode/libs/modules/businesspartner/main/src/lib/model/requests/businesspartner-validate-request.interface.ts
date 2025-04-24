import {PropertyType} from '@libs/platform/common';

export interface IBusinessPartnerValidateRequest {
	Id: number,
	Value: PropertyType | undefined,
	Model: string
}