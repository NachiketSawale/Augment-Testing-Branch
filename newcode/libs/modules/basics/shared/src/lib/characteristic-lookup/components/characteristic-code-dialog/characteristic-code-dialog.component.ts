/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, inject, InjectionToken, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Orientation, PlatformConfigurationService ,ServiceLocator} from '@libs/platform/common';
import { Observable } from 'rxjs';
import {
	FieldType,
	getCustomDialogDataToken,
	IGridConfiguration, StandardDialogButtonId
} from '@libs/ui/common';
import {
	BasicsCharacteristicSearchEntityGridService
} from '../../services/basics-characteristic-search-entity-grid.service';
import { ICharacteristicEntity, ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { ICharacteristicCodeLookupOptions } from '../../model/characteristic-code-lookup-options.interface';
import { ICharacteristicCodeLookupViewResult } from '../../model/characteristic-code-lookup-view-result.interface';
import { BasicsCharacteristicSearchService } from '../../services/basics-characteristic-search.service';
import { ISplitGridSplitter } from '@libs/ui/business-base';
import {BasicsSharedCharacteristicPopupGroupService} from '../../services/basics-characteristic-group-popup.service';
import {BasicsSharedCharacteristicGroupHelperService} from '../../services/basics-characteristic-group-helper.service';

/// get lookup option
const CHARACTERISTIC_CODE_LOOKUP_OPTIONS_TOKEN = new InjectionToken('characteristic_code_lookup_options');
export function getCharacteristicCodeLookupOptionsToken(): InjectionToken<ICharacteristicCodeLookupOptions> {
	return CHARACTERISTIC_CODE_LOOKUP_OPTIONS_TOKEN;
}

@Component({
	selector: 'basics-shared-characteristic-code-dialog',
	templateUrl: './characteristic-code-dialog.component.html',
	styleUrls: ['./characteristic-code-dialog.component.scss'],
})
export class BasicsSharedCharacteristicCodeDialogComponent implements OnInit, AfterViewInit {

	private readonly dialogWrapper = inject(getCustomDialogDataToken<ICharacteristicCodeLookupViewResult<ICharacteristicEntity>, BasicsSharedCharacteristicCodeDialogComponent>());
	/// get lookup Options
	private lookupOptions = inject(getCharacteristicCodeLookupOptionsToken());

	public selectedGroupEntity?: ICharacteristicGroupEntity | null;
	/**
	 * Focused data item which will be applied
	 */
	public focusedItem?: ICharacteristicEntity;
	/**
	 * Focused data items which will be applied
	 */
	public focusedItems: ICharacteristicEntity[] = [];
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	public characteristicSearchService = inject(BasicsCharacteristicSearchService);
	public characteristicGroupHelperService = ServiceLocator.injector.get(BasicsSharedCharacteristicGroupHelperService);
	public groups: ICharacteristicGroupEntity[] = [];
	protected groupService = ServiceLocator.injector.get(BasicsSharedCharacteristicPopupGroupService);
	public characteristicItems: ICharacteristicEntity[] = [];
	public gridConfig: IGridConfiguration<ICharacteristicEntity> = {
		uuid: '015039777d6f4a1ca0bf9eec6e9d244e',
		columns: [],
		items: [],
		iconClass: null,
		skipPermissionCheck: false,
		enableColumnReorder: false,
		enableCopyPasteExcel: true
	};

	public parentGridConfig: IGridConfiguration<ICharacteristicGroupEntity> = {
		uuid: 'd2c2e05077b9449fb19c067bbe938ebe',
		items: [],
		enableCopyPasteExcel: true,
		columns: [
			{
				id: 'description',
				model: 'DescriptionInfo',
				type: FieldType.Translation,
				label: {
					text: 'Description',
					key: 'cloud.common.entityDescription'
				},
				sortable: true,
				visible: true,
				readonly: true,
			}
		],
		treeConfiguration: {
			parent: (entity: ICharacteristicGroupEntity) => {
				if (entity.CharacteristicGroupFk) {
					return this.parentGridConfig.items?.find((item) => item.Id === entity.CharacteristicGroupFk) || null;
				}
				return null;
			},
			children: (entity: ICharacteristicGroupEntity) => entity.Groups ?? [],
			width: 70,
		},
	};

	/**
	 * Is loading
	 */
	public isLoading = false;

	/**
	 * Splitter configuration
	 * @protected
	 */
	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [40, 60]
	};

	private readonly entityGridService = inject(BasicsCharacteristicSearchEntityGridService);

	public ngOnInit(): void {
		const columns = this.entityGridService.generateGridConfig();
		this.gridConfig = {
			...this.gridConfig,
			columns: columns
		};
	}

	public refresh(): void {
		const sectionId = this.lookupOptions.sectionId;
		let filteredList: ICharacteristicEntity[] = [];
		this.characteristicSearchService.getList(sectionId, true).subscribe(res => {
			this.getGroupList(sectionId).subscribe(groupRes => {
				const groups: ICharacteristicGroupEntity[] = [];
				this.characteristicGroupHelperService.flattenGroup(groupRes, groups);
				const newSelectedGroupEntity = this.selectedGroupEntity ? groups.find(e => e.Id == this.selectedGroupEntity?.Id) : null;
				if (newSelectedGroupEntity) {
					const data = res;
					let characteristicIds2Remove: number[] = [];
					if (this.lookupOptions.entityListFilter) {
						characteristicIds2Remove = this.lookupOptions.entityListFilter().map(e => e.Id);
					}
					const groupIds: number[] = [];
					this.characteristicGroupHelperService.collectGroupIds(newSelectedGroupEntity, groupIds);
					filteredList = data.filter(e => groupIds.indexOf(e.CharacteristicGroupFk) >= 0);
					filteredList = filteredList.filter(item => !item.IsReadonly && characteristicIds2Remove.indexOf(item.Id) === -1);
				}
				this.characteristicItems = filteredList;
				this.gridConfig = {...this.gridConfig, items: this.characteristicItems};
			});
		});
	}

	public ngAfterViewInit(): void {
		setTimeout(() => {
			this.init();
		});
	}

	public onParentChanged(selectedRows: ICharacteristicGroupEntity[]) {
		if (selectedRows && selectedRows.length > 0) {
			this.selectedGroupEntity = selectedRows[0];
			this.searchCharacteristicItems(selectedRows[0]);
		}
	}

	public init() {
		this.search();
	}

	/**
	 * Search group
	 */
	public search() {
		const sectionId = this.lookupOptions.sectionId;
		this.isLoading = true;
		this.getGroupList(sectionId).subscribe((res) => {
			this.isLoading = false;
			this.parentGridConfig = {
				...this.parentGridConfig,
				items: res,
			};
		});
	}

	public getGroupList(sectionId: number): Observable<ICharacteristicGroupEntity[]> {
		return this.groupService.getListBySectionId(sectionId);
	}

	public searchCharacteristicItems(entity?: ICharacteristicGroupEntity) {
		if (entity) {
			const groupIds: number[] = [];
			let filteredList: ICharacteristicEntity[] = [];
			this.characteristicSearchService.search(this.lookupOptions).subscribe(res => {
				this.characteristicGroupHelperService.collectGroupIds(entity, groupIds);
				filteredList = res.filter(e => groupIds.indexOf(e.CharacteristicGroupFk) >= 0);
				this.characteristicItems = filteredList;
				this.gridConfig = {...this.gridConfig, items: this.characteristicItems}; /// refresh list
			});
		}
	}

	/**
	 * Handle data selection changed
	 * @param selections
	 */
	public handleSelectionChanged(selections: ICharacteristicEntity[]) {
		this.focusedItems = selections;///todo create multiple records
		this.focusedItem = selections.length > 0 ? selections[0] : undefined;
	}

	/**
	 * Handle item is selected
	 */
	public apply(dataItem?: ICharacteristicEntity) {
		if (!dataItem) {
			dataItem = this.focusedItem;
		}
		if (!dataItem) {
			return;
		}
		this.select(dataItem);
	}

	protected select(dataItem: ICharacteristicEntity) {
		let itemsExceptFirst: ICharacteristicEntity[] = [];
		if (this.focusedItems.length > 0) {
			itemsExceptFirst = this.focusedItems;
			itemsExceptFirst.shift(); // the first item is handled by default
		}
		this.dialogWrapper.value = {
			apply: true,
			result: dataItem,
			selectionExceptFirst: itemsExceptFirst,
			selectionExceptFirstHandle: this.lookupOptions.selectionExceptFirstHandle
		};
		this.dialogWrapper.close(StandardDialogButtonId.Ok);
	}
}


