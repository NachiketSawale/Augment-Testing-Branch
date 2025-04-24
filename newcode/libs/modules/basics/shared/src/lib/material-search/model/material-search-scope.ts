/*
 * Copyright(c) RIB Software GmbH
 */

import { forkJoin, map, of, Observable, Subject } from 'rxjs';
import { cloneDeep, find, isNil, keyBy } from 'lodash';
import { inject, Injector } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { MaterialSearchResponse } from './material-search-response';
import { IMaterialTypeFilter, MaterialSearchRequest } from './material-search-request';
import { BasicsSharedMaterialSearchService } from '../services/material-search.service';
import { MaterialSearchSort } from './interfaces/material-search-sort.enum';
import { BasicsSharedMaterialBlobService } from '../services/material-blob.service';
import { IMaterialSearchEntity } from './interfaces/material-search-entity.interface';
import { IMaterialSearchOptions } from './interfaces/material-search-options.interface';
import { IMaterialAttributeLoadEntity, IMaterialAttributeNodeLoadEntity } from './interfaces/material-search-attribute-load.interface';
import { IMaterialSearchPriceList } from './interfaces/material-search-price-list.interface';
import { BasicsSharedCurrencyLookupService } from '../../lookup-services/currency-lookup.service';
import { BasicsSharedCo2SourceLookupService } from '../../lookup-services/customize/basics/basics-shared-co2-source-lookup.service';
import { CurrencyEntity } from '../../lookup-services/entities/currency-entity.class';
import { Co2SourceEntity } from '../../lookup-services/entities/co2source-entity.class';
import { IMaterialDefinitionsEntity } from './interfaces/material-definitions-entity.interface';

/**
 * Material search scope which used to store state and communicate among child components
 */
export class MaterialSearchScope {
	/**
	 * Search service
	 */
	public searchService = inject(BasicsSharedMaterialSearchService);
	/**
	 * Image service
	 * @private
	 */
	private blobService = inject(BasicsSharedMaterialBlobService);
	/**
	 * Translation service
	 */
	public translateService = inject(PlatformTranslateService);

	/**
	 * currency lookup service
	 */
	public currencyLookupService = inject(BasicsSharedCurrencyLookupService);

	/**
	 * co2Source lookup service
	 */
	public co2SourceLookupService = inject(BasicsSharedCo2SourceLookupService);

	/**
	 * Is loading
	 */
	public loading = false;

	/**
	 * Show material detail view
	 */
	public showDetail = false;

	/**
	 * Material detail
	 */
	public detailItem?: IMaterialSearchEntity;

	/**
	 * Selected material
	 */
	public selectedItem?: IMaterialSearchEntity;

	/**
	 * Selected materials
	 */
	public selectedItems: IMaterialSearchEntity[] = [];

	/**
	 * current Search Result
	 */
	public currentSearchResult: IMaterialSearchEntity[] | null = null;

	/**
	 * enable Multiple Selection
	 */
	public enableMultiSelection: boolean = false;

	/**
	 * check All From Current Page
	 */
	public checkAllFromCurrentPage = false;

	/**
	 * check All From Result Set
	 */
	public checkAllFromResultSet = false;

	/**
	 *  disable checkAllFromResultSet checkbox
	 */
	public checkAllFromResultSetDisable = false;

	/**
	 * Select material subject
	 */
	public selected$ = new Subject<IMaterialSearchEntity>();

	private injector = inject(Injector);
	/**
	 * sub injector for content component
	 */
	public subInjector: Injector = Injector.create({
		parent: this.injector,
		providers: [
			{
				provide: MaterialSearchScope,
				useValue: this,
			},
		],
	});

	/**
	 * Search view options
	 */
	public searchOptions?: IMaterialSearchOptions;

	/**
	 * Sort options when searching
	 */
	public sortOptions = [
		{
			value: MaterialSearchSort.SupplierAscending,
			description: 'basics.material.lookup.SupplierAscending',
		},
		{
			value: MaterialSearchSort.SupplierDescending,
			description: 'basics.material.lookup.SupplierDescending',
		},
		{
			value: MaterialSearchSort.CodeAscending,
			description: 'basics.material.lookup.CodeAscending',
		},
		{
			value: MaterialSearchSort.CodeDescending,
			description: 'basics.material.lookup.CodeDescending',
		},
		{
			value: MaterialSearchSort.PriceAscending,
			description: 'basics.material.lookup.PriceAscending',
		},
		{
			value: MaterialSearchSort.PriceDescending,
			description: 'basics.material.lookup.PriceDescending',
		},
	];

