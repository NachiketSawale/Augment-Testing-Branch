/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IActivityEntity, IActivityCommentEntity,ICalculationActivityEntity ,IActivityClerkEntity,IEventEntity,IBelongsToActivityEstLineItemEntityCplToSaveDto,
	ISchedulingActionEntity,IHammockActivityEntity,ILineItemProgressEntity,IActivity2ModelObjectEntity,IActivityObservationEntity,IActivityProgressReportEntity,
	IActivityRelationshipEntity,IActivitySplitEntity} from '@libs/scheduling/interfaces';
import { CompleteIdentification } from '@libs/platform/common';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';


export class ActivityComplete implements CompleteIdentification<IActivityEntity>{

 /*
  * ActionResult
  */
  public ActionResult: string | null = '' ;

 /*
  * Activities
  */
  public Activities: IActivityEntity[] | null = [];

 /*
  * ActivityByBaselineToSave
  */
  public ActivityByBaselineToSave: IActivityEntity[] | null = [];

 /*
  * ActivityCommentsToDelete
  */
  public ActivityCommentsToDelete: IActivityCommentEntity[] | null = [];

 /*
  * ActivityCommentsToSave
  */
  public ActivityCommentsToSave: IActivityCommentEntity[] | null = [];

 /*
  * ActivityPlanningChange
  */
  public ActivityPlanningChange: ICalculationActivityEntity | null = null;

 /*
  * BelongsToActivityEstLineItemDtoCplToSave
  */
  public BelongsToActivityEstLineItemDtoCplToSave: IBelongsToActivityEstLineItemEntityCplToSaveDto[] | null = [];

 /*
  * BelongsToActivityEstLineItemDtoToDelete
  */
  public BelongsToActivityEstLineItemDtoToDelete: IBelongsToActivityEstLineItemEntityCplToSaveDto[] | null = [];

 /*
  * BelongsToActivityEstLineItemDtoToSave
  */
  // public BelongsToActivityEstLineItemDtoToSave: IIIdentifyable[] | null = [];

 /*
  * ClerksToDelete
  */
  public ClerksToDelete: IActivityClerkEntity[] | null = [];

 /*
  * ClerksToSave
  */
  public ClerksToSave: IActivityClerkEntity[] | null = [];

 /*
  * EntitiesCount
  */
  public EntitiesCount: number | null = 10;

 /*
  * EventTypeFkChanged
  */
  public EventTypeFkChanged: boolean | null = true;

 /*
  * EventsToDelete
  */
  public EventsToDelete: IEventEntity[] | null = [];

 /*
  * EventsToSave
  */
  public EventsToSave: IEventEntity[] | null = [];

 /*
  * HammockActivityToDelete
  */
  public HammockActivityToDelete: IHammockActivityEntity[] | null = [];

 /*
  * HammockActivityToSave
  */
  public HammockActivityToSave: IHammockActivityEntity[] | null = [];

 /*
  * HasTransientRootEntityInclude
  */
  public HasTransientRootEntityInclude: boolean | null = true;

 /*
  * LineItemProgress
  */
  public LineItemProgress: ILineItemProgressEntity | null = null;

 /*
  * LineItemsToUpdate
  */
  // public LineItemsToUpdate: IIEstLineItemData[] | null = [];

 /*
  * LineItemsWhichNotTransferredQuantity
  */
 public LineItemsWhichNotTransferredQuantity: IEstLineItemEntity[] | null = [];

 /*
  * MainItemId
  */
  public MainItemId: number | null = 10;

 /*
  * ObjModelSimulationToDelete
  */
  public ObjModelSimulationToDelete: IActivity2ModelObjectEntity[] | null = [];

 /*
  * ObjModelSimulationToSave
  */
  public ObjModelSimulationToSave: IActivity2ModelObjectEntity[] | null = [];

 /*
  * ObservationsToDelete
  */
  public ObservationsToDelete: IActivityObservationEntity[] | null = [];

 /*
  * ObservationsToSave
  */
  public ObservationsToSave: IActivityObservationEntity[] | null = [];

 /*
  * PostProcess
  */
  public PostProcess: ISchedulingActionEntity | null = null;

 /*
  * ProgressReportsToDelete
  */
  public ProgressReportsToDelete: IActivityProgressReportEntity[] | null = [];

 /*
  * ProgressReportsToSave
  */
  public ProgressReportsToSave: IActivityProgressReportEntity[] | null = [];

 /*
  * RelationshipsToDelete
  */
  public RelationshipsToDelete: IActivityRelationshipEntity[] | null = [];

 /*
  * RelationshipsToSave
  */
  public RelationshipsToSave: IActivityRelationshipEntity[] | null = [];

 /*
  * RequiredByRequisitionDtoToDelete
  */
 // public RequiredByRequisitionDtoToDelete: IIIdentifyable[] | null = [];

 /*
  * RequiredByRequisitionDtoToSave
  */
  // public RequiredByRequisitionDtoToSave: IIIdentifyable[] | null = [];

 /*
  * SplitEntitiesToDelete
  */
  public SplitEntitiesToDelete: IActivitySplitEntity[] | null = [];

 /*
  * SplitEntitiesToSave
  */
  public SplitEntitiesToSave: IActivitySplitEntity[] | null = [];

 /*
  * Valid
  */
  public Valid: boolean | null = true;

 /*
  * ValidationError
  */
  public ValidationError: string | null = '' ;

 /*
  * activityCommentsToDelete
  */
  public activityCommentsToDelete: IActivityCommentEntity[] | null = [];

 /*
  * activityCommentsToSave
  */
  public activityCommentsToSave: IActivityCommentEntity[] | null = [];

	/**
	 * Entity Descriptor Structure Activity Parent Details
	 */
	public DescriptorStructureActivityParent: IActivityEntity | null = null;
}
