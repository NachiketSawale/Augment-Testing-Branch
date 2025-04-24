/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBusinessPartnerEntity } from './business-partner-entity.interface';
import { IBusinessPartnerRelationTypeEntity } from './business-partner-relation-type-entity.interface';

export interface IBusinessPartnerRelationEntityGenerated extends IEntityBase {

  /**
   * AddressLine
   */
  AddressLine?: string | null;

  /**
   * BpSubsidiary2Fk
   */
  BpSubsidiary2Fk?: number | null;

  /**
   * BpSubsidiaryFk
   */
  BpSubsidiaryFk?: number | null;

  /**
   * BusinessPartner2Fk
   */
  BusinessPartner2Fk: number;

  /**
   * BusinessPartnerEntity_BpdBusinesspartner2Fk
   */
  BusinessPartnerEntity_BpdBusinesspartner2Fk?: IBusinessPartnerEntity | null;

  /**
   * BusinessPartnerEntity_BpdBusinesspartnerFk
   */
  BusinessPartnerEntity_BpdBusinesspartnerFk?: IBusinessPartnerEntity | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * RelationTypeFk
   */
  RelationTypeFk: number;

  /**
   * RelationtypeEntity
   */
  RelationtypeEntity?: IBusinessPartnerRelationTypeEntity | null;

  /**
   * Remark
   */
  Remark?: string | null;
}
