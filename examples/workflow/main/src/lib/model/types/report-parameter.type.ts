/*
 * Copyright(c) RIB Software GmbH
 */

import { IBaseColumn } from '../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';

/**
 * Properties from report that are used in the client.
 */
export interface IReportParameterForClient extends IBaseColumn {
	Name: string;
	ParamValue: string;
	ParamValueType: string;
}