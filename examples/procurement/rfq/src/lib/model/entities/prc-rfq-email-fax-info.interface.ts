import { IReportParametersData, IReportPrepareData } from '@libs/platform/common';

/*
 * Copyright(c) RIB Software GmbH
 */
export interface IEmailInfo {
	Subject: string;
	Body: string;
	IsReportBody: boolean;
	Receivers: IReceiver[];
	AttachmentRequests: IAttachmentRequest[];
	BodyRequests: IBodyRequest[];
}

export interface IEmailRequest {
	RfqHeaderId: number;
	ReportId: number;
	ItemReportId: number;
	GaebExt: string | null;
	EmailInfo: IEmailInfo | null;
	CommunicateType: string;
	ItemGearDataName: string;
	BoqGearDataName: string;
}

export interface IReceiver {
	Id: number;
	To: string;
	Cc?: string;
	BodyIds: string[];
	AttachmentIds: string[];
}

export interface IAttachmentRequest {
	Id: string;
	Request: IReportRequest;
}

export interface IBodyRequest {
	Id: string;
	Request: IReportRequest;
}
export interface ISendFaxEmailEntity {
	emailFaxSetting: string;
	recipient: string;
	sender: string;
}

export interface IDefaultRfqBpStatus {
	Id: number;
	Description: string;
}

export interface ICheckItemAndBoq {
	item: boolean;
	boq: boolean;
}

export interface IReportRequest {
	ReportData: IReportPrepareData;
	GearData:{Name: 'pdf'};
	Parameters:{Key: string | undefined, Value:IReportParametersData}[];
}

export interface ISenderEntity {
	userName: string;
	password: string;
}