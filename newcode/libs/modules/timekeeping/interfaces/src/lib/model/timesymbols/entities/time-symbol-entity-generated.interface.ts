/*
 * Copyright(c) RIB Software GmbH
 */

import { ITimeSymbolEntity } from './time-symbol-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IBasicsCustomizeTimeSymbolGroupEntity } from '@libs/basics/interfaces';

export interface ITimeSymbolEntityGenerated extends IEntityBase {

  /**
   * AdditionalCodeFinance
   */
  AdditionalCodeFinance?: string | null;

  /**
   * ByTimeallocation
   */
  ByTimeallocation: boolean;

  /**
   * Code
   */
  Code: string;

  /**
   * CodeFinance
   */
  CodeFinance?: string | null;

  /**
   * CompanyFk
   */
  CompanyFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsAbsence
   */
  IsAbsence: boolean;

  /**
   * IsAction
   */
  IsAction: boolean;

  /**
   * IsCUMandatory
   */
  IsCUMandatory: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsDriver
   */
  IsDriver: boolean;

  /**
   * IsExpense
   */
  IsExpense: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsOffDay
   */
  IsOffDay: boolean;

  /**
   * IsOverNightTravel
   */
  IsOverNightTravel: boolean;

  /**
   * IsOvertime
   */
  IsOvertime: boolean;

  /**
   * IsPayroll
   */
  IsPayroll: boolean;

  /**
   * IsPresence
   */
  IsPresence: boolean;

  /**
   * IsProductive
   */
  IsProductive: boolean;

  /**
   * IsReporting
   */
  IsReporting: boolean;

  /**
   * IsSurcharges
   */
  IsSurcharges: boolean;

  /**
   * IsTimeAccount
   */
  IsTimeAccount: boolean;

  /**
   * IsTimeAllocation
   */
  IsTimeAllocation: boolean;

  /**
   * IsTravelAllowance
   */
  IsTravelAllowance: boolean;

  /**
   * IsTravelDistance
   */
  IsTravelDistance: boolean;

  /**
   * IsTravelTime
   */
  IsTravelTime: boolean;

  /**
   * IsUplift
   */
  IsUplift: boolean;

  /**
   * IsVacation
   */
  IsVacation: boolean;

  /**
   * IsWtmRelevant
   */
  IsWtmRelevant: boolean;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * TimeSymbolEntities_TksTimesymbolFk
   */
  TimeSymbolEntities_TksTimesymbolFk?: ITimeSymbolEntity[] | null;

  /**
   * TimeSymbolEntity_TksTimesymbolFk
   */
  TimeSymbolEntity_TksTimesymbolFk?: ITimeSymbolEntity | null;

  /**
   * TimeSymbolFk
   */
  TimeSymbolFk?: number | null;

  /**
   * TimeSymbolGroup
   */
  TimeSymbolGroup?: IBasicsCustomizeTimeSymbolGroupEntity | null;

  /**
   * TimeSymbolGroupFk
   */
  TimeSymbolGroupFk: number;

  /**
   * TimeSymbolToCompany
   */
  TimeSymbolToCompany?: string | null;

  /**
   * TimeSymbolTypeFk
   */
  TimeSymbolTypeFk?: number | null;

  /**
   * TimesheetContextFk
   */
  TimesheetContextFk: number;

  /**
   * UoMFk
   */
  UoMFk?: number | null;

  /**
   * ValuationPercent
   */
  ValuationPercent: number;

  /**
   * ValuationRate
   */
  ValuationRate: number;
}
