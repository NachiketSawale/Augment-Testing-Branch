/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoAddressRangeEntity } from './qto-address-range-entity.interface';
import { IQtoMainHeaderGridEntity } from '../qto-main-header-grid-entity.class';

export interface IQtoConfigEntityGenerated extends IEntityBase {

/*
 * CommentPrjLevel
 */
  CommentPrjLevel: boolean;

/*
 * CommentRubricLevel
 */
  CommentRubricLevel: boolean;

/*
 * CommentSystemLevel
 */
  CommentSystemLevel: boolean;

/*
 * Id
 */
  Id: number;

/*
 * QtoAddressRangeDialogFk
 */
  QtoAddressRangeDialogFk?: number | null;

/*
 * QtoAddressRangeEntity_QtoAddressRangeDialogFk
 */
  QtoAddressRangeEntity_QtoAddressRangeDialogFk?: IQtoAddressRangeEntity | null;

/*
 * QtoAddressRangeEntity_QtoAddressRangeImportFk
 */
  QtoAddressRangeEntity_QtoAddressRangeImportFk?: IQtoAddressRangeEntity | null;

/*
 * QtoAddressRangeImportFk
 */
  QtoAddressRangeImportFk?: number | null;

/*
 * QtoHeaderEntity
 */
  QtoHeaderEntity?: IQtoMainHeaderGridEntity | null;

/*
 * QtoHeaderFk
 */
  QtoHeaderFk: number;
}
