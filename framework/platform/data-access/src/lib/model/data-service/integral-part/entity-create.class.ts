/*
 * Copyright(c) RIB Software GmbH
 */


import { IDataProvider } from '../../data-provider/data-provider.interface';
import { IEntityList } from '../interface/entity-list.interface';
import { IIdentificationData } from '@libs/platform/common';
import { IDataServiceEndPointOptions } from '../data-service-end-point-options.interface';
import { EntityMultiProcessor } from './entity-multi-processor.class';
import { IEntityActionState } from '../interface/entity-action-state.interface';
import { IEntitySelection } from '../interface/entity-selection.interface';
import { IEntityModification } from '../interface/entity-modification.interface';

/**
 * Implementation for the different stages of create
 * @typeParam T - entity type handled by the data service
 */
export class EntityCreate<T extends object> {
	public constructor(
		protected actionState: IEntityActionState<T>,
		protected entitySelection: IEntitySelection<T>,
		protected entityList: IEntityList<T>,
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
	public create(parentEntity: object | undefined): Promise<T> {
		//let ident = <IIdentificationData | null> null;
		let ident = <IIdentificationData>{};
		if(parentEntity != undefined && 'Id' in parentEntity && typeof parentEntity.Id === 'number') {
			ident = <IIdentificationData>{id: 0, pKey1: parentEntity.Id};
		}

		if (this.actionState.prepareParameter) {
			ident = this.actionState.prepareParameter(ident);
		}

		return this.provider.create(ident).then(created => {
			if(this.processor !== undefined) {
				this.processor.process(created);
			}

			this.entityList.append(created);
			this.entitySelection.select(created);
			this.entityModification.setModified(created);

			return created;
		});
	}

	public createEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (created: RT) => T): Promise<T> {
		if(this.provider.createEnhanced === undefined) {
			throw new Error('Enhanced creation is only supported with a provider having implemented createEnhanced');
		}

		return this.provider.createEnhanced(payload, onSuccess).then(created => {
			if(this.processor !== undefined) {
				this.processor.process(created);
			}
			this.entityList.append(created);
			this.entitySelection.select(created);
			this.entityModification.setModified(created);

			return created;
		});
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