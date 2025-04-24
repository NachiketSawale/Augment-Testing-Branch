/*
 * Copyright(c) RIB Software GmbH
 */

import { Subject } from 'rxjs';
import { IRootRole } from '../interface/root-role.interface';
import {
	ISearchResult,
	ISearchPayload,
	CompleteIdentification,
	IMainEntityAccess, Translatable, PlatformSearchAccessService
} from '@libs/platform/common';
import { IRootDataProvider } from '../../data-provider/root-data-provider.interface';
import { inject } from '@angular/core';
import { PendingAsyncValidationService } from '../../validation/pending-async-validation.service';
import { UnhandledValidationErrorService } from '../../validation/unhandled-validation-error.service';
import { EntityModification } from './entity-modification.class';
import { IEntityUpdateAccessor } from '../interface/entity-update-accessor.interface';
import { isArray, isObject } from 'lodash';
import { IParentRole } from '../interface/parent-role.interface';
import { IChildRoleBase } from '../interface/child-role-base.interface';
import { IEntityList } from '../interface/entity-list.interface';
import { EntityMultiProcessor } from './entity-multi-processor.class';


/**
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export class RootRole<T extends object, U extends CompleteIdentification<T>> implements IParentRole<T, U>, IRootRole<T, U> {

	private searchAccessService: PlatformSearchAccessService = inject(PlatformSearchAccessService);
	private pendingValidationService: PendingAsyncValidationService = inject(PendingAsyncValidationService);
	private unhandledValidationErrorService: UnhandledValidationErrorService = inject(UnhandledValidationErrorService);
	public entitiesModifiedInfo: Subject<void>;

	public constructor(protected parentRole: IParentRole<T, U>,
	                   protected rootDataProvider: IRootDataProvider<T, U>,
	                   protected processor: EntityMultiProcessor<T>,
	                   protected entityList: IEntityList<T>,
	                   protected modifications: EntityModification<T>,
	                   protected entityUpdateAccessor: IEntityUpdateAccessor<T, U>,
	                   protected getMainEntitiesFromUpdate: (update: U) => T[]) {
		this.entitiesModifiedInfo = parentRole.entitiesModifiedInfo;
	}

	/**
	 *  return whether the current instance is a root service or not
	 */
	public isRoot(): boolean {
		return true;
	}

	/**
	 * triggers the update with completeEntity
	 * @param oldSelection the previous selected rootEntity
	 */

	public async update(oldSelection: T): Promise<T> {
		await this.pendingValidationService.getAll();

		if (this.unhandledValidationErrorService.hasUnhandledErrors()) {
			// ToDo: Trigger error correction, in case successfully do update, else go out as done in next line
			return Promise.resolve(oldSelection);
		}

		return this.doUpdate(oldSelection);
	}

	/**
	 * triggers a filter request
	 * @param payload
	 */
	public filter(payload: ISearchPayload): Promise<ISearchResult<T>> {
		return this.rootDataProvider.filter(payload).then(result => {
			this.processor.process(result.dtos);
			this.entityList.setList(result.dtos);

			return result;
		});
	}

	/**
	 *
	 * @param payload
	 * @param onSuccess
	 */
	public filterEnhanced<PT extends object, RT>(payload: PT, onSuccess: (loaded: RT) => ISearchResult<T>): Promise<ISearchResult<T>> {
		if (this.rootDataProvider.filterEnhanced === undefined) {
			throw new Error('Enhanced loading is only supported with a provider having implemented loadEnhanced');
		}

		return this.rootDataProvider.filterEnhanced(payload, onSuccess).then(result => {
			this.processor.process(result.dtos);
			this.entityList.setList(result.dtos);

			return result;
		});
	}

	/**
	 * called when response from server is received to merge entities back to the service instance state
	 * @param updated
	 * @protected
	 */
	protected takeOverUpdated(updated: U): T[] {
		const updatedRoots = [] as T[];
		if (this.getMainEntitiesFromUpdate !== undefined) {
			updatedRoots.push(...this.getMainEntitiesFromUpdate(updated));
			if (updatedRoots.length > 0) {
				this.entityList.updateEntities(updatedRoots);
				this.modifications.entitiesUpdated(updatedRoots);
			}
		}
		this.takeOverUpdatedChildEntities(updated);
		return updatedRoots;
	}

	private isSaveRequired(updateEntity: U): boolean {
		let isUpdateRequired = false;
		const updateEntityKeys = Object.keys(updateEntity) as Array<keyof U>;
		updateEntityKeys.forEach((updateEntityKey) => {
			if (isArray(updateEntity[updateEntityKey])) {
				const entityList = updateEntity[updateEntityKey] as unknown as [];
				isUpdateRequired = isUpdateRequired || entityList.length > 0;
			} else if (isObject(updateEntity[updateEntityKey]) && updateEntity[updateEntityKey] !== null && updateEntity[updateEntityKey] !== undefined) {
				isUpdateRequired = true;
			}
		});
		return isUpdateRequired;
	}

	private async doUpdate(oldSelection: T): Promise<T> {
		let modifiedSel: T | null = null;
		const modified = this.modifications.getModified();
		const comparer = this.entityList.assertComparer();
		if (modified.some((i) => comparer.compare(i, oldSelection) === 0)) {
			modifiedSel = oldSelection;
		}

		const updateEntity = this.entityUpdateAccessor.createUpdateEntity(modifiedSel);
		this.transferChildModificationsToUpdate(updateEntity, oldSelection);

		if (this.isSaveRequired(updateEntity)) {
			const complete = await this.rootDataProvider.update(updateEntity);

			const updatedRoots = this.takeOverUpdated(complete);
			if (updatedRoots.length > 0) {
				const index = updatedRoots.findIndex(rm => comparer.compare(rm, oldSelection) === 0);
				if (index >= 0) {
					return Promise.resolve(updatedRoots[index]);
				}
			}
		}

		return Promise.resolve(oldSelection);
	}

	private transferChildModificationsToUpdate(completeUpdate: U, oldSelection: T): void {
		this.collectChildModifications(completeUpdate, oldSelection);

		this.modifications.clearModifications();
		this.clearChildrenModification();
	}

	public refreshSelectedEntities(payload: ISearchPayload): Promise<T[]> {
		return this.rootDataProvider.filter(payload).then(result => {
			this.processor.process(result.dtos);
			this.entityList.updateEntities(result.dtos);

			return Promise.resolve(result.dtos);
		});
	}

	public refreshSelectedEnhanced<PT extends object, RT>(payload: PT, onSuccess: (loaded: RT) => ISearchResult<T>): Promise<T[]> {
		if (this.rootDataProvider.filterEnhanced === undefined) {
			throw new Error('Enhanced loading is only supported with a provider having implemented loadEnhanced');
		}
		return this.rootDataProvider.filterEnhanced(payload, onSuccess).then(result => {
			this.processor.process(result.dtos);
			this.entityList.updateEntities(result.dtos);
			return result.dtos;
		});
	}

	public refreshOnlySelected(selected: T[]): Promise<T[]> {
		this.parentRole.clearChildrenModification();

		// TODO: implementation of reload of selected entity
		return Promise.resolve(selected);
	}

	public async refreshAllLoaded(): Promise<T[]> {
		this.parentRole.clearChildrenModification();

		const payload = this.searchAccessService.currentSearchPayload();
		const loaded = await this.filter(payload);

		this.processor.process(loaded.dtos);

		return Promise.resolve(loaded.dtos);
	}

	/**
	 * An accessor object for commands executed on the main entity.
	 */
	public get mainEntityAccess(): IMainEntityAccess {
		// TODO: return meaningful object
		return {
			selectionInfo$: new Subject<Translatable>(),
			entitiesModifiedInfo$: this.entitiesModifiedInfo.asObservable()
		};
	}

	public childrenHaveModification(parent: T): boolean {
		return this.parentRole.childrenHaveModification(parent);
	}

	public clearChildrenModification(): void {
		this.parentRole.clearChildrenModification();
	}

	public collectChildModifications(complete: U, forEntity: T): void {
		this.parentRole.collectChildModifications(complete, forEntity);
	}

	public loadChildEntities(selected: T): Promise<T | null> {
		return this.parentRole.loadChildEntities(selected);
	}

	public registerChildService(childService: IChildRoleBase<T, U>): void {
		this.parentRole.registerChildService(childService);
	}

	public takeOverUpdatedChildEntities(updated: U): void {
		this.parentRole.takeOverUpdatedChildEntities(updated);
	}
}
