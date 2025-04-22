/*
 * Copyright(c) RIB Software GmbH
 */

import { Observable } from 'rxjs';
import { DataServiceBase } from './data-service-base.class';
import { IEntitySelection } from './interface/entity-selection.interface';
import { EntitySelection } from './integral-part/entity-selection.class';
import {
	CompleteIdentification,
	IEntityIdentification,
	IIdentificationData, isLazyInjectionToken,
	PlatformLazyInjectorService
} from '@libs/platform/common';
import { IChildRoleTyped } from './interface/child-role-typed.interface';
import { ChildRole } from './integral-part/child-role.class';
import { IEntityTree } from './interface/entity-tree.interface';
import { EntityTree } from './integral-part/entity-tree.class';
import { IEntityDelete } from './interface/entity-delete.interface';
import { EntityDelete } from './integral-part/entity-delete.class';
import { IEntityCreate } from './interface/entity-create.interface';
import { EntityCreate } from './integral-part/entity-create.class';
import { IEntityModification } from './interface/entity-modification.interface';
import { IDataServiceOptions } from './interface/options/data-service-options.interface';
import { EntityModification } from './integral-part/entity-modification.class';
import { IParentRole } from './interface/parent-role.interface';
import { IChildModificationRegistration } from './interface/child-modification-registration.interface';
import { LeafRole } from './integral-part/leaf-role.class';
import { IEntityComparer } from './interface/entity-comparer.interface';
import { IDataServiceChildRoleOptions } from './interface/options/data-service-child-role-options.interface';
import { SimpleEntityComparer } from './integral-part/simple-entity-comparer.class';
import { IEntityCreateChild } from './interface/entity-create-child.interface';
import { EntityCreateChild } from './integral-part/entity-create-child.class';
import { IDataProvider } from '../data-provider/data-provider.interface';
import { HttpDataProvider } from '../data-provider/http-data-provider.class';
import { HttpDataCacheProvider } from '../data-provider/http-data-cache-provider.class';
import { inject } from '@angular/core';
import { EntityDataTranslationService } from '../../services/entity-data-translation.service';
import { IEntityTreeOperations } from './interface/entity-tree-operations.interface';
import { EntityTreeOperations } from './integral-part/entity-tree-operations.class';


/**
 * Base clas of all data service classes for non hierarchically entity classes not having other
 * entity classes as sub entities in the same business domain
 * @typeParam T - entity type handled by the data service
 * @typeParam PT - entity type handled by the parent data service
 * @typeParam PU - complete entity of the parent data service for storage of own (complete) entities
 */
