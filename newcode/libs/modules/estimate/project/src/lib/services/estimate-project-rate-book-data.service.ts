/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectComplete, IRateBookEntity, IRateBookRequestData } from '@libs/project/interfaces';
import { ProjectEntity, ProjectMainDataService } from '@libs/project/shared';
import { isNull } from 'lodash';
import { EstimateProjectRateBookConfigDataService } from '@libs/estimate/shared';

// TODO: will be done in the future
@Injectable({
	providedIn: 'root',
})
export class EstimateProjectRateBookDataService extends DataServiceHierarchicalLeaf<IRateBookEntity, ProjectEntity, IProjectComplete> {
	private thisContentTypeId: null | number = null;
	private allChildItems: IRateBookEntity[] = [];

	protected readonly estimateProjectRateBookConfigDataService = inject(EstimateProjectRateBookConfigDataService);

	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IRateBookEntity> = {
			apiUrl: 'project/main/ratebook',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IRateBookEntity, ProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'RateBook',
				parent: projectMainDataService
			}
		};
		super(options);

		this.processor.addProcessor([
			{
				process: (item) => {
					this.processItem(item);
				},
				revertProcess() {}
			}
		]);
	}

	public override childrenOf(element: IRateBookEntity): IRateBookEntity[] {
		return element.RateBookChildren ?? [];
	}
	public override parentOf(element: IRateBookEntity): IRateBookEntity | null {
		if (element.RateBookParentFk == null) {
			return null;
		}

		const parentId = element.RateBookParentFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * Replace initReadData methods
	 * @protected
	 */
	protected override provideLoadPayload(): IRateBookRequestData {
		const readData: IRateBookRequestData = {};
		if (!isNull(this.thisContentTypeId)) {
			readData.IsInProject = this.estimateProjectRateBookConfigDataService.isInProject();
			readData.PKey3 = this.thisContentTypeId;
		} else {
			const contentTypeId = this.estimateProjectRateBookConfigDataService.getCustomizeContentTypeId();
			readData.IsInProject = this.estimateProjectRateBookConfigDataService.isInProject();
			if (!isNull(contentTypeId)) {
				readData.PKey3 = contentTypeId;
			} else {
				const contentId = this.estimateProjectRateBookConfigDataService.getCustomizeContentId();
				if (contentId) {
					readData.PKey2 = contentId;
				} else {
					const sel = this.getSelectedParent();
					if (sel) {
						readData.PKey1 = sel.Id;
					}
				}
			}
		}
		return readData;
	}

	private processItem(item: IRateBookEntity): void {
		this.setEntityReadOnlyFields(item, [{ field: 'Code', readOnly: true }]);
		this.setEntityReadOnlyFields(item, [{ field: 'DescriptionInfo', readOnly: true }]);
		this.setEntityReadOnlyFields(item, [{ field: 'IsChecked', readOnly: item.IsReadOnly }]);
	}

	public setThisContentTypeId(contentTypeId: null | number) {
		this.thisContentTypeId = contentTypeId;
	}

	private getAllChildItems(groupItem?: IRateBookEntity[] | null) {
		if (Array.isArray(groupItem)) {
			this.allChildItems = this.allChildItems.concat(groupItem);

			groupItem.forEach((item) => {
				this.getAllChildItems(item.RateBookChildren ?? []);
			});
		}
	}

	public onItemCheckedChange(selectItem: IRateBookEntity, newValue: boolean) {
		this.allChildItems = [];
		selectItem.IsChecked = newValue;
		this.setModified(selectItem);
		this.getAllChildItems(selectItem.RateBookChildren);
		// if the parent checked,the all child should be changed
		this.allChildItems.forEach((item) => {
			item.IsChecked = newValue;
			this.setModified(item);
		});
		this.fixIsChecked(this.getList());
		// TODO: gridRefresh
		// service.gridRefresh();
	}

	public onLoaded() {
		this.fixIsChecked(this.getList());
		// TODO:
		//service.gridRefresh();
	}

	public fixIsChecked(items: IRateBookEntity[]): IRateBookEntity[] {
		this.allChildItems.forEach((item) => {
			this.doItemCheck(item);
		});
		return items;
	}

	// TODO:
	// service.isCheckedValueChange = function (selectItem, newValue) {
	// 	service.onItemCheckedChange(selectItem, newValue, true);
	// 	return {apply: false, valid: true, error: ''};
	// };
	//
	// public setActivated = function (isReadOnly) {
	// 	let list = this.getList();
	// 	_.each(list, function (item) {
	// 		item.IsReadOnly = isReadOnly;
	// 		item.PrjContentFk = -1;
	// 		if(item.IsChecked){
	// 			service.markItemAsModified(item);
	// 		}
	// 		processItem(item);
	// 		if(item.RateBookChildren){
	// 			setChildrenActivated(item.RateBookChildren, isReadOnly);
	// 		}
	// 	});
	// 	service.gridRefresh();
	// }
	//
	// function setChildrenActivated(list, isReadOnly) {
	// 	_.each(list, function (item) {
	// 		item.IsReadOnly = isReadOnly;
	// 		item.PrjContentFk = -1;
	// 		if(item.IsChecked){
	// 			service.markItemAsModified(item);
	// 		}
	// 		processItem(item);
	// 		if(item.RateBookChildren){
	// 			setChildrenActivated(item.RateBookChildren, isReadOnly);
	// 		}
	// 	});
	// }

	private doItemCheck(item: IRateBookEntity): boolean | string | null | undefined {
		if (item.RateBookChildren && item.RateBookChildren.length) {
			const checkedItems = [],
				unCheckedItems = [];
			item.RateBookChildren.forEach((item) => {
				const isChecked = this.doItemCheck(item);
				if (isChecked === true) {
					checkedItems.push(item);
				} else if (isChecked !== 'unknown') {
					unCheckedItems.push(item);
				}
			});

			if (checkedItems.length === item.RateBookChildren.length) {
				item.IsChecked = true;
				// service.markItemAsModified(item);
			} else if (unCheckedItems.length === item.RateBookChildren.length) {
				item.IsChecked = false;
			} else {
				item.IsChecked = this.isFirstLevel(item) ? 'unknown' : true;
				// service.markItemAsModified(item);
			}
		}
		return item.IsChecked;
	}

	public isFirstLevel(item: IRateBookEntity): boolean {
		return item.Id === 1 || item.Id === 2 || item.Id === 3 || item.Id === 4 || item.Id === 5;
	}

	public clearData() {
		this.setList([]);
		// TODO:
		// service.gridRefresh();
	}
}
