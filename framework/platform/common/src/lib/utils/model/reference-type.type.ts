/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '../../model/identification-data.interface';

/**
 * A data type that covers all formats for record references.
 */
export type ReferenceType = number | IIdentificationData;