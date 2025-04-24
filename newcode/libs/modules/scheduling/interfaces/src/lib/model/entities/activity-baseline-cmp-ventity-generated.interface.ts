/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityRelationshipEntity } from './activity-relationship-entity.interface';

export interface IActivityBaselineCmpVEntityGenerated {

/*
 * ActPresentationFk
 */
  ActPresentationFk?: number | null;

/*
 * ActivityParentCode
 */
  ActivityParentCode?: string | null;

/*
 * ActivityParentDescription
 */
  ActivityParentDescription?: string | null;

/*
 * ActivityStateFk
 */
  ActivityStateFk?: number | null;

/*
 * ActivityTemplateFk
 */
  ActivityTemplateFk?: number | null;

/*
 * ActivityTypeFk
 */
  ActivityTypeFk?: number | null;

/*
 * ActivtyId
 */
  ActivtyId?: number | null;

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
 * AllowModify
 */
  AllowModify?: boolean | null;

/*
 * Bas3dvisualizationtypeFk
 */
  Bas3dvisualizationtypeFk?: number | null;

/*
 * BaseActivityFk
 */
  BaseActivityFk?: number | null;

/*
 * BaselineDescription
 */
  BaselineDescription?: string | null;

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
 * EarliestFinish
 */
  EarliestFinish?: string | null;

/*
 * EarliestStart
 */
  EarliestStart?: string | null;

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
 * Id
 */
  Id?: number | null;

/*
 * IsCritical
 */
  IsCritical?: boolean | null;

/*
 * IsDirty
 */
  IsDirty?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * LatestFinish
 */
  LatestFinish?: string | null;

/*
 * LatestStart
 */
  LatestStart?: string | null;

/*
 * LocationFk
 */
  LocationFk?: number | null;

/*
 * LocationSpec
 */
  LocationSpec?: string | null;

/*
 * Note
 */
  Note?: string | null;

/*
 * ParentActivityFk
 */
  ParentActivityFk?: number | null;

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
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityUoMFk
 */
  QuantityUoMFk?: number | null;

/*
 * ResourceFactor
 */
  ResourceFactor?: number | null;

/*
 * SCurveFk
 */
  SCurveFk?: number | null;

/*
 * ScheduleFk
 */
  ScheduleFk?: number | null;

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
 * UpToDateActivityStateFk
 */
  UpToDateActivityStateFk?: number | null;

/*
 * UpToDateActivityTypeFk
 */
  UpToDateActivityTypeFk?: number | null;

/*
 * UpToDateActualDuration
 */
  UpToDateActualDuration?: number | null;

/*
 * UpToDateActualFinish
 */
  UpToDateActualFinish?: string | null;

/*
 * UpToDateActualStart
 */
  UpToDateActualStart?: string | null;

/*
 * UpToDateCode
 */
  UpToDateCode?: string | null;

/*
 * UpToDateConstraintDate
 */
  UpToDateConstraintDate?: string | null;

/*
 * UpToDateConstraintTypeFk
 */
  UpToDateConstraintTypeFk?: number | null;

/*
 * UpToDateCurrentDuration
 */
  UpToDateCurrentDuration?: number | null;

/*
 * UpToDateCurrentFinish
 */
  UpToDateCurrentFinish?: string | null;

/*
 * UpToDateCurrentStart
 */
  UpToDateCurrentStart?: string | null;

/*
 * UpToDateDescription
 */
  UpToDateDescription?: string | null;

/*
 * UpToDateLocationFk
 */
  UpToDateLocationFk?: number | null;

/*
 * UpToDateLocationSpecification
 */
  UpToDateLocationSpecification?: string | null;

/*
 * UpToDateParentActivityFk
 */
  UpToDateParentActivityFk?: number | null;

/*
 * UpToDatePerf1UoMFk
 */
  UpToDatePerf1UoMFk?: number | null;

/*
 * UpToDatePerf2UoMfk
 */
  UpToDatePerf2UoMfk?: number | null;

/*
 * UpToDatePerformanceFactor
 */
  UpToDatePerformanceFactor?: number | null;

/*
 * UpToDatePerformanceRuleFk
 */
  UpToDatePerformanceRuleFk?: number | null;

/*
 * UpToDatePlannedDuration
 */
  UpToDatePlannedDuration?: number | null;

/*
 * UpToDatePlannedFinish
 */
  UpToDatePlannedFinish?: string | null;

/*
 * UpToDatePlannedStart
 */
  UpToDatePlannedStart?: string | null;

/*
 * UpToDateResourceFactor
 */
  UpToDateResourceFactor?: number | null;

/*
 * UpToDateScheduleFk
 */
  UpToDateScheduleFk?: number | null;

/*
 * UpToDateSchedulingMethodFk
 */
  UpToDateSchedulingMethodFk?: number | null;

/*
 * UpToDateSpecification
 */
  UpToDateSpecification?: string | null;

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
