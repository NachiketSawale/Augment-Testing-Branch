/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoAddressRangeDetailEntity } from './qto-address-range-detail-entity.interface';
import { IQtoConfigEntity } from './qto-config-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IQtoAddressRangeEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * IsActive
 */
  IsActive: boolean;

/*
 * QtoAddressRangeDetailEntities
 */
  QtoAddressRangeDetailEntities?: IQtoAddressRangeDetailEntity[] | null;

/*
 * QtoConfigEntities_QtoAddressRangeDialogFk
 */
  QtoConfigEntities_QtoAddressRangeDialogFk?: IQtoConfigEntity[] | null;

/*
 * QtoConfigEntities_QtoAddressRangeImportFk
 */
  QtoConfigEntities_QtoAddressRangeImportFk?: IQtoConfigEntity[] | null;
}
