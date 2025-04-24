/*
 * Copyright(c) RIB Software GmbH
 */

import { IInfo } from './info.interface';
import { IDescriptionInfo, ITranslated } from '@libs/platform/common';

export interface IContractBasicInfoApiEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CompanyId
   */
  CompanyId: number;

  /**
   * Currency
   */
  Currency?: string | null;

  /**
   * CurrencyFK
   */
  CurrencyFK: number;

  /**
   * CustomerCompanyCode
   */
  CustomerCompanyCode?: string | null;

  /**
   * CustomerCompanyName
   */
  CustomerCompanyName?: string | null;

  /**
   * DateDelivery
   */
  DateDelivery?: string | null;

  /**
   * DateOrdered
   */
  DateOrdered: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * Icon
   */
  Icon?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;

  /**
   * StatusDescription
   */
  StatusDescription?: ITranslated | null;

  /**
   * StatusDescriptionInfo
   */
  StatusDescriptionInfo?: IDescriptionInfo | null;

  /**
   * StatusId
   */
  StatusId: number;

  /**
   * item
   */
  item?: IInfo | null;

  /**
   * status
   */
  status?: string | null;
}
