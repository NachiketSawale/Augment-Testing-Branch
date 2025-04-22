/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import _ from 'lodash';
import { ICompareRowEntity } from '../model/entities/compare-row-entity.interface';
import {
	CompareTypes
} from '../model/enums/compare.types.enum';
import { CompareContainerUuids } from '../model/enums/compare-container-uuids.enum';
import { CompareConfigKeys } from '../model/enums/compare-config-keys.enum';
import { CompareFieldTypes } from '../model/enums/compare-field-types.enum';
import { ICompareCustomData } from '../model/entities/compare-custom-data.interface';
import { ICompareViewEntity } from '../model/entities/compare-view-entity.interface';
import { ProcurementPricecomparisonDescriptionTranslateService } from './description-translate.service';
import { BoqAllowEditVisibleFields } from '../model/constants/boq/boq-allow-edit-visible-fields';
import { CompareFields } from '../model/constants/compare-fields';
import { ISimpleCheckableRowEntity } from '../model/entities/simple-checkable-row-entity.interface';
import { ICompareBoqTypeSummary } from '../model/entities/boq/compare-boq-type-summary.interface';
import { ProcurementPricecomparisonUtilService } from './util.service';

@Injectable({
	providedIn: 'root'
})
export class ProcurementPricecomparisonConfigurationService {
	private readonly rowCache = new Map<string, ICompareRowEntity[]>;
	private readonly defaultRowCache = new Map<string, ICompareRowEntity[]>;
	private readonly settingCache = new Map<string, ICompareRowEntity[]>;

	private boqLineTypes: ISimpleCheckableRowEntity[] = [];
	private boqItemTypes: ISimpleCheckableRowEntity[] = [];
	private boqItemTypes2: ISimpleCheckableRowEntity[] = [];

	private readonly http = inject(PlatformHttpService);
	private readonly translateService = inject(ProcurementPricecomparisonDescriptionTranslateService);
	private readonly utilService = inject(ProcurementPricecomparisonUtilService);

	private getKey(configurationFk: number | null | undefined, compareType: CompareTypes, fieldType: CompareFieldTypes) {
		return (configurationFk || '') + '_' + compareType + '_' + fieldType;
	}

	private getGuid(compareType: CompareTypes) {
		return compareType === CompareTypes.Item ? CompareContainerUuids.Item : CompareContainerUuids.BoQ;
	}

	private getConfigKey(compareType: CompareTypes) {
		return compareType === CompareTypes.Item ? CompareConfigKeys.Item : CompareConfigKeys.BoQ;
	}

	private getFirstConfig(compareType: CompareTypes, fieldType: CompareFieldTypes) {
		let first: ICompareRowEntity[] = [];
		const matchValue = '_' + compareType + '_' + fieldType;

		this.rowCache.forEach((v, key) => {
			if (key.lastIndexOf(matchValue) > -1) {
				first = v;
			}
		});

		return first;
	}

	private getDefaultRows(configurationFk: number | null | undefined, compareType: CompareTypes, fieldType: CompareFieldTypes) {
		const key = this.getKey(configurationFk, compareType, fieldType);
		let defaultRows = this.defaultRowCache.get(key);
		if (defaultRows) {
			return defaultRows;
		}
		defaultRows = this.rowCache.get(key);
		if (!defaultRows) {
			defaultRows = this.getFirstConfig(compareType, fieldType);
		}
		if (defaultRows) {
			defaultRows.forEach(row => {
				if (row.DescriptionInfo) {
					row.DefaultDescription = row.DescriptionInfo.Description;
					row.DescriptionInfo.Description = '';
				} else {
					row.DefaultDescription = row.Field;
				}
			});
			defaultRows = _.cloneDeep(defaultRows);
		}
		this.defaultRowCache.set(key, defaultRows);
		return defaultRows;
	}

