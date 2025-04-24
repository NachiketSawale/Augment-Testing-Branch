/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IOenBoqItemEntity } from './oen-boq-item-entity.interface';

export interface IOenLbMetadataEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * Code
 */
  Code: string;

/*
 * Description
 */
  Description: string;

/*
 * DescriptionPartialEdition
 */
  DescriptionPartialEdition?: string | null;

/*
 * DownloadUrl
 */
  DownloadUrl?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * OenBoqItem
 */
  OenBoqItem?: IOenBoqItemEntity | null;

/*
 * OenReleaseStatusFk
 */
  OenReleaseStatusFk: number;

/*
 * Type
 */
  Type: number;

/*
 * VersionDate
 */
  VersionDate: string;

/*
 * VersionNumber
 */
  VersionNumber: number;
}
