
import {Component, DestroyRef, inject} from '@angular/core';
import {ColumnDef, FieldType, IFieldValueChangeInfo, IGridConfiguration} from '@libs/ui/common';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {
	CollectionHelper,
	ITranslatable,
	PlatformConfigurationService, PropertyType,
	ServiceLocator
} from '@libs/platform/common';
import {PrcStructureLookupEntity} from '@libs/basics/shared';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {TreeInfo} from '../../model/types/TreeInfo';
import {BusinesspartnerPrcStructureDataService} from '../../services/businesspartner-prcstructure-data.service';
import {ProcurementStructureTreeHelper} from '../../model/helper/procurement-structure-tree-helper';
import * as _ from 'lodash';

@Component({
	selector: 'businesspartner-main-procurement-structure-selection-dialog',
	templateUrl: './procurement-structure-selection-dialog.component.html',
	styleUrls: ['./procurement-structure-selection-dialog.component.scss']
})
export class BusinesspartnerMainProcurementStructureSelectionDialogComponent {
	private filter: string = '';
	private columns: ColumnDef<PrcStructureLookupEntity>[];
	private destroyRef: DestroyRef;
	private treeInfo: TreeInfo; // { parentProp: string, childProp: string, countProp: string };
	private targetTree: PrcStructureLookupEntity[] = [];
	private dialogCaches: PrcStructureLookupEntity[] = []; // data cache selected
	private dataService: BusinesspartnerPrcStructureDataService;
	private cacheData: PrcStructureLookupEntity[] = []; // current page data
	private cacheCount: number = 0;

	public title: ITranslatable;
	public loading: boolean = false;
	public readonly dialogRef = inject(MatDialogRef<BusinesspartnerMainProcurementStructureSelectionDialogComponent>);
	public configuration!: IGridConfiguration<PrcStructureLookupEntity>;
	public buttons: {id: string, fn: (event: Event) => void, isDisabled: () => boolean, tooltip: string, caption: string}[];
	public htmlTranslate = {
		structureSelectCount: {
			key: 'basics.procurementstructure.structureSelectCount',
			params: {
				count: this.cacheCount
			}
		}
	};

	public constructor() {
		this.dataService = ServiceLocator.injector.get(BusinesspartnerPrcStructureDataService);
		this.title = {
			text: 'Select Procurement Structure',
			key: 'cloud.common.dialogTitleProcurementStructure'
		};
		this.columns = [
			{ id: 'IsSelected', model: 'IsSelected', type: FieldType.Boolean, label: { text: 'Selected' }, sortable: true, visible: true, change: this.onIsSelectedChanged },
			{ id: 'Code', model: 'Code', type: FieldType.Code, label: 'Code', sortable: true, visible: true, readonly: true, width: 120 },
			{ id: 'Description', model: 'Description', type: FieldType.Description, label: 'Description', sortable: true, visible: true, readonly: true, width: 300},
			{ id: 'Comment', model: 'Comment', type: FieldType.Comment, label: 'Comment', sortable: true, visible: true, readonly: true, width: 300}
		];
		this.destroyRef = ServiceLocator.injector.get(DestroyRef);
		this.buttons = [
			{
				id: 'apply',
				isDisabled: () => {
					return false;
				},
				tooltip: 'cloud.common.apply',
				caption: 'cloud.common.apply',
				fn: () => {
					this.apply();
				}
			},
			{
				id: 'ok',
				isDisabled: () => {
					return false;
				},
				tooltip: 'cloud.common.ok',
				caption: 'cloud.common.ok',
				fn: () => {
					this.dialogRef.close({isOk: true, data: []});
				}
			},
			{
				id: 'cancel',
				isDisabled: () => {
					return false;
				},
				tooltip: 'cloud.common.cancel',
				caption: 'cloud.common.cancel',
				fn: () => {
					this.cancel();
				}
			}
		];
		this.treeInfo = {
			parentProp: 'PrcStructureFk',
			childProp: 'ChildItems',
			countProp:'ChildCount'
		};
		this.targetTree = this.dataService.getPrcStructures();
		this.doSearch(this.targetTree, '');
		this.initializeGrid([]);
	}

	// todo chi: add toolbar buttons

	public cancel(): void {
		this.dialogRef.close({isOk: false, isCancel: true});
	}

