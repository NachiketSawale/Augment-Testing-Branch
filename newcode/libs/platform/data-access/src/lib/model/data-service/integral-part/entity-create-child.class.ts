/*
 * Copyright(c) RIB Software GmbH
 */

import { IDataProvider } from '../../data-provider/data-provider.interface';
import { IIdentificationData } from '@libs/platform/common';
import { IDataServiceEndPointOptions } from '../data-service-end-point-options.interface';
import { EntityMultiProcessor } from './entity-multi-processor.class';
import { IEntityActionState } from '../interface/entity-action-state.interface';
import { IEntitySelection } from '../interface/entity-selection.interface';
import { IEntityModification } from '../interface/entity-modification.interface';
import { IEntityTree } from '../interface/entity-tree.interface';


/**
 * Implementation for the different stages of create
 * @typeParam T - entity type handled by the data service
 */
export class EntityCreateChild<T extends object> {
	public constructor(
		protected actionState: IEntityActionState<T>,
		protected entitySelection: IEntitySelection<T>,
		protected entityTree: IEntityTree<T>,
		protected entityModification: IEntityModification<T>,
		protected provider: IDataProvider<T>,
		protected options: IDataServiceEndPointOptions | undefined,
		protected processor: EntityMultiProcessor<T> | undefined
	) {

	}

	/**
	 * Creates a new entity
	 * @return the new created entity
	 */
	public create(parentByRole: object | undefined, parentInTree: T | undefined): Promise<T> {
		const ident = this.providePayload(parentByRole, parentInTree);

		return this.provider.create(ident).then(created => {
			if (this.processor !== undefined) {
				this.processor.process(created);
			}
			if (parentInTree) {
				this.entityTree.appendTo(created, parentInTree);
			} else {
				this.entityTree.append(created);
			}
			this.entitySelection.select(created);
			this.entityModification.setModified(created);

			return created;
		});
	}

	public createEnhanced<PT extends object, RT>(payload: PT | undefined, parentInTree: T | undefined, onSuccess: (created: RT) => T): Promise<T> {
		if (this.provider.createEnhanced === undefined) {
			throw new Error('Enhanced creation is only supported with a provider having implemented createEnhanced');
		}

		return this.provider.createEnhanced(payload, onSuccess).then(created => {
			if (this.processor !== undefined) {
				this.processor.process(created);
			}
			if (parentInTree) {
				this.entityTree.appendTo(created, parentInTree);
			} else {
				this.entityTree.append(created);
			}
			this.entitySelection.select(created);
			this.entityModification.setModified(created);
			return created;
		});
	}

	/**
	 * Creates and identification data as payload for the create call
	 * @param parentByRole
	 * @param parentInTree
	 */
	public providePayload(parentByRole: object | undefined, parentInTree: T | undefined): IIdentificationData {
		let ident = <IIdentificationData>{};
		if (parentByRole !== undefined && 'Id' in parentByRole && typeof parentByRole.Id === 'number' &&
			parentInTree !== undefined && 'Id' in parentInTree && typeof parentInTree.Id === 'number'
		) {
			ident = <IIdentificationData>{id: parentByRole.Id, pKey1: parentInTree.Id};
		} else if (!this.actionState.prepareTreeParameter) {
			throw new Error('Action state prepareTreeParameter function must be provided as the parent entity has no Id property');
		}

		if (this.actionState.prepareTreeParameter) {
			ident = this.actionState.prepareTreeParameter(parentByRole, parentInTree);
		}

		return ident;
	}

	/**
	 * Verifies, if create is allowed. In case special verification is needed,
	 *  implement the IEntityCreateGuard<T> interface.
	 * @return true only if create is allowed
	 */
	public canCreate(): boolean {
		const selection = this.entitySelection.getSelection();
		return this.actionState.canExecute(selection);
	}

	public supportsCreate(): boolean {
		return this.actionState.supported;
	}
}