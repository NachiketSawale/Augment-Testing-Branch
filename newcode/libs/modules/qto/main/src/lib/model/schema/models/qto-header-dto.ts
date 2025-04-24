/* tslint:disable */
import { QtoConfigDto } from './qto-config-dto';
import { QtoSheetDto } from './qto-sheet-dto';
import { QtoStatusDto } from './qto-status-dto';
import { QtoStatusHistoryDto } from './qto-status-history-dto';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface QtoHeaderDto extends IEntityBase {
	BasGoniometerTypeFk?: number;
	BasRubricCategoryFk: number;
	BoqHeaderFk: number;
	BoqId?: number;
	BusinessPartnerFk?: number;
	ClerkFk?: number;
	Code: string;
	ConHeaderFk?: number;
	ContractCode?: string;
	DescriptionInfo?: IDescriptionInfo;
	DetailTotal?: number;
	Id: number;
	IsAQ: boolean;
	IsBQ: boolean;
	IsFreeItemsAllowedOfContract?: boolean;
	IsIQ: boolean;
	IsLive: boolean;
	IsWQ: boolean;
	NoDecimals?: number;
	OrdHeaderFk?: number;
	PackageFk?: number;
	PerformedFrom?: string;
	PerformedTo?: string;
	PermissionObjectInfo?: string;
	PrcBoqFk?: number;
	PrcStructureFk?: number;
	PrjChangeStutasReadonly?: boolean;
	ProjectFk: number;
	QTOStatusFk?: number;
	QtoConfigEntities?: Array<QtoConfigDto>;
	QtoDate?: string;
	QtoSheetEntities?: Array<QtoSheetDto>;
	QtoStatusEntity?: QtoStatusDto;
	QtoStatusHistoryEntities?: Array<QtoStatusHistoryDto>;
	QtoTargetType: number;
	QtoTypeFk: number;
	Remark?: string;
	UseRoundedResults: boolean;
	hasQtoDetal?: boolean;
}
