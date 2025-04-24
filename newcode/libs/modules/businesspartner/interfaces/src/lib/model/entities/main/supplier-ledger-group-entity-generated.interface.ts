/*
 * Copyright(c) RIB Software GmbH
 */

import { ISubLedgerContextEntity } from './sub-ledger-context-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface ISupplierLedgerGroupEntityGenerated {

  /**
   * BusinessGroup
   */
  BusinessGroup?: string | null;

  /**
   * CreditorGroup
   */
  CreditorGroup?: string | null;

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
   * RetentionPayables
   */
  RetentionPayables: string;

  /**
   * SubLedgerContextFk
   */
  SubLedgerContextFk: number;

  /**
   * SubledgerContextEntity
   */
  SubledgerContextEntity?: ISubLedgerContextEntity | null;
}
