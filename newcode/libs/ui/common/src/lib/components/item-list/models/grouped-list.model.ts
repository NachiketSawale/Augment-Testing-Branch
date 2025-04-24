/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReports } from './grouped-list-cfg';

export interface IGroupedList {
	id: number;
	name: string;
	visible: boolean;
	icon: string;
	reports: IReports[];
	count: number;
	groupIconClass?: string;
	toggleClass?: string;
}
