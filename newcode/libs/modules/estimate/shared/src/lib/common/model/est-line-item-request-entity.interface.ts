import { IIdentificationData, ISearchPayload } from '@libs/platform/common';

// Define an interface that extends the ISearchPayload interface
// This interface represents a request entity for retrieving line item data
export interface IEstLineItemRequestEntity extends ISearchPayload {
	// Optional property for additional filters
	// Each filter object has a 'Token' (string) and a 'Value' (which can be a number, IIdentificationData, or string)
	// If not provided, the value can be null
	furtherFilters?: { Token: string, Value: number | IIdentificationData | string }[] | null;

	// Optional property to indicate whether to load data based on project favorites
	// Value is a boolean
	setLoadByPrjFavorites?: boolean;

	// Optional property for specifying the order of the results
	// Each order object has a 'Field' (string) and an optional 'Desc' (boolean) indicating ascending or descending order
	// If not provided, the value can be null
	orderBy?: { Field: string, Desc?: boolean }[] | null;
}