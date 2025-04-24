/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

/**
 * interface to store transmission errors.
 */
export interface IGenericWizardTransmissionErrors {
    type: string;
    id?: string | number;
    displayValue?: string;
    message?: ITranslated;
}
