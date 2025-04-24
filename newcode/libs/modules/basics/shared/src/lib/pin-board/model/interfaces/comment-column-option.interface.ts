/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification, PropertyPathAccessor, ReadOnlyPropertyPathAccessor } from '@libs/platform/common';

/**
 * Comment Entity Descriptor Interface.
 */
export interface ICommentEntityDescriptor<TEntity extends IEntityBase & IEntityIdentification> {
	/**
	 * Accessor for the clerk ID.
	 */
	clerkIdAccessor: ReadOnlyPropertyPathAccessor<TEntity, number>;

	/**
	 * Accessor for the date when the comment was created.
	 */
	insertedAtAccessor: ReadOnlyPropertyPathAccessor<TEntity, string>;

	/**
	 * Accessor for the comment html text.
	 */
	commentAccessor: ReadOnlyPropertyPathAccessor<TEntity, string>;

	/**
	 * Optional accessor for the status ID.
	 * This parameter should be provided when the pin board container's `CommentType` is `CommentType.Customized`.
	 */
	statusIdAccessor?: ReadOnlyPropertyPathAccessor<TEntity, number>;

	/**
	 * Accessor for the main item ID.
	 */
	mainItemIdAccessor: ReadOnlyPropertyPathAccessor<TEntity, number>;

	/**
	 * Accessor for the entity item ID.
	 */
	idAccessor: ReadOnlyPropertyPathAccessor<TEntity, number>;

	/**
	 * Accessor for the parent entity item ID.
	 */
	parentIdAccessor: ReadOnlyPropertyPathAccessor<TEntity, number>;

	/**
	 * Optional accessor for the child count.
	 *
	 * If it's a customized pin board container, this accessor may be undefined.
	 */
	childCountAccessor?: PropertyPathAccessor<TEntity, number>;

	/**
	 * Accessor for the children entities.
	 */
	childrenAccessor: PropertyPathAccessor<TEntity, Array<TEntity>>;

	/**
	 * Accessor indicating if the entity is new.
	 */
	isNewAccessor: ReadOnlyPropertyPathAccessor<TEntity, boolean>;

	/**
	 * Optional accessor indicating if the entity can be deleted.
	 */
	canDeleteAccessor?: ReadOnlyPropertyPathAccessor<TEntity, boolean>;

	/**
	 * Optional accessor indicating if the entity can be cascade deleted.
	 */
	canCascadeDeleteAccessor?: ReadOnlyPropertyPathAccessor<TEntity, boolean>;
}
