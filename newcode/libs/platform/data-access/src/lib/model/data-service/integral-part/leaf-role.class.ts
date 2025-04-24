/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification, IIdentificationData } from '@libs/platform/common';
import { IChildRoleTyped } from '../interface/child-role-typed.interface';

/**
 * Intergral part for implementation of a leaf service not being derieved from one of the data-service-...-leaf classes
 * @typeParam T - entity type handled by the data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export class LeafRole<T extends object,
	PT extends object, PU extends CompleteIdentification<PT>> implements IChildRoleTyped<T, PT, PU> {
	public constructor(
		protected childRole: IChildRoleTyped<T, PT, PU>) {
	}

	public clearModification(): void {
		this.childRole.clearModifications();
	}

	/**
	 * Load entities for given identification data
	 * @return all loaded elements, in case of none loaded, an empty array
	 */
	public load(identificationData: IIdentificationData): Promise<T[]> {
		return this.childRole.load(identificationData);
	}

	public loadEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]> {
		if(this.childRole.loadEnhanced === undefined) {
			throw new Error('Enhanced loading is only supported with a provider having implemented loadEnhanced');
		}
		return this.childRole.loadEnhanced(payload, onSuccess);
	}

	/**
	 * Load entities for given identification data
	 */
	public loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return this.childRole.loadSubEntities(identificationData);
	}

	/**
	 * Writes back the updated subordinated entities sent back from the application server.
	 * @param updated Element taking the updated elements sent back from server
	 */
	public takeOverUpdated(updated: PU): void {
		// ToDo Check if something is needed to be done for proper implementation
	}

	public hasModifiedFor(parent: PT): boolean {
		return this.childRole.hasModifiedFor(parent);
	}

	public clearModifications() {
		this.childRole.clearModifications();
	}

	public collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		this.childRole.collectModificationsForParentUpdate(parentUpdate, parent);
	}
}


