/*
 * Copyright(c) RIB Software GmbH
 */

import { IReportParameter, IReportParameterValue } from '@libs/platform/common';

/**
 * Report parameters used in the generic wizard.
 */
export type GenericWizardReportParameter = Omit<IReportParameter, 'defaultValue'> & {
    /**
     * Datatype of the report parameter.
     */
    DataType?: string;

    /**
     * Description of the report parameter.
     */
    Description?: string | null;

    /**
     * Id of the report parameter.
     */
    Id: number;

    /**
     * Name of the report parameter.
     */
    Name?: string;

    /**
     * Default value of the report parameter.
     */
    defaultValue?: string | null | number | boolean;

    /**
     * Value of the report paremeter.
     */
    ParamValue?: IReportParameterValue | null;

    /**
     * Used only in the case of the parameter being of type boolean, indicates if the boolean is set in string or int.
     */
    actualDataType?: string;
}