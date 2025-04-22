/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IRfqBusinessPartnerEntity } from '../entities/rfq-businesspartner-entity.interface';
import { RFQ_BUSINESS_PARTNER_ENTITY_INFO_CONFIG } from '../classes/rfq-bidder-entity-config.class';

export const RFQ_BUSINESS_PARTNER_ENTITY_INFO: EntityInfo = EntityInfo.create<IRfqBusinessPartnerEntity>(RFQ_BUSINESS_PARTNER_ENTITY_INFO_CONFIG);