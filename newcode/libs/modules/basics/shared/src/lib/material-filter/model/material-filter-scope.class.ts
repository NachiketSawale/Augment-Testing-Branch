/*
 * Copyright(c) RIB Software GmbH
 */

import { find, findIndex, isNil, last, remove, toNumber } from 'lodash';
import { inject, InjectionToken } from '@angular/core';
import { BasicsSharedMaterialFilterResultColumnService, BasicsSharedMaterialFilterResultDisplayConfigService, BasicsSharedMaterialFilterService } from '../services';
import { IMaterialFilterInput, IMaterialFilterOptions, IMaterialFilterOutput, IMaterialFilterPreviewCustomConfig, IMaterialFilterResultDisplayConfig } from './interfaces';
import { BasicsSharedMaterialBlobService, BasicsSharedMaterialSearchService, IMaterialSearchEntity, MaterialSearchSort } from '../../material-search';
import { EntityFilterScope, IEntityFilterDefinition, IEntityFilterOutput, IEntityFilterProfileEntity, IEntityFilterResultPreviewInfo, IEntityFilterResultViewConfig } from '../../entity-filter';
import { BasicsSharedMaterialFilterTranslatePipe } from '../pipes';
import { MaterialFilterGridId, MaterialFilterSortByItems } from './constants';
import { BasicsSharedMaterialFilterPreviewHeaderComponent } from '../components';
import { ConcreteMenuItem, FieldValidationInfo, GridApiService, ICheckMenuItem, IMenuItemEventInfo, IMenuItemsList, ItemType } from '@libs/ui/common';
import { ValidationResult } from '@libs/platform/data-access';
import { PlatformPermissionService } from '@libs/platform/common';
import { firstValueFrom, forkJoin, Subject } from 'rxjs';
import { BasicsSharedSystemOptionLookupService } from '../../lookup-services/customize';
import { BasicsCustomizeSystemOption } from '@libs/basics/interfaces';
import { BasicsSharedMaterialCreateSimilarMaterialService } from '../../material-search/services/material-create-similar-material.service';

/**
 * The scope of material filter view.
 */
export class MaterialFilterScope extends EntityFilterScope<IMaterialSearchEntity> {
	private readonly columnService = inject(BasicsSharedMaterialFilterResultColumnService);
	private readonly platformPermissionService = inject(PlatformPermissionService);
	private readonly displayConfigService = inject(BasicsSharedMaterialFilterResultDisplayConfigService);
	private readonly materialSimilarService = inject(BasicsSharedMaterialCreateSimilarMaterialService);
	private readonly materialSearchService = inject(BasicsSharedMaterialSearchService);
	private readonly materialBlobService = inject(BasicsSharedMaterialBlobService);
	private readonly systemOptionLookup = inject(BasicsSharedSystemOptionLookupService);
	private readonly gridApiService = inject(GridApiService);
	private readonly createSimilarPermissionUuid = 'a663969f4d1d49b8804989c62665d28f';
	private readonly selectedField: keyof IMaterialSearchEntity = 'selected';
	private isFilterByHeaderStructure: boolean = false;
	private isShowImageInPreview: boolean = false;
	private initFilterOptionSubject = new Subject<void>();

	/**
	 * Material filter input object
	 */
	public override input: IMaterialFilterInput = this.getInitialInput();

	/**
	 * Material filter output object
	 */
	public override output: IMaterialFilterOutput = {
		...this.getInitialOutput(),
		MaterialsFound: 0,
		Materials: []
	};

	/**
	 * Material filter options
	 */
	public filterOptions: IMaterialFilterOptions = {};

	/**
	 * Filter service
	 */
	public filterService = inject(BasicsSharedMaterialFilterService);

	/**
	 * Filter pipe
	 * @private
	 */
	protected filterPipe = inject(BasicsSharedMaterialFilterTranslatePipe);