	private apply() {
		// let  data=dataService.getResult();
		if (!Array.isArray(this.dialogCaches) || this.dialogCaches.length === 0) {
			return;
		}
		this.dialogCaches = this.setParentsToNull(this.dialogCaches);
		let selectItems = this.dialogCaches;
		this.dialogCaches = [];
		this.cacheCount = this.getCacheCount(this.dialogCaches);

		selectItems = this.dataService.getRebuildSelectItems(selectItems);
		this.dataService.createHttp(selectItems).then(response => {
			this.dataService.createResponeHandle(response);
			this.targetTree = [...this.dataService.getPrcStructures()];
			this.doSearch(this.targetTree, this.filter).then( () => {
				if (this.filter && this.filter !== '') {
					// todo chi: expand nodes
					// platformGridAPI.rows.expandAllNodes($scope.gridId);
				}
			});
		});
	}

	private changeIsSelected(dataProcessItems: PrcStructureLookupEntity[], dataCaches: PrcStructureLookupEntity[]) {
		for (const dataProcessItem of dataProcessItems) {
			for (const cacheItem of dataCaches) {
				if (dataProcessItem.Id === cacheItem.Id) {
					dataProcessItem.IsSelected = cacheItem.IsSelected;
				}
			}
			// Recursively handle children
			if (dataProcessItem.HasChildren) {
				const children = _.get(dataProcessItem, this.treeInfo.childProp ?? '') || [];
				this.changeIsSelected(children, dataCaches);
			}
		}
	}

	private check(item1: PrcStructureLookupEntity, item2: PrcStructureLookupEntity) {
		const childProp = this.treeInfo.childProp ?? '';
		const countProp = this.treeInfo.countProp ?? '';
		const item1Children: PrcStructureLookupEntity[] | null = _.get(item1, childProp, null);
		const item2Children: PrcStructureLookupEntity[] | null = _.get(item2, childProp, null);
		const item1Count: number = _.get(item1, countProp);

		return (!item1Children && !item2Children) ||
			(item1Children && item2Children && item1Count === this.countChildren(item2));
	}

	private countChildren(item: PrcStructureLookupEntity){
		const childProp = this.treeInfo.childProp ?? '';
		const children = _.get(item, childProp) || [];
		let count = children.length;
		children.forEach((child: PrcStructureLookupEntity) => {
			count += this.countChildren(child);
		});
		return count;
	}

	private doSearch(targetTree: PrcStructureLookupEntity[], filter: string, dataCaches?: PrcStructureLookupEntity[]): Promise<PrcStructureLookupEntity[]> {
		this.targetTree = targetTree;
		this.filter = filter;
		this.loading = true;
		const http = ServiceLocator.injector.get(HttpClient);
		const configService = ServiceLocator.injector.get(PlatformConfigurationService);
		return new Promise((resolve, reject) => {
			http.get<PrcStructureLookupEntity[]>(`${configService.webApiBaseUrl}basics/procurementstructure/search` + (filter ? ('?filter=' + filter) : ''))
				.pipe(
					takeUntilDestroyed(this.destroyRef)
				)
				.subscribe(
					{
						next: prcStructures => {
							ProcurementStructureTreeHelper.setChildCount(prcStructures, this.treeInfo,
								function (obj) {
									return !!obj;
								});

							const dataProcessItem = this.processItem(prcStructures, this.targetTree);
							if (dataCaches && dataCaches.length > 0) {
								this.changeIsSelected(dataProcessItem, dataCaches);
							}
							this.cacheData = dataProcessItem;
							this.setReadOnly(this.cacheData);
							this.initializeGrid(this.cacheData);
							this.loading = false;
							resolve(this.cacheData);
						},
						error: () => {
							this.loading = false;
							reject(new Error('Error while searching procurement structure data'));
						}
					});
		});
	}

	private getCacheCount(dataCaches: PrcStructureLookupEntity[]): number {
		let  count= 0;
		dataCaches.forEach(dataCache => {
			if (dataCache.IsSelected && dataCache.IsLive) {
				count += 1;
			}
		});

		return count;
	}

	private getParent(parentId: number, data?: PrcStructureLookupEntity[]): PrcStructureLookupEntity | null {
		const find = (list: PrcStructureLookupEntity[]): PrcStructureLookupEntity | null => {
			let parent: PrcStructureLookupEntity | null = null;
			const childProp = this.treeInfo.childProp ?? '';
			for (const item of list) {
				if (item.Id === parentId) {
					parent = item;
					break;
				} else {
					const children = _.get(item, childProp) || [];
					parent = find(children);
					if (parent) {
						break;
					}
				}
			}
			return parent;
		};

		return find(data || this.cacheData);
	}