	private clearProps(items: Array<ICompareRowEntity[]> | ICompareRowEntity[], props: string[]) {
		items.forEach(item => {
			if (_.isNil(item)) {
				return;
			}
			if (_.isArray(item)) {
				this.clearProps(item, props);
			} else {
				props.forEach(prop => {
					// delete item[prop];
					_.set(item, prop, undefined);
				});
			}
		});
	}

	private clearPropsFromCustomData(customData: ICompareCustomData) {
		this.clearProps([
			customData.compareBillingSchemaRows,
			customData.compareQuoteRows,
			customData.compareRows
		], ['DescriptionInfo', 'DefaultDescription', '__rt$data']);
	}

	private getCustomDataFromView(guidId: string, itemKey: string): ICompareCustomData {
		// TODO-DRIZZLE: mainViewService.customData(guidId, itemKey);
		let customData = this.utilService.customData<ICompareCustomData>(guidId, itemKey);

		if (customData) {
			this.clearPropsFromCustomData(customData);
		} else {
			customData = {
				compareBillingSchemaRows: [],
				compareQuoteRows: [],
				compareRows: [],
				compareBaseColumns: []
			};
		}

		return customData;
	}

	private getCustomData(compareType: CompareTypes) {
		const guidId = this.getGuid(compareType);
		const itemKey = this.getConfigKey(compareType);
		return this.getCustomDataFromView(guidId, itemKey);
	}

	private async loadBoqLineTypes() {
		return await this.http.get<{ BoqLineType: ISimpleCheckableRowEntity[] }>('procurement/pricecomparison/print/getboqlinetypes').then(resp => {
			const roots = resp.BoqLineType.filter(r => r.Id === 103);
			const levels = resp.BoqLineType.filter(r => r.Id >= 1 && r.Id <= 9);
			return this.boqLineTypes = [...roots, ...levels];
		});
	}

	private async loadBoqItemTypes() {
		return await this.http.get<ISimpleCheckableRowEntity[]>('procurement/common/boqitemtype/list').then(resp => {
			return this.boqItemTypes = resp;
		});
	}

	private async loadBoqItemTypes2() {
		return await this.http.get<ISimpleCheckableRowEntity[]>('procurement/common/boqitemtype2/list').then(resp => {
			return this.boqItemTypes2 = resp;
		});
	}

	private async loadCompareRows() {
		const response = await this.http.post<Record<string, ICompareRowEntity[]>>('procurement/pricecomparison/comparerow/getdefaultrows', undefined);
		for (const key in response) {
			this.rowCache.set(key, response[key]);
		}
		return this.rowCache;
	}

	public async load() {
		return await Promise.all([
			this.loadCompareRows(),
			this.loadBoqLineTypes(),
			this.loadBoqItemTypes(),
			this.loadBoqItemTypes2()
		]);

	}

	public getBoqLineTypes() {
		return this.boqLineTypes;
	}

	public getBoqItemTypes() {
		return this.boqItemTypes;
	}

	public getBoqItemTypes2() {
		return this.boqItemTypes2;
	}


	public async saveCustomSettings2DB(configurationFk: number | null | undefined, compareType: CompareTypes, createData: Partial<ICompareViewEntity & ICompareCustomData & { gridColumns: object }>) {
		const guidId = this.getGuid(compareType);
		// const itemKey = this.getConfigKey(compareType);
		this.clearPropsFromCustomData(createData as ICompareCustomData);
		this.setViewConfig(guidId, createData.gridColumns);
		await this.http.post('procurement/pricecomparison/compareview/update', {
			rfqHeaderFk: createData.RfqHeaderFk,
			compareType: createData.CompareType,
			compareColumns: createData.CompareColumns,
			deletedColumns: createData.DeletedColumns
		});
		// TODO-DRIZZLE: To be checked.
		// mainViewService.customData(guidId, itemKey, {
		// 	compareBillingSchemaRows: createData.compareBillingSchemaRows,
		// 	compareQuoteRows: createData.compareQuoteRows,
		// 	compareRows: createData.compareRows,
		// 	compareBaseColumns: createData.compareBaseColumns,
		// 	compareTypeSummaryFields: commonService.typeSummary,
		// 	isVerticalCompareRows: createData.isVerticalCompareRows,
		// 	isLineValueColumn: createData.isLineValueColumn,
		// 	isFinalShowInTotal: createData.isFinalShowInTotal
		// });
		// Clear cache
		for (let i = 0, cacheTypes = [CompareFieldTypes.Default, CompareFieldTypes.Quote, CompareFieldTypes.BillingSchema]; i < cacheTypes.length; i++) {
			const cacheKey = this.getKey(configurationFk, compareType, cacheTypes[i]);
			this.settingCache.delete(cacheKey);
		}
		return createData;
	}

