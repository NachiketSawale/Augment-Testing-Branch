/*
 * Copyright(c) RIB Software GmbH
 */

import { ISubsidiaryEntity } from './subsidiary-entity.interface';
import { ISubsidiaryStatusEntity } from './subsidiary-status-entity.interface';

export interface ISubsidiaryResponseGenerated {

  /**
   * AddressType
   * todo - not sure how to handle IInt32[]
   */
  //AddressType?: IInt32[] | null;

  /**
   * Main
   */
  Main?: ISubsidiaryEntity[] | null;

  /**
   * SubsidiaryStatusEditRight
   */
  SubsidiaryStatusEditRight?: ISubsidiaryStatusEntity[] | null;
}