	/**
	 * lookup title
	 * */
	public MaterialDefinition: IMaterialDefinitionsEntity | null = null;

	public lookupTitle: string = '';

	private htmlTranslate = 'basics.material.materialSearchLookup.htmlTranslate';
	private pageTranslate = 'basics.material.materialSearchLookup.page';
	private typeFilterTranslate = 'basics.material.materialTypeFilter';
	private recordTranslate = 'basics.material.record';
	/**
	 * Translations
	 */
	public translations = {
		attributes: this.htmlTranslate + '.attributes',
		documents: this.htmlTranslate + '.documents',
		searchResults: this.htmlTranslate + '.searchResults',
		category: this.htmlTranslate + '.category',
		structure: this.htmlTranslate + '.structure',
		bp: this.htmlTranslate + '.BP',
		information: this.htmlTranslate + '.information',
		keyWord: this.htmlTranslate + '.keyWord',
		firstText: this.pageTranslate + '.firstText',
		previousText: this.pageTranslate + '.previousText',
		nextText: this.pageTranslate + '.nextText',
		lastText: this.pageTranslate + '.lastText',
		back: this.htmlTranslate + '.back',
		uom: this.htmlTranslate + '.uom',
		price: this.htmlTranslate + '.price',
		alternativeSource: this.htmlTranslate + '.alternativeSource',
		filter: this.htmlTranslate + '.filter',
		catError: this.htmlTranslate + '.catError',
		showCatError: this.htmlTranslate + '.showCatError',
		materialType: this.htmlTranslate + '.materialType',
		co2Project: this.recordTranslate + '.entityCo2Project',
		co2Source: this.recordTranslate + '.entityCo2Source',
		co2SourceName: this.recordTranslate + '.entityBasCo2SourceFk',
		alternative: this.recordTranslate + '.alternative',
		supplier: this.htmlTranslate + '.supplier',
		leadTimes: this.htmlTranslate + '.leadTimes',
		minQuantity: this.htmlTranslate + '.minQuantity',
		model3D: this.htmlTranslate + '.model3D',
		materialTypeFilter: {
			procurement: this.typeFilterTranslate + '.procurement',
			estimate: this.typeFilterTranslate + '.estimate',
			rm: this.typeFilterTranslate + '.rm',
			model: this.typeFilterTranslate + '.model',
			sales: this.typeFilterTranslate + '.sales',
			logistics: this.typeFilterTranslate + '.logistics',
		},
	};

	/**
	 * Search request
	 */
	public request = new MaterialSearchRequest();
	/**
	 * Search response
	 */
	public response = new MaterialSearchResponse();

	/**
	 * current procurement structure
	 */
	public get prcStructureId() {
		// #144045 - Adjustment of the pre-allocation in the material lookup
		if (this.request.Filter && this.request.Filter.PrcStructureOptional && this.request.Filter.PrcStructureId) {
			return this.request.Filter.PrcStructureId;
		}

		return this.request.StructureId;
	}

	private searching(changeSearchCondition: boolean = true) {
		this.loading = true;
		if (changeSearchCondition) {
			this.handleSearchConditionChange();
		}
		return this.searchService.search(this.request).pipe(
			map((response) => {
				this.loading = false;
				this.checkAllFromResultSetDisable = response.maxGroupCount > 500;
				this.blobService.provideImage(response.items);
				this.setCurrentPageSelectedItem(response.items);
				return response;
			}),
		);
	}

	/**
	 * handle Search Condition Change
	 * @private
	 */
	private handleSearchConditionChange() {
		this.checkAllFromCurrentPage = false;
		this.checkAllFromResultSet = false;
		this.currentSearchResult = null;
	}

	/**
	 * set current page item selected
	 * @param items
	 * @private
	 */
	private setCurrentPageSelectedItem(items: IMaterialSearchEntity[]) {
		this.selectedItems.forEach((item, idx) => {
			const target = find(items, {
				Id: item.Id,
				InternetCatalogFk: item.InternetCatalogFk,
			});
			if (target) {
				target.selected = true;
				this.selectedItems[idx] = target;
			}
		});
		const currentPageSelected = items.filter((e) => e.selected);
		this.checkAllFromCurrentPage = currentPageSelected.length === items.length;
	}

