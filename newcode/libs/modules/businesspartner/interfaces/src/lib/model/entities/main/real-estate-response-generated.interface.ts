/*
 * Copyright(c) RIB Software GmbH
 */

import { IRealEstateEntity } from './real-estate-entity.interface';
import { ISubsidiaryLookupVEntity } from './subsidiary-lookup-ventity.interface';

export interface IRealEstateResponseGenerated {

  /**
   * Main
   */
  Main?: IRealEstateEntity[] | null;

  /**
   * Subsidiary
   */
  Subsidiary?: ISubsidiaryLookupVEntity[] | null;
}
