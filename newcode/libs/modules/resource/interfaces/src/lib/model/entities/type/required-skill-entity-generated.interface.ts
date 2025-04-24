/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IResourceTypeEntity } from "@libs/resource/interfaces";

export interface IRequiredSkillEntityGenerated extends IEntityBase {

/*
 * Comment
 */
  Comment?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ResourceTypeEntity
 */
  ResourceTypeEntity?: IResourceTypeEntity | null;

/*
 * SkillFk
 */
  SkillFk?: number | null;

/*
 * TypeFk
 */
  TypeFk?: number | null;
}