	/**
	 * Initialize the material search result
	 * @param materialId
	 */
	public init(materialId: number) {
		this.loading = true;

		this.searchService.init(materialId).subscribe((response) => {
			this.loading = false;

			if (response.items && response.items.length > 0) {
				this.blobService.provideImage(response.items);
				this.selectedItem = response.items[0];
				this.selectedItem.selected = true;
				this.selectedItems = [this.selectedItem];
			}

			this.response = response;
		});
	}

	/**
	 * Search material
	 */
	public search() {
		this.request.CurrentPage = 1;
		this.request.IsResetAttribute = true;
		this.request.IsResetCatalog = true;
		this.request.CategoryIdsFilter = [];
		this.request.UomsFilter = [];
		this.request.Co2SourceNameFilter = [];
		this.request.PriceRange = null;
		this.request.Co2ProjectRange = null;
		this.request.Co2SourceRange = null;
		this.request.AttributeFilters = [];
		this.searching().subscribe((response) => {
			this.response = response;
		});
	}

	/**
	 * Sort material
	 */
	public sort() {
		this.request.CurrentPage = 1;
		this.searching().subscribe((response) => {
			this.response.items = response.items;
		});
	}

	/**
	 * Revert filters
	 */
	public revert() {
		this.request = new MaterialSearchRequest();
		this.search();
		this.lookupTitle = this.translateService.instant('basics.common.entityPrcStructureFk').text;
	}

	/**
	 * Paging material
	 */
	public paging() {
		this.request.IsResetAttribute = false;
		this.request.IsResetCatalog = false;
		this.searching(false).subscribe((response) => {
			this.response.items = response.items;
		});
	}

	/**
	 * Navigate structure
	 * @param structureId
	 */
	public navigate(structureId?: number) {
		if (this.request.Filter && this.request.Filter.PrcStructureOptional) {
			this.request.Filter.PrcStructureId = undefined;
		}

		this.request.StructureId = structureId;
		this.request.CurrentPage = 1;
		this.request.IsResetAttribute = true;
		this.request.IsResetCatalog = true;
		this.searching().subscribe((response) => {
			this.response = response;
		});
	}

	/**
	 * Filter framework catalog
	 */
	public filterFramework() {
		this.request.CurrentPage = 1;
		this.request.IsResetAttribute = true;
		this.request.IsResetCatalog = true;
		this.searching().subscribe((response) => {
			this.response = response;
		});
	}

	/**
	 * Filter material catalog
	 */
	public filterCatalog() {
		this.request.CurrentPage = 1;
		this.request.IsResetCatalog = false;
		this.request.IsResetAttribute = true;
		this.request.CategoryIdsFilter = this.response.categories.filter((e) => e.checked).map((e) => e.Id);
		this.searching().subscribe((response) => {
			this.response.items = response.items;
			this.response.structures = response.structures;
			this.response.attributes = response.attributes;
			this.response.matchedCount = response.matchedCount;
			this.response.maxGroupCount = response.matchedCount;
		});
	}

	/**
	 * Filter uom
	 */
	public filterUom() {
		this.request.UomsFilter = this.response.uoms.filter((e) => e.Checked).map((e) => e.Uom);
		this.searching().subscribe((response) => {
			this.response.items = response.items;
			this.response.structures = response.structures;
			this.response.attributes = response.attributes;
			this.response.matchedCount = response.matchedCount;
			this.response.maxGroupCount = response.matchedCount;
		});
	}

	/**
	 * Filter uom
	 */
	public filterCo2SourceName() {
		this.request.Co2SourceNameFilter = this.response.co2sources.filter((e) => e.Checked).map((e) => e.Id);
		this.searching().subscribe((response) => {
			this.response.items = response.items;
			this.response.structures = response.structures;
			this.response.attributes = response.attributes;
			this.response.matchedCount = response.matchedCount;
			this.response.maxGroupCount = response.matchedCount;
		});
	}

