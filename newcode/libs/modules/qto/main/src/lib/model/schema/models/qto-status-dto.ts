/* tslint:disable */
import { QtoHeaderDto } from './qto-header-dto';
import { QtoStatusHistoryDto } from './qto-status-history-dto';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface QtoStatusDto extends IEntityBase {
	DescriptionInfo?: IDescriptionInfo;
	Icon: number;
	Id: number;
	IsDefault: boolean;
	IsLive: boolean;
	IsReadOnly: boolean;
	QtoHeaderEntities?: Array<QtoHeaderDto>;
	QtoStatusHistoryEntities_QtoStatusNewFk?: Array<QtoStatusHistoryDto>;
	QtoStatusHistoryEntities_QtoStatusOldFk?: Array<QtoStatusHistoryDto>;
	Sorting: number;
}
