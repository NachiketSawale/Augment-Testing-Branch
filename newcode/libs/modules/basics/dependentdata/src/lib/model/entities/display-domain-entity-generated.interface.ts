/*
 * Copyright(c) RIB Software GmbH
 */

import { IDependentDataColumnEntity } from './dependent-data-column-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IDisplayDomainEntityGenerated extends IEntityBase {

  /**
   * DependentdatacolumnEntities
   */
  DependentdatacolumnEntities?: IDependentDataColumnEntity[] | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * DomainName
   */
  DomainName?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Islive
   */
  Islive: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
