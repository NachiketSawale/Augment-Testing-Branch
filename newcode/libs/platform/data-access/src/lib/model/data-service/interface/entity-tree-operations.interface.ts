/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface for entity tree operations
 * @typeParam T - entity type handled by the data service, needs to extend IEntityIdentification
 */
export interface IEntityTreeOperations<T extends object>{

	/**
	 * Indent (Downgrade) the select entity
	 */
	indent(entity: T) : void

	/**
	 * Verifies, if indent is allowed.
	 * @return true only if indent is allowed
	 */
	canIndent(entity: T | null): boolean

	/**
	 * Outdent (Upgrade) the select entity
	 */
	outdent(entity: T): void

	/**
	 * Verifies, if outdent is allowed.
	 * @return true only if outdent is allowed
	 */
	canOutdent(entity: T | null): boolean

	/**
	 * Callback function which is executed when the parent of a tree entity changes.
	 * @param entity the tree entity whose parent is changed
	 * @param newParent the new parent entity to which the current entity is now attached.
	 * If the new parent is `null`, it indicates that the current entity is detached from its previous parent and becomes a root node.
	 */
	onTreeParentChanged(entity: T, newParent: T | null): void // TODO: This might be the temporary solution. Could be refactored if treeInfo option is implemented in hierarchical data services
}