/* tslint:disable */
import { QtoHeaderDto } from './qto-header-dto';
import { IEntityBase } from '@libs/platform/common';

export interface QtoSheetDto extends IEntityBase {
	Date?: Date;
	Description?: string;
	From?: number;
	HasChildren?: boolean;
	Id: number;
	IsReadonly: boolean;
	PageNumber?: number;
	QtoHeaderEntity?: QtoHeaderDto;
	QtoHeaderFk: number;
	QtoSheetChildren?: Array<QtoSheetDto>;
	QtoSheetFk?: number;
	QtoSheetParent?: QtoSheetDto;
	QtoSheetStatusFk: number;
	QtoSheets?: Array<QtoSheetDto>;
	Remark?: string;
	To?: number;
}
