/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardTemplateJobCardRecordTemplateEntityGenerated } from './logistic-card-template-job-card-record-template-entity-generated.interface';
import { ILogisticCommonCardRecordEntity } from '../common/logistic-common-card-record.interface';

export interface ILogisticCardTemplateJobCardRecordTemplateEntity extends ILogisticCardTemplateJobCardRecordTemplateEntityGenerated, ILogisticCommonCardRecordEntity {
	CardRecordFk: number
	CardRecordDescription: string | null;
	ProcurementStructureFk: number | null;
	WorkOperationIsMinor: boolean;
	IsBulkPlant: boolean;
	WorkOperationIsHire: boolean;
}