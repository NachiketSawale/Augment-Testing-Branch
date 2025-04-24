/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IRateBookEntity } from './rate-book-entity.interface';
import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface IRateBookEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code?: string | null;

/*
 * ContentEntity
 */
  // ContentEntity?: IContentEntity | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * FilterId
 */
  FilterId: number;

/*
 * FilterType
 */
  FilterType: number;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsChecked
 */
  IsChecked?: boolean | null | string;

/*
 * IsReadOnly
 */
  IsReadOnly: boolean;

/*
 * PrjContentFk
 */
  PrjContentFk: number;

/*
 * RateBookChildren
 */
  RateBookChildren?: IRateBookEntity[] | null;

/*
 * RateBookParentFk
 */
  RateBookParentFk?: number | null;
}
