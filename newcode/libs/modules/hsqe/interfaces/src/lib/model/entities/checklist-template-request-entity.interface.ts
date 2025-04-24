import { IIdentificationData, ISearchPayload } from '@libs/platform/common';

// Define an interface that extends the ISearchPayload interface
// This interface represents a request entity for retrieving checklist template data
export interface ICheckListTemplateRequestEntity extends ISearchPayload {
	// Optional property for additional filters
	// Each filter object has a 'Token' (string) and a 'Value' (which can be a number, IIdentificationData, or string)
	// If not provided, the value can be null
	furtherFilters?: { Token: string, Value: number | IIdentificationData | string }[] | null;
}