	/**
	 * Filter price
	 */
	public filterPrice() {
		if (this.response.price) {
			this.request.PriceRange = {
				MinValue: this.response.price.Value[0],
				MaxValue: this.response.price.Value[1],
			};
			this.searching().subscribe((response) => {
				this.response.items = response.items;
				this.response.structures = response.structures;
				this.response.attributes = response.attributes;
				this.response.matchedCount = response.matchedCount;
				this.response.maxGroupCount = response.matchedCount;
			});
		}
	}

	/**
	 * Filter Co2Project
	 */
	public filterCo2Project() {
		if (this.response.co2project) {
			this.request.Co2ProjectRange = {
				MinValue: this.response.co2project.Value[0],
				MaxValue: this.response.co2project.Value[1],
			};
			this.searching().subscribe((response) => {
				this.response.items = response.items;
				this.response.structures = response.structures;
				this.response.attributes = response.attributes;
				this.response.matchedCount = response.matchedCount;
				this.response.maxGroupCount = response.matchedCount;
			});
		}
	}

	/**
	 * Filter Co2Project
	 */
	public filterCo2Source() {
		if (this.response.co2source) {
			this.request.Co2SourceRange = {
				MinValue: this.response.co2source.Value[0],
				MaxValue: this.response.co2source.Value[1],
			};
			this.searching().subscribe((response) => {
				this.response.items = response.items;
				this.response.structures = response.structures;
				this.response.attributes = response.attributes;
				this.response.matchedCount = response.matchedCount;
				this.response.maxGroupCount = response.matchedCount;
			});
		}
	}

	/**
	 * Filter Attributes
	 */
	public filterAttribute(filteredAttributes: IMaterialAttributeLoadEntity[]) {
		this.request.AttributeFilters = filteredAttributes;
		this.searching().subscribe((response) => {
			this.response.items = response.items;
			this.response.structures = response.structures;
			this.response.attributes = response.attributes;
			this.response.matchedCount = response.matchedCount;
			this.response.maxGroupCount = response.matchedCount;
		});
	}

	/**
	 * Filter Material Type
	 */
	public filterMaterialType() {
		this.searching().subscribe((response) => {
			this.response.items = response.items;
			this.response.structures = response.structures;
			this.response.attributes = response.attributes;
			this.response.matchedCount = response.matchedCount;
			this.response.maxGroupCount = response.matchedCount;
		});
	}

	/**
	 * load more attributes
	 * @param node
	 */
	public loadMoreAttribute(node?: IMaterialAttributeNodeLoadEntity) {
		let requestData: MaterialSearchRequest;
		const property = node?.property;
		if (!property) {
			requestData = this.request;
			requestData.AttrPageNumber += 1;
			requestData.MorePropValue = null;
		} else {
			const excludeValues = this.response.attributes
				.filter((i) => {
					return i.Property.toLowerCase() === property.toLowerCase();
				})
				.map((j) => {
					return j.Value;
				});
			requestData = cloneDeep(this.request);
			requestData.AttrPageNumber = 1;
			requestData.MorePropValue = {
				Property: property,
				ExcludeValues: excludeValues,
			};
		}
		this.searchService.loadAttribute(requestData).subscribe((res) => {
			if (res && res.length) {
				this.response.attributes = this.response.attributes.concat(res);
			} else {
				if (!node) {
					this.response.attributesFinished = true;
				} else {
					node.finish = true;
				}
			}
			return this.response;
		});
	}

	/**
	 * load 500 items
	 */
	public load500ResultSet() {
		this.request.ItemsPerPage = 500;
		this.request.CurrentPage = 1;
		return this.searching(false);
	}

	/**
	 * materil type filter data
	 */
	public materialTypeDatas = [
		{
			type: 'IsForEstimate' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.estimate,
		},
		{
			type: 'IsForProcurement' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.procurement,
		},
		{
			type: 'IsForRM' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.rm,
		},
		{
			type: 'IsForLogistics' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.logistics,
		},
		{
			type: 'IsForModel' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.model,
		},
		{
			type: 'IsForSales' as keyof IMaterialTypeFilter,
			label: this.translations.materialTypeFilter.sales,
		},
	];

