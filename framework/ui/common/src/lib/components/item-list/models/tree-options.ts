/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface ITreeOptions {
	valueMember: string;
	expandFn(id: string | number): void;
	collapseFn(id: string | number): void;
	clickHeaderFn(id: string | number, event: Event): void;
	clickTabFn(id: string | number, event: Event, tabId: number | string): void;
	searchhandlerfunction(event: Event): void;
}
