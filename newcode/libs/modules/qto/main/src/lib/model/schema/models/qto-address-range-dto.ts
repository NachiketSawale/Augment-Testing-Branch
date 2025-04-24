/* tslint:disable */
import { QtoAddressRangeDetailDto } from './qto-address-range-detail-dto';
import { QtoConfigDto } from './qto-config-dto';
import { IEntityBase } from '@libs/platform/common';

export interface QtoAddressRangeDto extends IEntityBase {
	Id: number;
	IsActive: boolean;
	QtoAddressRangeDetailEntities?: Array<QtoAddressRangeDetailDto>;
	QtoConfigEntities_QtoAddressRangeDialogFk?: Array<QtoConfigDto>;
	QtoConfigEntities_QtoAddressRangeImportFk?: Array<QtoConfigDto>;
}
