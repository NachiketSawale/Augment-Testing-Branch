/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceBase } from './data-service-base.class';
import { IEntityList } from './interface/entity-list.interface';
import { EntityList } from './integral-part/entity-list.class';
import { Observable, Subject } from 'rxjs';
import { IEntitySelection } from './interface/entity-selection.interface';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData, isLazyInjectionToken,
	PlatformLazyInjectorService
} from '@libs/platform/common';
import { IParentRole } from './interface/parent-role.interface';
import { IChildRoleBase } from './interface/child-role-base.interface';
import { ParentRole } from './integral-part/parent-role.class';
import { ParentEntitySelection } from './integral-part/parent-entity-selection.class';
import { IEntityDelete } from './interface/entity-delete.interface';
import { EntityDelete } from './integral-part/entity-delete.class';
import { IEntityCreate } from './interface/entity-create.interface';
import { EntityCreate } from './integral-part/entity-create.class';
import { IChildRoleTyped } from './interface/child-role-typed.interface';
import { IEntityModification } from './interface/entity-modification.interface';
import { EntityModification } from './integral-part/entity-modification.class';
import { NodeRole } from './integral-part/node-role.class';
import { IEntityUpdateAccessor } from './interface/entity-update-accessor.interface';
import { IDataServiceOptions } from './interface/options/data-service-options.interface';
import { ChildRole } from './integral-part/child-role.class';
import { IEntityComparer } from './interface/entity-comparer.interface';
import { INodeRoleModificationRegistration } from './interface/node-role-modification-registration.interface';
import { IDataServiceChildRoleOptions } from './interface/options/data-service-child-role-options.interface';
import { SimpleEntityComparer } from './integral-part/simple-entity-comparer.class';
import { IDataProvider } from '../data-provider/data-provider.interface';
import { HttpDataProvider } from '../data-provider/http-data-provider.class';
import { HttpDataCacheProvider } from '../data-provider/http-data-cache-provider.class';
import { inject } from '@angular/core';
import { EntityDataTranslationService } from '../../services/entity-data-translation.service';