	/**
	 * Result view option
	 */
	public override resultViewOption: IEntityFilterResultViewConfig<IMaterialSearchEntity, IMaterialFilterPreviewCustomConfig> = {
		titleTr: 'basics.material.record.material',
		gridOption: {
			gridId: MaterialFilterGridId,
			gridColumns: []
		},
		previewOption: {
			formRows: this.columnService.getRows(),
			headerComponent: BasicsSharedMaterialFilterPreviewHeaderComponent,
			headerComponentToken: MATERIAL_FILTER_RESULT_PREVIEW_INFO,
			onPreviewItemChanged: this.onPreviewItemChanged.bind(this),
			previewCustomConfig: {isShowImageInPreview: false}
		},
		toolBarSettingItems: []
	};

	/**
	 * Page size option list
	 */
	public override pageSizeList = [50, 100, 200];

	/**
	 * Initialize the material filter
	 */
	public initFilter() {
	}

	/**
	 * Initialize the material by materialId
	 * @param materialId
	 */
	public async initData(materialId?: number) {
		if (!materialId) {
			return;
		}

		const data = await this.filterService.getInitialData(materialId);
		data.Materials.map((m) => {
			m.selected = true;
			this.actionSelectedOrNot(m);
		});
		this.output = {
			MaterialsFound: 0,
			Materials: data.Materials,
			EntitiesFound: 0,
			Entities: [],
		};
		this.processOutput(this.output);
	}

	/**
	 * Initialize filter options
	 * @param options
	 */
	public initFilterOptions(options?: IMaterialFilterOptions | null) {
		if (isNil(options)) {
			return;
		}

		this.filterOptions = {
			...this.filterOptions,
			...options,
		};

		this.initFilterOptionSubject.next();
	}

	protected processOutput(output: IMaterialFilterOutput): void {
		output.Entities = output.Materials;
		output.EntitiesFound = output.MaterialsFound;
		output.HasMoreEntities = output.HasMoreMaterials;
		this.setSelectedForOutputItems(output.Materials);
		this.output$.next(output);
	}

	private setSelectedForOutputItems(outputItems: IMaterialSearchEntity[]) {
		if (!this.selectedItems.length) {
			return;
		}

		this.selectedItems.forEach((selectedItem) => {
			const outputItem = find(outputItems, {Id: selectedItem.Id});
			if (outputItem) {
				outputItem.selected = true;
			}
		});
	}

	/**
	 * Load filter definitions from backend
	 */
	public override async loadFilterDefs() {
		this.filterDefs = await this.filterService.getFilterDefs();
	}

	protected override async postFilter(): Promise<IEntityFilterOutput<IMaterialSearchEntity>> {
		this.showLoading();
		const output = await this.filterService.executeFilter(this.input);
		this.hideLoading();

		return output;
	}

	/**
	 * Action for select item or unselect item
	 * @param item
	 */
	public actionSelectedOrNot(item: IMaterialSearchEntity) {
		if (!item.selected) {
			remove(this.selectedItems, {Id: item.Id});
		} else if (!find(this.selectedItems, {Id: item.Id})) {
			if (this.filterOptions?.isEnableMultiSelect) {
				this.selectedItems.push(item);
			} else {
				this.selectedItems.forEach((selectedItem) => {
					selectedItem.selected = false;
				});
				this.selectedItems = [item];
			}
		}

		this.selectedItem = last(this.selectedItems) ?? undefined;
	}

	private actionSelectAllOrNot(isSelectAll: boolean) {
		this.output.Entities.forEach((entity: IMaterialSearchEntity) => {
			entity.selected = isSelectAll;
		});

		this.selectedItems = isSelectAll ? this.output.Entities.map((e) => e) : [];
	}

	private clearSelectedItems() {
		this.selectedItems = [];
	}

	/**
	 * Load display items for a given filter definition.
	 * @param definition
	 * @param missingFactors
	 */
	public override loadDisplayItemsOfFilter(definition: IEntityFilterDefinition, missingFactors: unknown[]) {
		return this.filterService.loadDisplayItems(definition, missingFactors);
	}

