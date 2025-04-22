/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintGenericProfile } from './compare-print-generic-profile.interface';
import { IComparePrintRfqProfile } from './compare-print-rfq-profile.interface';

export interface IComparePrintContext {
	generic: IComparePrintGenericProfile;
	rfq: IComparePrintRfqProfile;
}