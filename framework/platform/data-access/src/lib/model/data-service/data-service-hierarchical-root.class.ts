/*
 * Copyright(c) RIB Software GmbH
 */

import { DataServiceBase } from './data-service-base.class';
import { IEntityTree } from './interface/entity-tree.interface';
import { EntityTree } from './integral-part/entity-tree.class';
import { Observable, Subject } from 'rxjs';
import { IEntitySelection } from './interface/entity-selection.interface';
import {
	ISearchPayload,
	ISearchResult,
	IFilterResult,
	IEntityIdentification,
	CompleteIdentification,
	IIdentificationData,
	INavigationBarControls, IMainEntityAccess, Translatable, PlatformSearchAccessService, ISidebarSearchSupport
} from '@libs/platform/common';
import { IRootRole } from './interface/root-role.interface';
import { IChildRoleBase } from './interface/child-role-base.interface';
import { RootRole } from './integral-part/root-role.class';
import { RootEntitySelection } from './integral-part/root-entity-selection.class';
import { IEntityDelete } from './interface/entity-delete.interface';
import { EntityDelete } from './integral-part/entity-delete.class';
import { IEntityCreate } from './interface/entity-create.interface';
import { EntityCreate } from './integral-part/entity-create.class';
import { IEntityModification } from './interface/entity-modification.interface';
import { IRootDataProvider } from '../data-provider/root-data-provider.interface';
import { HttpRootDataProvider } from '../data-provider/http-root-data-provider.class';
import { IEntityUpdateAccessor } from './interface/entity-update-accessor.interface';
import { IDataServiceOptions } from './interface/options/data-service-options.interface';
import { EntityModification } from './integral-part/entity-modification.class';
import { ParentRole } from './integral-part/parent-role.class';
import {IEntityComparer} from './interface/entity-comparer.interface';
import {IEntityCreateChild} from './interface/entity-create-child.interface';
import { EntityCreateChild } from './integral-part/entity-create-child.class';
import { SimpleEntityComparer } from './integral-part/simple-entity-comparer.class';
import { inject } from '@angular/core';
import { EntityDataTranslationService } from '../../services/entity-data-translation.service';
import { EntityTreeOperations } from './integral-part/entity-tree-operations.class';
import { IEntityTreeOperations } from './interface/entity-tree-operations.interface';
import { IEntityDataCreationContext } from './interface/entity-data-creation-context.interface';
import { IEntityDynamicCreateDialogService } from './interface/entity-dynamic-create-dialog-service.interface';
import { EntityDataConfiguration } from './integral-part/entity-data-configuration.class';
import { IEntityDataCreateConfiguration } from './interface/entity-data-configuration.interface';


/**
 * Base clas of all data service classes for non hierarchically entity classes being the main
 * entity in the business module. The service will be linked to sidebar, navigation bar, ...
 * @typeParam T - entity type handled by the data service
 * @typeParam U - complete entity for update of own entities and subordinated entities
 */
