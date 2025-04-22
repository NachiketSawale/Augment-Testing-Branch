/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDropDownButtonData, IItems } from '@libs/ui/common';

export interface IMainMenu {
	itemIdx: number;
	mainMenuDeclaration: IDropDownButtonData;
	makeItem(id: string, captionTr: string, cssclass: string, caption: string, disabled: boolean | null): IItems;
	makeDivider(id: string): IItems;
}

export interface IDivider {
	id: string;
	type: string;
}
