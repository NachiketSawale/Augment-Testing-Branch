/*
 * Copyright(c) RIB Software GmbH
 */

import { Included } from './generic-wizard-included.type';
import { IPrcBoqExtendedEntity } from '@libs/procurement/interfaces';

export type RfqBidderBoq = IPrcBoqExtendedEntity & Included & {
	RequisitionDescription: string;
	ItemCount: number;
};