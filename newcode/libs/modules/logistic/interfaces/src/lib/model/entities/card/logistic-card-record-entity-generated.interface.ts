/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ILogisticCardRecordEntityGenerated extends IEntityBase {

/*
 * AcceptedQuantity
 */
  AcceptedQuantity: number;

/*
 * CardRecordDescription
 */
  CardRecordDescription?: string | null;

/*
 * CardRecordFk
 */
  CardRecordFk: number;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * DateEffective
 */
  DateEffective?: string | null;

/*
 * DeliveredQuantity
 */
  DeliveredQuantity: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * DispatchRecordFk
 */
  DispatchRecordFk?: number | null;

/*
 * EmployeeFk
 */
  EmployeeFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBulkPlant
 */
  IsBulkPlant?: boolean | null;

/*
 * IsSerial
 */
  IsSerial?: boolean | null;

/*
 * JobCardActivityFk
 */
  JobCardActivityFk: number;

/*
 * JobCardFk
 */
  JobCardFk: number;

/*
 * JobCardRecordTypeFk
 */
  JobCardRecordTypeFk: number;

/*
 * Lot
 */
  Lot?: string | null;

/*
 * MaterialFk
 */
  MaterialFk?: number | null;

/*
 * PlantFk
 */
  PlantFk?: number | null;

/*
 * ProcurementStructureFk
 */
  ProcurementStructureFk?: number | null;

/*
 * ProjectStockFk
 */
  ProjectStockFk?: number | null;

/*
 * ProjectStockLocationFk
 */
  ProjectStockLocationFk?: number | null;

/*
 * Quantity
 */
  Quantity: number;

/*
 * RecordNo
 */
  RecordNo: number;

/*
 * ReservationId
 */
  ReservationId?: number | null;

/*
 * StockTransactionTypeFk
 */
  StockTransactionTypeFk?: number | null;

/*
 * SundryServiceFk
 */
  SundryServiceFk?: number | null;

/*
 * UomFk
 */
  UomFk: number;

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
 * WorkOperationIsHire
 */
  WorkOperationIsHire?: boolean | null;

/*
 * WorkOperationIsMinor
 */
  WorkOperationIsMinor?: boolean | null;

/*
 * WorkOperationTypeFk
 */
  WorkOperationTypeFk?: number | null;
}
