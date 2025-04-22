/*
 * Copyright(c) RIB Software GmbH
 */

import { SchemaGraphNode } from './schema-graph-node.class';
import { Translatable } from '@libs/platform/common';

/**
 * SubEntity
 */
export class SubEntity {
	/**
	 * id
	 */
	public id: number|string = '';

	/**
	 * name
	 */
	public name: string;

	/**
	 * displayName
	 */
	public displayName?: Translatable;

	/**
	 * node
	 */
	public node: SchemaGraphNode;

	/**
	 * path
	 */
	public path: string;

	/**
	 * Default constructor
	 * @param name
	 * @param path
	 * @param id
	 * @param node
	 * @param displayName
	 */
	public constructor(name: string, path: string, id: string|number, node: SchemaGraphNode, displayName: string) {
		this.id = id;
		this.name = name;
		this.displayName = displayName;
		this.node = node;
		this.path = path;
		this.setNodeProperties();
	}

	/**
	 * Set default node properties
	 */
	public setNodeProperties() {
		this.node.id = this.id;
		this.node.name = this.name;
		this.node.image = 'control-icons ico-criterion';
		this.node.isVirtual = true;
		this.node.children = undefined;
		this.node.parent = undefined;
	}
}