	/**
	 * overrider material by selected price list
	 * @param material
	 * @param priceList
	 */
	public overrideMaterialByPriceList(material: IMaterialSearchEntity, priceList: IMaterialSearchPriceList): Observable<void> {
		return new Observable((observer) => {
			const willCompleteObs = [];
			willCompleteObs.push(material.BasCurrencyFk !== priceList.CurrencyFk && priceList.CurrencyFk ? this.currencyLookupService.getItemByKey({ id: priceList.CurrencyFk }) : of(null));
			willCompleteObs.push(material.BasCo2SourceFk !== priceList.BasCo2SourceFk && priceList.BasCo2SourceFk ? this.co2SourceLookupService.getItemByKey({ id: priceList.BasCo2SourceFk }) : of(null));
			forkJoin(willCompleteObs).subscribe((e) => {
				const res = e as (CurrencyEntity | Co2SourceEntity | null)[];
				material.MaterialPriceListFk = priceList.Id <= 0 ? undefined : priceList.Id;
				material.Cost = priceList.Cost;
				material.PriceForShow = priceList.Cost;
				material.EstimatePrice = priceList.EstimatePrice;
				material.PriceReferenceForShow = priceList.EstimatePrice;
				material.PrcPriceconditionFk = priceList.PrcPriceConditionFk;
				material.LeadTime = priceList.LeadTime;
				material.MinQuantity = priceList.MinQuantity;
				material.Requirequantity = material.MinQuantity;
				material.SellUnit = priceList.SellUnit;
				material.PriceExtra = priceList.PriceExtras;
				material.MdcTaxCodeFk = priceList.TaxCodeFk;
				material.RetailPrice = priceList.RetailPrice;
				material.ListPrice = priceList.ListPrice;
				material.Discount = priceList.Discount;
				material.Charges = priceList.Charges;
				material.Co2Project = priceList.Co2Project;
				material.Co2Source = priceList.Co2Source;
				const currency = res[0] as CurrencyEntity | null;
				const co2Source = res[1] as Co2SourceEntity | null;
				if (material.BasCurrencyFk !== priceList.CurrencyFk) {
					material.BasCurrencyFk = priceList.CurrencyFk;
					if (isNil(material.BasCurrencyFk)) {
						material.Currency = '';
					} else if (currency) {
						material.Currency = currency.Currency;
					}
				}
				if (material.BasCo2SourceFk !== priceList.BasCo2SourceFk) {
					material.BasCo2SourceFk = priceList.BasCo2SourceFk;
					if (isNil(material.BasCo2SourceFk)) {
						material.BasCo2SourceName = '';
					} else if (co2Source) {
						material.BasCo2SourceFk = co2Source.Id;
						material.BasCo2SourceName = co2Source.DescriptionInfo.Translated;
					}
				}
				observer.next();
				observer.complete();
			});
		});
	}

	/**
	 * reset selectedItem
	 */
	public resetSelectedItem() {
		this.selectedItem = this.selectedItems.length ? this.selectedItems[0] : undefined;
	}

	/**
	 * update check all checkbox Status
	 * @private
	 */
	public updateCheckAllStatus(currenPageSelectAll: boolean | null = null) {
		if (!currenPageSelectAll && currenPageSelectAll !== null) {
			this.checkAllFromCurrentPage = false;
			this.checkAllFromResultSet = false;
		} else {
			if (currenPageSelectAll === true) {
				this.checkAllFromCurrentPage = true;
			} else if (this.response.items && this.response.items.length) {
				const currentPageSelected = this.response.items.filter((e) => e.selected);
				this.checkAllFromCurrentPage = currentPageSelected.length === this.response.items.length;
			}
			if (this.currentSearchResult && this.currentSearchResult.length && this.selectedItems && this.selectedItems.length) {
				const selectedItemsMap = keyBy(this.selectedItems, 'Id');
				const currentResultNotAllBeSelected = this.currentSearchResult.some((i) => {
					return !selectedItemsMap[i.Id];
				});
				this.checkAllFromResultSet = !currentResultNotAllBeSelected;
			}
		}
	}

	/**
	 * Handle after created new material similar
	 * @param newSimilar
	 * @param source
	 */
	public handleAfterCreatedSimilar(newSimilar: IMaterialSearchEntity, source: IMaterialSearchEntity) {
		if (newSimilar) {
			this.selectedItems.forEach((m) => {
				m.selected = false;
			});
			newSimilar.selected = true;
			this.selectedItem = newSimilar;
			this.selectedItems = [newSimilar];
			this.response.items = [source, newSimilar];
			this.checkAllFromCurrentPage = false;
			this.checkAllFromResultSet = false;
		}
	}
}