	/**
	 * Get the definition label
	 * @param definition
	 */
	public override getFilterLabel(definition: IEntityFilterDefinition): string {
		return this.filterPipe.transform(definition);
	}

	public override loadSavedFilters(): Promise<IEntityFilterProfileEntity[]> {
		return this.filterService.loadSavedFilters();
	}

	protected override postProfile(profile: IEntityFilterProfileEntity): Promise<boolean> {
		return this.filterService.saveFilterProfile(profile);
	}

	/**
	 * Get initial input data
	 * @protected
	 */
	protected override getInitialInput(): IMaterialFilterInput {
		return {
			...super.getInitialInput(),
			...{
				OrderBy: MaterialSearchSort.PriceAscending,
			}
		};
	}

	/**
	 * Load result view required data
	 */
	public override async loadResultViewRequiredData(): Promise<void> {
		const requiredData = await firstValueFrom(forkJoin([
			// Load and initialize result display configuration
			this.displayConfigService.loadResultDisplayConfig(),

			// Load result material create similar permission
			this.platformPermissionService.loadPermissions(this.createSimilarPermissionUuid),

			// Load system option of isFilterByHeaderStructure
			this.getFilterByHeaderStructureSystemOption(),

			// Wait initialize filter options finish
			firstValueFrom(this.initFilterOptionSubject),

			// TODO https://rib-40.atlassian.net/browse/DEV-34604
			//cloudDesktopHotKeyService.registerHotkeyjson('basics.material/content/json/hotkey.json', moduleName)
		]));

		this.initResultViewData(requiredData[0], requiredData[2]);

		return Promise.resolve();
	}

	/**
	 * execute the material filter
	 */
	public override async executeFilter(): Promise<void> {
		this.clearSelectedItems();
		return super.executeFilter();
	}

	private initResultViewData(displayConfig: IMaterialFilterResultDisplayConfig | null, systemOptionFilterByHeaderStructure: boolean) {
		this.input.PageSize = displayConfig?.itemsPerPage ?? this.input.PageSize;
		this.input.OrderBy = displayConfig?.sortOption ?? this.input.OrderBy;
		this.isShowImageInPreview = displayConfig?.showImageInPreview ?? this.isShowImageInPreview;
		this.isFilterByHeaderStructure = systemOptionFilterByHeaderStructure ? true : (displayConfig?.isFilterByHeaderStructure ?? this.isFilterByHeaderStructure);
		this.resultViewOption.gridOption.gridTools = this.getResultViewGridTools();
		this.resultViewOption.gridOption.gridColumns = this.getColumns();
		this.resultViewOption.toolBarSettingItems = this.getResultViewToolsSettingItems(systemOptionFilterByHeaderStructure);
		this.resultViewOption.previewOption.previewCustomConfig!.isShowImageInPreview = this.isShowImageInPreview;
	}

	private async updateResultDisplayConfig(config: Partial<IMaterialFilterResultDisplayConfig>) {
		return this.displayConfigService.postMaterialSearchOption(config);
	}

	private async getFilterByHeaderStructureSystemOption(): Promise<boolean> {
		const systemOption = await firstValueFrom(this.systemOptionLookup.getItemByKey({id: BasicsCustomizeSystemOption.MaterialFilterByHeaderPrcStructure}));
		return (systemOption?.ParameterValue === '1' || systemOption?.ParameterValue.toLowerCase() === 'true');
	}

	private getColumns() {
		const columns = this.columnService.getColumns();
		const selectedColumn = find(columns, {id: this.selectedField})!;

		selectedColumn.headerChkbox = !!(this.filterOptions?.isEnableMultiSelect);
		selectedColumn.validator = this.selectedValidator.bind(this);

		return columns;
	}

