/*
 * Copyright(c) RIB Software GmbH
 */


import { IReportEntity } from '@libs/basics/reporting';
import { GenericWizardReportParameter } from './generic-wizard-report-parameter-entity.interface';
import { ShortParameterType } from './generic-wizard-short-parameter.type';
import { Included } from './generic-wizard-included.type';

/**
 * Reports used in the generic wizard.
 */
export type IGenericWizardReportEntity = IReportEntity & Included & {
	/**
	 * Indicates if these reports are used for the cover letter.
	 */
	IsCoverLetter: boolean;

	/**
	 * Indicates if the selection of the report is mandatory.
	 */
	IsMandatory: boolean;

	/**
	 * Indicates if the report should be selected by default.
	 */
	IsDefault: boolean;

	/**
	 * Report parameters that should be available to the user for editing.
	 */
	parameters?: GenericWizardReportParameter[];

	/**
	 * Report parameters that have a default value and are hidden in the UI.
	 */
	hiddenParameters?: GenericWizardReportParameter[];

	/**
	 * Final list of parameters.
	 */
	Parameters?: ShortParameterType[];
}