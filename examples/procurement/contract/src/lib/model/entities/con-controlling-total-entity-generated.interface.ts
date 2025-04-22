/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

export interface IConControllingTotalEntityGenerated {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * ConfirmationDate
   */
  ConfirmationDate?: string | null;

  /**
   * ContrCostCodeCode
   */
  ContrCostCodeCode?: string | null;

  /**
   * ContrCostCodeDescription
   */
  ContrCostCodeDescription?: ITranslated | null;

  /**
   * ContrCostCodeFk
   */
  ContrCostCodeFk?: number | null;

  /**
   * ControllingUnitCode
   */
  ControllingUnitCode?: string | null;

  /**
   * ControllingUnitDescription
   */
  ControllingUnitDescription?: ITranslated | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * DateCallofffrom
   */
  DateCallofffrom?: string | null;

  /**
   * DateCalloffto
   */
  DateCalloffto?: string | null;

  /**
   * DateCanceled
   */
  DateCanceled?: string | null;

  /**
   * DateDelivery
   */
  DateDelivery?: string | null;

  /**
   * DateEffective
   */
  DateEffective: string;

  /**
   * DateOrdered
   */
  DateOrdered: string;

  /**
   * DatePenalty
   */
  DatePenalty?: string | null;

  /**
   * DateQuotation
   */
  DateQuotation?: string | null;

  /**
   * DateReported
   */
  DateReported?: string | null;

  /**
   * ExecutionEnd
   */
  ExecutionEnd?: string | null;

  /**
   * ExecutionStart
   */
  ExecutionStart?: string | null;

  /**
   * HeaderCode
   */
  HeaderCode?: string | null;

  /**
   * HeaderDescription
   */
  HeaderDescription?: string | null;

  /**
   * HeaderId
   */
  HeaderId: number;

  /**
   * HeaderTotal
   */
  HeaderTotal: number;

  /**
   * Id
   */
  Id?: string | null;

  /**
   * ItemFilteredTotal
   */
  ItemFilteredTotal: number;

  /**
   * StatusFk
   */
  StatusFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