	private initializeGrid(items: PrcStructureLookupEntity[]): void {
		this.configuration = {
			uuid: '881c6e8cdf3044c2b304ae7a181cbf4a',
			columns: this.columns,
			skipPermissionCheck: true,
			items: items,
			treeConfiguration: {
				parent: entity => {
					if (entity.PrcStructureFk) {
						return this.configuration.items?.find(item => item.Id === entity.PrcStructureFk) || null;
					}
					return null;
				},
				children: entity => {
					const list = CollectionHelper.Flatten(this.configuration.items || [], (item) => {
						return item.ChildItems || [];
					});
					return list.reduce((result: PrcStructureLookupEntity[], item) => {
						if (entity.Id === item.PrcStructureFk) {
							result.push(item);
						}
						return result;
					}, []) || [];
				}
			}
		};
	}

	private ok() {
		if (!Array.isArray(this.dialogCaches) || this.dialogCaches.length === 0) {
			this.dialogRef.close({isOk: true, data: []});
		}
		this.dialogCaches = this.setParentsToNull(this.dialogCaches);
		let selectItems = this.dialogCaches;
		this.dialogCaches=[];
		selectItems = this.dataService.getRebuildSelectItems(selectItems);
		this.dialogRef.close({isOk: true, data: selectItems});
	}

	private onIsSelectedChanged(changeInfo: IFieldValueChangeInfo<PrcStructureLookupEntity, PropertyType>): void {
		this.setChild(changeInfo.entity, changeInfo.newValue as unknown as boolean);
		this.setParent(changeInfo.entity);
		this.initializeGrid(this.cacheData);
		this.dialogCaches = this.updateNewCache(this.cacheData, this.dialogCaches);
		this.cacheCount = this.getCacheCount(this.dialogCaches);
	}

	private onRenderCompleted(): void {

		const items: PrcStructureLookupEntity[] = [];
		this.toList(this.cacheData, items, item => {
			return item.IsSelected === null;
		});
		// // todo chi: get grid instance
		// const grid = platformGridAPI.grids.element('id', $scope.gridId);
		// const cell = grid.instance.getColumnIndex('IsSelected');
		//
		// // setIndeterminate
		// items.forEach((item) => {
		// 	const row = grid.dataView.getRowById(item.Id);
		// 	const element = grid.instance.getCellNode(row, cell);
		// 	if ((row || row === 0) && element) {
		// 		element.find('input').attr('checked', false).prop('indeterminate', true);
		// 	}
		// });
	}

	private process(items: PrcStructureLookupEntity[]): PrcStructureLookupEntity[] {
		const childProp = this.treeInfo.childProp ?? '';
		items.forEach(item => {
			item.IsSelected = false;
			const children = _.get(item, childProp) || [];
			_.set(item, this.treeInfo.childProp ?? '', children);
			this.process(children);
		});
		return items;
	}

	private processItem(responseData: PrcStructureLookupEntity[], targetTree: PrcStructureLookupEntity[]): PrcStructureLookupEntity[] {
		const responseDataList: PrcStructureLookupEntity[] = [];
		this.toList(this.process(responseData), responseDataList);
		const targetTreeList: PrcStructureLookupEntity[] = [];
		this.toList(this.process(targetTree), targetTreeList);
		const childProp = this.treeInfo.childProp ?? '';
		const parentProp = this.treeInfo.parentProp ?? '';

		// remove nodes which can't be added.
		targetTreeList.forEach((source) => {
			const temp = _.find(responseDataList, {Id: source.Id});
			if (!temp) {
				return;
			}
			let response: PrcStructureLookupEntity = temp;
			if (response) {
				if (this.check(response, source)) {
					const parentId = _.get(response, parentProp);
					let parentNode = this.getParent(parentId, responseData);
					let children = parentNode ? _.get(parentNode, childProp) || [] : responseData;
					this.removeNode(children, response);
					// remove parents
					while(parentNode && !children.length) {
						response = parentNode;
						const parentId = _.get(parentNode, parentProp);
						parentNode = this.getParent(parentId, responseData);
						children = parentNode ? _.get(parentNode, childProp) || [] : responseData;
						this.removeNode(children, response);
					}
				} else {
					response.IsExistent = true;
					response.IsSelected = (!response.IsLive ? false : null);
				}
			}
		});

		return responseData;
	}

