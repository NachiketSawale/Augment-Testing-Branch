/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcDataViewEntity } from './prc-data-view-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IPrcDataViewEntityGenerated {

  /**
   * Children
   */
  Children?: IPrcDataViewEntity[] | null;

  /**
   * Count
   */
  Count?: number | null;

  /**
   * DataFk
   */
  DataFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IdReal
   */
  IdReal: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * Sorting
   */
  Sorting?: number | null;

  /**
   * Type
   */
  Type: string;
}
