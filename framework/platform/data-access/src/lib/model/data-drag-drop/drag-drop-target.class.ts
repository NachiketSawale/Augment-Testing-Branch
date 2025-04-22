/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropTarget } from '@libs/platform/common';

export class DragDropTarget<T extends object> implements IDragDropTarget<T> {

	public area?: object;

	public data?: T[];

	// public preferredActions


	public constructor(public readonly id: string) {
	}
}