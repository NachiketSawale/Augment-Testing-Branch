/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeAllocationHeaderEntity } from './time-allocation-header-entity.interface';
import { ITimeAlloc2PrjActionEntity } from './time-alloc-2-prj-action-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ITimeAllocationEntityGenerated extends IEntityBase {

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * DistributedHours
   */
  DistributedHours?: number | null;

  /**
   * DistributedHoursCurrentHeader
   */
  DistributedHoursCurrentHeader?: number | null;

  /**
   * DistributedHoursOtherHeaders
   */
  DistributedHoursOtherHeaders?: number | null;

  /**
   * DistributedHoursTotal
   */
  DistributedHoursTotal?: number | null;

  /**
   * EmployeeFk
   */
  EmployeeFk?: number | null;

  /**
   * EtmPlantFk
   */
  EtmPlantFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsGenerated
   */
  IsGenerated: boolean;

  /**
   * PeriodFk
   */
  PeriodFk?: number | null;

  /**
   * Rate
   */
  Rate?: number | null;

  /**
   * RecordDescription
   */
  RecordDescription?: string | null;

  /**
   * RecordFk
   */
  RecordFk: number;

  /**
   * RecordType
   */
  RecordType: number;

  /**
   * RecordingFk
   */
  RecordingFk?: number | null;

  /**
   * RoundingConfigDetail
   */
  // RoundingConfigDetail?: ITksRoundingConfigDetailEntity | null;

  /**
   * TimeAllocationHeaderFk
   */
  TimeAllocationHeaderFk: number;

  /**
   * TimeAllocationheaderEntity
   */
  TimeAllocationheaderEntity?: ITimeAllocationHeaderEntity | null;

  /**
   * TimeAllocations2ProjectActions
   */
  TimeAllocations2ProjectActions?: ITimeAlloc2PrjActionEntity[] | null;

  /**
   * Timealloc2prjActionEntities
   */
  Timealloc2prjActionEntities?: ITimeAlloc2PrjActionEntity[] | null;

  /**
   * TimekeepingGroupId
   */
  TimekeepingGroupId: number;

  /**
   * ToDistribute
   */
  ToDistribute?: number | null;

  /**
   * TotalProductiveHours
   */
  TotalProductiveHours?: number | null;

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
