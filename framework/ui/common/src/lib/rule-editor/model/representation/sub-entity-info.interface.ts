/*
 * Copyright(c) RIB Software GmbH
 */

import { SchemaGraphNode } from '../schema-graph-node/schema-graph-node.class';

export interface ISubEntityInfo {
	/**
	 * id
	 */
	id: number|string;

	/**
	 * node
	 */
	node: SchemaGraphNode;

	/**
	 * originalNode
	 */
	originalNode: SchemaGraphNode;

	/**
	 * name
	 */
	name: string;

	/**
	 * displayName
	 */
	displayName: string;

	/**
	 * path
	 */
	path: string;
}