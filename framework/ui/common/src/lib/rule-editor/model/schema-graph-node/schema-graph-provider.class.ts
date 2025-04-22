/*
 * Copyright(c) RIB Software GmbH
 */

import { SchemaGraphNode } from './schema-graph-node.class';
import { BehaviorSubject, forkJoin, mergeMap, Observable, of, Subject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import { DdDataState } from './dd-data-state.class';
import { IEntityInfo } from '../representation/entity-info.interface';
import { map } from 'rxjs/operators';
import { IEntityFieldCategory } from '../representation/entity-field-category.interface';
import { IEntityField } from '../representation/entity-field.interface';
import { isEmpty, cloneDeep } from 'lodash';
import { ILabelPath } from '../representation/label-path.interface';
import { inject } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';

/***
 * SchemaGraphProvider
 * Responsible for providing SchemaGraphNode using DdDataState
 */
export class SchemaGraphProvider {

	/**
	 * dataChange behavior subject
	 */
	public dataChange = new BehaviorSubject<SchemaGraphNode[]>([]);
	private translate = inject(PlatformTranslateService);

	/***
	 * initializes the provider
	 * @param state
	 */
	public initialize(state: DdDataState) {
		console.log('Initializing SchemaGraphProvider');
		this.dataState = state;
		if (this.dataState.rootEntity) {
			console.log('Root entity found', this.dataState.rootEntity);
			return this.storeRootNode(this.createRootNode(this.dataState.rootEntity));
		}
		return of(undefined);
	}

	private createRootNode(rootEntity: IEntityInfo) {
		const rootNode = new SchemaGraphNode('', '', rootEntity.Id, rootEntity.DisplayName);
		rootNode.isRootItem = true;
		rootNode.mightHaveChildren = true;
		rootNode.fieldData = rootEntity;
		return rootNode;
	}

	/**
	 * gets a clone of root node
	 */
	public getRootNodeClone() {
		if (!this.loadedTree) {
			return null;
		}
		return cloneDeep(this.loadedTree);
	}

	/**
	 * addChildrenDynamically
	 * @param node
	 */
	public addChildrenDynamically(node: SchemaGraphNode) {
		if (!node.children || node.children.length === 0) {
			this.getChildrenOfNode(node).subscribe(newChildren => {
				newChildren.sort(this.compareSchemaGraphNodes);
				node.children = newChildren;
				if (node.nodeInfo) {
					node.nodeInfo.children = newChildren.length > 0;
					node.nodeInfo.collapsed = true;
					if(node.name == 'Characteristics') {
						console.log(node);
					}
					node.children.forEach(child => {
						if (!child.nodeInfo) {
							child.nodeInfo = {
								level: 0,
								children: false,
								collapsed: true
							};
						}
						if (node.nodeInfo?.level) {
							child.nodeInfo.level = node.nodeInfo.level + 1;
						}
					});
				}
				this.appendParentToNodes(node);
				this.fireDataLoaded();


			});
		}
	}

	/**
	 * Gets the children of the given node. If children is not loaded yet, node data is loaded, SchemaGraphNodes of the children are created and returned
	 * @param node
	 * @private
	 */
	public getChildrenOfNode(node: SchemaGraphNode): Observable<SchemaGraphNode[]> {
		if (node.children && node.children.length > 0) {
			return of(node.children);
		}

		return this.getEntityData(node).pipe(
			map((entityData?: IEntityInfo | undefined) => {
				if (entityData) {
					const typedEntityData = entityData as IEntityInfo;
					const categoryNodes = this.getCategoryNodes(typedEntityData, node);
					const regularNodes = this.getRegularNodes(typedEntityData, node);
					// todo const selectorNodes = ...

					return [...categoryNodes, ...regularNodes];
				}
				return [];
			})
		);

	}

	private getRegularNodes(entityData: IEntityInfo, parent: SchemaGraphNode) {
		const regularFields = entityData.Fields.filter(field => !field.CategoryId);
		return this.createChildrenNodes(regularFields, parent);
	}

	private getCategoryNodes(entityData: IEntityInfo, parent: SchemaGraphNode) {
		const categoryNodes: SchemaGraphNode[] = [];
		entityData.Categories.forEach(category => {
			const fieldsInCategoryGroup = entityData.Fields.filter(field => field.CategoryId?.includes(category.Id));
			if (fieldsInCategoryGroup.length > 0) {
				const categoryGroupNode = this.createCategoryGroupNode(category, parent);
				categoryGroupNode.children = this.createChildrenNodes(fieldsInCategoryGroup, categoryGroupNode);
				categoryNodes.push(categoryGroupNode);
			}
		});

		return categoryNodes;
	}

	private createChildrenNodes(childrenFields: IEntityField[], parent: SchemaGraphNode): SchemaGraphNode[] {
		const logicalParentNode = parent.logicalParentNode || parent;

		return childrenFields.map(field => {
			const isParameterized = field.Parameters !== undefined && field.Parameters.length > 0;
			return this.createCategoryNode(field, logicalParentNode, parent, isParameterized);
		});
	}

	private createCategoryGroupNode(category: IEntityFieldCategory, parent: SchemaGraphNode) {
		console.log('Creating category group node: ', category.Name);
		const nodeId = ((parent.id.toString().length > 0) ? parent.id + '.' : '') + category.Id;
		const categoryGroupNode = new SchemaGraphNode(nodeId, category.Id, null, category.Name, parent);
		categoryGroupNode.mightHaveChildren = false;
		categoryGroupNode.onlyStructural = true;
		categoryGroupNode.isVirtual = true;
		//categoryGroupNode.removeTreeExpand(parent.nodeInfo?.level);
		return categoryGroupNode;
	}

	private createCategoryNode(field: IEntityField, logicalParentNode: SchemaGraphNode, parentNode: SchemaGraphNode, isParametrized: boolean) {
		const nodeId = (logicalParentNode.id.toString().length > 0 ? logicalParentNode.id + '.' : '') + field.DdPath;
		const categoryNode = new SchemaGraphNode(nodeId, isParametrized ? '' : field.UiTypeId, isParametrized ? null : (field.TargetId || null), field.Name, parentNode, field.UiTypeId === 'lookup', field.IsForeignKey);
		categoryNode.isNullable = !!field.IsNullable;
		categoryNode.mightHaveChildren = field.TargetId && (!field.TargetKind || field.TargetKind === '') || isParametrized;
		categoryNode.onlyStructural = this.determineOnlyStructural(isParametrized, field);
		categoryNode.targetKind = field.TargetKind;
		categoryNode.isVirtual = isParametrized;
		categoryNode.isFilteredAttribute = !!field.IsFilterAttribute;
		categoryNode.fieldData = field;

		if (isParametrized) {
			if (!this.dataState?.contextProvider) {
				throw new Error('Parametrized fields are not supported without a context provider.');
			}

			categoryNode.children = [];
			// todo categoryNode.selector = ... line 278 basics-common-dd-schema-graph-service

			this.dataState.contextProvider.initializeAliasExpressions(this, categoryNode, field);
		}

		return categoryNode;
	}

	private determineOnlyStructural(isParametrized: boolean, field: IEntityField) {
		if (isParametrized) {
			return true;
		}

		if (field.TargetId) {
			if (this.dataState?.targetId) {
				return (field.TargetId !== this.dataState?.targetId) || !((isEmpty(this.dataState?.targetKind) === isEmpty(field.TargetKind)) || (field.TargetKind === this.dataState?.targetKind));
			} else {
				return !!this.dataState?.uiTypeId;
			}
		}
		return false;
	}

	private getEntityData(node: SchemaGraphNode): Observable<IEntityInfo | undefined> {

		if (node.targetId) {
			const entityData = this.dataState?.entitiesById[node.targetId];
			if (!entityData) {
				return this.dataState?.loadEntityData(node.targetId) || of(undefined);
			}
			return of(entityData);
		}

		return of(undefined);


	}

	private storeRootNode(rootItem: SchemaGraphNode) {
		console.log('Storing root node');
		this.loadedTree = rootItem;
		rootItem.image = 'control-icons ico-criterion-focus';
		return this.getChildrenOfNode(rootItem).pipe(
			map(children => {
				console.log('children of root item', children);
				children.sort(this.compareSchemaGraphNodes);
				rootItem.children = children;
				rootItem.isExpanded = true;
				this.appendParentToNodes(rootItem);


				const observables = rootItem.children.filter(child => child.mightHaveChildren).map(child => {
					console.log('------------------------------------------------------------');
					console.log('Getting grandchildren of ', child);
					return this.getChildrenOfNode(child).pipe(
						mergeMap((grandchildren) => {
							grandchildren.sort(this.compareSchemaGraphNodes);
							child.children = grandchildren;
							this.appendParentToNodes(child);
							return grandchildren;
						})
					);
				});

				forkJoin(observables).subscribe(response => {
					console.log('Grandchildren storing done', response);
					console.log('Loaded tree', rootItem);
					this.fireDataLoaded();
				});
			})
		);

	}

	/***
	 * gets the loaded tree or null
	 */
	public getLoadedTree() {
		return this.loadedTree ? [this.loadedTree] : null;
	}

	/***
	 * finds the node in the tree with id
	 * @param id
	 * @param tree
	 */
	public findLoadedNode(id: string | number, tree?: SchemaGraphNode) {
		if (tree || this.loadedTree) {
			return this.findInSubtree(id, tree || this.loadedTree);
		}

		return null;
	}

	/***
	 * handler subscription for data loaded
	 * @param handler
	 */
	public registerDataLoaded(handler: () => void) {
		const subscription = this.onDataLoaded.subscribe(handler);
		this.subscriptions.set(handler, subscription);
	}

	/***
	 * handler remove subscription for data loaded
	 * @param handler
	 */
	public unregisterDataLoaded(handler: () => void) {
		const subscription = this.subscriptions.get(handler);
		if (subscription) {
			subscription.unsubscribe();
			this.subscriptions.delete(handler);
		}
	}

	/***
	 * todo
	 * @param id
	 */
	public prepareNodeDataForId(id: string | number) {

	}

	/***
	 * todo
	 * @param startAtNode
	 * @param expandPaths
	 * @param customDepth
	 */
	public loadMissing(startAtNode: SchemaGraphNode, expandPaths: string[], customDepth: number) {

	}

	/***
	 * todo
	 * @param path
	 */
	public expandPath(path: string) {

	}

	/***
	 * todo
	 */
	public isPartOfPath() {

	}

	/***
	 * todo
	 */
	public findFields() {

	}

	/***
	 * todo
	 * @param items
	 */
	public storeSearchResults(items: unknown[]) {

	}

	/***
	 * todo
	 */
	public getLatestSearchResults() {

	}

	/***
	 * todo
	 */
	public getDisplayNameForItem() {

	}

	/***
	 * todo
	 */
	public formatDisplayName(labelList: ILabelPath) {
		return {
			long: this.formatDdPath(labelList),
			short: this.formatDdPathShort(labelList)
		};
	}

	private formatDdPath(labelList: ILabelPath) {
		return 'not implemented'; // todo
		//return labelList.PathLabels.join(this.translate.instant('basics.common.fieldSelector.levelSeparator'));
	}

	private formatDdPathShort(labelList: ILabelPath) {
		return 'not implemented'; // todo
	}

	/***
	 * todo
	 */
	public canSelectItem() {

	}

	/***
	 * todo
	 */
	public fieldTypesMatch() {

	}

	/***
	 * todo
	 */
	public isNodeBookmarked() {

	}

	/***
	 * todo
	 */
	public supportsBookmarks() {

	}

	/***
	 * todo
	 */
	public modifySubEntities() {

	}

	/***
	 * todo
	 */
	public supportsSubEntities() {

	}

	/***
	 * todo
	 */
	public modifyAliasExpressions() {

	}


	private onDataLoaded = new Subject();
	private subscriptions: WeakMap<() => void, Subscription> = new WeakMap<() => void, Subscription>();
	private loadedTree?: SchemaGraphNode | null;
	private dataState?: DdDataState;

	private fireDataLoaded() {
		this.onDataLoaded.next(null);
		this.dataChange.next(this.loadedTree ? [this.loadedTree] : []);
	}

	private findInSubtree(id: number | string, rootNode: SchemaGraphNode | null | undefined) {
		if (rootNode?.id === id) {
			return rootNode;
		}
		const resultItem = this.findObject(id, rootNode?.children ?? []);
		if (resultItem) {
			return resultItem;
		}
		return null;
	}

	private findObject(id: number | string, node: SchemaGraphNode[]): SchemaGraphNode | undefined {
		let result: SchemaGraphNode | undefined;

		for (let i = 0; i < node.length; i++) {
			if (node[i].id === id) {
				result = node[i];
				break;
			}
			if (node[i].children) {
				result = this.findObject(id, node[i].children ?? []);
				if (result) {
					break;
				}
			}
		}
		return result;
	}

	private appendParentToNodes(tree: SchemaGraphNode) {
		const parent = tree.id;
		tree.children?.forEach(function (child) {
			child.parent = parent;
		});

		return tree;
	}

	private compareSchemaGraphNodes(a: SchemaGraphNode, b: SchemaGraphNode): number {
		if (!a) {
			if (!b) {
				return 0;
			} else {
				return -1;
			}
		} else if (!b) {
			return 1;
		}

		let result;
		if (a.sorting) {
			if (b.sorting) {
				result = a.sorting - b.sorting;
				if (result !== 0) {
					return result;
				}
			} else {
				return -1;
			}
		} else if (b.sorting) {
			return 1;
		}

		return (a.name ?? '').toLowerCase().localeCompare((b.name ?? '').toLowerCase());
	}

}