/**
 * Base clas of all data service classes for non hierarchically entity classes having other
 * entity classes as sub entities in the same business domain
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export class DataServiceFlatNode<T extends object, U extends CompleteIdentification<T>,
	PT extends object, PU extends CompleteIdentification<PT>>
	extends DataServiceBase<T> implements IEntitySelection<T>,
	IParentRole<T, U>,
	IChildRoleTyped<T, PT, PU>,
	IEntityList<T>,
	IEntityDelete<T>,
	IEntityCreate<T>,
	IEntityModification<T>,
	IEntityUpdateAccessor<T, U>,
	INodeRoleModificationRegistration<T, U, PT, PU> {
	private entitySelection: IEntitySelection<T>;
	private entityList: IEntityList<T>;
	private nodeRole: NodeRole<T, U, PT, PU>;
	private entityDelete: EntityDelete<T>;
	private entityCreate: EntityCreate<T>;
	private entityModification: EntityModification<T>;
	private dataTranslationService = inject(EntityDataTranslationService);
	protected typedParent: IParentRole<PT, PU> & IEntitySelection<PT> | undefined;
	private readonly lazyInjectorService = inject(PlatformLazyInjectorService);
	public entitiesModifiedInfo = new Subject<void>();

	public constructor(options: IDataServiceOptions<T>) {
		super(options);
		this.entityList = new EntityList<T>(this.assertComparer, this.converter);
		this.entityModification = new EntityModification<T>(options, this.assertComparer, this.isParentFn.bind(this));
		this.nodeRole = new NodeRole<T, U, PT, PU>(this.entityList, this.provider, this.processor,
			new ParentRole<T, U>(this.converter, this.entityModification, this.processor),
			new ChildRole<T, PT, PU>(this.entityList, this.provider, this.processor, this.entityModification, this),
			this.entityModification, this, this);
		this.entitySelection = new ParentEntitySelection<T, U>(this.nodeRole, this.entityList, this.converter);
		this.entityDelete = new EntityDelete<T>(this.provideDeleteActionState(), this.entitySelection, this.entityList, this.entityModification, null);
		this.entityCreate = new EntityCreate<T>(this.provideCreateActionState(), this.entitySelection, this.entityList, this.entityModification, this.provider, options.createInfo, this.processor);

		const childOptions = options.roleInfo as IDataServiceChildRoleOptions<T, PT, PU>;

		if (isLazyInjectionToken(childOptions?.parent)) {
			this.lazyInjectorService.inject(childOptions?.parent).then(ps => {
				this.typedParent = ps;
				this.typedParent.registerChildService(this);
			});
		} else {
			this.typedParent = childOptions?.parent as IParentRole<PT, PU> & IEntitySelection<PT>;
			this.typedParent.registerChildService(this);
		}
	}

	/**
	 * Returns true, when at least one element is in the list
	 */
	public any(): boolean {
		return this.entityList.any();
	}

	public isRoot(): boolean {
		return false;
	}

	public get itemName(): string {
		return this.options.roleInfo.itemName;
	}

	public createUpdateEntity(modified: T | null): U {
		throw new Error('Method not implemented.');
	}

	public getModificationsFromUpdate(complete: U): T[] {
		throw new Error('This function must be overwritten for creation of update objects');
	}

	/**
	 * Colled changed or deleted entites into the complete object
	 * @param complete A container for all data to be saved or deleted
	 * @param forEntity The parent entity for which the complete is created
	 */
	public collectChildModifications(complete: U, forEntity: T): void {
		this.nodeRole.collectChildModifications(complete, forEntity);
	}

	public deselect(): void {
		this.entitySelection.deselect();
	}

	public getSelection(): T[] {
		return this.entitySelection.getSelection();
	}

	public getSelectedIds(): IIdentificationData[] {
		return this.entitySelection.getSelectedIds();
	}

	public getSelectedEntity(): T | null {
		return this.entitySelection.getSelectedEntity();
	}

	public hasSelection(): boolean {
		return this.entitySelection.hasSelection();
	}

	public select(toSelect: T[] | T | null): Promise<T | null> {
		this.dataTranslationService.loadTranslation(toSelect, this);
		return this.entitySelection.select(toSelect);
	}

	public selectById(toSelect: IIdentificationData[] | IIdentificationData | null): Promise<T | null> {
		return this.entitySelection.selectById(toSelect);
	}

	public selectFirst(): Promise<T | null> {
		return this.entitySelection.selectFirst();
	}

	public selectLast(): Promise<T | null> {
		return this.entitySelection.selectLast();
	}

	public selectNext(): Promise<T | null> {
		return this.entitySelection.selectNext();
	}

	public selectPrevious(): Promise<T | null> {
		return this.entitySelection.selectPrevious();
	}

	/**
	 * selectionChanged$ observable for registration
	 */
	public get selectionChanged$(): Observable<T[]> {
		return this.entitySelection.selectionChanged$;
	}

	public getList(): T[] {
		return this.entityList.getList();
	}

	public getAllIds(): IIdentificationData[] {
		return this.entityList.getAllIds();
	}

	public registerChildService(childService: IChildRoleBase<T, U>): void {
		this.nodeRole.registerChildService(childService);
	}

	public loadChildEntities(selected: T): Promise<T | null> {
		return this.nodeRole.loadChildEntities(selected);
	}

	public supportsDelete(): boolean {
		return this.entityDelete.supportsDelete();
	}

	public canDelete(): boolean {
		return this.entityDelete.canDelete();
	}

	public delete(entities: T[] | T): void {
		this.entityDelete.deleteSubordinated(entities);
	}

	public supportsCreate(): boolean {
		return this.entityCreate.supportsCreate();
	}

	public canCreate(): boolean {
		return this.entityCreate.canCreate();
	}

	protected override checkCreateIsAllowed(entities: T[] | T | null): boolean {
		return this.getSelectedParent() !== undefined;
	}

	protected getSelectedParent(): PT | undefined {
		if (this.typedParent) {
			const parent = this.typedParent.getSelectedEntity();
			return parent ? parent : undefined;
		}
		return undefined;
	}

	public create(): Promise<T> {
		if (this.onCreateSucceeded !== undefined && this.provideCreatePayload !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreate.createEnhanced(this.provideCreatePayload(), onSuccess);
		} else if (this.onCreateSucceeded !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreate.createEnhanced(this.getSelectedParent(), onSuccess);
		}
		return this.entityCreate.create(this.getSelectedParent());
	}

	public get listChanged$(): Observable<T[]> {
		return this.entityList.listChanged$;
	}

	public setList(entities: T[]): void {
		this.entityList.setList(entities);
	}

	public load(identificationData: IIdentificationData): Promise<T[]> {
		if (this.onLoadSucceeded !== undefined && this.provideLoadPayload !== undefined) {
			const onSuccessFn = this.onLoadSucceeded;
			const onSuccess = (loaded: object) => onSuccessFn.call(this, loaded);
			return this.nodeRole.loadEnhanced(this.provideLoadPayload(), onSuccess);
		} else if (this.onLoadSucceeded !== undefined) {
			const onSuccessFn = this.onLoadSucceeded;
			const onSuccess = (loaded: object) => onSuccessFn.call(this, loaded);
			return this.nodeRole.loadEnhanced(identificationData, onSuccess);
		}

		return this.nodeRole.load(identificationData);
	}


	public loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		if (identificationData != null) {
			return this.load(identificationData).then(() => {
			});
		}

		return this.nodeRole.loadSubEntities(identificationData);
	}

	public append(toAdd: T[] | T): void {
		this.entityList.append(toAdd);
	}

	public getModified(): T[] {
		return this.entityModification.getModified();
	}

	public getModifiedFor(parentKey: IEntityIdentification): T[] {
		return this.entityModification.getModifiedFor(parentKey);
	}

	public getDeleted(): T[] {
		return this.entityModification.getDeleted();
	}

	public getDeletedFor(parentKey: IEntityIdentification): T[] {
		return this.entityModification.getDeletedFor(parentKey);
	}

	public get entitiesModified$(): Observable<T[]> {
		return this.entityModification.entitiesModified$;
	}

	public removeModified(entities: T[] | T): void {
		this.entityModification.removeModified(entities);
	}

	public hasModifiedFor(parent: PT): boolean {
		return this.entityModification.hasModifiedFor(parent);
	}

	public clearModifications() {
		this.entityModification.clearModifications();

		this.nodeRole.clearChildrenModification();
	}

	public setModified(entities: T[] | T): void {
		this.entityModification.setModified(entities);
	}


	public remove(entities: T[] | T): void {
		this.entityList.remove(entities);
	}

	public setDeleted(entities: T[] | T): void {
		this.entityModification.setDeleted(entities);
	}

	public takeOverUpdated(updated: PU): void {
		let saved: T[] | null = null;
		if (this.registerByMethod()) {
			saved = this.getSavedEntitiesFromUpdate(updated);
		} else {
			type EntityKey = keyof typeof updated;
			saved = (updated[this.itemName + 'ToSave' as EntityKey] as T[]);
		}

		if (saved && saved.length > 0) {
			this.entityList.updateEntities(saved);
			this.entityModification.entitiesUpdated(saved);
		}
	}

	public takeOverUpdatedChildEntities(updated: U): void {
	}

	public updateEntities(updated: T[]): void {
		this.entityList.updateEntities(updated);
	}

	public childrenHaveModification(parent: T): boolean {
		return this.nodeRole.childrenHaveModification(parent);
	}

	public collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		this.nodeRole.collectModificationsForParentUpdate(parentUpdate, parent);
	}

	public clearChildrenModification(): void {
		this.nodeRole.clearChildrenModification();
	}

	public registerByMethod(): boolean {
		return false;
	}

	public registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]): void {
		if (this.registerByMethod()) {
			throw new Error('Even though registerByMethod returns true, this method should not have been called for a node');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getSavedEntitiesFromUpdate(parentUpdate: PU): T[] {
		if (this.registerByMethod()) {
			throw new Error('This method must be override in case registerByMethod is so and returns true');
		}

		return [];
	}

	public registerNodeModificationsToParentUpdate(parentUpdate: PU, modified: U[], deleted: T[]): void {
		if (this.registerByMethod()) {
			throw new Error('This method must be override in case registerByMethod is so and returns true');
		}
	}

	public assertComparer(): IEntityComparer<T> {
		return new SimpleEntityComparer<T>();
	}


	public isParentFn(parentKey: object, entity: T): boolean {

		throw new Error('The parent reference needs to be declared');
	}

	protected override createHttpProvider(options: IDataServiceOptions<T>): IDataProvider<T> {
		if (options.provider) {
			return options.provider;
		}

		if (this.typedParent && this.typedParent.isRoot()) {
			return new HttpDataProvider(options);
		}
		return new HttpDataCacheProvider(options);
	}

	public entitiesUpdated(entities: T[] | T): void {
		this.entityModification.entitiesUpdated(entities);
	}

	/**
	 * Observable for entitiesUpdated$ event
	 * @return Observable indicating that entities have been updated e.g. after after update call
	 */
	public get entitiesUpdated$(): Observable<T[]> {
		return this.entityModification.entitiesUpdated$;
	}
}