/* tslint:disable */
import { QtoHeaderDto } from './qto-header-dto';
import { QtoStatusDto } from './qto-status-dto';
import { IEntityBase } from '@libs/platform/common';

export interface QtoStatusHistoryDto extends IEntityBase {
	Id: number;
	QtoHeaderEntity?: QtoHeaderDto;
	QtoHeaderFk: number;
	QtoStatusEntity_QtoStatusNewFk?: QtoStatusDto;
	QtoStatusEntity_QtoStatusOldFk?: QtoStatusDto;
	QtoStatusNewFk: number;
	QtoStatusOldFk: number;
	Remark?: string;
}
