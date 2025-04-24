/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeAllocationEntity } from './time-allocation-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITimeAllocationHeaderEntityGenerated extends IEntityBase {

  /**
   * AllocationDate
   */
  AllocationDate: string;

  /**
   * Allocationenddate
   */
  Allocationenddate?: string | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * DispatchHeaderFk
   */
  DispatchHeaderFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * JobFk
   */
  JobFk?: number | null;

  /**
   * PeriodFk
   */
  PeriodFk?: number | null;

  /**
   * PermissionObjectInfo
   */
  PermissionObjectInfo?: string | null;

  /**
   * ProjectActions
   */
  //ProjectActions?: IIIdentifyable[] | null;

  /**
   * ProjectFk
   */
  ProjectFk: number;

  /**
   * RecordingFk
   */
  RecordingFk?: number | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * TimeAllocationEntities
   */
  TimeAllocationEntities?: ITimeAllocationEntity[] | null;

  /**
   * TimeAllocationStatusFk
   */
  TimeAllocationStatusFk: number;

  /**
   * TimesheetContextFk
   */
  TimesheetContextFk: number;

  /**
   * UserDefinedDate01
   */
  UserDefinedDate01?: string | null;

  /**
   * UserDefinedDate02
   */
  UserDefinedDate02?: string | null;

  /**
   * UserDefinedDate03
   */
  UserDefinedDate03?: string | null;

  /**
   * UserDefinedDate04
   */
  UserDefinedDate04?: string | null;

  /**
   * UserDefinedDate05
   */
  UserDefinedDate05?: string | null;

  /**
   * UserDefinedDate06
   */
  UserDefinedDate06?: string | null;

  /**
   * UserDefinedDate07
   */
  UserDefinedDate07?: string | null;

  /**
   * UserDefinedDate08
   */
  UserDefinedDate08?: string | null;

  /**
   * UserDefinedDate09
   */
  UserDefinedDate09?: string | null;

  /**
   * UserDefinedDate10
   */
  UserDefinedDate10?: string | null;

  /**
   * UserDefinedNumber01
   */
  UserDefinedNumber01?: number | null;

  /**
   * UserDefinedNumber02
   */
  UserDefinedNumber02?: number | null;

  /**
   * UserDefinedNumber03
   */
  UserDefinedNumber03?: number | null;

  /**
   * UserDefinedNumber04
   */
  UserDefinedNumber04?: number | null;

  /**
   * UserDefinedNumber05
   */
  UserDefinedNumber05?: number | null;

  /**
   * UserDefinedNumber06
   */
  UserDefinedNumber06?: number | null;

  /**
   * UserDefinedNumber07
   */
  UserDefinedNumber07?: number | null;

  /**
   * UserDefinedNumber08
   */
  UserDefinedNumber08?: number | null;

  /**
   * UserDefinedNumber09
   */
  UserDefinedNumber09?: number | null;

  /**
   * UserDefinedNumber10
   */
  UserDefinedNumber10?: number | null;

  /**
   * UserDefinedText01
   */
  UserDefinedText01?: string | null;

  /**
   * UserDefinedText02
   */
  UserDefinedText02?: string | null;

  /**
   * UserDefinedText03
   */
  UserDefinedText03?: string | null;

  /**
   * UserDefinedText04
   */
  UserDefinedText04?: string | null;

  /**
   * UserDefinedText05
   */
  UserDefinedText05?: string | null;

  /**
   * UserDefinedText06
   */
  UserDefinedText06?: string | null;

  /**
   * UserDefinedText07
   */
  UserDefinedText07?: string | null;

  /**
   * UserDefinedText08
   */
  UserDefinedText08?: string | null;

  /**
   * UserDefinedText09
   */
  UserDefinedText09?: string | null;

  /**
   * UserDefinedText10
   */
  UserDefinedText10?: string | null;
}
