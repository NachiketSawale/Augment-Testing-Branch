/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from '@libs/procurement/interfaces';
import { IConTotalEntity } from '@libs/procurement/interfaces';

export interface IContractCreateCompleteResponse {
  ConHeaderDto?: IConHeaderEntity;
  PrcTotalsDto?: Array<IConTotalEntity>;
}
