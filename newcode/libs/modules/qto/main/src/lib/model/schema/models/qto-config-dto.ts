/* tslint:disable */
import { QtoAddressRangeDto } from './qto-address-range-dto';
import { QtoHeaderDto } from './qto-header-dto';
import { IEntityBase } from '@libs/platform/common';

export interface QtoConfigDto extends IEntityBase {
	CommentPrjLevel: boolean;
	CommentRubricLevel: boolean;
	CommentSystemLevel: boolean;
	Id: number;
	QtoAddressRangeDialogFk?: number;
	QtoAddressRangeEntity_QtoAddressRangeDialogFk?: QtoAddressRangeDto;
	QtoAddressRangeEntity_QtoAddressRangeImportFk?: QtoAddressRangeDto;
	QtoAddressRangeImportFk?: number;
	QtoHeaderEntity?: QtoHeaderDto;
	QtoHeaderFk: number;
}
