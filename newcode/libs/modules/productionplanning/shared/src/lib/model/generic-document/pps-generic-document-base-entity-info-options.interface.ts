import { IPpsEntityInfoOptions } from '../pps-entity-info-options.interface';
export interface IPpsGenericDocumentBaseEntityInfoOptions<PT extends object> extends IPpsEntityInfoOptions<PT> {
	apiUrl: string,
	endPoint?: string,
	uploadServiceKey?: string, // e.g. 'pps-header', 'eng-task'
}