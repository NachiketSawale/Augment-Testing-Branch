/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IIdentificationData } from '@libs/platform/common';
import { IDataProvider } from '../../../model/data-provider/data-provider.interface';
import {IChildRoleTyped} from '../interface/child-role-typed.interface';
import {EntityMultiProcessor} from './entity-multi-processor.class';
import { IEntityList } from '../interface/entity-list.interface';
import { EntityModification } from './entity-modification.class';
import { IChildModificationRegistration } from '../interface/child-modification-registration.interface';

/**
 * Interface for child (sub) element data service
 * @typeParam T - entity type handled by the data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export class ChildRole<T extends object,
	PT extends object, PU extends CompleteIdentification<PT>> implements IChildRoleTyped<T, PT, PU> {
	public constructor(
		protected entityList: IEntityList<T>,
		protected dataProvider: IDataProvider<T>,
		protected processor: EntityMultiProcessor<T>,
		protected entityModification: EntityModification<T>,
		protected modificationRegistration: IChildModificationRegistration<T, PT, PU>) {
	}

	public clearModification(): void {
		this.entityModification.clearModifications();
	}

	/**
	 * Load entities for given identification data
	 * @return all loaded elements, in case of none loaded, an empty array
	 */
	public load(identificationData: IIdentificationData): Promise<T[]> {
		return this.dataProvider.load(identificationData).then(data => {
			this.processor.process(data);
			this.entityList.setList(data);

			return data;
		});
	}

	/**
	 *
	 * @param payload
	 * @param onSuccess
	 */
	public loadEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]> {
		if(this.dataProvider.loadEnhanced === undefined) {
			throw new Error('Enhanced loading is only supported with a provider having implemented loadEnhanced');
		}

		return this.dataProvider.loadEnhanced(payload, onSuccess).then(data => {
			this.processor.process(data);
			this.entityList.setList(data);

			return data;
		});
	}

	/**
	 * Load entities for given identification data
	 */
	public loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return this.dataProvider.load(identificationData).then(data => {
			this.processor.process(data);
			this.entityList.setList(data);
		});
	}

	/**
	 * Writes back the updated subordinated entities sent back from the application server.
	 * @param updated Element taking the updated elements sent back from server
	 */
	public takeOverUpdated(updated: PU): void {
		this.modificationRegistration.takeOverUpdated(updated);
	}

	public hasModifiedFor(parent: PT): boolean {
		return this.entityModification.hasModifiedFor(parent);
	}

	public clearModifications() {
		this.entityModification.clearModifications();
	}

	public collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		type EntityKey = keyof typeof parentUpdate;
		const modified = this.entityModification.getModifiedFor(parent);
		const deleted = this.entityModification.getDeletedFor(parent);
		// ToDo: Check if modifications need to be cloned
		this.processor.revertProcess(modified);
		this.processor.revertProcess(deleted);

		if (this.modificationRegistration.registerByMethod()) {
			this.modificationRegistration.registerModificationsToParentUpdate(parentUpdate, modified, deleted);
		} else {
			(parentUpdate[this.modificationRegistration.itemName + 'ToSave' as EntityKey] as T[]) = modified;
			(parentUpdate[this.modificationRegistration.itemName + 'ToDelete' as EntityKey] as T[]) = deleted;
		}
	}
}


