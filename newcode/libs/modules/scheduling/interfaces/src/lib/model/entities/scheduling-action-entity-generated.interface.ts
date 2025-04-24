/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAssignCUDataEntity } from './assign-cudata-entity.interface';
import { IBaselineEntity } from './baseline-entity.interface';
import { IChangeActivityStateEntity } from './change-activity-state-entity.interface';
import { ICreateProgressReportEntity } from './create-progress-report-entity.interface';
import { IGenerateActivitiesViaCriteriaEntity } from './generate-activities-via-criteria-entity.interface';
import { ILocationInfoEntity } from './location-info-entity.interface';
import { IPerformanceSheetEntity } from './performance-sheet-entity.interface';
import { IPrcPackageEntity } from './prc-package-entity.interface';
import { IActivityRelationshipEntity } from './activity-relationship-entity.interface';
import { IRenumberDataEntity } from './renumber-data-entity.interface';
import { IUpdatePlannedDurationEntity } from './update-planned-duration-entity.interface';

export interface ISchedulingActionEntityGenerated {

/*
 * Action
 */
  Action?: number | null;

/*
 * ActivityIds
 */
  ActivityIds?: number[] | null;

/*
 * AssignCUData
 */
  AssignCUData?: IAssignCUDataEntity | null;

/*
 * Baselines
 */
  Baselines?: IBaselineEntity[] | null;

/*
 * ChangeActivityStateInfo
 */
  ChangeActivityStateInfo?: IChangeActivityStateEntity[] | null;

/*
 * CreateData
 */
  CreateData?: ICreateProgressReportEntity | null;

/*
 * CreateRequisitionByCostCode
 */
  CreateRequisitionByCostCode?: boolean | null;

/*
 * CreateRequisitionByMaterial
 */
  CreateRequisitionByMaterial?: boolean | null;

/*
 * CreateRequisitionByPlant
 */
  CreateRequisitionByPlant?: boolean | null;

/*
 * CreateRequisitionByResResource
 */
  CreateRequisitionByResResource?: boolean | null;

/*
 * EffectedItemId
 */
  EffectedItemId?: number | null;

/*
 * EstimateId
 */
  EstimateId?: number | null;

/*
 * GenerateActivitiesInfo
 */
  GenerateActivitiesInfo?: IGenerateActivitiesViaCriteriaEntity | null;

/*
 * GroupByControllingUnit
 */
  GroupByControllingUnit?: boolean | null;

/*
 * GroupByPrcStructure
 */
  GroupByPrcStructure?: boolean | null;

/*
 * IsFullEstimate
 */
  IsFullEstimate?: boolean | null;

/*
 * IsFullScheduling
 */
  IsFullScheduling?: boolean | null;

/*
 * IsSelectedActivities
 */
  IsSelectedActivities?: boolean | null;

/*
 * IsSelectedLineItems
 */
  IsSelectedLineItems?: boolean | null;

/*
 * LineItemHeader
 */
  LineItemHeader?: number | null;

/*
 * LineItemIds
 */
  LineItemIds?: number[] | null;

/*
 * Location
 */
  Location?: ILocationInfoEntity | null;

/*
 * PerformanceSheet
 */
  PerformanceSheet?: IPerformanceSheetEntity | null;

/*
 * ProcurementPackage
 */
  ProcurementPackage?: IPrcPackageEntity | null;

/*
 * ReferredEntityId
 */
  ReferredEntityId?: number | null;

/*
 * RelationShip
 */
  RelationShip?: IActivityRelationshipEntity | null;

/*
 * RenumberInfo
 */
  RenumberInfo?: IRenumberDataEntity | null;

/*
 * RescheduleUncompleteTasks
 */
 // RescheduleUncompleteTasks?: IRescheduleUncompleteTasksEntity | null;

/*
 * ScheduleId
 */
  ScheduleId?: number | null;

/*
 * UpdateActivityDuration
 */
  UpdateActivityDuration?: boolean | null;

/*
 * UpdateActivityQuantity
 */
  UpdateActivityQuantity?: boolean | null;

/*
 * UpdatePlannedDurationData
 */
  UpdatePlannedDurationData?: IUpdatePlannedDurationEntity | null;

/*
 * UpdateSummaryActivities
 */
  UpdateSummaryActivities?: boolean | null;
}
