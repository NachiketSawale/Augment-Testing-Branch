/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridApi, IGridConfiguration } from '@libs/ui/common';

export interface ISlickGridOptions<T extends object> extends IGridConfiguration<T> {
	/**
	 * Enables/disables column reorder
	 * By default, this setting is enabled (true)
	 */
	enableCellNavigation?: boolean;
	enableDraggableGroupBy?: boolean;
	multiColumnSort?: boolean;
	enableAsyncPostRender?: boolean;
	editable?: boolean;
	rowReordering?: boolean;
	autoEdit?: boolean;
	groupItemMetadataProvider?: object;
	groupPanelText?: string;
	showGroupingPanel?: boolean;
	api?: IGridApi<T>;
}
