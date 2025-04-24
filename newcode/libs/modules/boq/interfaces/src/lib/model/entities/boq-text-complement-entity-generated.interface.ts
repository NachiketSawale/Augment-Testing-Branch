/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity } from './boq-header-entity.interface';
import { IBoqItemEntity } from './boq-item-entity.interface';


export interface IBoqTextComplementEntityGenerated extends IEntityBase {

/*
 * BoqHeaderEntity
 */
  BoqHeaderEntity?: IBoqHeaderEntity | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemEntity
 */
  BoqItemEntity?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * ComplBody
 */
  ComplBody?: string | null;

/*
 * ComplCaption
 */
  ComplCaption?: string | null;

/*
 * ComplTail
 */
  ComplTail?: string | null;

/*
 * ComplType
 */
  ComplType: number;

/*
 * Id
 */
  Id: number;

/*
 * Sorting
 */
  Sorting: number;
}
