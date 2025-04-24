/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IRfqBusinessPartnerEntity } from './rfq-businesspartner-entity.interface';
import { IRfqBusinessPartner2ContactEntity } from './rfq-businesspartner-2contact-entity.interface';
import { IRfqPartialReqAssignedEntity } from './rfq-partialreq-assigned-entity.interface';

export class RfqBusinessPartnerEntityComplete implements CompleteIdentification<IRfqBusinessPartnerEntity> {
	public MainItemId: number = 0;
	public RfqBusinessPartner: IRfqBusinessPartnerEntity | null = null;
	public EntitiesCount: number = 0;
	public RfqBusinessPartner2ContactToSave: IRfqBusinessPartner2ContactEntity[] | null = [];
	public RfqBusinessPartner2ContactToDelete: IRfqBusinessPartner2ContactEntity[] | null = [];
	public RfqPartialReqAssignedToSave: IRfqPartialReqAssignedEntity[] | null = [];
	public RfqPartialReqAssignedToDelete: IRfqPartialReqAssignedEntity[] | null = [];
}