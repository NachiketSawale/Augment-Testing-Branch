/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IJobPlantAllocationEntityGenerated extends IEntityBase {

  /**
   * AllocatedFrom
   */
  AllocatedFrom: string;

  /**
   * AllocatedTo
   */
  AllocatedTo?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CompanyCode
   */
  CompanyCode?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyInCode
   */
  CompanyInCode?: string | null;

  /**
   * CompanyInFk
   */
  CompanyInFk?: number | null;

  /**
   * CompanyInName
   */
  CompanyInName?: string | null;

  /**
   * CompanyName
   */
  CompanyName?: string | null;

  /**
   * CompanyOutCode
   */
  CompanyOutCode?: string | null;

  /**
   * CompanyOutFk
   */
  CompanyOutFk?: number | null;

  /**
   * CompanyOutName
   */
  CompanyOutName?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * DispatchHeaderInCode
   */
  DispatchHeaderInCode?: string | null;

  /**
   * DispatchHeaderInComment
   */
  DispatchHeaderInComment?: string | null;

  /**
   * DispatchHeaderInDesc
   */
  DispatchHeaderInDesc?: string | null;

  /**
   * DispatchHeaderInFk
   */
  DispatchHeaderInFk?: number | null;

  /**
   * DispatchHeaderOutCode
   */
  DispatchHeaderOutCode?: string | null;

  /**
   * DispatchHeaderOutComment
   */
  DispatchHeaderOutComment?: string | null;

  /**
   * DispatchHeaderOutDesc
   */
  DispatchHeaderOutDesc?: string | null;

  /**
   * DispatchHeaderOutFk
   */
  DispatchHeaderOutFk?: number | null;

  /**
   * DispatchRecordInFk
   */
  DispatchRecordInFk?: number | null;

  /**
   * DispatchRecordOutFk
   */
  DispatchRecordOutFk?: number | null;

  /**
   * HomeProjectFk
   */
  HomeProjectFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsFromPes
   */
  IsFromPes: boolean;

  /**
   * IsSettled
   */
  IsSettled: boolean;

  /**
   * JobCode
   */
  JobCode?: string | null;

  /**
   * JobDescription
   */
  JobDescription?: string | null;

  /**
   * JobFk
   */
  JobFk: number;

  /**
   * JobGroupFk
   */
  JobGroupFk?: number | null;

  /**
   * LastSettlementDate
   */
  LastSettlementDate?: string | null;

  /**
   * PesItemFk
   */
  PesItemFk?: number | null;

  /**
   * PlantCode
   */
  PlantCode?: string | null;

  /**
   * PlantComponentFk
   */
  PlantComponentFk?: number | null;

  /**
   * PlantDescription
   */
  PlantDescription?: string | null;

  /**
   * PlantFk
   */
  PlantFk: number;

  /**
   * PlantGroupCode
   */
  PlantGroupCode?: string | null;

  /**
   * PlantGroupDesc
   */
  PlantGroupDesc?: string | null;

  /**
   * PlantGroupFk
   */
  PlantGroupFk?: number | null;

  /**
   * PlantIsBulk
   */
  PlantIsBulk: boolean;

  /**
   * PlantKindFk
   */
  PlantKindFk: number;

  /**
   * PlantStatusFk
   */
  PlantStatusFk: number;

  /**
   * PlantTypeFk
   */
  PlantTypeFk: number;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * ProjectLocationFk
   */
  ProjectLocationFk?: number | null;

  /**
   * ProjectName
   */
  ProjectName?: string | null;

  /**
   * ProjectNo
   */
  ProjectNo?: string | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ReleaseDate
   */
  ReleaseDate?: string | null;

  /**
   * ReservationFk
   */
  ReservationFk?: number | null;

  /**
   * SerialNumber
   */
  SerialNumber?: string | null;

  /**
   * UomFk
   */
  UomFk?: number | null;

  /**
   * WorkOperationTypeFk
   */
  WorkOperationTypeFk: number;
}
