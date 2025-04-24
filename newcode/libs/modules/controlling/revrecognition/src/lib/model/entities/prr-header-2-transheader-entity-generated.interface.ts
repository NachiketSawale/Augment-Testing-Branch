/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrrConfigurationEntity } from './prr-configuration-entity.interface';
import { IPrrHeaderEntity } from './prr-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPrrHeader2transheaderEntityGenerated extends IEntityBase {

  /**
   * BasCompanyTransheaderFk
   */
  BasCompanyTransheaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * PrrConfigurationEntity
   */
  PrrConfigurationEntity?: IPrrConfigurationEntity | null;

  /**
   * PrrConfigurationFk
   */
  PrrConfigurationFk: number;

  /**
   * PrrHeaderEntity
   */
  PrrHeaderEntity?: IPrrHeaderEntity | null;

  /**
   * PrrHeaderFk
   */
  PrrHeaderFk: number;

  /**
   * TransactionSetId
   */
  TransactionSetId: number;
}
