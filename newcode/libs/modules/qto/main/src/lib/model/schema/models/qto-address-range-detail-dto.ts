/* tslint:disable */
import { QtoAddressRangeDto } from './qto-address-range-dto';
import { IEntityBase } from '@libs/platform/common';

export interface QtoAddressRangeDetailDto extends IEntityBase {
	BasClerkFk?: number;
	BasClerkRoleFk?: number;
	Id: number;
	IndexArea?: string;
	LineArea?: string;
	QtoAddressRangeEntity?: QtoAddressRangeDto;
	QtoAddressRangeFk: number;
	SheetArea?: string;
}
