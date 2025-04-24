/*
 * Copyright(c) RIB Software GmbH
 */

import { IEngDrwProgReportEntity } from './eng-drw-prog-report-entity.interface';

import { CompleteIdentification, IEntityBase } from '@libs/platform/common';
import { IEngTaskEntity } from './eng-task-entity.interface';
import { IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { IBasicMainItem2CostGroup, ICommentDataEntity } from '@libs/basics/shared';
import { IPpsCommonBizPartnerEntity } from '@libs/productionplanning/common';
import { IPpsDocumentEntity, IPPSEventEntity, IPpsGenericDocumentEntity, IPpsProductTemplateEntityGenerated, PpsProductTemplateComplete } from '@libs/productionplanning/shared';
import { IEngTask2ClerkEntity } from './eng-task-2-clerk-entity.interface';
import { IPpsUpstreamItemEntity } from '@libs/productionplanning/item';

export class EngTaskComplete implements CompleteIdentification<IEngTaskEntity> {
	/**
	 * BusinessPartnersToDelete
	 */
	public BusinessPartnersToDelete?: IBusinessPartnerEntity[] | null = [];

	/**
	 * BusinessPartnersToSave
	 */
	public BusinessPartnersToSave?: IBusinessPartnerEntity[] | null = [];

	/**
	 * CommentDataToSave
	 */
	public CommentDataToSave?: ICommentDataEntity[] | null = [];

	/**
	 * CommonBizPartnerToDelete
	 */
	public CommonBizPartnerToDelete?: IPpsCommonBizPartnerEntity[] | null = [];

	/**
	 * CommonBizPartnerToSave
	 */
	public CommonBizPartnerToSave?: IPpsCommonBizPartnerEntity[] | null = [];

	/**
	 * CostGroupToDelete
	 */
	public CostGroupToDelete?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * CostGroupToSave
	 */
	public CostGroupToSave?: IBasicMainItem2CostGroup[] | null = [];

	/**
	 * DocumentToSave
	 */
	public DocumentToSave?: IPpsGenericDocumentEntity[] | null = [];

	/**
	 * EngTask2ClerkToDelete
	 */
	public EngTask2ClerkToDelete?: IEngTask2ClerkEntity[] | null = [];

	/**
	 * EngTask2ClerkToSave
	 */
	public EngTask2ClerkToSave?: IEngTask2ClerkEntity[] | null = [];

	/**
	 * EngTasks
	 */
	public EngTasks: IEngTaskEntity[] | null = [];

	/**
	 * EventLogToSave
	 */
	public EventLogToSave?: IEntityBase[] | null = [];

	/**
	 * MainItemId
	 */
	public MainItemId: number = 0;

	// /**
	//  * PbResReservationToDelete
	//  */
	// public PbResReservationToDelete?: IIIdentifyable[] | null = [];
	//
	// /**
	//  * PbResReservationToSave
	//  */
	// public PbResReservationToSave?: IIIdentifyable[] | null = [];

	// /**
	//  * PlanningUnitToSave
	//  */
	// public PlanningUnitToSave?: IIIdentifyable[] | null = [];

	/**
	 * PpsDocumentToDelete
	 */
	public PpsDocumentToDelete?: IPpsDocumentEntity[] | null = [];

	/**
	 * PpsDocumentToSave
	 */
	public PpsDocumentToSave?: IPpsDocumentEntity[] | null = [];

	/**
	 * PpsUpstreamItemToDelete
	 */
	public PpsUpstreamItemToDelete?: IPpsUpstreamItemEntity[] | null = [];

	/**
	 * PpsUpstreamItemToSave
	 */
	public PpsUpstreamItemToSave?: IPpsUpstreamItemEntity[] | null = [];

	/**
	 * ProductDescriptionToDelete
	 */
	public ProductDescriptionToDelete?: IPpsProductTemplateEntityGenerated[] | null = [];

	/**
	 * ProductDescriptionToSave
	 */
	public ProductDescriptionToSave?: PpsProductTemplateComplete[] | null = [];

	/**
	 * ProgressReportToDelete
	 */
	public ProgressReportToDelete?: IEngDrwProgReportEntity[] | null = [];

	/**
	 * ProgressReportToSave
	 */
	public ProgressReportToSave?: IEngDrwProgReportEntity[] | null = [];

	// /**
	//  * ResRequisitionToDelete
	//  */
	// public ResRequisitionToDelete?: IIIdentifyable[] | null = [];
	//
	// /**
	//  * ResRequisitionToSave
	//  */
	// public ResRequisitionToSave?: IIIdentifyable[] | null = [];

	// /**
	//  * ResReservationToDelete
	//  */
	// public ResReservationToDelete?: IIIdentifyable[] | null = [];
	//
	// /**
	//  * ResReservationToSave
	//  */
	// public ResReservationToSave?: IIIdentifyable[] | null = [];

	/**
	 * SequenceEventsToSave
	 */
	public SequenceEventsToSave?: IPPSEventEntity[] | null = [];
}
