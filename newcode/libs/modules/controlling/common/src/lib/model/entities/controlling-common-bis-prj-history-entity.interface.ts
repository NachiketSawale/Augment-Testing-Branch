import { IDescriptionInfo, IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IControllingCommonBisPrjHistoryEntity extends IEntityBase, IEntityIdentification {
	Id: number;
	Descritpion: IDescriptionInfo | null;
	RibCompanyId: string;
	RibPrjId: string;
	RibPrjVersion: number;
	RibHistoryId: number;
	HistoryDescription: string;
	HistoryRemark: string;
	HistoryDate: Date | string;
	ReportLog: string;
	TransferLog: string;
}
export interface ITransferReport {
	Info1: string | undefined;
	Info2: string | undefined;
	Info3: string | undefined;
	Info4: string | undefined;
	Info5: string | undefined;
	Info6: string | undefined;
	Message: string | undefined;
	MessageType: number;
	TransferType: string | undefined;
}

export interface IQuantityCheckDetail {
	AQQuantity: string;
	AQQuantityTotal: string;
	EstLineItem: string;
	Id: number;
	WQQuantity: string;
	WQQuantityTotal: string;
}
export interface ITotalCompareDetail {
	AQDifference: string;
	AQValueControlling: string;
	AQValueEstimate: string;
	Id: number;
	TotalType: string;
	WQDifference: string;
	WQValueControlling: string;
	WQValueEstimate: string;
}
export interface IDetail {
	Description?: string | undefined;
	Id: number;
	StructureName?: string;
}
export interface IWarningDetail extends IDetail {
	LogDetail?: Array<IWarningDetail>;
	nodeInfo?: INodeInfo;
}
export interface IRecordDetail extends IDetail {}
export interface INodeInfo {
	children: boolean;
	collapsed: boolean;
	lastElement: boolean;
	level: number;
}

export type TransferReportResult = {
	totalRecords: number;
	logDetails: string;
	transferLogDetails: string;

	showAssignmentCheckGrid: boolean;
	showQuantityCheckGrid: boolean;
	showTransferLog: boolean;
	showTransferLogDetails: boolean;
	transferTotalCompareGridId: boolean;
	transferQuantityCheckDetails?: Array<IQuantityCheckDetail> | undefined;
	transferTotalCompareDetails?: Array<ITotalCompareDetail> | undefined;
	transferWarningDetails?: Array<IWarningDetail> | undefined;
	transferedRecordDetails?: Array<IRecordDetail> | undefined;
};

export type DetailLog = {
	type: string;
	logStr: string;
};
