/*
 * Copyright(c) RIB Software GmbH
 */

import { IRfqBusinessPartnerEntity } from '@libs/procurement/interfaces';
import { Included } from './generic-wizard-included.type';
import { SendStatusError } from '../../../models/types/generic-wizard-send-status-error.type';
import { BidderSendStatus } from '../enum/bidder-send-status.enum';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
/**
 * Properties in the rfq bidders container.
 */
export type RfqBidders = IRfqBusinessPartnerEntity & Included & {
    /**
     * The current transmission status.
     */
    sendStatus?: BidderSendStatus;

    /**
     * Error list in case transmission fails.
     */
    errorList?: SendStatusError[];

	/**
	 * The related business partner entry.
	 */
	lookup: IBusinessPartnerEntity;
};