/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';

/**
 * Represents the lookup identification
 */
export interface ILookupIdentificationData extends IIdentificationData {
	/**
	 * Lookup entity key which supports string and number
	 */
	key: number | string
}
