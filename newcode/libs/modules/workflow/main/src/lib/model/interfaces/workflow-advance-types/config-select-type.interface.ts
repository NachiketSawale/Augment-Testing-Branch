/*
 * Copyright(c) RIB Software GmbH
 */

/**
 *IConfigSelectType: An interface for "select" type in user-input client action.
 */
export interface IConfigSelectType {
	id: string;
	displayMember: string;
	valueMember: string;
	typeSelectedMode: number;
	editorMode: number;
	items: string | Array<Record<string, string>>
}
