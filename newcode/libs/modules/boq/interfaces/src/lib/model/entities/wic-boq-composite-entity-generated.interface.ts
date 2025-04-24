/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IWicBoqEntity } from './wic-boq-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity } from './boq-header-entity.interface';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IWicBoqCompositeEntityGenerated extends IEntityBase {

/*
 * BoqHeader
 */
  BoqHeader: IBoqHeaderEntity;

/*
 * BoqRootItem
 */
  BoqRootItem: IBoqItemEntity;

/*
 * Id
 */
// Todo-Boq: This property was set initially set to optional (-> Id?: number) which conflicted with a neccessary extension of the derived class with the interface IEntityIdentification.
// Todo-Boq: So the declaration was adjusted manually to conform to this interfacd.
  readonly Id: number;

/*
 * WicBoq
 */
  WicBoq?: IWicBoqEntity | null;
}
