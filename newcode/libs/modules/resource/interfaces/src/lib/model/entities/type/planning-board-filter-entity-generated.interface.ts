/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IResourceTypeEntity } from "./resource-type-entity.interface";

export interface IPlanningBoardFilterEntityGenerated extends IEntityBase {

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ModuleFk
 */
  ModuleFk?: number | null;

/*
 * ResourceTypeEntity
 */
  ResourceTypeEntity?: IResourceTypeEntity | null;

/*
 * TypeFk
 */
  TypeFk?: number | null;
}
