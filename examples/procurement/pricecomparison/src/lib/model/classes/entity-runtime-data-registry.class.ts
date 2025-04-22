/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityRuntimeData, IEntityRuntimeDataRegistry, IFieldInfo, IFieldValidationResult, IReadOnlyEntityRuntimeData, IReadOnlyField } from '@libs/platform/data-access';
import { CollectionHelper, Dictionary } from '@libs/platform/common';

/**
 * TODO-DRIZZLE: Use EntityRuntimeDataRegister instead.
 */
export class EntityRuntimeDataRegistry<T extends object> implements IEntityRuntimeDataRegistry<T> {
	private runtimeData: Dictionary<T, EntityRuntimeData<T>> = new Dictionary<T, EntityRuntimeData<T>>();

	/**
	 * Quick check of there are any invalid entities registered on thos data service
	 */
	public hasValidationErrors(): boolean {
		return this.runtimeData.values().some(rt => {
			return rt.validationResults.length > 0;
		});
	}

	/**
	 * get all entities with validation errors
	 */
	public getInvalidEntities(): T[] {
		const invalidEntities = [] as T[];
		this.runtimeData.keys().forEach(entity => {
			const rt = this.runtimeData.get(entity);
			if (rt !== undefined && rt.validationResults.length > 0) {
				invalidEntities.push(entity);
			}
		});
		return invalidEntities;
	}

	/**
	 * get all validation errors for a given entity
	 * @param entity
	 */
	public getValidationErrors(entity: T): IFieldValidationResult<T>[] {
		const rt = this.runtimeData.get(entity);
		return rt ? rt.validationResults : [];
	}

	private compareFields(left: IFieldInfo<T>, right: IFieldInfo<T>): number {
		if (left.field === right.field) {
			return 0;
		}
		if (left.field < right.field) {
			return -1;
		}
		return 1;
	}

	/**
	 * Remove validation error after a correction was done
	 * @param entity - information about entity unsuccessful validated
	 * @param result - information about property and error
	 */
	public removeInvalid(entity: T, result: IFieldValidationResult<T>): void {

	}

	/**
	 * Register validation error on a property of a given entity
	 * @param entity - information about entity unsuccessful validated
	 * @param result - information about property and error
	 */
	public addInvalid(entity: T, result: IFieldValidationResult<T>): void {

	}

	public getEntityReadOnlyFields(entity: T): IReadOnlyField<T>[] {
		const rt = this.runtimeData.get(entity);
		if (rt !== undefined) {
			return rt.readOnlyFields;
		}
		return [];
	}

	public isEntityReadOnly(entity: T): boolean {
		const rt = this.runtimeData.get(entity);
		if (rt !== undefined) {
			return rt.entityIsReadOnly;
		}
		return false;
	}

	public getEntityReadonlyRuntimeData(entity: T): IReadOnlyEntityRuntimeData<T> | null {
		const rt = this.runtimeData.get(entity);
		if (rt !== undefined) {
			return rt;
		}

		return null;
	}

	public setEntityReadOnly(entity: T, readonly: boolean): void {
		let rt = this.runtimeData.get(entity);
		if (rt === undefined) {
			rt = new EntityRuntimeData<T>();
			this.runtimeData.add(entity, rt);
		}
		rt.entityIsReadOnly = readonly;
	}

	public setEntityReadOnlyFields(entity: T, readonlyFields: IReadOnlyField<T>[]) {
		let rt = this.runtimeData.get(entity);
		if (!rt) {
			rt = new EntityRuntimeData<T>();
			this.runtimeData.add(entity, rt);
		} else {
			CollectionHelper.RemoveFromWithComparer(readonlyFields, rt.readOnlyFields, this.compareFields);
		}
		rt.readOnlyFields.push(...readonlyFields);
	}
}