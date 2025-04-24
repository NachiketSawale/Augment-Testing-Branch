/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityInfo } from '../representation/entity-info.interface';
import { SchemaGraphNode } from './schema-graph-node.class';
import { IEntityField } from '../representation/entity-field.interface';
import { IFieldRequestParam } from '../representation/field-request-param.interface';
import { IDdStateConfig } from '../representation/dd-state-config.interface';
import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlatformConfigurationService } from '@libs/platform/common';
import { DdPathBookmarkLoader } from './dd-path-bookmark-loader';
import { ContextProvider } from './context-provider.class';

/***
 * The data dictionary state. Responsible for loading the info required for rule editor from database
 */
export class DdDataState {
	/**
	 * Entities by id record
	 */
	public entitiesById: Record<number, IEntityInfo> = {};

	/**
	 * entity properties by id record
	 */
	public propsById: Record<string, IEntityField> = {};

	/**
	 * The root entity
	 */
	public rootEntity?: IEntityInfo;

	/**
	 * dynamicFieldSelectorsById
	 */
	public dynamicFieldSelectorsById: unknown;

	/**
	 * loadedTree
	 */
	public loadedTree?: SchemaGraphNode;

	// onDataLoaded: new PlatformMessenger(), // todo
	// onContentChanged: new PlatformMessenger(), // todo
	// onTreeChanged: new PlatformMessenger(), // todo
	// fireDataLoaded: function () { // todo
	// 	this.onDataLoaded.fire();
	// },

	/**
	 * Flag isInitialized
	 */
	public isInitialized: boolean = false;

	/**
	 * uiTypeId
	 */
	public uiTypeId: string = '';

	/**
	 * targetKind
	 */
	public targetKind?: string;

	/**
	 * targetId
	 */
	public targetId?: number;

	/**
	 * contextProvider
	 */
	public contextProvider?: ContextProvider;

	private targetTableName?: string;
	private focusTableName: string = '';
	private moduleName: string = '';
	private bookmarks: unknown;
	private http = inject(HttpClient);
	private configService = inject(PlatformConfigurationService);
	private readonly bookmarkLoader = new DdPathBookmarkLoader();
	private readonly treeRequestUrl = this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityfieldshierarchically';
	private readonly entityFieldsRequestUrl = this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityFields';
	private readonly entityIdRequestUrl = this.configService.webApiBaseUrl + 'basics/common/bulkexpr/schema/entityid';

	/**
	 * Initialize data state
	 * @param config
	 */
	public initialize(config: IDdStateConfig) : Observable<void> {
		const searchTranslationDialogActivated = false; // Todo: from global settings
		this.focusTableName = config.focusTableName;
		this.moduleName = config.moduleName;
		this.uiTypeId = config.uiTypeId ?? '';
		this.targetKind = config.targetKind;
		this.targetId = config.targetId;
		this.targetTableName = config.targetTableName;
		this.contextProvider = config.contextProvider;

		const tree$ : Observable<IEntityInfo[]> = this.getTreeRequest(this.focusTableName, this.moduleName);
		const targetId$: Observable<IEntityInfo|null> = this.getTargetIdRequest(this.targetTableName);
		const bookmark$ = this.moduleName ? this.bookmarkLoader.loadBookmarksByModule(this.moduleName) : this.bookmarkLoader.loadBookmarks(this.focusTableName); //this.getBookmarkRequest();

		return forkJoin([tree$, targetId$, bookmark$]).pipe(
			map(([tree, targetId, bookmark]) => {

				const typedTree : IEntityInfo[] = tree as IEntityInfo[];

				if(targetId){
					this.targetId = targetId.Id;
				}

				this.bookmarks = bookmark;

				if(tree.length > 0) {
					if (!searchTranslationDialogActivated) {
						tree.forEach(e => e.Fields = e.Fields.filter(f => f.IsFilterAttribute === undefined || f.IsFilterAttribute));
					}

					this.entitiesById = this.getEntitiesByIdRecord(typedTree);
					this.propsById = this.getPropertiesByIdRecord(typedTree);
					this.rootEntity = typedTree[0];
					console.log('DdDataState initialized', this.entitiesById, this.propsById);
				}
			})
		);

	}

