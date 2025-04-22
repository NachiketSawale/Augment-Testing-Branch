/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IReportData } from './report-data.interface';
import { IReportStateContext } from './report-state-context.interface';

/**
 * Report state data.
 */
export interface IReportState {
	/**
	 * Sidebar reports data.
	 */
	groups: Array<IReportData>;

	/**
	 * Sidebar report context data.
	 */
	context: Array<IReportStateContext>;

	/**
	 * User information.
	 */
	userInfo: IReportUserInfo;

	/**
	 * Current active module.
	 */
	moduleName: string;
}

/**
 * User information interface.
 */
export interface IReportUserInfo {
	/**
	 * User id.
	 */
	UserId?: number;

	/**
	 * Logon name.
	 */
	LogonName?: string;

	/**
	 * User name.
	 */
	UserName?: string;
}
