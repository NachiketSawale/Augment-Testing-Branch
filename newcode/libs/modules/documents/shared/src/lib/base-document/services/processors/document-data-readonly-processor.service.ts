/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityReadonlyProcessorBase, ReadonlyFunctions } from '@libs/basics/shared';
import { DocumentDataLeafService } from '../document-data-leaf.service';
import { IDocumentBaseEntity } from '@libs/documents/interfaces';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { DocumentDataNodeService } from '../document-data-node.service';

/**
 * Document data leaf readonly processor
 */
export class DocumentDataReadonlyProcessorService<T extends IDocumentBaseEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	/**
	 *The constructor
	 * @param dataService data service.
	 */
	public constructor(protected dataService: DocumentDataLeafService<T, PT, PU>) {
		super(dataService);
	}

	/**
	 * Generate readonly functions.
	 * @return ReadonlyFunctions.
	 */
	public override generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			DocumentTypeFk: (info) => {
				return !!info.item.FileArchiveDocFk;
			},
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.dataService.IsParentEntityReadonly();
	}
}

/**
 * Document data node readonly processor
 */
export class DocumentDataNodeReadonlyProcessorService<T extends IDocumentBaseEntity, U extends CompleteIdentification<T>, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> extends EntityReadonlyProcessorBase<T> {
	/**
	 *The constructor
	 * @param dataService data service.
	 */
	public constructor(protected dataService: DocumentDataNodeService<T, U, PT, PU>) {
		super(dataService);
	}

	/**
	 * Generate readonly functions.
	 * @return ReadonlyFunctions.
	 */
	public override generateReadonlyFunctions(): ReadonlyFunctions<T> {
		return {
			DocumentTypeFk: (info) => {
				return !!info.item.FileArchiveDocFk;
			},
		};
	}

	protected override readonlyEntity(item: T): boolean {
		return this.dataService.IsParentEntityReadonly();
	}
}