export class DataServiceHierarchicalLeaf<T extends object,
	PT extends object, PU extends CompleteIdentification<PT>>
	extends DataServiceBase<T> implements IEntitySelection<T>,
	IChildRoleTyped<T, PT, PU>,
	IEntityTree<T>,
	IEntityDelete<T>,
	IEntityCreate<T>,
	IEntityCreateChild<T>,
	IEntityModification<T>,
	IChildModificationRegistration<T, PT, PU>,
	IEntityTreeOperations<T>{
	private entityTree: IEntityTree<T>;
	private entitySelection: IEntitySelection<T>;
	private leafRole: IChildRoleTyped<T, PT, PU>;
	private entityDelete: EntityDelete<T>;
	private entityCreate: EntityCreate<T>;
	private entityCreateChild: EntityCreateChild<T>;
	private entityModification: EntityModification<T>;
	private entityTreeOperations: EntityTreeOperations<T>;
	private dataTranslationService = inject(EntityDataTranslationService);
	protected typedParent: IParentRole<PT, PU> & IEntitySelection<PT> | undefined;
	private readonly lazyInjectorService = inject(PlatformLazyInjectorService);


	public constructor(options: IDataServiceOptions<T>) {
		super(options);
		this.entityTree = new EntityTree<T>(this.assertComparer, this.childrenOf, this.parentOf, this.converter);
		this.entitySelection = new EntitySelection<T>(this.entityTree, this.converter);
		this.entityModification = new EntityModification<T>(options, this.assertComparer, this.isParentFn.bind(this));
		this.leafRole = new LeafRole<T, PT, PU>(
			new ChildRole<T, PT, PU>(this.entityTree, this.provider, this.processor, this.entityModification, this));
		this.entityDelete = new EntityDelete<T>(this.provideDeleteActionState(), this.entitySelection, this.entityTree, this.entityModification, null);
		this.entityCreate = new EntityCreate<T>(this.provideCreateActionState(), this.entitySelection, this.entityTree, this.entityModification, this.provider, options.createInfo, this.processor);
		this.entityCreateChild = new EntityCreateChild<T>(this.provideCreateChildActionState(), this.entitySelection, this.entityTree, this.entityModification, this.provider, options.createInfo, this.processor);
		this.entityTreeOperations = new EntityTreeOperations<T>(this.entityTree, this.entityModification, this.entitySelection, this.onTreeParentChanged);

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
	public getAllIds(): IIdentificationData[] {
		return this.entityTree.getAllIds();
	}
	public getSelectedIds(): IIdentificationData[] {
		return this.entitySelection.getSelectedIds();
	}

	protected override provideGetChildrenCallback(): (parent: T) => T[] {
		return this.childrenOf;
	}

	/**
	 * Returns true, when at least one element is in the list
	 */
	public any(): boolean {
		return this.entityTree.any();
	}

	public flatList(): T[] {
		return this.entityTree.flatList();
	}

	public registerByMethod(): boolean {
		return false;
	}

	public get itemName(): string {
		return this.options.roleInfo.itemName;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public registerModificationsToParentUpdate(parentUpdate: PU, modified: T[], deleted: T[]): void {
		if (this.registerByMethod()) {
			throw new Error('This method must be override in case registerByMethod is so and returns true');
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public getSavedEntitiesFromUpdate(parentUpdate: PU): T[] {
		if (this.registerByMethod()) {
			throw new Error('This method must be override in case registerByMethod is so and returns true');
		}

		return [];
	}

	public setModified(entities: T | T[]): void {
		this.entityModification.setModified(entities);
	}

	public removeModified(entities: T | T[]): void {
		this.entityModification.removeModified(entities);
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

	public hasModifiedFor(parent: PT): boolean {
		return this.entityModification.hasModifiedFor(parent);
	}

	public clearModifications() {
		this.entityModification.clearModifications();
	}

	public setDeleted(entities: T | T[]): void {
		this.entityModification.setDeleted(entities);
	}

	public deselect(): void {
		this.entitySelection.deselect();
	}

	public getSelection(): T[] {
		return this.entitySelection.getSelection();
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
	 * selectionChanged$ for registration
	 */
	public get selectionChanged$(): Observable<T[]> {
		return this.entitySelection.selectionChanged$;
	}

	public load(identificationData: IIdentificationData): Promise<T[]> {
		if (this.leafRole.loadEnhanced !== undefined && this.onLoadSucceeded !== undefined && this.provideLoadPayload !== undefined) {
			const onSuccessFn = this.onLoadSucceeded;
			const onSuccess = (loaded: object) => onSuccessFn.call(this, loaded);
			return this.leafRole.loadEnhanced(this.provideLoadPayload(), onSuccess);
		} else if (this.leafRole.loadEnhanced !== undefined && this.onLoadSucceeded !== undefined) {
			const onSuccessFn = this.onLoadSucceeded;
			const onSuccess = (loaded: object) => onSuccessFn.call(this, loaded);
			return this.leafRole.loadEnhanced(identificationData, onSuccess);
		}

		return this.leafRole.load(identificationData);
	}

	public getList(): T[] {
		return this.entityTree.getList();
	}

	public loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		if (identificationData != null) {
			return this.load(identificationData).then(() => {
			});
		}

		return this.leafRole.loadSubEntities(identificationData);
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
			const selected = this.getSelectedEntity();
			if(selected !== null){
				const parent = this.parentOf(selected);
				if(parent !== null){
					return this.entityCreateChild.createEnhanced(this.getSelectedParent(), parent, onSuccess);
				}
			}
			return this.entityCreate.createEnhanced(this.getSelectedParent(), onSuccess);
		}

		const selected = this.getSelectedEntity();
		if(selected !== null){
			const parent = this.parentOf(selected);
			if(parent !== null){
				return this.entityCreateChild.create(this.getSelectedParent(), parent);
			}
		}

		return this.entityCreate.create(this.getSelectedParent());
	}

	public get listChanged$(): Observable<T[]> {
		return this.entityTree.listChanged$;
	}

	public setList(entities: T[]): void {
		this.entityTree.setList(entities);
	}

	public append(toAdd: T[] | T): void {
		this.entityTree.append(toAdd);
	}

	public get entitiesModified$(): Observable<T[]> {
		return this.entityModification.entitiesModified$;
	}

	public remove(entities: T[] | T): void {
		this.entityModification.setDeleted(entities);
	}

	/**
	 * called when response from server is received to merge entities back to the service instance state
	 * @param updated
	 * @protected
	 */
	public takeOverUpdated(updated: PU): void {
		this.leafRole.takeOverUpdated(updated);
	}

	/**
	 * Update entities in memory in order to keep in sync with changes done outside (app-server, ...)
	 * @param updated
	 */
	public updateEntities(updated: T[]): void {
		this.entityTree.updateEntities(updated);
	}

	public collectModificationsForParentUpdate(parentUpdate: PU, parent: PT): void {
		this.leafRole.collectModificationsForParentUpdate(parentUpdate, parent);
	}

	public assertComparer(): IEntityComparer<T> {
		return new SimpleEntityComparer<T>();
	}

	public isParentFn(parentKey: object, entity: T): boolean {

		throw new Error('The parent reference needs to be declared');
	}

	public appendTo(toAdd: T[] | T, parent: T | null): void {
		this.entityTree.appendTo(toAdd, parent);
	}

	public childrenOf(element: T): T[] {
		return [];
	}

	public parentOf(element: T): T | null {
		return null;
	}

	public onTreeParentChanged(entity: T, newParent: T | null): void{
	}

	public rootEntities(): T[] {
		return this.entityTree.rootEntities();
	}

	public canCreateChild(): boolean {
		return this.entityCreateChild.canCreate();
	}

	protected override checkCreateIsAllowed(entities: T[] | T | null): boolean {
		return this.getSelectedParent() !== undefined;
	}

	public createChild(): Promise<T> {
		if (this.onCreateSucceeded !== undefined && this.provideCreateChildPayload !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreateChild.createEnhanced(this.provideCreateChildPayload(), this.getSelectedEntity() ?? undefined, onSuccess);
		}

		const selected = this.entitySelection.getSelection();
		let parentInTree: T | undefined = undefined;
		if (selected.length > 0) {
			parentInTree = selected[0];
		}
		const parentInRole = this.getSelectedParent();

		if (this.onCreateSucceeded !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreateChild.createEnhanced(this.entityCreateChild.providePayload(this.getSelectedParent(), parentInTree), parentInTree, onSuccess);
		}

		return this.entityCreateChild.create(parentInRole, parentInTree);
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

	public indent(): void{
		this.entityTreeOperations.indent();
	}

	public canIndent(): boolean {
		return this.entityTreeOperations.canIndent();
	}

	public outdent(): void{
		this.entityTreeOperations.outdent();
	}

	public canOutdent(): boolean {
		return this.entityTreeOperations.canOutdent();
	}

	/**
	 * Observable for entitiesUpdated$ event
	 * @return Observable indicating that entities have been updated e.g. after after update call
	 */
	public get entitiesUpdated$(): Observable<T[]> {
		return this.entityModification.entitiesUpdated$;
	}
}