	private getTypeSummaryDefault(): ICompareBoqTypeSummary {
		return {
			checkedLineTypes: _.map(this.getBoqLineTypes(), function (item) {
				return item.Id;
			}),
			checkedBoqItemTypes: _.map(this.getBoqItemTypes(), function (item) {
				return item.Id;
			}),
			checkedBoqItemTypes2: _.map(this.getBoqItemTypes2(), function (item) {
				return item.Id;
			}),
			hideZeroValueLines: true,
			percentageLevels: false
		};
	}

	private applyCustomRowConfig(customRows: ICompareRowEntity[], currRow: ICompareRowEntity) {
		const customItem = customRows.find(r => r.Field === currRow.Field);
		const lockedProperties = {
			Id: currRow.Id,
			DefaultDescription: currRow.DefaultDescription
		};
		if (customItem) {
			_.extend(currRow, customItem, lockedProperties);
		}
	}

	public setViewConfig(gridId: string, gridColumns?: object) {
		// TODO-DRIZZLE: To be checked.
		// _.forEach(commonService.allConfigColumns, function (item) {
		// 	if (_.startsWith(item.id, 'QuoteCol_')) {
		// 		return;
		// 	}
		// 	let column = _.find(gridColumns, {id: item.id});
		// 	if (!column) {
		// 		item.hidden = false;
		// 		gridColumns.push(item);
		// 	}
		// });
		// let config = mainViewService.getViewConfig(gridId);
		// if (config && config.Propertyconfig) {
		// 	config = angular.isArray(config.Propertyconfig) ? config.Propertyconfig : JSON.parse(config.Propertyconfig);
		// }
		// if (config) {
		// 	let structure = _.find(config, {id: 'tree'});
		// 	if (structure) {
		// 		gridColumns.unshift(structure);
		// 	}
		// }
		// mainViewService.setViewConfig(gridId, gridColumns, null, true);
	}

	public getCustomSettingsCompareQuoteRows(configurationFk: number | null | undefined, compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		const defaultRows = this.getDefaultRows(configurationFk, compareType, CompareFieldTypes.Quote);
		const customRows = customData.compareQuoteRows || [];
		const mergeRows = defaultRows;
		const cacheKey = this.getKey(configurationFk, compareType, CompareFieldTypes.Quote);
		if (!this.settingCache.get(cacheKey)) {
			_.forEach(mergeRows, (item) => {
				this.applyCustomRowConfig(customRows, item);
				item.UserLabelName = !_.isUndefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
				item.FieldName = this.translateService.getQuoteDisplayText(item.Field, null, item.DefaultDescription);
				item.DisplayName = this.translateService.getQuoteDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
			});
			this.settingCache.set(cacheKey, _.orderBy(mergeRows, ['Sorting']));
		}
		return this.settingCache.get(cacheKey) as ICompareRowEntity[];
	}

