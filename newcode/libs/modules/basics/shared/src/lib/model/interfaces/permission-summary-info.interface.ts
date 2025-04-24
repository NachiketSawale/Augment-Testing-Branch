/*
 * Copyright(c) RIB Software GmbH
 */

export interface IPermissionSummaryInfo {
	AccessRightDescriptorName: string;
	AccessGuid: string;
	Explanation: string;
	GroupTitle: string;
	HasCreate?: boolean;
	HasRead?: boolean;
	HasWrite?: boolean;
	HasDelete?: boolean;
	HasExecute?: boolean;
}