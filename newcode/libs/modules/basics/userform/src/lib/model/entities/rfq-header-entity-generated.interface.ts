/*
 * Copyright(c) RIB Software GmbH
 */

import { IProjectEntity } from './project-entity.interface';
import { IQtnHeaderEntity } from './qtn-header-entity.interface';
import { IRfqHeaderEntity } from './rfq-header-entity.interface';
import { IRfqHeaderFormDataEntity } from './rfq-header-form-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IRfqHeaderEntityGenerated extends IEntityBase {

  /**
   * AwardReference
   */
  AwardReference?: string | null;

  /**
   * ClerkPrcFk
   */
  ClerkPrcFk?: number | null;

  /**
   * ClerkReqFk
   */
  ClerkReqFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CompanyFk
   */
  CompanyFk: number;

  /**
   * CurrencyFk
   */
  CurrencyFk: number;

  /**
   * DateAwarddeadline
   */
  DateAwarddeadline?: Date | string | null;

  /**
   * DateCanceled
   */
  DateCanceled?: Date | string | null;

  /**
   * DateQuotedeadline
   */
  DateQuotedeadline?: Date | string | null;

  /**
   * DateRequested
   */
  DateRequested: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EvaluationschemaFk
   */
  EvaluationschemaFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LocaQuotedeadline
   */
  LocaQuotedeadline?: string | null;

  /**
   * MdcBillingSchemaFk
   */
  MdcBillingSchemaFk?: number | null;

  /**
   * PaymentTermAdFk
   */
  PaymentTermAdFk?: number | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PlannedEnd
   */
  PlannedEnd?: Date | string | null;

  /**
   * PlannedStart
   */
  PlannedStart?: Date | string | null;

  /**
   * PrcAwardmethodFk
   */
  PrcAwardmethodFk: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * PrcContracttypeFk
   */
  PrcContracttypeFk: number;

  /**
   * PrcStrategyFk
   */
  PrcStrategyFk: number;

  /**
   * ProjectEntity
   */
  ProjectEntity?: IProjectEntity | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * QtnHeaderEntities
   */
  QtnHeaderEntities?: IQtnHeaderEntity[] | null;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * RfqHeaderEntities_RfqHeaderFk
   */
  RfqHeaderEntities_RfqHeaderFk?: IRfqHeaderEntity[] | null;

  /**
   * RfqHeaderEntity_RfqHeaderFk
   */
  RfqHeaderEntity_RfqHeaderFk?: IRfqHeaderEntity | null;

  /**
   * RfqHeaderFk
   */
  RfqHeaderFk?: number | null;

  /**
   * RfqHeaderFormdataEntities
   */
  RfqHeaderFormdataEntities?: IRfqHeaderFormDataEntity[] | null;

  /**
   * RfqStatusFk
   */
  RfqStatusFk: number;

  /**
   * RfqTypeFk
   */
  RfqTypeFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * TimeQuotedeadline
   */
  TimeQuotedeadline?: string | null;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
