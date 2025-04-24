/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */




import { ICompanyEntity } from './company-entity.interface';

export interface ICompanyValidateEntity {

	Company?: ICompanyEntity | null;
	Field2Validate?: number | null;
	Model?: string | null;
	NewIntValue?: number | null;
	ValidationErrorMessage?: string | null;
	ValidationResult?: boolean | null;
}
