/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEstColumnConfigTypeEntity } from './est-column-config-type-entity.interface';

export interface IGetAllConfigResponseGenerated {

/*
 * Config
 */
  Config?: IEstConfigEntity | null;

/*
 * ConfigType
 */
  ConfigType?: IEstColumnConfigTypeEntity | null;

/*
 * ConfigTypes
 */
  ConfigTypes?: IEstColumnConfigTypeEntity[] | null;
}