	/**
	 * Load entity info
	 * @param targetTableId
	 */
	public loadEntityData(targetTableId: number) : Observable<IEntityInfo> {
		return this.getEntityDataRequest(targetTableId).pipe(
			map((entityData)=>{
				this.entitiesById[targetTableId] = entityData;
				return entityData;
			})
		);
	}

	private getTreeRequest(focusTableName: string, moduleName: string) {
		const treeRequestParams : IFieldRequestParam = {
			tableName: focusTableName,
			maxDepth: 1,
			moduleName: moduleName,
			alongPath:''
		};
		this.applyTypeRestrictionsToRequest(treeRequestParams);
		return this.http.get<IEntityInfo[]>(this.treeRequestUrl, { params: this.getHttpParams(treeRequestParams)});
	}

	private getEntityDataRequest(targetTableId: number) {
		const entityFieldsRequestParams : IFieldRequestParam = {
			tableId: targetTableId
		};
		return this.http.get<IEntityInfo>(this.entityFieldsRequestUrl, { params: this.getHttpParams(entityFieldsRequestParams) });
	}

	private getTargetIdRequest(targetTableName: string | undefined) {
		let observable: Observable<IEntityInfo|null> = of(null);
		if(targetTableName){
			const targetIdParams : IFieldRequestParam = {
				tableName: targetTableName
			};
			observable = this.http.get<IEntityInfo>(this.entityIdRequestUrl, {
				params: this.getHttpParams(targetIdParams)
			});
		}

		return observable;
	}

	private getHttpParams(requestParams: object){
		let  httpParams = new HttpParams();
		for(const [key, value] of Object.entries(requestParams)){
			if(value) {
				httpParams = httpParams.set(key, value);
			}
		}

		return httpParams;
	}

	private getEntitiesByIdRecord(entities: IEntityInfo[]) {
		const entitiesById : Record<number, IEntityInfo> = {};

		entities.forEach((entity: IEntityInfo) => {
			entity.Fields = entity.Fields.filter(f => !f.IsFilterAttribute || f.IsFilterAttribute);

			const referenceFields = entity.Fields.filter(field => field.UiTypeId === 'reference' || field.UiTypeId === 'lookup');
			entity.Fields = entity.Fields.filter(f =>
				f.UiTypeId === 'reference' && f.TargetId ||
				f.UiTypeId === 'lookup' ||
				referenceFields.filter(rF => rF.Name === f.Name).length === 0);

			entitiesById[entity.Id] = entity;
		});

		return entitiesById;
	}

	private getPropertiesByIdRecord(entities: IEntityInfo[]) {
		const propertiesById: Record<string, IEntityField> = {};
		entities.forEach(entity => {
			entity.Fields.forEach(field => {
				field.TableNameDb = entity.DisplayName;
				field.TableIdDb = entity.Id;
				propertiesById[field.DdPath] = field;
			});
		});
		return propertiesById;
	}



	private applyTypeRestrictionsToRequest(requestParams: IFieldRequestParam) {
		const els : Record<string, string> = {};
		if (this.uiTypeId) {
			els['t'] = this.uiTypeId;
		}
		if (this.targetId) {
			els['e'] = this.targetId.toString();
		} else if (this.targetTableName) {
			els['e'] = this.targetTableName;
		}
		if (this.targetKind && this.targetKind !== '') {
			els['k'] = this.targetKind;
		}

		const restrictionElements = Object.keys(els).map(key => key + ':' + els[key]);

		if (restrictionElements.length > 0) {
			requestParams.typeRestrictions = restrictionElements.join(';');
		}
	}
}