	private selectedValidator(info: FieldValidationInfo<IMaterialSearchEntity>) {
		info.entity.selected = info.value as boolean;
		this.actionSelectedOrNot(info.entity);

		if (!this.filterOptions?.isEnableMultiSelect && info.value) {
			const updatedItems = [info.entity];
			this.output.Entities.forEach((i) => {
				if (i.Id !== info.entity.Id && i.selected) {
					i.selected = false;
					updatedItems.push(i);
				}
			});
			this.itemsUpdated$.next(updatedItems);
		}

		return new ValidationResult();
	}

	private getResultViewToolsSettingItems(systemOptionFilterByHeaderStructure: boolean): ConcreteMenuItem<void>[] {
		return [{
			id: 'showImageInPreview',
			type: ItemType.Check,
			caption: {key: 'basics.material.lookup.showImageInPreview'},
			value: this.isShowImageInPreview,
			fn: this.toggleShowImageInPreview.bind(this),
			sort: 100
		},
		{
			id: 'filterByHeaderPrcStructure',
			type: ItemType.Check,
			caption: {key: 'basics.material.lookup.filterByHeaderPrcStructure'},
			disabled: systemOptionFilterByHeaderStructure,
			value: this.isFilterByHeaderStructure,
			fn: this.toggleFilterByHeaderStructure.bind(this),
			sort: 101
		}];
	}

