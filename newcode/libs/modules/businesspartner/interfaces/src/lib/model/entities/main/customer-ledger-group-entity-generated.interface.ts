/*
 * Copyright(c) RIB Software GmbH
 */

import { ISubLedgerContextEntity } from './sub-ledger-context-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface ICustomerLedgerGroupEntityGenerated {

  /**
   * BusinessGroup
   */
  BusinessGroup: string;

  /**
   * DebtorGroup
   */
  DebtorGroup: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * RetentionInstallment
   */
  RetentionInstallment: string;

  /**
   * RetentionReceivables
   */
  RetentionReceivables: string;

  /**
   * SubledgerContextEntity
   */
  SubledgerContextEntity?: ISubLedgerContextEntity | null;

  /**
   * SubledgerContextFk
   */
  SubledgerContextFk: number;
}
