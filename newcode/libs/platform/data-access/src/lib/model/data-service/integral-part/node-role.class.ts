/*
 * Copyright(c) RIB Software GmbH
 */

import {
	CollectionHelper,
	CompleteIdentification, Dictionary,
	IIdentificationData
} from '@libs/platform/common';
import { IChildRoleTyped } from '../interface/child-role-typed.interface';
import { IParentRole } from '../interface/parent-role.interface';
import { IDataProvider } from '../../data-provider/data-provider.interface';
import { IEntityList } from '../interface/entity-list.interface';
import { EntityMultiProcessor } from './entity-multi-processor.class';
import { EntityModification } from './entity-modification.class';
import { IEntityUpdateAccessor } from '../interface/entity-update-accessor.interface';
import { IChildRoleBase } from '../interface/child-role-base.interface';
import { INodeRoleModificationRegistration } from '../interface/node-role-modification-registration.interface';
import { IEntityTree } from '../interface/entity-tree.interface';
import { Subject } from 'rxjs';


/**
 * Class for child (sub) element data service
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export class NodeRole<T extends object, U extends CompleteIdentification<T>,
	PT extends object, PU extends CompleteIdentification<PT>>
	implements IParentRole<T, U>, IChildRoleTyped<T, PT, PU> {

	/**
	 * entitiesModifiedInfo subject for IParentRole
	 */
	public entitiesModifiedInfo = new Subject<void>();
	public constructor(
		protected entityList: IEntityList<T>,
		protected dataProvider: IDataProvider<T>,
		protected processor: EntityMultiProcessor<T>,
		protected parentRole: IParentRole<T, U>,
		protected childRole: IChildRoleTyped<T, PT, PU>,
		protected entityModification: EntityModification<T>,
		protected entityUpdateAccessor: IEntityUpdateAccessor<T, U>,
		protected modificationRegistration: INodeRoleModificationRegistration<T, U, PT, PU>) {
	}

	public registerChildService(childService: IChildRoleBase<T, U>): void {
		this.parentRole.registerChildService(childService);
	}

	public childrenHaveModification(parent: T): boolean {
		return this.parentRole.childrenHaveModification(parent);
	}

	public loadChildEntities(selected: T): Promise<T | null> {
		return this.parentRole.loadChildEntities(selected);
	}

	public collectChildModifications(updated: U, forEntity: T): void {
		this.parentRole.collectChildModifications(updated, forEntity);
	}

	public takeOverUpdatedChildEntities(updated: U): void {
		this.parentRole.takeOverUpdatedChildEntities(updated);
	}

	public clearChildrenModification(): void {
		this.parentRole.clearChildrenModification();
	}

	public isRoot(): boolean {
		return false;
	}

	public hasModifiedFor(parent: PT): boolean {
		let result = this.childRole.hasModifiedFor(parent);
		if (!result) {
			const entities = this.entityList.getList();
			entities.forEach((entity) => {
				if (!result && this.parentRole.childrenHaveModification(entity)) {
					result = true;
				}
			});
		}

		return result;
	}

	public collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		type EntityKey = keyof typeof parentUpdate;

		//0) Get all own modifications
		const modifiedToUpdates = this.collectOwnModificationsForParentUpdate(parentUpdate, parent);

		let candidates: T[] = [];
		// Check if entityList is actually an entityTree
		//  if so, get flat list for the candidates instead of a regular list
		if (typeof (this.entityList as IEntityTree<T>).flatList === 'function') {
			candidates = candidates.concat(...(this.entityList as IEntityTree<T>).flatList());
		} else {
			candidates = candidates.concat(...this.entityList.getList());
		}
		//1) Determine all entities not already parentUpdate, but having modified entities
		CollectionHelper.RemoveFromWithComparer(modifiedToUpdates.keys(), candidates, this.entityList.assertComparer().compare);

		//2) Create Update Entities for them
		if (candidates.length > 0) {
			const completes = [] as U[];
			candidates.forEach((unmod) => {
				if (this.childrenHaveModification(unmod)) {
					const newComplete = this.entityUpdateAccessor.createUpdateEntity(null);
					completes.push(newComplete);
					modifiedToUpdates.add(unmod, newComplete);
				}
			});

			if (this.modificationRegistration.registerByMethod()) {
				this.modificationRegistration.registerNodeModificationsToParentUpdate(parentUpdate, completes, []);
			} else {
				(parentUpdate[this.modificationRegistration.itemName + 'ToSave' as EntityKey] as U[]) = completes;
			}
		}

		//3) Get all modified subordinated entities for all elements found in 0= and 1)
		modifiedToUpdates.keys().forEach((parent: T) => {
			const update = modifiedToUpdates.get(parent);
			if (update !== undefined) {
				this.parentRole.collectChildModifications(update, parent);
			}
		});
	}

	private collectOwnModificationsForParentUpdate(parentUpdate: PU, parent: PT): Dictionary<T, U> {
		type EntityKey = keyof typeof parentUpdate;
		const modified = this.entityModification.getModifiedFor(parent);
		const modifiedToUpdates = new Dictionary<T, U>();
		modified.forEach((mod) => {
			modifiedToUpdates.add(mod, this.entityUpdateAccessor.createUpdateEntity(mod));
		});
		const deleted = this.entityModification.getDeletedFor(parent);
		// ToDo: Check if modifications need to be cloned
		this.processor.revertProcess(modified);
		this.processor.revertProcess(deleted);

		if (this.modificationRegistration.registerByMethod()) {
			this.modificationRegistration.registerNodeModificationsToParentUpdate(parentUpdate, modifiedToUpdates.values(), deleted);
		} else {
			(parentUpdate[this.modificationRegistration.itemName + 'ToSave' as EntityKey] as U[]) = modifiedToUpdates.values();
			(parentUpdate[this.modificationRegistration.itemName + 'ToDelete' as EntityKey] as T[]) = deleted;
		}

		return modifiedToUpdates;
	}

	public clearModifications(): void {
		this.clearChildrenModification();

		this.childRole.clearModifications();
	}

	public load(identificationData: IIdentificationData): Promise<T[]> {
		return this.childRole.load(identificationData);
	}

	public loadEnhanced<PT extends object, RT>(payload: PT | undefined, onSuccess: (loaded: RT) => T[]): Promise<T[]> {
		if(this.childRole.loadEnhanced === undefined) {
			throw new Error('Enhanced loading is only supported with a provider having implemented loadEnhanced');
		}
		return this.childRole.loadEnhanced(payload, onSuccess);
	}

	public loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return this.childRole.loadSubEntities(identificationData);
	}

	public takeOverUpdated(updated: PU): void {
		this.childRole.takeOverUpdated(updated);

		const updatedOwnParent = [] as U[];

		updatedOwnParent.forEach((updatedParent) => {
			this.parentRole.takeOverUpdatedChildEntities(updatedParent);
		});
	}
}


