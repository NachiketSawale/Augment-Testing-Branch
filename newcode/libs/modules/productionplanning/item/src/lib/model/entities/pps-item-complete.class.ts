/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IPPSItem2ClerkEntity } from './pps-item-2clerk-entity.interface';
import { IPPSItemEntity } from '../models';
import {
	IEngDrawingComponentEntityGenerated,
	IPPSEventEntity,
	IPpsEventParentComplete, IPpsParameterEntityGenerated,
	IPpsProductTemplateEntityGenerated,
	PPSEventComplete
} from '@libs/productionplanning/shared';
import {PpsUpstreamItemComplete} from './pps-upstream-item-complete.class';

export class PPSItemComplete implements IPpsEventParentComplete<IPPSItemEntity> {
	/*
	 * BundleToSave
	 */
	public BundleToSave!: IEntityBase[] | null;

	/*
	 * BusinessPartnersToDelete
	 */
	public BusinessPartnersToDelete!: IEntityBase[] | null;

	/*
	 * BusinessPartnersToSave
	 */
	public BusinessPartnersToSave!: IEntityBase[] | null;

	/*
	 * CommonBizPartnerToDelete
	 */
	public CommonBizPartnerToDelete!: IEntityBase[] | null;

	/*
	 * CommonBizPartnerToSave
	 */
	public CommonBizPartnerToSave!: IEntityBase[] | null;

	/*
	 * DailyProductionToSave
	 */
	public DailyProductionToSave!: IEntityBase[] | null;

	/*
	 * DrawingComponentsToDelete
	 */
	public DrawingComponentsToDelete!: IEngDrawingComponentEntityGenerated[] | null;

	/*
	 * DrawingComponentsToSave
	 */
	public DrawingComponentsToSave!: IEngDrawingComponentEntityGenerated[] | null;

	/*
	 * EngTask2ClerkToDelete
	 */
	public EngTask2ClerkToDelete!: IEntityBase[] | null;

	/*
	 * EngTask2ClerkToSave
	 */
	public EngTask2ClerkToSave!: IEntityBase[] | null;

	/*
	 * EventLogToSave
	 */
	public EventLogToSave!: IEntityBase[] | null;

	public EventsToSave: PPSEventComplete[] | null = [];

	public EventsToDelete: IPPSEventEntity[] | null = [];

	/*
	 * Header2BpToDelete
	 */
	public Header2BpToDelete!: IEntityBase[] | null;

	/*
	 * Header2BpToSave
	 */
	public Header2BpToSave!: IEntityBase[] | null;

	/*
	 * ItemLogToSave
	 */
	public ItemLogToSave!: IEntityBase[] | null;

	/*
	 * MainItemId
	 */
	public MainItemId!: number | null;

	/*
	 * PPSItem
	 */
	public PPSItem!: IPPSItemEntity[] | null;

	/*
	 * PPSItemClerkToDelete
	 */
	public PPSItemClerkToDelete!: IPPSItem2ClerkEntity[] | null;

	/*
	 * PPSItemClerkToSave
	 */
	public PPSItemClerkToSave!: IPPSItem2ClerkEntity[] | null;

	/*
	 * PPSItemEventGanttToSave
	 */
	public PPSItemEventGanttToSave!: PPSEventComplete[] | null;

	/*
	 * PlanningBoardDemandsToSave
	 */
	public PlanningBoardDemandsToSave!: IEntityBase[] | null;

	/*
	 * PpsDocumentToDelete
	 */
	public PpsDocumentToDelete!: IEntityBase[] | null;

	/*
	 * PpsDocumentToSave
	 */
	public PpsDocumentToSave!: IEntityBase[] | null;

	/*
	 * PpsParameterToDelete
	 */
	public PpsParameterToDelete!: IPpsParameterEntityGenerated[] | null;

	/*
	 * PpsParameterToSave
	 */
	public PpsParameterToSave!: IPpsParameterEntityGenerated[] | null;

	/*
	 * PpsUpstreamItemToDelete
	 */
	public PpsUpstreamItemToDelete!: IEntityBase[] | null;

	/*
	 * PpsUpstreamItemToSave
	 */
	public PpsUpstreamItemToSave!: PpsUpstreamItemComplete[] | null;

	/*
	 * ProductTemplateToSave
	 */
	public ProductTemplateToSave!: IPpsProductTemplateEntityGenerated[] | null;

	/*
	 * ProductToDelete
	 */
	public ProductToDelete!: IEntityBase[] | null;

	/*
	 * ProductToSave
	 */
	public ProductToSave!: IEntityBase[] | null;

	/*
	 * ReloadProjectDocumentContainer
	 */
	public ReloadProjectDocumentContainer!: boolean | null;

	/*
	 * TransportPackageToSave
	 */
	public TransportPackageToSave!: IEntityBase[] | null;

	/*
	 * TrsGoodsToSave
	 */
	public TrsGoodsToSave!: IEntityBase[] | null;

	/*
	 * VirtualEventToSave
	 */
	public VirtualEventToSave!: IEntityBase[] | null;

	/*
	 * VirtualPpsPhaseToSave
	 */
	public VirtualPpsPhaseToSave!: IEntityBase[] | null;

	/*
	 * VirtualResRequisitionToSave
	 */
	public VirtualResRequisitionToSave!: IEntityBase[] | null;

	/*
	 * VirtualResReservationToSave
	 */
	public VirtualResReservationToSave!: IEntityBase[] | null;
}
