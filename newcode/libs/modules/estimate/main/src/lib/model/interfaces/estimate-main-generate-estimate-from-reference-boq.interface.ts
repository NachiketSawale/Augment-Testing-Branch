/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Generate Estimate From Reference Boq Interface
 */
export interface IGenerateEstimateFrmBoqEntity {
	SearchCriteria: number;
	SourceBoqItems: boolean;
	ExistingEstimate: number;
}