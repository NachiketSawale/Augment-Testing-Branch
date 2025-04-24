/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenCompanyEntity } from './oen-company-entity.interface';
import { IOenLbMetadataEntity } from './oen-lb-metadata-entity.interface';
import { IOenLvHeaderEntity } from './oen-lv-header-entity.interface';
import { IOenParamListEntity } from './oen-param-list-entity.interface';
import { IOenPersonEntity } from './oen-person-entity.interface';

export interface IOenContactEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * OenCompany
 */
  OenCompany?: IOenCompanyEntity | null;

/*
 * OenLbMetadata
 */
  OenLbMetadata?: IOenLbMetadataEntity | null;

/*
 * OenLbMetadataFk
 */
  OenLbMetadataFk?: number | null;

/*
 * OenLvHeaderBidder
 */
  OenLvHeaderBidder?: IOenLvHeaderEntity | null;

/*
 * OenLvHeaderBidderFk
 */
  OenLvHeaderBidderFk?: number | null;

/*
 * OenLvHeaderClient
 */
  OenLvHeaderClient?: IOenLvHeaderEntity | null;

/*
 * OenLvHeaderClientFk
 */
  OenLvHeaderClientFk?: number | null;

/*
 * OenLvHeaderCreator
 */
  OenLvHeaderCreator?: IOenLvHeaderEntity | null;

/*
 * OenLvHeaderCreatorFk
 */
  OenLvHeaderCreatorFk?: number | null;

/*
 * OenLvHeaderProcUnit
 */
  OenLvHeaderProcUnit?: IOenLvHeaderEntity | null;

/*
 * OenLvHeaderProcUnitFk
 */
  OenLvHeaderProcUnitFk?: number | null;

/*
 * OenParamList
 */
  OenParamList?: IOenParamListEntity | null;

/*
 * OenParamListFk
 */
  OenParamListFk?: number | null;

/*
 * OenPerson
 */
  OenPerson?: IOenPersonEntity | null;
}
