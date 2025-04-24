/*
 * Copyright(c) RIB Software GmbH
 */

import { IEmployeeLeaveEntity } from './employee-leave-entity.interface';
import { IEmployeeSkillDocumentEntity } from './employee-skill-document-entity.interface';
import { IEmployeeWTMEntity } from './employee-wtmentity.interface';
import { IPlannedAbsenceEntity } from './planned-absence-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';
//import { ITelephoneNumberEntity } from '../../../../../../basics/site/src/lib/model/schema/models/telephone-number-entity.interface';

export interface IEmployeeEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  Address?: IAddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * BirthDate
   */
  BirthDate?: string | null;

  /**
   * BlobsFk
   */
  BlobsFk?: number | null;

  /**
   * CalendarFk
   */
  CalendarFk?: number | null;

  /**
   * ClerkFk
   */
  ClerkFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CompanyOperatingFk
   */
  CompanyOperatingFk: number;

  /**
   * CostGroupFk
   */
  CostGroupFk: number;

  /**
   * CountryFk
   */
  CountryFk?: number | null;

  /**
   * CrewLeaderFk
   */
  CrewLeaderFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Email
   */
  Email?: string | null;

  /**
   * EmployeeAreaFk
   */
  EmployeeAreaFk?: number | null;

  /**
   * EmployeeGroupFk
   */
  EmployeeGroupFk?: number | null;

  /**
   * EmployeeLeaveEntities
   */
  EmployeeLeaveEntities?: IEmployeeLeaveEntity[] | null;

  /**
   * EmployeeSkillDocumentEntities
   */
  EmployeeSkillDocumentEntities?: IEmployeeSkillDocumentEntity[] | null;

  /**
   * EmployeeStatusFk
   */
  EmployeeStatusFk: number;

  /**
   * EmployeeSubAreaFk
   */
  EmployeeSubAreaFk?: number | null;

  /**
   * EmployeeWTMEntities
   */
  EmployeeWTMEntities?: IEmployeeWTMEntity[] | null;

  /**
   * FamilyName
   */
  FamilyName?: string | null;

  /**
   * FirstName
   */
  FirstName?: string | null;

  /**
   * FlagBlobs
   */
  FlagBlobs: boolean;

  /**
   * GenerateRecording
   */
  GenerateRecording: boolean;

  /**
   * GroupFk
   */
  GroupFk: number;

  /**
   * HasCrewMember
   */
  HasCrewMember: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * Initials
   */
  Initials?: string | null;

  /**
   * IsCrewLeader
   */
  IsCrewLeader: boolean;

  /**
   * IsHiredLabor
   */
  IsHiredLabor: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsPayroll
   */
  IsPayroll: boolean;

  /**
   * IsTimekeeper
   */
  IsTimekeeper: boolean;

  /**
   * IsWhiteCollar
   */
  IsWhiteCollar: boolean;

  /**
   * PaymentGroupFk
   */
  PaymentGroupFk: number;

  /**
   * ProfessionalCategoryFk
   */
  ProfessionalCategoryFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * ShiftFk
   */
  ShiftFk: number;

  /**
   * StartDate
   */
  StartDate: string;

  /**
   * TelephoneMobil
   */
  //TelephoneMobil?: ITelephoneNumberEntity | null;

  /**
   * TelephoneNumber
   */
  //TelephoneNumber?: ITelephoneNumberEntity | null;

  /**
   * TelephoneNumberMobFk
   */
  TelephoneNumberMobFk?: number | null;

  /**
   * TelephoneNumberTelFk
   */
  TelephoneNumberTelFk?: number | null;

  /**
   * TerminalDate
   */
  TerminalDate?: string | null;

  /**
   * TimekeepingGroupFk
   */
  TimekeepingGroupFk: number;

  /**
   * TimesheetContextFk
   */
  TimesheetContextFk: number;

  /**
   * TksPlannedabsenceEntities
   */
  TksPlannedabsenceEntities?: IPlannedAbsenceEntity[] | null;

  /**
   * TrafficLightFk
   */
  TrafficLightFk: number;

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
   * UserFk
   */
  UserFk?: number | null;

  /**
   * VacationBalance
   */
  VacationBalance?: number | null;

  /**
   * WorkingTimeAccountBalance
   */
  WorkingTimeAccountBalance: number;

  /**
   * WorkingTimeModelFk
   */
  WorkingTimeModelFk?: number | null;

  /**
   * YearlyVacation
   */
  YearlyVacation?: number | null;
}
