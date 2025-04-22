/*
 * Copyright(c) RIB Software GmbH
 */

import { PrcStructureLookupEntity } from '@libs/basics/shared';
import { IBusinessPartner2PrcStructureEntity } from './business-partner-2-prc-structure-entity.interface';
import { ISubsidiaryEntity } from './subsidiary-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBusinessPartner2PrcStructureEntityGenerated extends IEntityBase {

  /**
   * BpdSubsidiaryFk
   */
  BpdSubsidiaryFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ChildItems
   */
  ChildItems?: IBusinessPartner2PrcStructureEntity[] | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * ParentPrcStructureFk
   */
  ParentPrcStructureFk?: number | null;

  /**
   * PrcStructure
   */
  PrcStructure?: PrcStructureLookupEntity | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * SubsidiaryEntity
   */
  SubsidiaryEntity?: ISubsidiaryEntity | null;
}
