/*
 * Copyright(c) RIB Software GmbH
 */

import { TreeNodeEventType } from './tree-node-event-type.enum';

/**
 * Tree node change event type
 */
export class TreeNodeEvent<T extends object> {
	/**
	 * Constructor
	 * @param entity
	 * @param eventType
	 */
	public constructor(public readonly entity: T, public readonly eventType: TreeNodeEventType) {
	}
}