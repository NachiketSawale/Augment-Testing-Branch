/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcCallOffAgreementEntityGenerated extends IEntityBase {

  /**
   * CallOffAgreement
   */
  CallOffAgreement?: string | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ContractPenalty
   */
  ContractPenalty: boolean;

  /**
   * EarliestStart
   */
  EarliestStart?: string | null;

  /**
   * ExecutionDuration
   */
  ExecutionDuration: number;

  /**
   * Id
   */
  Id: number;

  /**
   * LatestStart
   */
  LatestStart?: string | null;

  /**
   * LeadTime
   */
  LeadTime: number;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk?: number | null;
}
