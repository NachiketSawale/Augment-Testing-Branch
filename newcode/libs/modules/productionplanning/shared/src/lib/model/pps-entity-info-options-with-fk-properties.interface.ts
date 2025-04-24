import { IPpsEntityInfoOptions } from './pps-entity-info-options.interface';

export interface IPpsEntityInfoOptionsWithFkProperties<PT extends object> extends IPpsEntityInfoOptions<PT> {
	endPoint?: string,
	foreignKey: string,

}