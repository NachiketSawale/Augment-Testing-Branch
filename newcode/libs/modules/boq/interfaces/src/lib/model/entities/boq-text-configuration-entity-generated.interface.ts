/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from './boq-item-entity.interface';
import { IBoqTextConfigurationEntity } from './boq-text-configuration-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IBoqTextConfigurationEntityGenerated extends IEntityBase {

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
 * BoqTextConfigGroups
 */
  BoqTextConfigGroups?: IBoqTextConfigurationEntity[] | null;

/*
 * BoqTextConfigurationChildren
 */
  BoqTextConfigurationChildren?: IBoqTextConfigurationEntity[] | null;

/*
 * BoqTextConfigurationFk
 */
  BoqTextConfigurationFk?: number | null;

/*
 * BoqTextConfigurationParent
 */
  BoqTextConfigurationParent?: IBoqTextConfigurationEntity | null;

/*
 * ConfigBody
 */
  ConfigBody?: string | null;

/*
 * ConfigCaption
 */
  ConfigCaption?: string | null;

/*
 * ConfigTail
 */
  ConfigTail?: string | null;

/*
 * ConfigType
 */
  ConfigType: number;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * Isoutput
 */
  Isoutput: boolean;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting: number;
}
