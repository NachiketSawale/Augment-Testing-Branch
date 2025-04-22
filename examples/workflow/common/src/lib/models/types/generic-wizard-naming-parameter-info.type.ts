/*
 * Copyright(c) RIB Software GmbH
 */

import { GenericWizardNamingParameterTypeEnum } from '../enum/generic-wizard-naming-parameter-type.enum';

/**
 * Represents the allowed naming parameter information available during execution of generic wizard.
 */
export type GenericWizardNamingParameterInfo = {
	namingParameterInfo: {
		//Project
		projectDescription: string;
		projectCode: string;

		//Package
		packageDescription: { key: number, value: string }[];
		packageCode: { key: number, value: string }[];

		//Requisiton
		requisitionDescription: { key: number, value: string }[];
		requisitionCode: { key: number, value: string }[];

		//Rfq
		rfqDescription: string;
		rfqCode: string;

		//Contract
		contractDescription: string;
		contractCode: string;

		//Quote
		quoteCode: { key: number, value: string }[];
		quoteExternalCode: { key: number, value: string }[];
	},
	allowedNamingParameterTypes: GenericWizardNamingParameterTypeEnum[]
}