export class DataServiceHierarchicalRoot<T extends object,
	U extends CompleteIdentification<T>> extends DataServiceBase<T> implements
	IEntitySelection<T>,
	IRootRole<T, U>,
	IEntityTree<T>,
	IEntityDelete<T>,
	IEntityCreate<T>,
	IEntityCreateChild<T>,
	IEntityModification<T>,
	IEntityTreeOperations<T>,
	INavigationBarControls,
	IEntityUpdateAccessor<T, U>,
	ISidebarSearchSupport,
	IEntityDataCreateConfiguration<T> {
	private searchAccessService : PlatformSearchAccessService = inject(PlatformSearchAccessService);
	private readonly entitySelection: IEntitySelection<T>;
	private entityTree: IEntityTree<T>;
	private readonly rootRole: IRootRole<T, U>;
	private entityDelete: EntityDelete<T>;
	private entityCreate: EntityCreate<T>;
	private entityCreateChild: EntityCreateChild<T>;
	private readonly entityModification: EntityModification<T>;
	private entityTreeOperations: EntityTreeOperations<T>;
	private readonly rootProvider: IRootDataProvider<T, U>;
	public readonly mainEntityAccess: IMainEntityAccess;
	private dataTranslationService = inject(EntityDataTranslationService);
	private entityDataConfiguration: EntityDataConfiguration<T>;
	public entitiesModifiedInfo: Subject<void>;

	public constructor(options: IDataServiceOptions<T>) {
		super(options);
		this.entityTree = new EntityTree<T>(this.assertComparer, this.childrenOf, this.parentOf, this.converter);
		this.rootProvider = options.provider as IRootDataProvider<T, U> ?? new HttpRootDataProvider<T, U>(options);
		this.entityModification = new EntityModification<T>(options, this.assertComparer, this.isParentFn.bind(this));
		this.rootRole = new RootRole<T, U>(new ParentRole<T, U>(this.converter, this.entityModification, this.processor, true), this.rootProvider, this.processor, this.entityTree, this.entityModification, this, this.getModificationsFromUpdate.bind(this));
		this.entitySelection = new RootEntitySelection<T, U>(this.rootRole, this.entityTree, this.converter);
		this.entityDelete = new EntityDelete<T>(this.provideDeleteActionState(), this.entitySelection, this.entityTree, this.entityModification, null);
		this.entityCreate = new EntityCreate<T>(this.provideCreateActionState(), this.entitySelection, this.entityTree, this.entityModification, this.provider, options.createInfo, this.processor);
		this.entityCreateChild = new EntityCreateChild<T>(this.provideCreateChildActionState(), this.entitySelection, this.entityTree, this.entityModification, this.provider, options.createInfo, this.processor);
		this.entityTreeOperations = new EntityTreeOperations<T>(this.entityTree, this.entityModification, this.entitySelection, this.onTreeParentChanged);
		this.entityDataConfiguration = new EntityDataConfiguration<T>(this.provideCreateActionState(), this.entityCreate, this.isCreateByFixDialogSupported.bind(this), this.createByFixDialog.bind(this), this.onCreateSucceeded?.bind(this));
      this.entitiesModifiedInfo = this.rootRole.entitiesModifiedInfo;
		this.mainEntityAccess = {
			navBarCommands: this,
			sidebarSearchSupport: this,
			selectionInfo$: this.selectionInfo$,
			entitiesModifiedInfo$: this.entitiesModifiedInfo.asObservable()
		};
	}

	protected override provideGetChildrenCallback(): (parent: T) => T[] {
		return this.childrenOf;
	}

	// TODO: revise and populate with data
	private readonly selectionInfo$ = new Subject<Translatable>();

	/**
	 * Returns true, when at least one element is in the list
	 */
	public any(): boolean {
		return this.entityTree.any();
	}

	public flatList(): T[] {
		return this.entityTree.flatList();
	}

	public save(): Promise<void> {
		const selection = this.entitySelection.getSelection();
		if(selection.some(() => true)){
			return this.rootRole.update(selection[0]).then(()=> {});
		}
		return Promise.resolve();
	}

	public get itemName(): string {
		return this.options.roleInfo.itemName;
	}

	public getModificationsFromUpdate(complete: U): T[] {
		throw new Error('This function must be overwritten for taken over changes done by the update on server side');
	}

	public createUpdateEntity(modified: T | null): U {
		throw new Error('This function must be overwritten for creation of update objects');
	}

	public refreshSelected(): Promise<void> {
		const selected = this.entitySelection.getSelection();
		if(!selected.some(()=> true)){
			return Promise.resolve();
		}
		return this.rootRole.refreshOnlySelected(selected).then(() => {
		});
	}

	public refreshAll(): Promise<void> {
		return this.refreshAllLoaded().then((loaded) => {});
	}

	public goToPrevious(): Promise<void> {
		return this.entitySelection.selectPrevious().then(()=> {});
	}

	public goToNext(): Promise<void> {
		return this.entitySelection.selectNext().then(() => {
		});
	}
	public goToFirst():  Promise<void> {
		return this.entitySelection.selectFirst().then(()=> {});
	}

	public goToLast(): Promise<void> {
		return this.entitySelection.selectLast().then(()=> {});
	}

	public isRoot(): boolean {
		return true;
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

	public get entitiesModified$(): Observable<T[]> {
		return this.entityModification.entitiesModified$;
	}

	public hasModifiedFor(parentKey: IEntityIdentification): boolean {
		return this.entityModification.hasModifiedFor(parentKey);
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
		return this.entityTree.getList();
	}

	public getAllIds(): IIdentificationData[] {
		return this.entityTree.getAllIds();
	}

	public refresh(payload: ISearchPayload): Promise<ISearchResult<T>> {
		return this.rootRole.filter(payload).then(result => {
			this.processor.process(result.dtos);
			this.entityTree.setList(result.dtos);

			return result;
		});
	}

	public filter(payload: ISearchPayload): Promise<ISearchResult<T>> {
		if(this.rootRole.filterEnhanced !== undefined && this.onLoadByFilterSucceeded !== undefined && this.provideLoadByFilterPayload !== undefined) {
			const onSuccessFn = this.onLoadByFilterSucceeded;
			const onSuccess = (filtered: object) => onSuccessFn.call(this, filtered);
			return this.rootRole.filterEnhanced(this.provideLoadByFilterPayload(payload), onSuccess);
		} else if(this.rootRole.filterEnhanced !== undefined && this.onLoadByFilterSucceeded !== undefined) {
			const onSuccessFn = this.onLoadByFilterSucceeded;
			const onSuccess = (filtered: object) => onSuccessFn.call(this, filtered);
			return this.rootRole.filterEnhanced(payload, onSuccess);
		}

		return this.rootRole.filter(payload);
	}

	public update(oldSelection: T): Promise<T> {
		return this.rootRole.update(oldSelection);
	}

	public registerChildService(childService: IChildRoleBase<T, U>): void {
		this.rootRole.registerChildService(childService);
	}

	public loadChildEntities(selected: T): Promise<T | null> {
		return this.rootRole.loadChildEntities(selected);
	}

	public supportsDelete(): boolean {
		return this.entityDelete.supportsDelete();
	}

	public canDelete(): boolean {
		return this.entityDelete.canDelete();
	}

	public delete(entities: T[] | T): void {
		this.entityDelete.deleteRoot(entities, this.rootProvider);
	}

	public supportsCreate() {
		return this.entityCreate.supportsCreate();
	}
	public canCreate(): boolean {
		return this.entityCreate.canCreate();
	}

	public async create(): Promise<T> {
		if(this.onCreateSucceeded !== undefined && this.provideCreatePayload !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreate.createEnhanced(this.provideCreatePayload(), onSuccess);
		} else if(this.onCreateSucceeded !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			const selected = this.getSelectedEntity();
			if(selected !== null){
				const parent = this.parentOf(selected);
				if(parent !== null){
					return this.entityCreateChild.createEnhanced(undefined, parent, onSuccess);
				}
			}
			return this.entityCreate.createEnhanced(undefined, onSuccess);
		}

		const selected = this.getSelectedEntity();
		if(selected !== null){
			const parent = this.parentOf(selected);
			if(parent !== null){
				return this.entityCreateChild.create(undefined, parent);
			}
		}
		return this.entityCreate.create(undefined);
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

	public remove(entities: T[] | T): void {
		//todo root deletion
	}

	/**
	 * Collecting changes (modifications, deletions) of subordinated entities
	 * @param complete The own complete
	 * @param forEntity The parent entity for which the complete is created
	 */
	public collectChildModifications(complete: U, forEntity: T): void {
		this.rootRole.collectChildModifications(complete, forEntity);
	}

	public updateEntities(updated: T[]): void {
		// ToDo provide implementation
	}

	public childrenHaveModification(parent: T): boolean {
		return this.rootRole.childrenHaveModification(parent);
	}

	public clearChildrenModification(): void {
		this.rootRole.clearChildrenModification();
	}

	public refreshAllLoaded(): Promise<T[]> {
		if(this.supportsSidebarSearch()){
			const payload = this.searchAccessService.currentSearchPayload();

			return this.filter(payload).then(function(result) {
				return result.dtos;
			});
		}else{
			return this.rootProvider.load(null).then(data => {
				this.processor.process(data);
				this.entityTree.setList(data);

				return data;
			});
		}
	}

	public refreshSelectedEntities(payload: ISearchPayload): Promise<T[]>{
		const selectedEntities = this.getSelection();
		payload.pKeys = this.getEntityPrimaryKeys(selectedEntities);
		return this.rootRole.refreshSelectedEntities(payload);
	}

	public refreshOnlySelected(selected: T[]): Promise<T[]> {
		const payload = {
			executionHints: false,
			includeNonActiveItems: true,
			pageNumber: 1,
			pageSize: 999,
			pattern: '',
			pinningContext: [],
			projectContextId: null,
			useCurrentClient: false,
			filter: '',
			isReadingDueToRefresh: false,
			pKeys: this.getEntityPrimaryKeys(selected)

		} as ISearchPayload;
		return this.rootRole.refreshSelectedEntities(payload);
	}

	protected getEntityPrimaryKeys(entities: T[]): number[] {
		if(entities != undefined && entities.every(item => 'Id' in item && typeof item.Id === 'number')){

			return entities.map(item => {
				if('Id' in item && typeof item.Id === 'number'){
					return item.Id;
				}
				return -1;
			});
		} else{
			throw new Error('The objects passed to refreshOnlySelected() must have a numeric Id property');
		}
	}

	public takeOverUpdatedChildEntities(updated: U): void {
		this.rootRole.takeOverUpdatedChildEntities(updated);
	}

	public assertComparer(): IEntityComparer<T> {
		return new SimpleEntityComparer<T>();
	}

	public isParentFn(parentKey: object, entity: T): boolean {
		return true;
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

	public async createChild(): Promise<T> {
		if(this.onCreateSucceeded !== undefined && this.provideCreateChildPayload !== undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);

			return this.entityCreateChild.createEnhanced(this.provideCreateChildPayload(), this.getSelectedEntity() ?? undefined, onSuccess);
		}

		if(this.onCreateSucceeded !== undefined && parent != undefined) {
			const onSuccessFn = this.onCreateSucceeded;
			const onSuccess = (created: object) => onSuccessFn.call(this, created);
			return this.entityCreateChild.createEnhanced(undefined, this.getSelectedEntity() ?? undefined, onSuccess);
		}

		return this.entityCreateChild.create(undefined, this.getSelectedEntity() ?? undefined);
	}

	public entitiesUpdated(entities: T[] | T): void {
		this.entityModification.entitiesUpdated(entities);
	}

	public executeSidebarSearch(payload: ISearchPayload): Promise<IFilterResult> {
		return this.filter(payload).then(function(result) {
			return result.FilterResult;
		});
	}

	public supportsSidebarSearch(): boolean {
		return true;
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
	public updateAndExecute(exeFunc: () => void): Promise<void>{
		return this.save().then(exeFunc);
	}

	public supportsConfiguredCreate(): boolean {
		return this.entityDataConfiguration.supportsConfiguredCreate();
	}

	public createByConfiguration(context: IEntityDataCreationContext<T>, dialogService: IEntityDynamicCreateDialogService<T>): Promise<T | undefined> {
		return this.entityDataConfiguration.createByConfiguration(context, dialogService);
	}

	/**
	 * Observable for entitiesUpdated$ event
	 * @return Observable indicating that entities have been updated e.g. after after update call
	 */
	public get entitiesUpdated$(): Observable<T[]> {
		return this.entityModification.entitiesUpdated$;
	}
}