	private removeNode(list: PrcStructureLookupEntity[], node: PrcStructureLookupEntity): PrcStructureLookupEntity[] {
		for (let i = list.length - 1; i >= 0; i--) {
			if (list[i].Id === node.Id) {
				list.splice(i, 1);
			}
		}
		return list;
	}

	public search(filter: string, event: Event | null): void {
		if (event && ((event as KeyboardEvent).key === 'Enter' || (event instanceof MouseEvent))) {
			this.doSearch(this.targetTree, filter, this.dialogCaches);
		}
	}

	private setChild(entity: PrcStructureLookupEntity, isSelected: boolean): void {
		const children: PrcStructureLookupEntity[] = _.get(entity, this.treeInfo.childProp ?? '') || [];
		children.forEach(item => {
			item.IsSelected = isSelected;
			this.setChild(item, isSelected);
		});
	}

	private setParent(entity: PrcStructureLookupEntity): void {
		if (!entity) {
			return;
		}

		const parentId = _.get(entity, this.treeInfo.parentProp ?? '');
		const parent = this.getParent(parentId);

		if (parent) {
			if (!parent.IsLive || !parent.AllowAssignment) {
				const predicate = function (child: PrcStructureLookupEntity) {
					return child.IsSelected === false;
				};
				const children: PrcStructureLookupEntity[] = _.get(parent, this.treeInfo.childProp ?? '') || [];
				if (_.every(children, predicate)) {
					// if no children is selected, and it is not assignable.
					parent.IsSelected = false;
				}else{
					// has children selected, it will be assigned event it is not assignable originally.
					parent.IsSelected = null;
				}
			} else {
				parent.IsSelected = null;
			}
			this.setParent(parent);
		}
	}

	private setParentsToNull(dataCaches: PrcStructureLookupEntity[]): PrcStructureLookupEntity[] {
		const childProp = this.treeInfo.childProp ?? '';
		const itemResult = (entity: PrcStructureLookupEntity) => {
			const children: PrcStructureLookupEntity[] = _.get(entity, childProp) || [];
			if (Array.isArray(children)) {
				if (this.filter){
					entity.IsSelected = null;
				}
				children.forEach(itemResult);
			}
		};
		dataCaches.forEach(itemResult);
		return dataCaches;
	}

	private setReadOnly(responseData: PrcStructureLookupEntity[] | PrcStructureLookupEntity){
		if (responseData) {
			if (_.isArray(responseData) && responseData.length > 0 ) {
				_.forEach(responseData, (item) => {
					this.setReadOnly(item);
				});
			}
			if (_.isObject(responseData)) {
				const temp = responseData as unknown as PrcStructureLookupEntity;
				if(!temp.AllowAssignment){
					// TODO chi: readonly
					// platformRuntimeDataService.readonly(temp, [{field: 'IsSelected', readonly: true}]);
				}
				const children = _.get(responseData, this.treeInfo.childProp ?? '');
				if(children?.length){
					this.setReadOnly(children);
				}
			}
		}
	}

	private toList(items: PrcStructureLookupEntity[], children: PrcStructureLookupEntity[],
						   filter?: (item: PrcStructureLookupEntity) => boolean): void {

		items.forEach(item => {
			if (filter ? filter(item) : true) {
				children.push(item);
			}
			const list = item.ChildItems || [];
			this.toList(list, children, filter);
		});
	}

	private updateNewCache(nowPageDatas: PrcStructureLookupEntity[], dataCaches: PrcStructureLookupEntity[]): PrcStructureLookupEntity[] {
		for (const pageData of nowPageDatas) {
			if (dataCaches && dataCaches.length > 0) {
				dataCaches = dataCaches.filter((cache) => {
					return !(pageData.Id === cache.Id && pageData.IsSelected === false);
				});
			}

			const findData = dataCaches.find(e => e.Id === pageData.Id);
			if (!findData && pageData.IsSelected !== false) {
				dataCaches.push(pageData);
			}

			if (pageData.HasChildren) {
				const children: PrcStructureLookupEntity[] = _.get(pageData, this.treeInfo.childProp ?? '') || [];
				this.updateNewCache(children, dataCaches);
			}
		}
		return dataCaches;
	}
}