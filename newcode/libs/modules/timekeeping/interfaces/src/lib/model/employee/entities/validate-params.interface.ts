/*
 * Copyright(c) RIB Software GmbH
 */

import { IValidateParamsGenerated } from './validate-params-generated.interface';
import { IEmployeeWTMEntity } from './employee-wtmentity.interface';

export interface IValidateParams extends IValidateParamsGenerated {

	ChangedEmployeeWTM?: IEmployeeWTMEntity | null;

	/**
	 * CrewAssignmentToValidate
	 */
	EmployeeWTMToValidate?: IEmployeeWTMEntity | null;

	/**
	 * CrewAssignmentsToDelete
	 */
	EmployeeWTMToDelete?: IEmployeeWTMEntity[] | null;

	/**
	 * CrewAssignmentsToSave
	 */
	EmployeeWTMToSave?: IEmployeeWTMEntity[] | null;

}
