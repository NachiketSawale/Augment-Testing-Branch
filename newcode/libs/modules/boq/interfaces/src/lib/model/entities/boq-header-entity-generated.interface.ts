/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqSurchargedItemEntity } from './boq-surcharged-item-entity.interface';
import { IBoqTextComplementEntity } from './boq-text-complement-entity.interface';
import { IOenGraphicEntity } from './oen-graphic-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqStructureEntity } from './boq-structure-entity.interface';
import { IBoqTypeEntity } from './boq-type-entity.interface';

export interface IBoqHeaderEntityGenerated extends IEntityBase {

/*
 * BackupComment
 */
  BackupComment?: string | null;

/*
 * BackupDescription
 */
  BackupDescription?: string | null;

/*
 * BackupNumber
 */
  BackupNumber?: number | null;

/*
 * BackupSourceFk
 */
  BackupSourceFk?: number | null;

/*
 * BasCurrencyFk
 */
  BasCurrencyFk?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqStatusFk
 */
  BoqStatusFk: number;

/*
 * BoqStructureEntity
 */
  BoqStructureEntity?: IBoqStructureEntity | null;

/*
 * BoqStructureFk
 */
  BoqStructureFk?: number | null;

/*
 * BoqSurchardedItemEntities
 */
  BoqSurchardedItemEntities?: IBoqSurchargedItemEntity[] | null;

/*
 * BoqTextComplementEntities
 */
  BoqTextComplementEntities?: IBoqTextComplementEntity[] | null;

/*
 * BoqType
 */
  BoqType?: IBoqTypeEntity | null;

/*
 * BoqTypeFk
 */
  BoqTypeFk?: number | null;

/*
 * CreationType
 */
  CreationType: number;

/*
 * EstUppConfigFk
 */
  EstUppConfigFk?: number | null;

/*
 * EstUppConfigtypeFk
 */
  EstUppConfigtypeFk?: number | null;

/*
 * Gaebtype
 */
  Gaebtype?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsBackup
 */
  IsBackup?: boolean | null;

/*
 * IsGCBoq
 */
  IsGCBoq: boolean;

/*
 * IsReadOnly
 */
  IsReadOnly?: boolean | null;

/*
 * OenGraphics
 */
  OenGraphics?: IOenGraphicEntity[] | null;

/*
 * Reference
 */
  Reference?: string | null;

/*
 * SourceInfo
 */
  SourceInfo?: string | null;
}
