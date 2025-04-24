/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IModuleEntity } from '../../../modules/model/entities/module-entity.interface';

export interface INavbarConfigEntityGenerated extends IEntityBase {

/*
 * AppVersion
 */
  AppVersion?: string | null;

/*
 * BarItemEntity
 */
  //BarItemEntity?: IBarItemEntity | null;

/*
 * BasBarItemFk
 */
  BasBarItemFk: number;

/*
 * BasModuleFk
 */
  BasModuleFk: number;

/*
 * Id
 */
  Id: number;

/*
 * IsMenueItem
 */
  IsMenueItem?: boolean | null;

/*
 * IsPortal
 */
  IsPortal?: boolean | null;

/*
 * IsStandard
 */
  IsStandard: boolean;

/*
 * ModuleEntity
 */
  ModuleEntity?: IModuleEntity | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * Visibility
 */
  Visibility?: boolean | null;
}
