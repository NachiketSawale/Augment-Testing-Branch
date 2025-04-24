/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IList {
	id: number;
	groupId: number;
	name: string | null;
	text: string | null;
	filename: string;
	path: string;
	pending?: boolean;
	hiddenParameters?: [];
	exportType?: string;
	hasError?: boolean;
	disabled?: boolean;
	itemIcon?: string;
}
