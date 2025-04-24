/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { IRfqBusinessPartnerEntity } from './rfq-businesspartner-entity.interface';
import { RfqBusinessPartnerEntityComplete } from './rfq-businesspartner-entity-complete.class';
import { RfqRequisitionEntityComplete } from './rfq-requisition-complete.class';
import { IRfqRequisitionEntity } from './rfq-requisition-entity.interface';
import { IRfqTotalEntity } from './rfq-total-entity.interface';
import { IRfqHeaderblobEntity } from './rfq-header-blob-entity.interface';
import { IPrcPackage2ExtBidderEntity } from '@libs/procurement/common';
import { IRfqSendHistoryEntity } from './rfq-send-history-entity.interface';

export class RfqHeaderEntityComplete implements CompleteIdentification<IRfqHeaderEntity> {
	public MainItemId: number = 0;
	public Id: number = 0;
	public RfqHeader: IRfqHeaderEntity | null = null;
	public RfqHeaders: IRfqHeaderEntity[] | null = [];
	public RfqBusinessPartnerToSave: RfqBusinessPartnerEntityComplete[] | null = [];
	public RfqBusinessPartnerToDelete: IRfqBusinessPartnerEntity[] | null = [];
	public RfqRequisitionToSave: RfqRequisitionEntityComplete[] | null = [];
	public RfqRequisitionToDelete: IRfqRequisitionEntity[] | null = [];
	public RfqTotalToSave: IRfqTotalEntity[] | null = [];
	public RfqTotalToDelete: IRfqTotalEntity[] | null = [];
	public RfqHeaderblobToSave: IRfqHeaderblobEntity[] | null = [];
	public RfqHeaderblobToDelete: IRfqHeaderblobEntity[] | null = [];
	public PrcPackage2ExtBidderToSave: IPrcPackage2ExtBidderEntity[] | null = [];
	public PrcPackage2ExtBidderToDelete: IPrcPackage2ExtBidderEntity[] | null = [];
	public MtgHeaderToSave: IEntityIdentification[] | null = [];
	public MtgHeaderToDelete: IEntityIdentification[] | null = [];
	public RfqSendHistoryToSave: IRfqSendHistoryEntity[] | null = [];
}