	public getCustomSettingsCompareBillingSchemaRows(configurationFk: number | null | undefined, compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		const defaultRows = this.getDefaultRows(configurationFk, compareType, CompareFieldTypes.OldBillingSchema);
		const customRows = customData.compareBillingSchemaRows || [];
		const mergeRows = defaultRows;
		const maxSortingItem = customRows.length > 0 ? _.maxBy(customRows, function (o) {
			return o.Sorting;
		}) : null;
		const cacheKey = this.getKey(configurationFk, compareType, CompareFieldTypes.OldBillingSchema);
		let maxSorting = maxSortingItem ? (maxSortingItem.Sorting || 0) : 0;
		if (!this.settingCache.get(cacheKey)) {
			_.forEach(mergeRows, (item) => {
				const customItem = customRows.find(r => r.Id === item.Id);
				const lockedProperties = {
					DefaultDescription: item.DefaultDescription,
					Field: item.Field
				};
				if (customItem) {
					_.extend(item, customItem, lockedProperties);
				} else {
					item.Sorting = ++maxSorting;
				}
				item.UserLabelName = !_.isUndefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
				item.FieldName = item.DescriptionInfo && item.DescriptionInfo.Translated ? item.DescriptionInfo.Translated : item.DefaultDescription;
				item.DisplayName = this.translateService.getBillingSchemaDisplayText(item.Field, item.UserLabelName, item.FieldName);
			});
			this.settingCache.set(cacheKey, _.orderBy(mergeRows, ['Sorting']));
		}
		return this.settingCache.get(cacheKey) as ICompareRowEntity[];
	}

	public getCustomSettingsCompareRows(configurationFk: number | null | undefined, compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		const defaultRows = this.getDefaultRows(configurationFk, compareType, CompareFieldTypes.Default);
		const customRows = customData.compareRows || [];
		const mergeRows = defaultRows;
		const cacheKey = this.getKey(configurationFk, compareType, CompareFieldTypes.Default);
		if (!this.settingCache.get(cacheKey)) {
			_.forEach(mergeRows, (item) => {
				if (_.includes(BoqAllowEditVisibleFields, item.Field) && CompareTypes
					.BoQ === compareType && item.Field !== CompareFields.quantity) {
					item.AllowEdit = true;
				}
				this.applyCustomRowConfig(customRows, item);
				item.UserLabelName = !_.isUndefined(item.UserLabelName) ? item.UserLabelName : (item.DescriptionInfo ? item.DescriptionInfo.Description : '');
				if (compareType === CompareTypes
					.Item) {
					item.FieldName = this.translateService.getItemDisplayText(item.Field, null, item.DefaultDescription);
					item.DisplayName = this.translateService.getItemDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
				} else {
					item.FieldName = this.translateService.getBoqDisplayText(item.Field, null, item.DefaultDescription);
					item.DisplayName = this.translateService.getBoqDisplayText(item.Field, item.UserLabelName, item.DefaultDescription);
				}
			});
			this.settingCache.set(cacheKey, _.orderBy(mergeRows, ['Sorting']));
		}
		return this.settingCache.get(cacheKey) as ICompareRowEntity[];
	}

	public getCustomSettingsCompareColumns(compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		const columns = customData.compareBaseColumns;
		_.forEach(columns, col => {
			if (_.isUndefined(col.IsCountInTarget)) {
				col.IsCountInTarget = col.Id.toString() === '-1';
			}
		});
		return columns;
	}

	public getBoqTypeSummary(compareType: CompareTypes): ICompareBoqTypeSummary {
		const defaultConfig = this.getTypeSummaryDefault();
		const customData = this.getCustomData(compareType);
		return {
			...defaultConfig,
			...customData.compareTypeSummaryFields ?? {}
		};
	}

	public isVerticalCompareRows(compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		return customData && customData.isVerticalCompareRows !== undefined ? customData.isVerticalCompareRows : false;
	}

	public isLineValueColumnVisible(compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		return customData && customData.isLineValueColumn !== undefined ? customData.isLineValueColumn : true;
	}

	public isFinalShowInTotal(compareType: CompareTypes) {
		const customData = this.getCustomData(compareType);
		return customData && customData.isFinalShowInTotal !== undefined ? customData.isFinalShowInTotal : true;
	}

	public clearCache() {
		this.settingCache.clear();
	}
}