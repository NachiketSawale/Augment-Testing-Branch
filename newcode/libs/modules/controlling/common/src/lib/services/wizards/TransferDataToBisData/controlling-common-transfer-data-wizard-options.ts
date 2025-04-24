import { IDescriptionInfo } from '@libs/platform/common';
import { IControllingCommonBisPrjHistoryEntity } from '../../../model/entities/controlling-common-bis-prj-history-entity.interface';
import { IControllingCommonProjectEntity } from '../../../model/entities/controlling-common-project-entity.interface';
import { ICompanyPeriodEntity } from '@libs/basics/interfaces';

export interface ICostGroupCatalog {
	Id: number;
	Classification: string;
	Code: string;
	DescriptionInfo?: IDescriptionInfo | null;
	IsProjectCatalog?: boolean;
}

export interface ICostGroup {
	Id: number;
	Code: string;
	DescriptionInfo?: IDescriptionInfo;
	IsProjectCatalog?: boolean;
}

/**
 *
 */
export interface projectActivityInfo {
	Id: number;

	PlannedFinish?: Date;

	PlannedStart?: Date;

	ScheduleFk: number;

	Code: string;
}

/**
 *
 */
export interface estLineItemInfo {
	Id: number;

	EstHeaderFk: number;

	PsdActivityFk?: number;
}

export interface BisTransferInfo {
	EstHeaderId: number;

	EstLineItemId: number;

	ActivityId?: number;

	ActivityCode: string;

	PlannedFinish?: Date;

	PlannedStart?: Date;

	ScheduleFk?: number;

	ProjectNo: string;

	ProjectIndex: number;

	CompanyCode: string;

	ProjectIsCompleteperformance: boolean;
}

/**
 * validate project data by estimate header, company period and activity.
 */
export interface validateResult {
	CanDoTransfer: boolean;

	EstHeaderIds: number[];

	Activities: projectActivityInfo[];

	NoActivityMatchPeriodList: projectActivityInfo[];

	ActivityCantMatchPeriodList: projectActivityInfo[];

	Periods: ICompanyPeriodEntity[];

	EstLineItems: estLineItemInfo[];

	NoActivityMatchPeriod: boolean;

	ActivityCantMatchPeriod: boolean;

	ProjectIsCompleteperformance: boolean;

	ProjectNo: string;

	ProjectIndex: number;

	CompanyCode: string;
}

/**
 * errorType: 3 for error, 2 fro warining
 */
export interface projectValidateResult {
	show: boolean;
	canContinue: boolean;
	message: string;
	type: number;
	isDisableOkBtn: boolean;
}

export interface quantityUpdateDateInfo {
	AQLastUpdateDate: string;
	IQLastUpdateDate: string;
	BQLastUpdateDate: string;
	FQLastUpdateDate: string;
}

export interface quantityUpdateData {
	updateAQ: boolean;
	updateBQ: boolean;
	updateFQ: boolean;
	updateIQ: boolean;
	updateIQFrom: number;
	updateRevenue: boolean;
	updateRevenueFrom: number;
}

export interface validationInfo {
	projectActivies: projectActivityInfo[];

	companyPeriods: ICompanyPeriodEntity[];

	validateResult: validateResult;
}

/**
 *
 */
export interface bisTransferDataRequest {
	projectId: number;

	ribHistoryId: number;

	costGroupCats: ICostGroupCatalog[];

	versionType: string;

	histroyRemark: string;

	historyDescription: string;

	debugMode: boolean;

	updateInstalledQty: boolean;

	insQtyUpdateFrom: number;

	updateBillingQty: boolean;

	updateForecastingPlannedQty: boolean;

	updatePlannedQty: boolean;

	updateRevenue: boolean;

	revenueUpdateFrom: number;

	estHeaderIds: number[];

	projectIsCompletePerformance: boolean;
}

export interface IControllingTransferDataToBisDataEntity {
	versionType: number;
	project: IControllingCommonProjectEntity | null;
	projectId: number;
	projectNo: string;
	ribHistoryId: number;
	ribHistoryDescription: string;
	ribHistoryRemark: string;
	qtyUpdateDataNValidateionInfo: (quantityUpdateData & validationInfo) | null;
	historyList: IControllingCommonBisPrjHistoryEntity[];
	valResult: validateResult | null;
	costGroupCatalogList: ICostGroupCatalog[];
	costGroupCatalogListForLookup: ICostGroupCatalog[];
	costGroupList: ICostGroup[];
	validatedEstHeaderIds: number[];
	validateActivities: projectActivityInfo[];
	validatedEstLineItems: estLineItemInfo[];
	periods: ICompanyPeriodEntity[];
	qtyUpdateDateInfo: quantityUpdateDateInfo;
	prjValidateResult: projectValidateResult;
	debugMode: boolean;
	updateInstalledQty: boolean;
	insQtyUpdateFrom: number;
	updateBillingQty: boolean;
	updateForecastingPlannedQty: boolean;
	updatePlannedQty: boolean;
	updateRevenue: boolean;
	revenueUpdateFrom: number;
	ProjectIsCompleteperformance: boolean;
}
