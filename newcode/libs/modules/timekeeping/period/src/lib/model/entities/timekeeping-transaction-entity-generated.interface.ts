/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ITimekeepingTransactionEntityGenerated extends IEntityBase {

/*
 * Account
 */
  Account?: string | null;

/*
 * AccountFk
 */
  AccountFk?: number | null;

/*
 * ActivityFk
 */
  ActivityFk?: number | null;

/*
 * Amount
 */
  Amount: number;

/*
 * BilHeaderFk
 */
  BilHeaderFk?: number | null;

/*
 * CompanyChargedFk
 */
  CompanyChargedFk: number;

/*
 * CompanyCostHeaderFk
 */
  CompanyCostHeaderFk?: number | null;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * ControllingUnitAssign01
 */
  ControllingUnitAssign01?: string | null;

/*
 * ControllingUnitAssign02
 */
  ControllingUnitAssign02?: string | null;

/*
 * ControllingUnitAssign03
 */
  ControllingUnitAssign03?: string | null;

/*
 * ControllingUnitAssign04
 */
  ControllingUnitAssign04?: string | null;

/*
 * ControllingUnitAssign05
 */
  ControllingUnitAssign05?: string | null;

/*
 * ControllingUnitAssign06
 */
  ControllingUnitAssign06?: string | null;

/*
 * ControllingUnitAssign07
 */
  ControllingUnitAssign07?: string | null;

/*
 * ControllingUnitAssign08
 */
  ControllingUnitAssign08?: string | null;

/*
 * ControllingUnitAssign09
 */
  ControllingUnitAssign09?: string | null;

/*
 * ControllingUnitAssign10
 */
  ControllingUnitAssign10?: string | null;

/*
 * ControllingUnitAssignDesc01
 */
  ControllingUnitAssignDesc01?: string | null;

/*
 * ControllingUnitAssignDesc02
 */
  ControllingUnitAssignDesc02?: string | null;

/*
 * ControllingUnitAssignDesc03
 */
  ControllingUnitAssignDesc03?: string | null;

/*
 * ControllingUnitAssignDesc04
 */
  ControllingUnitAssignDesc04?: string | null;

/*
 * ControllingUnitAssignDesc05
 */
  ControllingUnitAssignDesc05?: string | null;

/*
 * ControllingUnitAssignDesc06
 */
  ControllingUnitAssignDesc06?: string | null;

/*
 * ControllingUnitAssignDesc07
 */
  ControllingUnitAssignDesc07?: string | null;

/*
 * ControllingUnitAssignDesc08
 */
  ControllingUnitAssignDesc08?: string | null;

/*
 * ControllingUnitAssignDesc09
 */
  ControllingUnitAssignDesc09?: string | null;

/*
 * ControllingUnitAssignDesc10
 */
  ControllingUnitAssignDesc10?: string | null;

/*
 * ControllingUnitCode
 */
  ControllingUnitCode?: string | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * CreateNewRecord
 */
  CreateNewRecord?: boolean | null;

/*
 * EmployeeFk
 */
  EmployeeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * InvHeaderFk
 */
  InvHeaderFk?: number | null;

/*
 * IsControllingRelevant
 */
  IsControllingRelevant: boolean;

/*
 * IsDebit
 */
  IsDebit: boolean;

/*
 * IsSuccess
 */
  IsSuccess: boolean;

/*
 * MdcTaxCodeFk
 */
  MdcTaxCodeFk?: number | null;

/*
 * NominalDimension1
 */
  NominalDimension1?: string | null;

/*
 * NominalDimension2
 */
  NominalDimension2?: string | null;

/*
 * NominalDimension3
 */
  NominalDimension3?: string | null;

/*
 * PeriodFk
 */
  PeriodFk: number;

/*
 * PostingDate
 */
  PostingDate: string;

/*
 * PostingNarritive
 */
  PostingNarritive?: string | null;

/*
 * ProjectChangeFk
 */
  ProjectChangeFk?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * SettlementItemFk
 */
  SettlementItemFk?: number | null;

/*
 * TimekeepingTransactionFk
 */
  TimekeepingTransactionFk?: number | null;

/*
 * TransactionCase
 */
  TransactionCase: number;

/*
 * TransactionTypeFk
 */
  TransactionTypeFk: number;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * VoucherDate
 */
  VoucherDate: string;

/*
 * VoucherNumber
 */
  VoucherNumber: string;
}
