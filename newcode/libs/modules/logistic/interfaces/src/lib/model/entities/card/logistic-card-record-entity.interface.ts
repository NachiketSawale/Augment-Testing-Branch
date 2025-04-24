/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardRecordEntityGenerated } from './logistic-card-record-entity-generated.interface';
import { ILogisticCommonCardRecordEntity } from '../common';

export interface ILogisticCardRecordEntity extends ILogisticCardRecordEntityGenerated, ILogisticCommonCardRecordEntity {
	CardRecordDescription: string | null
}
