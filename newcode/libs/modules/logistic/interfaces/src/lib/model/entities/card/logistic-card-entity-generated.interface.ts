/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardActClerkEntity } from './logistic-card-act-clerk-entity.interface';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface ILogisticCardEntityGenerated extends IEntityIdentification,IEntityBase {

/*
 * ActualFinish
 */
  ActualFinish?: string | null;

/*
 * ActualStart
 */
  ActualStart?: string | null;

/*
 * BasClerkOwnerFk
 */
  BasClerkOwnerFk?: number | null;

/*
 * BasClerkResponsibleFk
 */
  BasClerkResponsibleFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DispatchHeaderFk
 */
  DispatchHeaderFk?: number | null;

/*
 * EquipmentDivisionFk
 */
  EquipmentDivisionFk: number;

/*
 * Id
 */
  Id: number;

/*
 * IsJobCardTemplateAssigned
 */
  IsJobCardTemplateAssigned?: boolean | null;

/*
 * IsReadonlyStatus
 */
  IsReadonlyStatus?: boolean | null;

/*
 * JobCardAreaFk
 */
  JobCardAreaFk?: number | null;

/*
 * JobCardGroupFk
 */
  JobCardGroupFk?: number | null;

/*
 * JobCardPriorityFk
 */
  JobCardPriorityFk?: number | null;

/*
 * JobCardStatusFk
 */
  JobCardStatusFk: number;

/*
 * JobCardTemplateFk
 */
  JobCardTemplateFk?: number | null;

/*
 * JobFk
 */
  JobFk: number;

/*
 * JobPerformingFk
 */
  JobPerformingFk?: number | null;

/*
 * LgmJobcardactclerkEntities
 */
  LgmJobcardactclerkEntities?: ILogisticCardActClerkEntity[] | null;

/*
 * LogisticContextFk
 */
  LogisticContextFk: number;

/*
 * Meterreading
 */
  Meterreading?: number | null;

/*
 * NotDoneCount
 */
  NotDoneCount?: number | null;

/*
 * PlannedFinish
 */
  PlannedFinish?: string | null;

/*
 * PlannedStart
 */
  PlannedStart?: string | null;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * RequisitionFk
 */
  RequisitionFk?: number | null;

/*
 * ReservationFk
 */
  ReservationFk?: number | null;

/*
 * ReservationId
 */
  ReservationId?: number | null;

/*
 * ResourceFk
 */
  ResourceFk?: number | null;

/*
 * RubricCategoryFk
 */
  RubricCategoryFk: number;

/*
 * SearchPattern
 */
  SearchPattern?: string | null;

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
 * WorkOperationTypeFk
 */
  WorkOperationTypeFk?: number | null;
}
