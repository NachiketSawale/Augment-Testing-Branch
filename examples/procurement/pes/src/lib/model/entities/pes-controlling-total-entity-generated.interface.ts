/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

export interface IPesControllingTotalEntityGenerated {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

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
   * DateDelivered
   */
  DateDelivered: string;

  /**
   * DateDeliveredFrom
   */
  DateDeliveredFrom?: string | null;

  /**
   * DateEffective
   */
  DateEffective: string;

  /**
   * DocumentDate
   */
  DocumentDate?: string | null;

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
   * PesHeaderFk
   */
  PesHeaderFk: number;

  /**
   * StatusFk
   */
  StatusFk: number;
}
