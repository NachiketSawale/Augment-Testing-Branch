/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridContainerLink } from './grid-container-link.interface';

/**
 * Provides references to the standard equipment inside a tree container.
 */
export interface ITreeContainerLink<T extends object> extends IGridContainerLink<T> {

	/**
	 * Collapses all nodes in the tree.
	 */
	collapseAll(): void;

	/**
	 * Expands all nodes in the tree. 
	 * Also expand level wise if provide selected level.
	 * 
	 * @param {number} level selected level from tree grid container
	 */
	expandAll(level?: number): void;

	/**
	 * Collapses the currently selected nodes in the tree.
	 */
	collapse(node: T): void;

	/**
	 * Expands the currently selected nodes in the tree.
	 */
	expand(node: T): void;
}
