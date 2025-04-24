/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { ActivePopup, FieldType, GridApiService, IGridConfiguration, IMenuItemsList, ItemType } from '@libs/ui/common';
import { IBasicsSearchStructureEntity, IBasicsSearchStructurePreDefine, IMaterialStructureLookupEntity, IPrcStructureEntityGenerated } from '@libs/basics/interfaces';
import { MaterialSearchScope } from '../../model/material-search-scope';
import { IMaterialDefinitionsEntity } from '../../model/interfaces/material-definitions-entity.interface';
import { CategorySearchType } from '../../../model/enums/category-search-type.enum';

/**
 * material catalog list grid
 */
@Component({
	selector: 'basics-shared-material-structure-list',
	templateUrl: './material-structure-list.component.html',
	styleUrls: ['./material-structure-list.component.scss'],
})
export class BasicsSharedMaterialStructureListComponent implements AfterViewInit {
	private readonly httpService = inject(PlatformHttpService);
	private readonly gridApiService = inject(GridApiService);
	private activePopup = inject(ActivePopup);
	private materialSearchScope = inject(MaterialSearchScope);
	private gridId = 'e9c8f8c53f8740b7b420dc3bc4a81e25';
	private allStructureItems: IBasicsSearchStructureEntity[] = [];
	protected isLoading = false;
	protected gridConfig!: IGridConfiguration<IBasicsSearchStructureEntity>;
	protected structureItems: IBasicsSearchStructureEntity[] = [];
	protected selectedEntity?: IBasicsSearchStructureEntity;
	protected selectedOption: string = CategorySearchType.MaterialCatalog;
	protected searchText: string = '';

	public constructor() {
		this.updateTree();
	}

	public ngAfterViewInit() {
		setTimeout(async () => {
			await this.loadData();
		});
	}

