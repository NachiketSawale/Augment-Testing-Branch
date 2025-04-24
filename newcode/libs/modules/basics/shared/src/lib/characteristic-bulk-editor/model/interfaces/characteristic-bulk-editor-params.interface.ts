/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection, ICharacteristicDataEntity } from '@libs/basics/interfaces';

/**
 * Characteristic Bulk Editor Params
 */
export interface ICharacteristicBulkEditorParams {
	sectionId: BasicsCharacteristicSection;
	moduleName: string;
	filter: IBasicsCharacteristicDataFilter; //todo-Any: replace object to common FilterRequestParams interface.
	values: ICharacteristicDataEntity[];
	objectsCount: number;
}

// todo-Any: should use cloudDesktopSidebarService.getFilterRequestParams, wait add
export interface IBasicsCharacteristicDataFilter {
	ExecutionHints?: boolean | null;
	IncludeNonActiveItems: boolean | null;
	PageSize: number;
	PageNumber: number;
	Pattern?: string;
	PinningContext: string[];
	ProjectContextId?: number | null;
	UseCurrentClient: boolean | null;
	UseCurrentProfitCenter?: boolean | null;
	OrderBy?: object[];
}
