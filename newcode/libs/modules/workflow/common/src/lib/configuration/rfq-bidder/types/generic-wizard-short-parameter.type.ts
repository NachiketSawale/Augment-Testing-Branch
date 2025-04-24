/*
 * Copyright(c) RIB Software GmbH
 */

import { IReportParameterValue } from '@libs/platform/common';

/**
 * Final type used to pass report parameters and their values for the generic wizard workflow.
 */
export type ShortParameterType = {
    /**
     * Name of the report parameter.
     */
    Name?: string;

    /**
     * Data type of the report parameter.
     */
    ParamValueType?: string;

    /**
     * Value of the report parameter.
     */
    ParamValue: IReportParameterValue | null;
};