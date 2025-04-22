/*
 * Copyright(c) RIB Software GmbH
 */

import { IComparePrintBoqProfile } from './compare-print-boq-profile.interface';
import { IComparePrintItemProfile } from './compare-print-item-profile.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';

export type IComparePrintRfqProfile = IComparePrintBoqProfile | IComparePrintItemProfile;

export interface IComparePrintRfqProfileBase {
	bidder: {
		quotes: ICustomCompareColumnEntity[]
	}
}