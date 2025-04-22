/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeEntity } from './change-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IChangeTypeEntityGenerated extends IEntityBase {

  /**
   * ChangeEntities
   */
  ChangeEntities: IChangeEntity[];

  /**
   * DescriptionInfo
   */
  DescriptionInfo: IDescriptionInfo;

  /**
   * Id
   */
  Id: number;
}
