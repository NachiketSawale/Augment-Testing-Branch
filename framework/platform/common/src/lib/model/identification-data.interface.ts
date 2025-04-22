/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationDataMutable } from './identification-data-mutable.interface';

/**
 * The interface that represents a unique ID of up to four components.
 */
export type IIdentificationData = Readonly<IIdentificationDataMutable>;
