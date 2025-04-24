/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEstTotalsConfigEntity } from './est-totals-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstTotalsConfigTypeEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * EstTotalsconfigEntity
 */
  EstTotalsconfigEntity?: IEstTotalsConfigEntity | null;

/*
 * EstTotalsconfigFk
 */
  EstTotalsconfigFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * Isdefault
 */
  Isdefault?: boolean | null;
}
