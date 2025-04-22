/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeBoqEntity } from './composite-boq-entity.interface';

export interface ICompareSummaryRowInfo {
	rows: ICompositeBoqEntity[];
	summaryType: string;
}