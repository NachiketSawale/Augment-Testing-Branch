/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IActivityClerkEntity } from './activity-clerk-entity.interface';
import { IActivityProgressReportEntity } from './activity-progress-report-entity.interface';
import { IActivityRelationshipEntity } from './activity-relationship-entity.interface';
import { IActivityTypeEntity } from './activity-type-entity.interface';
import { IActivityCommentEntity } from './activity-comment-entity.interface';
import { IHammockActivityEntity } from './hammock-activity-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBaselineEntity } from './baseline-entity.interface';
import { IScheduleEntity } from './schedule-entity.interface';

export interface IActivityEntityGenerated extends IEntityBase {

/*
 * Activities
 */
  Activities?: IActivityEntity[] | null;

/*
 * ActivityClerkEntities
 */
  ActivityClerkEntities?: IActivityClerkEntity[] | null;

/*
 * ActivityEntities_ActivitySubFk
 */
  ActivityEntities_ActivitySubFk?: IActivityEntity[] | null;

/*
 * ActivityEntities_BaseActivityFk
 */
  ActivityEntities_BaseActivityFk?: IActivityEntity[] | null;

/*
 * ActivityEntities_ParentActivityFk
 */
  ActivityEntities_ParentActivityFk?: IActivityEntity[] | null;

/*
 * ActivityEntity_ActivitySubFk
 */
  ActivityEntity_ActivitySubFk?: IActivityEntity | null;

/*
 * ActivityEntity_BaseActivityFk
 */
  ActivityEntity_BaseActivityFk?: IActivityEntity | null;

/*
 * ActivityEntity_ParentActivityFk
 */
  ActivityEntity_ParentActivityFk?: IActivityEntity | null;

/*
 * ActivityMasterFk
 */
  ActivityMasterFk?: number | null;

/*
 * ActivityPresentationFk
 */
  ActivityPresentationFk?: number | null;

/*
 * ActivityProgressReportEntities
 */
  ActivityProgressReportEntities?: IActivityProgressReportEntity[] | null;

/*
 * ActivityRelationshipEntities_ChildActivityFk
 */
  ActivityRelationshipEntities_ChildActivityFk?: IActivityRelationshipEntity[] | null;

/*
 * ActivityRelationshipEntities_ParentActivityFk
 */
  ActivityRelationshipEntities_ParentActivityFk?: IActivityRelationshipEntity[] | null;

/*
 * ActivityStateFk
 */
  ActivityStateFk?: number | null;

/*
 * ActivitySubFk
 */
  ActivitySubFk?: number | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * ActivityTypeFk
 */
  ActivityTypeFk?: number | null;

/*
 * ActualCalendarDays
 */
  ActualCalendarDays?: number | null;

/*
 * ActualDuration
 */
  ActualDuration?: number | null;

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * AddressFk
 */
  AddressFk?: number | null;

/*
 * AllowModify
 */
  AllowModify?: boolean | null;

/*
 * Bas3dVisualizationTypeFk
 */
  Bas3dVisualizationTypeFk?: number | null;

/*
 * BaseActivityFk
 */
  BaseActivityFk?: number | null;

/*
 * Baseline
 */
  Baseline?: string | null;

/*
 * BaselineFk
 */
  BaselineFk?: number | null;

/*
 * CalendarFk
 */
  CalendarFk?: number | null;

/*
 * ChartPresentationFk
 */
  ChartPresentationFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * ConstraintDate
 */
  ConstraintDate?: string | null;

/*
 * ConstraintTypeFk
 */
  ConstraintTypeFk?: number | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * CosMatchtext
 */
  CosMatchtext?: string | null;

/*
 * CurrentCalendarDays
 */
  CurrentCalendarDays?: number | null;

/*
 * CurrentDuration
 */
  CurrentDuration?: number | null;

/*
 * CurrentFinish
 */
  CurrentFinish?: string | null;

/*
 * CurrentStart
 */
  CurrentStart?: string | null;

/*
 * Description
 */
  Description?: string | null;
  /*
 * Description
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * DueDateQuantityPerformance
 */
  DueDateQuantityPerformance?: number | null;

/*
 * DueDateWorkPerformance
 */
  DueDateWorkPerformance?: number | null;

/*
 * EarliestFinish
 */
  EarliestFinish?: string | null;

/*
 * EarliestStart
 */
  EarliestStart?: string | null;

/*
 * EstimateHoursTotal
 */
  EstimateHoursTotal?: number | null;

/*
 * EventTypeFk
 */
  EventTypeFk?: number | null;

/*
 * ExecutionFinished
 */
  ExecutionFinished?: boolean | null;

/*
 * ExecutionStarted
 */
  ExecutionStarted?: boolean | null;

/*
 * FreeFloatTime
 */
  FreeFloatTime?: number | null;

/*
 * HasCalculatedEnd
 */
  HasCalculatedEnd?: boolean | null;

/*
 * HasCalculatedStart
 */
  HasCalculatedStart?: boolean | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * HasHammock
 */
  HasHammock?: boolean | null;

/*
 * HasReports
 */
  HasReports?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsAssignedToEstimate
 */
  IsAssignedToEstimate?: boolean | null;

/*
 * IsAssignedToHammock
 */
  IsAssignedToHammock?: boolean | null;

/*
 * IsCritical
 */
  IsCritical?: boolean | null;

/*
 * IsDirty
 */
  IsDirty?: boolean | null;

/*
 * IsDurationEstimationDriven
 */
  IsDurationEstimationDriven?: boolean | null;

/*
 * IsInterCompany
 */
  IsInterCompany?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * IsOnLongestPath
 */
  IsOnLongestPath?: boolean | null;

/*
 * IsQuantityEvaluated
 */
  IsQuantityEvaluated?: boolean | null;

/*
 * IsReadOnly
 */
  IsReadOnly?: boolean | null;

/*
 * IsUpdatedToEstimate
 */
  IsUpdatedToEstimate?: boolean | null;

/*
 * LastProgressDate
 */
  LastProgressDate?: string | null;

/*
 * LatestFinish
 */
  LatestFinish?: string | null;

/*
 * LatestStart
 */
  LatestStart?: string | null;

/*
 * LobLabelPlacementFk
 */
  LobLabelPlacementFk?: number | null;

/*
 * LocationFk
 */
  LocationFk?: number | null;

/*
 * LocationSpecification
 */
  LocationSpecification?: string | null;

/*
 * Note
 */
  Note?: string | null;

/*
 * ObjectId
 */
  ObjectId?: number | null;

/*
 * PackageCode
 */
  PackageCode?: string | null;

/*
 * PackageDesc
 */
  PackageDesc?: string | null;

/*
 * PackageId
 */
  PackageId?: number | null;

/*
 * ParentActivityFk
 */
  ParentActivityFk?: number | null;

/*
 * ParentActivityIdAsRead
 */
  ParentActivityIdAsRead?: number | null;

/*
 * PercentageCompletion
 */
  PercentageCompletion?: number | null;

/*
 * PercentageRemaining
 */
  PercentageRemaining?: number | null;

/*
 * Perf1UoMFk
 */
  Perf1UoMFk?: number | null;

/*
 * Perf2UoMFk
 */
  Perf2UoMFk?: number | null;

/*
 * PerformanceFactor
 */
  PerformanceFactor?: number | null;

/*
 * PerformanceRuleFk
 */
  PerformanceRuleFk?: number | null;

/*
 * PeriodQuantityPerformance
 */
  PeriodQuantityPerformance?: number | null;

/*
 * PeriodWorkPerformance
 */
  PeriodWorkPerformance?: number | null;

/*
 * PermissionObjectInfo
 */
  PermissionObjectInfo?: string | null;

/*
 * PlannedCalendarDays
 */
  PlannedCalendarDays?: number | null;

/*
 * PlannedDuration
 */
  PlannedDuration?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * Predecessor
 */
  Predecessor?: IActivityRelationshipEntity[] | null;

/*
 * ProgressReportMethodFk
 */
  ProgressReportMethodFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ProjectName
 */
  ProjectName?: string | null;

/*
 * ProjectName2
 */
  ProjectName2?: string | null;

/*
 * ProjectNo
 */
  ProjectNo?: string | null;

/*
 * ProjectReleaseFk
 */
  ProjectReleaseFk?: number | null;

/*
 * PsdActivitytypeEntity
 */
  PsdActivitytypeEntity?: IActivityTypeEntity | null;

/*
 * PsdBaselineEntity
 */
  PsdBaselineEntity?: IBaselineEntity | null;

/*
 * PsdCommentEntities
 */
  PsdCommentEntities?: IActivityCommentEntity[] | null;

/*
 * PsdHammockactivityEntities_PsdActivityFk
 */
  PsdHammockactivityEntities_PsdActivityFk?: IHammockActivityEntity[] | null;

/*
 * PsdHammockactivityEntities_PsdActivitymemberFk
 */
  PsdHammockactivityEntities_PsdActivitymemberFk?: IHammockActivityEntity[] | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityUoMFk
 */
  QuantityUoMFk?: number | null;

/*
 * RemainingActivityQuantity
 */
  RemainingActivityQuantity?: number | null;

/*
 * RemainingActivityWork
 */
  RemainingActivityWork?: number | null;

/*
 * RemainingDuration
 */
  RemainingDuration?: number | null;

/*
 * ReportingDate
 */
  ReportingDate?: string | null;

/*
 * ResourceFactor
 */
  ResourceFactor?: number | null;

/*
 * RubricCategoryFk
 */
  RubricCategoryFk?: number | null;

/*
 * SCurveFk
 */
  SCurveFk?: number | null;

/*
 * Schedule
 */
  Schedule?: IScheduleEntity | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;

/*
 * ScheduleIsReadOnly
 */
  ScheduleIsReadOnly?: boolean | null;

/*
 * ScheduleMasterFk
 */
  ScheduleMasterFk?: number | null;

/*
 * ScheduleSubFk
 */
  ScheduleSubFk?: number | null;

/*
 * SchedulingMethodFk
 */
  SchedulingMethodFk?: number | null;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

/*
 * Specification
 */
  Specification?: string | null;

/*
 * SubScheduleFk
 */
  SubScheduleFk?: number | null;

/*
 * Successor
 */
  Successor?: IActivityRelationshipEntity[] | null;

/*
 * TaskTypeFk
 */
  TaskTypeFk?: number | null;

/*
 * TotalFloatTime
 */
  TotalFloatTime?: number | null;

/*
 * UserDefinedDate01
 */
  UserDefinedDate01?: string | null;

/*
 * UserDefinedDate02
 */
  UserDefinedDate02?: string | null;

/*
 * UserDefinedDate03
 */
  UserDefinedDate03?: string | null;

/*
 * UserDefinedDate04
 */
  UserDefinedDate04?: string | null;

/*
 * UserDefinedDate05
 */
  UserDefinedDate05?: string | null;

/*
 * UserDefinedDate06
 */
  UserDefinedDate06?: string | null;

/*
 * UserDefinedDate07
 */
  UserDefinedDate07?: string | null;

/*
 * UserDefinedDate08
 */
  UserDefinedDate08?: string | null;

/*
 * UserDefinedDate09
 */
  UserDefinedDate09?: string | null;

/*
 * UserDefinedDate10
 */
  UserDefinedDate10?: string | null;

/*
 * UserDefinedNumber01
 */
  UserDefinedNumber01?: number | null;

/*
 * UserDefinedNumber02
 */
  UserDefinedNumber02?: number | null;

/*
 * UserDefinedNumber03
 */
  UserDefinedNumber03?: number | null;

/*
 * UserDefinedNumber04
 */
  UserDefinedNumber04?: number | null;

/*
 * UserDefinedNumber05
 */
  UserDefinedNumber05?: number | null;

/*
 * UserDefinedNumber06
 */
  UserDefinedNumber06?: number | null;

/*
 * UserDefinedNumber07
 */
  UserDefinedNumber07?: number | null;

/*
 * UserDefinedNumber08
 */
  UserDefinedNumber08?: number | null;

/*
 * UserDefinedNumber09
 */
  UserDefinedNumber09?: number | null;

/*
 * UserDefinedNumber10
 */
  UserDefinedNumber10?: number | null;

/*
 * UserDefinedText01
 */
  UserDefinedText01?: string | null;

/*
 * UserDefinedText02
 */
  UserDefinedText02?: string | null;

/*
 * UserDefinedText03
 */
  UserDefinedText03?: string | null;

/*
 * UserDefinedText04
 */
  UserDefinedText04?: string | null;

/*
 * UserDefinedText05
 */
  UserDefinedText05?: string | null;

/*
 * UserDefinedText06
 */
  UserDefinedText06?: string | null;

/*
 * UserDefinedText07
 */
  UserDefinedText07?: string | null;

/*
 * UserDefinedText08
 */
  UserDefinedText08?: string | null;

/*
 * UserDefinedText09
 */
  UserDefinedText09?: string | null;

/*
 * UserDefinedText10
 */
  UserDefinedText10?: string | null;

/*
 * Work
 */
  Work?: number | null;
}
