/*
 * Copyright(c) RIB Software GmbH
 */

import { IChildRoleBase } from '../interface/child-role-base.interface';
import { IParentRole } from '../interface/parent-role.interface';
import { IIdentificationDataConverter } from '../interface/identification-data-converter.interface';
import { EntityModification } from './entity-modification.class';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IEntitySelection } from '../interface/entity-selection.interface';
import { EntityMultiProcessor } from './entity-multi-processor.class';
import { IEntityModification } from '../interface/entity-modification.interface';
import { Subject } from 'rxjs';


/**
 * Implementation class of all data service classes for non hierarchically entity classes.
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export class ParentRole<T extends object, U extends CompleteIdentification<T>> implements IParentRole<T, U> {
	private childServices: IChildRoleBase<T, U>[] = [];
	private isRootService: boolean = false;
	public entitiesModifiedInfo = new Subject<void>();

	public constructor(
		// protected dataProvider: IDataProvider<T>,
		protected converter: IIdentificationDataConverter<T>,
		protected modifications: EntityModification<T>,
		protected processor: EntityMultiProcessor<T>, isRoot: boolean = false) {
		if (isRoot) {
			this.isRootService = true;
			modifications.entitiesModified$.subscribe(() => {
				this.entitiesModifiedInfo.next();
			});
		}
	}

	/**
	 * Colled changed or deleted entites into the complete object
	 * @param complete A container for all data to be saved or deleted
	 * @param forEntity The parent entity for which the complete is created
	 */
	public collectChildModifications(complete: U, forEntity: T): void {
		for (const childService of this.childServices) {
			childService.collectModificationsForParentUpdate(complete, forEntity);
		}
	}

	/**
	 * Function to register a subordinated (child) data service. The registered service should be taken into account in
	 * loading and updating triggered by the parent or even higher levels.
	 * @param childService The child data service that needs to be administered by the parent service
	 */
	public registerChildService(childService: IChildRoleBase<T, U>): void {
		this.childServices.push(childService);
		const modifiable = childService as unknown as IEntityModification<T>;
		modifiable.entitiesModified$.subscribe(() => {
			this.entitiesModifiedInfo.next();
		});

	}

	/**
	 * Function for triggering the load calls in all subordinated (child) data services
	 * @param selected The currently selected parent entity. May be null, in case a deselction has taken place
	 */
	public loadChildEntities(selected: T): Promise<T | null> {
		const ident = this.converter.convert(selected);
		for (const childService of this.childServices) {
			childService.loadSubEntities(ident).then(() => {
				(childService as unknown as IEntitySelection<T>).deselect();
			});
		}
		return Promise.resolve(null);
	}

	/**
	 * Writes back the updated subordinated entities sent back from the application server.
	 */
	public takeOverUpdatedChildEntities(updated: U): void {
		for (const childService of this.childServices) {
			childService.takeOverUpdated(updated);
		}
	}

	public getSelection(): IEntityIdentification[] {
		throw new Error('This method is not implemented');
	}

	public childrenHaveModification(parent: T): boolean {
		return this.childServices.some(childService => childService.hasModifiedFor(parent));
	}

	public clearChildrenModification(): void {
		this.childServices.forEach(childService => childService.clearModifications());
	}

	public isRoot(): boolean {
		return this.isRootService;
	}
}
