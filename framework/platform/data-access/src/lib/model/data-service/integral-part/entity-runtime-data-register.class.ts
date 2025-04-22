/*
 * Copyright(c) RIB Software GmbH
 */

import { CollectionHelper, Dictionary } from '@libs/platform/common';
import { inject } from '@angular/core';
import { UnhandledValidationErrorService } from '../../validation/unhandled-validation-error.service';
import { EntityRuntimeData, IFieldInfo, IFieldValidationResult, IReadOnlyField } from '../../runtime-data/entity-runtime-data.class';
import { IReadOnlyEntityRuntimeData } from '../../runtime-data/read-only-entity-runtime-data.interface';


/**
 * Class for list functionality provided entity data services
 * @typeParam T - entity type handled by the data service
 */

export class EntityRuntimeDataRegister<T extends object> {
	private runtimeData: Dictionary<T, EntityRuntimeData<T>> = new Dictionary<T, EntityRuntimeData<T>>();
	private unhandledValidationErrorService: UnhandledValidationErrorService = inject(UnhandledValidationErrorService);

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
	 * @param serviceName Name of the calling data service
	 */
	public removeInvalid(entity: T, result: IFieldValidationResult<T>, serviceName: string): void {
		const rt = this.runtimeData.get(entity);

		if (rt) {
			CollectionHelper.RemoveFromWithComparer(result, rt.validationResults, this.compareFields);
		}

		if (!this.hasValidationErrors()) {
			this.unhandledValidationErrorService.removeServiceWithErrors(serviceName);
		}
	}

	/**
	 * Register validation error on a property of a given entity
	 * @param entity - information about entity unsuccessful validated
	 * @param result - information about property and error
	 * @param serviceName Name of the calling data service
	 */
	public addInvalid(entity: T, result: IFieldValidationResult<T>, serviceName: string): void {
		if (!this.hasValidationErrors()) {
			this.unhandledValidationErrorService.addServiceWithErrors(serviceName);
		}

		let rt = this.runtimeData.get(entity);

		if (!rt) {
			rt = new EntityRuntimeData<T>();
			rt.validationResults.push(result);
			this.runtimeData.add(entity, rt);
		} else {
			CollectionHelper.RemoveFromWithComparer(result, rt.validationResults, this.compareFields);
			rt.validationResults.push(result);
		}
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

	public setEntityReadOnlyFields(entity: T, readonlyFields: IReadOnlyField<T>[]): void {
		let rt = this.runtimeData.get(entity);
		if (rt === undefined) {
			rt = new EntityRuntimeData<T>();
			this.runtimeData.add(entity, rt);
		} else {
			CollectionHelper.RemoveFromWithComparer(readonlyFields, rt.readOnlyFields, this.compareFields);
		}
		rt.readOnlyFields.push(...readonlyFields);
	}
}