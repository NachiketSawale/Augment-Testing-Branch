/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IQtoAddressRangeDetailEntity } from './qto-address-range-detail-entity.interface';
import { IQtoConfigEntity } from './qto-config-entity.interface';
import { IQtoAddressRangeEntity } from './qto-address-range-entity.interface';

export interface IQtoHeaderDataGenerated {

/*
 * BoqHeaderId
 */
  BoqHeaderId?: number | null;

/*
 * QtoAddressRangeDetailDto
 */
  QtoAddressRangeDetailDto?: IQtoAddressRangeDetailEntity | null;

/*
 * QtoAddressRangeDetailDto2Delete
 */
  QtoAddressRangeDetailDto2Delete?: IQtoAddressRangeDetailEntity[] | null;

/*
 * QtoAddressRangeDetailDtos
 */
  QtoAddressRangeDetailDtos?: IQtoAddressRangeDetailEntity[] | null;

/*
 * QtoAddressRangeDialogDto
 */
  QtoAddressRangeDialogDto?: IQtoAddressRangeEntity | null;

/*
 * QtoAddressRangeImportDto
 */
  QtoAddressRangeImportDto?: IQtoAddressRangeEntity | null;

/*
 * QtoConfigDto
 */
  QtoConfigDto?: IQtoConfigEntity | null;

/*
 * QtoTargetTypeId
 */
  QtoTargetTypeId?: number | null;

/*
 * qtoBoqType
 */
  qtoBoqType?: number | null;

/*
 * qtoHeaderFk
 */
  qtoHeaderFk?: number | null;
}
