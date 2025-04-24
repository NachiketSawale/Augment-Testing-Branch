/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

export interface IPesHeaderTableDetailApiEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CompanyFK
   */
  CompanyFK: number;

  /**
   * ConCode
   */
  ConCode?: string | null;

  /**
   * ContractCode
   */
  ContractCode?: string | null;

  /**
   * ContractExternalCode
   */
  ContractExternalCode?: string | null;

  /**
   * DeliveryDate
   */
  DeliveryDate: string;

  /**
   * Id
   */
  Id: number;

  /**
   * PesStatusDescription
   */
  PesStatusDescription?: ITranslated | null;

  /**
   * PesStatusId
   */
  PesStatusId: number;

  /**
   * PesValue
   */
  PesValue: number;

  /**
   * PesValueOC
   */
  PesValueOC: number;

  /**
   * SearchPattern
   */
  SearchPattern?: string | null;
}
