/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintGenericProfile } from './compare-print-generic-profile.interface';
import { IComparePrintBoqProfile } from './compare-print-boq-profile.interface';
import { IComparePrintItemProfile } from './compare-print-item-profile.interface';

export interface IComparePrintProfileComplete {
	generic: IComparePrintGenericProfile;
	boq: IComparePrintBoqProfile;
	item: IComparePrintItemProfile;
}