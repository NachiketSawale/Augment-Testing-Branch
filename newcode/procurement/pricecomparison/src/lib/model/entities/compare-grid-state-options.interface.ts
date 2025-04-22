/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridConfiguration } from '@libs/ui/common';

export interface ICompareGridStateOptions<T extends object> {
	handleConfig: (config: IGridConfiguration<T>) => void;
}