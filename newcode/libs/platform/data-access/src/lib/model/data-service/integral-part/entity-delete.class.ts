/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySelection } from '../interface/entity-selection.interface';
import { IEntityDeleteGuard } from '../interface/entity-delete-guard.interface';
import { IEntityModification } from '../interface/entity-modification.interface';
import { CollectionHelper, IEntityBase } from '@libs/platform/common';
import { IEntityList } from '../interface/entity-list.interface';
import { IRootDataProvider } from '../../data-provider/root-data-provider.interface';
import { IEntityActionState } from '../interface/entity-action-state.interface';

/**
 * Implementation for the different stages of delete
 * @typeParam T - entity type handled by the data service
 */
export class EntityDelete<T extends object> {
	public constructor(
		protected actionState: IEntityActionState<T>,
		protected selection: IEntitySelection<T>,
		protected entities: IEntityList<T>,
		protected modification: IEntityModification<T>,
		protected deleteGuard: IEntityDeleteGuard<T> | null) {
	}

	/**
	 * Delete the following subordinated element managed by the dataservice using this as an implementation helper
	 * @return all selected elements, in case of none selected, an empty array
	 */
	public deleteSubordinated(entities: T[] | T): void {
		if (this.supportsDelete() && (this.deleteGuard === null || this.deleteGuard.isDeleteAllowed(entities))) {
			const saved = this.filterOutUnstoredEntities(entities);
			if (saved.length > 0) {
				this.modification.setDeleted(saved);
			}

			this.modification.removeModified(entities);
			this.entities.remove(entities);
		}
	}

	/**
	 * Delete the following root element managed by the dataservice using this as an implementation helper
	 * @return all selected elements, in case of none selected, an empty array
	 */
	public deleteRoot<U>(entities: T[] | T, httpProvider: IRootDataProvider<T, U>): void {
		if (this.supportsDelete() && (this.deleteGuard === null || this.deleteGuard.isDeleteAllowed(entities))) {
			this.modification.clearModifications();
			this.entities.remove(entities);

			const saved = this.filterOutUnstoredEntities(entities);
			if (saved.length > 0) {
				httpProvider.delete(saved);
			}
		}
	}

	/**
	 * Checks if currenty at least one entity is selected
	 * @return true iff at least one element is selected
	 */
	public canDelete(): boolean {
		let canDelete = this.supportsDelete();
		if (canDelete) {
			const selected = this.selection.getSelection();

			if (!selected || selected.length === 0) {
				canDelete = false;
			} else {
				if (this.deleteGuard) {
					canDelete = this.deleteGuard.isDeleteAllowed(selected);
				}
			}
		}

		return canDelete;
	}

	public supportsDelete(): boolean {
		return this.actionState.supported;
	}

	private filterOutUnstoredEntities(entities: T[] | T): T[] {
		const entityArray = [] as T[];
		const resultArray = [] as T[];
		CollectionHelper.AppendTo(entities, entityArray);

		entityArray.forEach((entity: T) => {
			const baseEntity = entity as IEntityBase;
			if (baseEntity !== undefined && baseEntity.Version !== undefined && baseEntity.Version > 0) {
				resultArray.push(entity);
			}
		});

		return resultArray;
	}
}
