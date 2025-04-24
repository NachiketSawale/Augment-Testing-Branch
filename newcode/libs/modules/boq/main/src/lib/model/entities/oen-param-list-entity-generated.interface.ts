/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IOenContactEntity } from './oen-contact-entity.interface';
import { IOenImageEntity } from './oen-image-entity.interface';
import { IOenParamSetEntity } from './oen-param-set-entity.interface';
import { IOenPictogramEntity } from './oen-pictogram-entity.interface';
import { IOenParamTreeItemEntity } from './oen-param-tree-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOenParamListEntityGenerated extends IEntityBase {

/*
 * BlobsTextFk
 */
  BlobsTextFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * Code
 */
  Code: string;

/*
 * CodeFunctionCat
 */
  CodeFunctionCat?: string | null;

/*
 * CodeProductCat
 */
  CodeProductCat?: string | null;

/*
 * Description
 */
  Description: string;

/*
 * DownloadUrl
 */
  DownloadUrl?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OenContacts
 */
  OenContacts?: IOenContactEntity[] | null;

/*
 * OenImages
 */
  OenImages?: IOenImageEntity[] | null;

/*
 * OenParamSets
 */
  OenParamSets?: IOenParamSetEntity[] | null;

/*
 * OenPictograms
 */
  OenPictograms?: IOenPictogramEntity[] | null;

/*
 * OenReleaseStatusFk
 */
  OenReleaseStatusFk: number;

/*
 * ParamTreeItemChildren
 */
  ParamTreeItemChildren?: IOenParamTreeItemEntity[] | null;

/*
 * ParamTreeItemParentId
 */
  ParamTreeItemParentId?: number | null;

/*
 * ParamTreeType
 */
  ParamTreeType?: string | null;

/*
 * VersionDate
 */
  VersionDate: string;

/*
 * VersionNumber
 */
  VersionNumber: number;
}
