/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityProcessor } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityBase, IEntityIdentification } from '@libs/platform/common';
import { BasicsSharedCommentDataServiceBase } from '../basics-shared-comment-data-base.service';

/**
 * Comment data entity readonly processor
 */
export class BasicsSharedCommentDataReadonlyProcessor<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification, PU extends CompleteIdentification<PT>> implements IEntityProcessor<T> {
	/**
	 *The constructor
	 */
	public constructor(protected dataService: BasicsSharedCommentDataServiceBase<T, PT, PU>) {}

	/**
	 * Process comment readonly logic
	 * @param item - comment entity
	 */
	public process(item: T) {
		const isReadOnly = this.dataService.isReadOnly();
		this.dataService.setEntityReadOnly(item, isReadOnly);
		this.dataService.handleChildren(this.dataService.getChildren(item), (child) => {
			this.dataService.setEntityReadOnly(child, isReadOnly);
		});
	}

	/**
	 * Revert process item
	 * @param item
	 */
	public revertProcess(item: T) {}
}
