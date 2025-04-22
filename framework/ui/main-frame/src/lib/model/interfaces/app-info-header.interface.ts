/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
export interface ISessionInfo {
	companyInfo: {
		companyCode: string;
		companyId: number;
		companyName: string;
		roleName: string;
	};
	headerInfo: IHeaderInfo;
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
