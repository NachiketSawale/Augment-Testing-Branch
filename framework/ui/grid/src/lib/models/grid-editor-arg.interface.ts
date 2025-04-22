/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IField, IGridApi } from '@libs/ui/common';

export interface IUiGridEditorArg<T extends object> {
	row: number;
	gridId: string;
	grid: IGridApi<T>;
	gridPosition: object;
	position: object;
	container: HTMLElement;
	column: IField<T>;
	item: T;
	commitChanges: void;
	cancelChanges: void;
}