	private getResultViewGridTools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			showTitles: true,
			items: [{
				id: 'copy',
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-copy btn-default',
				caption: {key: 'basics.material.lookup.createCopy'},
				hideItem: this.isHideCreateSimilarBth(),
				disabled: this.isDisableCreateSimilar.bind(this),
				fn: this.createSimilar.bind(this),
				sort: 100
			},
			{
				id: 'sortBy',
				type: ItemType.DropdownBtn,
				caption: {key: 'basics.material.lookup.sortBy'},
				iconClass: 'tlb-icons ico-sorting-ascending btn-default',
				list: this.sortByMenuItemList(),
				sort: 101
			}]
		};
	}

	private sortByMenuItemList(): IMenuItemsList<void> {
		return {
			cssClass: 'popup-menu',
			showTitles: true,
			showImages: false,
			items: MaterialFilterSortByItems.map((item, idx) => {
				return {
					id: item.id.toString(),
					type: ItemType.Item,
					caption: item.caption,
					iconClass: item.id == this.input.OrderBy ? 'selected' : '',
					fn: this.updateOrderBy.bind(this),
					sort: idx
				};
			})
		};
	}

	/**
	 * Update page size
	 * @param newPageSize
	 */
	public override updatePageSize(newPageSize: number) {
		if (this.input.PageSize !== newPageSize) {
			this.input.PageSize = newPageSize;

			this.updateResultDisplayConfig({itemsPerPage: newPageSize});
		}
	}

	private updateOrderBy(menuItem: IMenuItemEventInfo<void>) {
		const newOrderBy = toNumber(menuItem.item.id);
		if (this.input.OrderBy !== newOrderBy) {
			this.input.OrderBy = newOrderBy;
			this.updateResultGridTools();
			this.updateResultDisplayConfig({sortOption: newOrderBy});
			this.executeFilter();
		}
	}

	private toggleFilterByHeaderStructure(menuItem: IMenuItemEventInfo<void>) {
		const newValue = !this.isFilterByHeaderStructure;
		(menuItem.item as ICheckMenuItem<void>).value = newValue;
		this.isFilterByHeaderStructure = newValue;
		this.updateResultDisplayConfig({isFilterByHeaderStructure: newValue});
	}

	private toggleShowImageInPreview(menuItem: IMenuItemEventInfo<void>) {
		const newValue = !this.isShowImageInPreview;
		(menuItem.item as ICheckMenuItem<void>).value = newValue;
		this.isShowImageInPreview = newValue;
		this.updateResultDisplayConfig({showImageInPreview: newValue});
		this.resultViewOption.previewOption.previewCustomConfig!.isShowImageInPreview = this.isShowImageInPreview;
	}

	private isHideCreateSimilarBth(): boolean {
		return (!this.platformPermissionService.hasRead(this.createSimilarPermissionUuid) ||
			!this.platformPermissionService.hasExecute(this.createSimilarPermissionUuid) ||
			!!this.filterOptions.isDisableCreateSimilar);
	}

	private isDisableCreateSimilar() {
		const selectedItems = this.gridApiService.get(MaterialFilterGridId)?.selection;
		return !selectedItems?.length;
	}

	private async createSimilar() {
		const selectedItems = this.gridApiService.get(MaterialFilterGridId)?.selection as IMaterialSearchEntity[];
		const sourceItem = last(selectedItems);
		if (sourceItem) {
			this.showLoading();
			const newMaterial = await this.materialSimilarService.create(sourceItem);
			if (newMaterial) {
				newMaterial.selected = true;
				this.actionSelectedOrNot(newMaterial);
				this.insertItem(newMaterial, findIndex(this.output.Entities, {Id: sourceItem.Id}) + 1);
			}
			this.hideLoading();
		}
	}

	private insertItem(item: IMaterialSearchEntity, insertIndex: number) {
		if (insertIndex && insertIndex > -1) {
			this.output.Entities.splice(insertIndex, 0, item);
		} else {
			this.output.Entities.push(item);
		}

		this.output$.next(this.output);
	}

	private updateResultGridTools() {
		this.resultViewOption.gridOption.gridTools = this.getResultViewGridTools();
	}

	private async onPreviewItemChanged(item?: IMaterialSearchEntity | null) {
		if (!item) {
			return;
		}

		await Promise.all([
			this.loadNSetImage(item),
			this.loadNSetAttributes(item),
			this.loadNSetCharacteristic(item),
			this.loadNSetDocuments(item)
		]);
	}

	private async loadNSetImage(item: IMaterialSearchEntity) {
		await this.materialBlobService.provideImage([item], false);
	}

	private async loadNSetAttributes(item: IMaterialSearchEntity): Promise<void> {
		item.Attributes = await firstValueFrom(this.materialSearchService.getPreviewAttribute(item));
	}

	private async loadNSetDocuments(item: IMaterialSearchEntity): Promise<void> {
		const response = await firstValueFrom(this.materialSearchService.getDocumentByMaterial(item));
		item.Documents = response?.Main ?? [];
	}

	private async loadNSetCharacteristic(item: IMaterialSearchEntity): Promise<void> {
		// TODO https://rib-40.atlassian.net/browse/DEV-35917
		const characteristics = await this.materialSearchService.getCharacteristics(item.Id);
		item.Characteristics = characteristics.map(c => {
			return {
				Property: (c.CharacteristicEntity?.Code ?? '') + ' ' + (c.CharacteristicEntity?.DescriptionInfo?.Translated ?? ''),
				Value: c.ValueText?.toString() ?? ''
			};
		});
	}

	/**
	 * Handle selection changed, need to set item selected = true and update ui when select an item
	 * @param item
	 */
	public handleSelectionChanged(item?: IMaterialSearchEntity | null) {
		setTimeout(() => {
			if (!item || item.selected) {
				return;
			}

			const oldSelectedItems = this.selectedItems;
			item.selected = true;
			this.actionSelectedOrNot(item);

			const itemsOfNeedUpdateUI = this.filterOptions?.isEnableMultiSelect ?
				[item] :
				[item].concat(oldSelectedItems);
			this.gridApiService.get(MaterialFilterGridId)?.invalidate(itemsOfNeedUpdateUI);
		});
	}

	public override handleHeaderCheckboxChanged(isChecked: boolean) {
		this.actionSelectAllOrNot(isChecked);
	}
}

export const MATERIAL_FILTER_RESULT_PREVIEW_INFO = new InjectionToken<IEntityFilterResultPreviewInfo<IMaterialSearchEntity>>('MATERIAL_FILTER_RESULT_PREVIEW_INFO');