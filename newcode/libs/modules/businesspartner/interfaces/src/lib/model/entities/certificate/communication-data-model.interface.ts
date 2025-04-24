import { CommunicationType } from '../../enum';

export interface IReport {
	Name: string;
	TemplateName: string;
	Path: string;
}

export interface IParameter {
	Name: string;
	ParamValue?: string | number;
}

export interface IReportRequest {
	ReportData: IReport;
	GearData: { Name: 'pdf' };
	Parameters: { Key: string, Value: IParameter }[];
}

export interface ICommunicationDataModel {
	Subject: string;
	Receivers: ISendingData[];
	IsReportBody: boolean;
	BodyRequests: { id: string, Request: IReportRequest }[];
	AttachmentRequests: { id: string, Request: IReportRequest }[];
	CommunicationType: CommunicationType;
	EmailAccount: IEmailAccount;
}

export interface ISendingData {
	To?: string | null;
	BodyIds: string[];
	AttachmentIds: string[];
}

export interface IEmailAccount {
	UserName: string,
	Password: string | null,
}