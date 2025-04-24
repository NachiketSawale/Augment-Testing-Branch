/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injector, ProviderToken } from '@angular/core';
import { PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { IFilterDef, IFilterDefinitionEntity } from './entities/selection-statement/filter-definition-entity.interface';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { IFilterEntity } from './entities/selection-statement/filter-entity.interface';
import { SelectionStatementSearchType } from './enums/selection-statement-search-type.enum';
import { ConstructionSystemCommonFilterService } from '../service/selection-statement/construction-system-common-filter.service';
import { ConstructionSystemCommonPropertyFilterGridDataService } from '../service/selection-statement/construction-system-common-property-filter-grid-data.service';
import { ISelectStatementEntity } from './entities/selection-statement/selection-statement-entity.interface';
import { IEntitySelection } from '@libs/platform/data-access';
import { ICosSelectionStatementMainService } from './enums/selection-statement-main-service.interface';
import { IPropertyFilterEntity } from './entities/selection-statement/property-filter-entity.interface';
import { SelectionStatementCommonScopeService } from '../service/selection-statement/selection-statement-common-scope.service';
import { CosTreePartMode } from './enums/cos-tree-part-mode.enum';
import { SelectionStatementFilterLevel } from './enums/selection-statement-filter-level';

/**
 * Selection Statement filter scope which used to store state and communicate among child components
 */
export class SelectionStatementFilterScope {
	/**
	 * Translation service
	 */
	public readonly translateService = inject(PlatformTranslateService);

	public readonly mainDataService: IEntitySelection<ISelectStatementEntity> & ICosSelectionStatementMainService;

	/**
	 * Dialog service
	 */
	public readonly msgDialogService = inject(UiCommonMessageBoxService);

	public readonly selectionStatementFilterService: ConstructionSystemCommonFilterService;

	public readonly commonScope: SelectionStatementCommonScopeService = inject(SelectionStatementCommonScopeService);

	public searchType: SelectionStatementSearchType = SelectionStatementSearchType.Simple;

	/**
	 * Is active
	 */
	public active: boolean = true;

	/**
	 * Is loading
	 */
	public filterDataLoading: boolean = false;

	/**
	 * Selected filter
	 */
	public selectedFilterDef?: IFilterDefinitionEntity;

	/**
	 * Selected filter
	 */
	public selectedFilterId?: number;

	/**
	 * Current filter
	 */
	public currentFilterDef: IFilterDefinitionEntity | null = null;

	/**
	 * Find filters
	 */
	public availableFilterDefs: IFilterDefinitionEntity[] = [];

	public matchOption?: number;

	public filterRequest = {
		treePartMode: CosTreePartMode.Minimal,
		pattern: '',
	};

	public savedFilterList = {
		items: this.availableFilterDefs,
		displayMember: 'displayName',
		valueMember: 'filterName',
		// todo: select control style
		// templateResult: function (item) {
		// 	let acl = item.origin ? item.origin.accessLevel : '';
		// 	let ico = (acl === 'System') ? (simpleFilterService.hasSysFtrWrAccess ? 'ico-search-system' : 'ico-search-system-prot')
		// 		: (acl === 'User') ? (simpleFilterService.hasUserFtrWrAccess ? 'ico-search-user' : 'ico-search-user-prot')
		// 			: (acl === 'Role') ? (simpleFilterService.hasRoleFtrWrAccess ? 'ico-search-role' : 'ico-search-role-prot')
		// 				: (acl === 'New') ? 'ico-search-new'
		// 					: '';
		// 	return $('<span class="filterDefdropboxIconsLeft control-icons ' + ico + '">' + _.escape(item.text) + '</span>');
		// }
	};
	private injector = inject(Injector);

	public constructor(private mainDataServiceToken: ProviderToken<IEntitySelection<ISelectStatementEntity>> & ProviderToken<ICosSelectionStatementMainService>) {
		this.mainDataService = inject(mainDataServiceToken);
		this.selectionStatementFilterService = new ConstructionSystemCommonFilterService(this.mainDataService.constructor.name);
	}

	/**
	 * sub injector for content component
	 */
	public subInjector: Injector = Injector.create({
		parent: this.injector,
		providers: [
			{
				provide: SelectionStatementFilterScope,
				useValue: this,
			},
		],
	});

	public searchOptions = {
		dropboxOptions: this.savedFilterList,
		onRevertFilter: () => {
			this.onRevertFilter();
			this.setFilterEnvironment();
		},
		canRevertFilter: () => {
			return this.commonScope.canRevertFilter(this.mainDataService);
		},
		onRefreshFilter: () => {
			this.selectionStatementFilterService.refresh(this.searchType);
		},
		onClearSearch: () => {
			this.filterRequest.pattern = '';
			this.filterRequest.treePartMode = CosTreePartMode.Minimal;
			this.currentFilterDef = null;
		},
		onDeleteFilter: () => {
			this.onDeleteFilter();
		},
		onSaveFilter: () => {
			this.onSaveFilter(false);
			this.onSave2SelectionStatement();
		},
		onSaveAsFilter: () => {
			this.onSaveFilter(true);
			this.onSave2SelectionStatement();
		},
		onSaveAsSelectionStatement: () => {
			this.onSave2SelectionStatement();
		},
		active: true,
	};

	public selectionChanged() {
		const selectedItem = this.selectionStatementFilterService.availableFilterDefs.find((item) => item.Id == this.selectedFilterId);

		if (selectedItem) {
			this.selectedFilterDef = selectedItem;
			this.resetByFilterDto(this.selectedFilterDef, null);
			if (this.selectedFilterDef) {
				this.onSave2SelectionStatement();
			}
		}
	}

	public selectionFilterChanged(filterId: number) {
		this.selectedFilterId = filterId;
		const selectedItem = this.selectionStatementFilterService.availableFilterDefs.find((item) => item.Id == this.selectedFilterId);

		if (selectedItem) {
			this.selectedFilterDef = selectedItem;
			this.resetByFilterDto(this.selectedFilterDef, null);
			if (this.selectedFilterDef) {
				this.onSave2SelectionStatement();
			}
		}
	}

	public onRevertFilter() {
		this.commonScope.onRevertFilter(this.mainDataService);
	}

	private getFilterDef(): IFilterDef {
		const filterDef: IFilterDef = {
			FilterType: this.searchType,
			TreePartMode: this.filterRequest.treePartMode,
		};
		if (this.searchType === SelectionStatementSearchType.Property) {
			const propertyFilterGridDataService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyFilterGridDataService);
			const filterObj = {
				matchOption: this.matchOption,
				items: propertyFilterGridDataService.getList(),
			};
			filterDef.FilterText = JSON.stringify(filterObj);
			filterDef.Version = '1.0';
		} else {
			filterDef.FilterText = this.filterRequest.pattern;
		} ///todo enhance filter definition
		return filterDef;
	}

	public onSaveFilter(isSaveAs: boolean) {
		const filterDto: IFilterDefinitionEntity = {
			FilterDef: JSON.stringify(this.getFilterDef()),
			FilterName: this.selectedFilterDef?.FilterName ?? '',
			AccessLevel: this.selectedFilterDef?.AccessLevel ?? '',
			ModuleName: this.selectedFilterDef?.ModuleName ?? '',
			Id: this.selectedFilterDef?.Id ?? 0,
			DisplayName: this.selectedFilterDef?.DisplayName ?? '',
		};
		if (!isSaveAs) {
			this.doSaveFilterDefinition(filterDto);
		} else {
			// showfilterSaveDialog().then(function () { todo
			// 		var filterDef = $scope.searchOptions.enhancedFilter.currentFilterDef;
			// 		filterDto.name = filterDef.name;
			// 		filterDto.accessLevel = filterDef.accesslevel;
			//
			// 		doSaveFilterDefinition();
			// 	}
			// );
		}
	}

	private doSaveFilterDefinition(filterDto: IFilterDefinitionEntity) {
		this.filterDataLoading = true;
		this.selectionStatementFilterService.saveFilterDefinition(filterDto).then((addUpdatedFilterDefEntry) => {
			this.filterDataLoading = false;
			this.selectFilterDto(addUpdatedFilterDefEntry, null);
		});
	}

	private showfilterSaveDialog() {
		// todo cloudDesktopFilterDefinitionSaveDialogController  is not ready
		// var dialogOption = {
		// 	templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/filterdefinition-save-dialog.html',
		// 	controller: 'cloudDesktopFilterDefinitionSaveDialogController',
		// 	scope: $scope  // pass parameters to dialog via current scope
		// };
		// return platformModalService.showDialog(dialogOption);
	}

	public onDeleteFilter() {
		const filterDto = this.selectedFilterDef;
		if (filterDto) {
			const body = this.translateService.instant({
				key: 'cloud.desktop.filterdefConfirmDeleteBody',
				params: {
					p1: filterDto.FilterName,
				},
			}).text;
			this.msgDialogService.showMsgBox(body, 'cloud.desktop.filterdefConfirmDeleteTitle', 'ico-question')?.then(() => {
				this.filterDataLoading = true;
				try {
					this.selectionStatementFilterService.deleteFilterDefinition(filterDto).then((nextFilterDto) => {
						this.filterDataLoading = false;
						if (nextFilterDto) {
							this.selectFilterDto(nextFilterDto, null);
							this.onSave2SelectionStatement();
						}
					});
				} catch (e) {
					console.log(e);
				} finally {
					this.filterDataLoading = false;
				}
			});
		}
	}

	/**
	 * select filter
	 */
	public selectFilterDto(filterDto: IFilterDefinitionEntity, filter: IFilterEntity | null) {
		this.selectedFilterDef = filterDto;
		this.selectedFilterId = filterDto.Id;
		if (filterDto) {
			this.resetByFilterDto(filterDto, filter);
		}
	}

	/**
	 * set related values when the selected filter dto changed.
	 */
	public resetByFilterDto(filterDto: IFilterDefinitionEntity, filter: IFilterEntity | null) {
		if (this.selectedFilterDef && filterDto.FilterDef) {
			const currentFilterDef = this.selectionStatementFilterService.getCurrentFilterDef(filterDto);
			if (this.searchType === SelectionStatementSearchType.Property) {
				this.setPropertyFilterText(currentFilterDef);
			}
			this.filterRequest.pattern = currentFilterDef['filterText'] as unknown as string;
			this.filterRequest.treePartMode = currentFilterDef['treePartMode'] as unknown as CosTreePartMode;
		} else if (filter) {
			this.filterRequest.treePartMode = filter.TreePartMode as CosTreePartMode;
			this.filterRequest.pattern = filter.FilterText;
		} else {
			this.onClearSearch();
		}
	}

	/**
	 * set property filter grid data
	 * @param currentFilterDef
	 * @private
	 */
	private setPropertyFilterText(currentFilterDef: Record<string, unknown>) {
		const propertyGridDataService = ServiceLocator.injector.get(ConstructionSystemCommonPropertyFilterGridDataService);
		if (!currentFilterDef || currentFilterDef['filterType'] !== this.searchType || !currentFilterDef['filterText']) {
			propertyGridDataService.setList([]);
			return;
		}
		let list: IPropertyFilterEntity[] = [];
		try {
			const parsedFilter = JSON.parse(currentFilterDef['filterText'] as unknown as string);
			if (currentFilterDef['version'] === '1.0') {
				this.matchOption = parsedFilter.matchOption;
				list = parsedFilter.items;
			} else {
				list = parsedFilter;
			}
		} catch (e) {
			console.error('Failed to parse filter text:', e);
			return;
		}

		const items: IPropertyFilterEntity[] = list.map((item, index) => ({
			Id: index + 1,
			PropertyId: item.PropertyId,
			PropertyName: item.PropertyName,
			ValueType: item.ValueType,
			Operation: item.Operation || 1,
			PropertyValue: item.PropertyValue,
		}));

		propertyGridDataService.setList(items);
	}

	public onClearSearch() {
		if (this.searchType === SelectionStatementSearchType.Property) {
			this.setPropertyFilterText({});
		}
		this.filterRequest.pattern = '';
		this.filterRequest.treePartMode = CosTreePartMode.Minimal;
		this.matchOption = 1;
		this.currentFilterDef = null;
	}

	public canSaveOrDeleteFilter() {
		return this.selectedFilterDef && this.selectedFilterDef.AccessLevel !== 'New' && this.filterRequest.pattern;
	}

	public onParentSelectionChanged() {
		this.selectionStatementFilterService.clearSelectedFilter();
		this.onClearSearch();
		this.setFilterEnvironment();
	}

	public setFilterEnvironment() {
		function completeFilter(filters: IFilterDefinitionEntity[]) {
			filters.forEach((item) => {
				switch (item.AccessLevel) {
					case SelectionStatementFilterLevel.System:
						item.IconCss = 'ico-search-system';
						break;
					case SelectionStatementFilterLevel.User:
						item.IconCss = 'ico-search-user';
						break;
					case SelectionStatementFilterLevel.Role:
						item.IconCss = 'ico-search-role';
						break;
					case SelectionStatementFilterLevel.New:
						item.IconCss = 'ico-search-new';
						break;
					default:
						item.IconCss = '';
				}
			});
			return filters;
		}
		this.active = false;
		this.filterDataLoading = true;
		this.currentFilterDef = null;

		this.selectionStatementFilterService.loadFilterBaseData(this.searchType).then(() => {
			this.selectedFilterId = this.selectionStatementFilterService.selectedFilterDefDto?.Id ?? 1;
			this.filterDataLoading = false;
			if (this.selectionStatementFilterService.availableFilterDefs && this.selectionStatementFilterService.availableFilterDefs.length > 0) {
				this.searchOptions.dropboxOptions.items = completeFilter(this.selectionStatementFilterService.availableFilterDefs);
				this.selectFilterDto(this.selectionStatementFilterService.selectedFilterDefDto || this.selectionStatementFilterService.availableFilterDefs[0], null);
			}
			if (this.mainDataService.hasSelection()) {
				const header = this.mainDataService.getSelectedEntity();
				if (header && header.SelectStatement) {
					const filter = this.selectionStatementFilterService.convertKeysToCamelCase(JSON.parse(header.SelectStatement));
					switch (this.searchType) {
						case SelectionStatementSearchType.Property: {
							this.setPropertyFilterText(filter);
							let treePartMode = filter['filterComposite'] ? CosTreePartMode.Minimal : CosTreePartMode.Leaves;
							if (filter['treePartMode']) {
								treePartMode = filter['treePartMode'] as unknown as CosTreePartMode;
							}
							this.filterRequest.treePartMode = treePartMode;
							this.active = filter['filterType'] === this.searchType;
							break;
						}
						default: {
							//const selectStatementSelectedDto = JSON.parse(header.SelectStatement) as IFilterDef;
							let selectedItem = filter['SelectedItem'] ? (filter['SelectedItem'] as unknown as IFilterDefinitionEntity) : undefined;
							if (selectedItem) {
								selectedItem = this.selectionStatementFilterService.availableFilterDefs.find((e) => e.AccessLevel === selectedItem?.AccessLevel && e.DisplayName === selectedItem?.DisplayName);
							} else {
								selectedItem = this.selectionStatementFilterService.availableFilterDefs[0];
							}
							let treePartMode = filter['filterComposite'] ? CosTreePartMode.Minimal : CosTreePartMode.Leaves;
							if (filter['treePartMode'] as unknown as string) {
								treePartMode = filter['treePartMode'] as unknown as CosTreePartMode;
							}
							this.filterRequest.treePartMode = treePartMode;

							const showFilterText = filter['filterType'] === this.searchType ? (filter['filterText'] as unknown as string) ?? '' : '';
							this.selectFilterDto(selectedItem!, {
								TreePartMode: treePartMode,
								FilterText: showFilterText,
							});

							this.active = filter['filterType'] === this.searchType;
							break;
						}
					}
				}
			}
			this.active = true;
			//filterServiceCache.setFilterReadOnly(this);TODO
		});
	}

	/**
	 * collect simple filter and saved to the field 'SelectStatement' of COS Master.
	 */
	public onSave2SelectionStatement() {
		// todo enhanced filter case
		let filterDef;
		if (this.active) {
			switch (this.searchType) {
				case SelectionStatementSearchType.Property: {
					const propertyFilter = this.getFilterDef();
					filterDef = {
						version: propertyFilter.Version,
						filterType: this.searchType,
						treePartMode: this.filterRequest.treePartMode,
						filterText: propertyFilter.FilterText,
					};
					break;
				}
				default: {
					filterDef = {
						filterType: this.searchType,
						treePartMode: this.filterRequest.treePartMode,
						filterText: this.filterRequest.pattern,
					};
					break;
				}
			}
			if (filterDef && !filterDef.filterText) {
				const header = this.mainDataService.getSelectedEntity();
				if (header && header.SelectStatement) {
					const selectStatement = JSON.parse(header.SelectStatement);
					if (selectStatement && selectStatement.filterType !== this.searchType) {
						return;
					}
				}
			}
			//this.selectionStatementFilterService.filterDataService.setSelectedFilter(this.mainDataServiceToken.toString(), filterObj); todo very strange original save filterDef, not filterDefinitionEntity
			const item = this.mainDataService.getSelectedEntity();
			if (item) {
				item.SelectStatement = JSON.stringify(filterDef);
				this.mainDataService.setModified(item);
			}
		}
	}
}
