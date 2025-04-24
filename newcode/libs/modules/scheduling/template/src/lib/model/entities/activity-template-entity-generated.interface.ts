/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IActivityTemplateGroupEntity } from '@libs/scheduling/templategroup';
import { IActivityCriteriaEntity } from './activity-criteria-entity.interface';
import {IActivityTmplGrp2CUGrpEntity} from '@libs/scheduling/templategroup';
import { IEventTemplateEntity } from './event-template-entity.interface';
import { IPerformanceRuleEntity } from './performance-rule-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';


export interface IActivityTemplateEntityGenerated extends IEntityBase {

/*
 * ActivityPresentationFk
 */
  ActivityPresentationFk?: number | null;

/*
 * ActivityTemplateGroupEntity
 */
  ActivityTemplateGroupEntity?: IActivityTemplateGroupEntity | null;

/*
 * ActivityTemplateGroupFk
 */
  ActivityTemplateGroupFk?: number | null;

/*
 * ActivitycriteriaEntities
 */
  ActivitycriteriaEntities?: IActivityCriteriaEntity[] | null;

/*
 * Activitytmpl2CUGrpEntities
 */
  Activitytmpl2CUGrpEntities?: IActivityTmplGrp2CUGrpEntity[] | null;

/*
 * Bas3dVisualizationTypeFk
 */
  Bas3dVisualizationTypeFk?: number | null;

/*
 * ChartPresentationFk
 */
  ChartPresentationFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * ConstraintTypeFk
 */
  ConstraintTypeFk?: number | null;

/*
 * ControllingUnitTemplate
 */
  ControllingUnitTemplate?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EventTemplateEntities
 */
  EventTemplateEntities?: IEventTemplateEntity[] | null;

/*
 * Id
 */
  Id : number;

/*
 * LabelPlacementFk
 */
  LabelPlacementFk?: number | null;

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
 * PerformanceRuleEntities
 */
  PerformanceRuleEntities?: IPerformanceRuleEntity[] | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * ProgressReportMethodFk
 */
  ProgressReportMethodFk?: number | null;

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
 * SchedulingContextFk
 */
  SchedulingContextFk?: number | null;

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
 * TaskTypeFk
 */
  TaskTypeFk?: number | null;

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
}
