/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ISessionInfo {
	companyInfo: ICompanyInfo;
	headerInfo: IHeaderInfo;
}
export interface ICompanyInfo {
	companyCode: string;
	companyId: number;
	companyName: string;
	roleName: string;
}
export interface IHeaderInfo {
	IdpName: string;
	UserName: string;
}
export interface IAppInfo {
	data: {
		_value: {
			title: string;
		};
	};
}