	public get tools(): IMenuItemsList {
		return {
			cssClass: 'tools',
			items: [
				{
					id: 'collapse',
					caption: 'cloud.common.toolbarCollapse',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridId);
						if (gridApi && gridApi.selection.length > 0) {
							gridApi.collapse(gridApi.selection[0]);
						}
					},
				},
				{
					id: 'expand',
					caption: 'cloud.common.toolbarExpand',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-tree-expand',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridId);
						if (gridApi && gridApi.selection.length > 0) {
							gridApi.expand(gridApi.selection[0]);
						}
					},
				},
				{
					id: 'collapse-all',
					caption: 'cloud.common.toolbarCollapseAll',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridId);
						if (gridApi) {
							gridApi.collapseAll();
						}
					},
				},
				{
					id: 'expand-all',
					caption: 'cloud.common.toolbarExpandAll',
					type: ItemType.Item,
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: () => {
						const gridApi = this.gridApiService.get(this.gridId);
						if (gridApi) {
							gridApi.expandAll();
						}
					},
				},
			],
		};
	}

	/**
	 * Sort options when searching
	 */
	public structureOptionList = [
		{
			value: CategorySearchType.MaterialCatalog,
			description: 'basics.material.materialCatalog',
		},
		{
			value: CategorySearchType.PrcStructure,
			description: 'basics.common.entityPrcStructureFk',
		},
	];

	private updateTree() {
		this.gridConfig = {
			uuid: this.gridId,
			idProperty: 'Id',
			columns: [
				{
					id: 'codeDescription',
					model: 'CodeDescription',
					label: 'CodeDescription',
					type: FieldType.Description,
					width: 150,
					readonly: true,
					visible: true,
					sortable: true,
				},
			],
			skipPermissionCheck: true,
			enableColumnReorder: false,
			items: this.structureItems,
			indicator: false,
			treeConfiguration: {
				parent: (entity) => {
					if (entity.ParentId) {
						return this.structureItems.find((item) => item.Id === entity.ParentId) || null;
					}
					return null;
				},
				children: (entity) => entity.ChildItems ?? [],
				collapsed: true,
			},
		};
	}

	public async structureOptionChange() {
		await this.loadData();
	}

	public onSelectionChanged(selection: IBasicsSearchStructureEntity[]) {
		this.selectedEntity = selection[0];
	}

	public doubleSelect() {
		this.onOK();
	}

	public searchTextChange() {
		this.structureItems = !this.searchText ? this.allStructureItems : (this.allStructureItems.map((item) => this.filterItem(item, this.searchText)).filter((item) => item !== null) as IBasicsSearchStructureEntity[]);

		this.gridConfig.items = this.structureItems;
		this.updateTree();
	}

	public onOK() {
		this.materialSearchScope.request.PreDefine = this.selectedEntity?.PreDefine;
		this.materialSearchScope.search();
		this.activePopup.close();
		if (this.materialSearchScope.MaterialDefinition) {
			const [code, desc] = this.selectedEntity!.CodeDescription.split(' ');
			this.materialSearchScope.MaterialDefinition.config.category.entity.Code = code;
			if (this.materialSearchScope.MaterialDefinition.config.category.entity.DescriptionInfo) {
				this.materialSearchScope.MaterialDefinition.config.category.entity.DescriptionInfo.Translated = desc;
			}
			this.materialSearchScope.MaterialDefinition.config.category.entity.Id = this.selectedEntity!.Id;
			this.materialSearchScope.lookupTitle = this.selectedEntity!.CodeDescription;
			this.materialSearchScope.MaterialDefinition.config.filterOption.PreDefine = this.selectedEntity!.PreDefine;
			this.saveMaterialDefinition(this.materialSearchScope.MaterialDefinition);
		}
	}

	public onCancel() {
		this.activePopup.close();
	}

	private filterItem(item: IBasicsSearchStructureEntity, code: string): IBasicsSearchStructureEntity | null {
		const match = item.CodeDescription.toLowerCase().includes(code.toLowerCase());

		const filteredChildren = (item.ChildItems?.map((child) => this.filterItem(child, code)).filter((child) => child !== null) as IBasicsSearchStructureEntity[]) || [];

		if (match) {
			return { ...item, ChildItems: filteredChildren };
		}

		if (filteredChildren.length > 0) {
			return { ...item, ChildItems: filteredChildren };
		}

		return null;
	}

	private async loadData() {
		this.isLoading = true;
		const isTicketSystem = this.materialSearchScope.request?.Filter?.IsTicketSystem;
		const isFilterCompany = this.materialSearchScope.request?.Filter?.IsFilterCompany;
		this.allStructureItems = this.selectedOption === CategorySearchType.MaterialCatalog ? await this.loadMaterialStructure(!!isTicketSystem, !!isFilterCompany) : await this.loadStructureTree();
		this.structureItems = this.allStructureItems;
		this.isLoading = false;
		this.updateTree();
	}

	private getIconClass(hasChildItem: boolean, parentId?: number | null) {
		if (parentId === null) {
			return 'ico-folder-doc';
		}
		return hasChildItem ? 'ico-rubric-category' : 'control-icons ico-folder-empty';
	}

	private createStructureEntity(entity: IMaterialStructureLookupEntity | IPrcStructureEntityGenerated, parentKey: 'MaterialCatalogFk' | 'PrcStructureFk'): IBasicsSearchStructureEntity {
		const description = entity.DescriptionInfo?.Translated ?? entity.DescriptionInfo?.Description;
		const hasChildItem = !!entity.ChildItems?.length;

		let parentId = null;
		const preDefine: IBasicsSearchStructurePreDefine = {};
		if (parentKey === 'MaterialCatalogFk' && 'MaterialCatalogFk' in entity) {
			parentId = entity.MaterialCatalogFk;
			if (entity.IsMaterialCatalog) {
				preDefine.CategoryId = entity.Id;
			} else if (entity.IsMaterialGroup) {
				preDefine.GroupId = entity.Id;
				preDefine.CategoryId = entity.MaterialCatalogFk;
			}
		}
		if (parentKey === 'PrcStructureFk' && 'PrcStructureFk' in entity) {
			parentId = entity.PrcStructureFk;
			preDefine.StructureId = entity.Id;
		}
		return {
			Id: entity.Id,
			Code: entity.Code,
			CodeDescription: `${entity.Code} ${description}`,
			PreDefine: preDefine,
			Image: `control-icons ${this.getIconClass(hasChildItem, parentId)}`,
			IsPrcStructure: parentKey === 'PrcStructureFk',
			ChildItems: entity.ChildItems?.map((e) => this.createStructureEntity(e, parentKey)),
		};
	}

	private async loadMaterialStructure(isTicketSystem: boolean, isFilterCompany: boolean) {
		const entities = await this.httpService.post<IMaterialStructureLookupEntity[]>('basics/materialcatalog/catalog/structure', { IsTicketSystem: isTicketSystem, IsFilterCompany: isFilterCompany });
		return entities.map((e) => this.createStructureEntity(e, 'MaterialCatalogFk'));
	}

	private async loadStructureTree() {
		const entities = await this.httpService.get<IPrcStructureEntityGenerated[]>('basics/procurementstructure/structuretree');
		return entities.map((e) => this.createStructureEntity(e, 'PrcStructureFk'));
	}

	private saveMaterialDefinition(filterDef: IMaterialDefinitionsEntity): void {
		filterDef.config.category.type = this.getSearchType(filterDef);

		const payload = {
			FilterName: 'searchOptions',
			AccessLevel: 'User',
			FilterDef: JSON.stringify([filterDef]),
		};

		this.httpService.post('basics/material/savematerialdefinition', payload);
	}

	private getSearchType(filterDef: IMaterialDefinitionsEntity): CategorySearchType {
		const { StructureId, CategoryId, GroupId } = filterDef.config.filterOption.PreDefine;

		if (StructureId) {
			return CategorySearchType.PrcStructure;
		}
		if (CategoryId && GroupId) {
			return CategorySearchType.MaterialGroup;
		}
		return CategorySearchType.MaterialCatalog;
	}

	public ngOnInit() {
		const searchType = this.materialSearchScope.MaterialDefinition?.config.category.type;
		this.selectedOption = searchType === CategorySearchType.PrcStructure ? CategorySearchType.PrcStructure : CategorySearchType.MaterialCatalog;
	}
}
