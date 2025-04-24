/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ComparePrintConstants } from '../../constants/print/compare-print-constats';
import { IComparePrintGenericProfile, IComparePrintBidder, IComparePrintColumn, IComparePrintRow } from './compare-print-generic-profile.interface';
import { ICustomCompareColumnEntity } from '../custom-compare-column-entity.interface';
import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICompareTreeResponseBase } from '../compare-tree-response-base.interface';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../../services/compare-data-base.service';
import { CompareGridColumn } from '../compare-grid-column.interface';
import { IComparePrintProfileEntity } from './compare-print-profile-entity.interface';
import { IComparePrintProfileComplete } from './compare-print-profile-complete.interface';
import { IComparePrintBoqProfile } from './compare-print-boq-profile.interface';
import { IComparePrintItemProfile } from './compare-print-item-profile.interface';
import { ProcurementPricecomparisonUtilService } from '../../../services/util.service';
import { IComparePrintRfqProfile } from './compare-print-rfq-profile.interface';
import { CompareProfileSaveLocations } from '../../enums/compare-profile-save-locations.enum';
import { CompareProfileTypes } from '../../enums/compare-profile-types.enum';
import { IComparePrintBase } from './compare-print-base.interface';

export abstract class ComparePrintProfileServiceBase<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>,
> {
	protected readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);
	protected readonly utilSvc = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);

	private genericProfileCache: {
		items: IComparePrintProfileEntity[];
	} = {
		items: []
	};

	protected rfqProfileCache = {
		items: new Map<number, IComparePrintProfileEntity[]>(),
		boqs: new Map<number, IComparePrintProfileEntity[]>()
	};

	protected profileDefinitions: IComparePrintProfileComplete = {
		generic: {
			bidder: {
				boq: [],
				item: []
			},
			pageLayout: {
				paperSize: ComparePrintConstants.paperSize.A4,
				orientation: ComparePrintConstants.orientation.portrait
			},
			report: {
				coverSheetCheck: true,
				coverSheetTemplateId: -1,
				bidderNameTemplate: ComparePrintConstants.bidderNameTemplate,
				bidderNameCheck: true,
				bidderPageSizeCheck: false,
				bidderPageSize: 5,
				header: {
					leftTemplate: '',
					middleTemplate: '',
					rightTemplate: '',
					leftPicture: '',
					middlePicture: '',
					rightPicture: ''
				},
				footer: {
					leftTemplate: '',
					middleTemplate: '',
					rightTemplate: '',
					leftPicture: '',
					middlePicture: '',
					rightPicture: ''
				},
				shortenOutlineSpecCheck: false,
				shortenOutlineSpecValue: 0
			},
			column: {
				boq: {
					printColumns: []
				},
				item: {
					printColumns: []
				}
			},
			row: {
				boq: {
					billingSchemaFields: [],
					isVerticalCompareRows: false,
					isLineValueColumn: true,
					isFinalShowInTotal: false,
					isCalculateAsPerAdjustedQuantity: false,
					itemFields: [],
					quoteFields: []
				},
				item: {
					billingSchemaFields: [],
					isVerticalCompareRows: false,
					isLineValueColumn: true,
					isFinalShowInTotal: false,
					itemFields: [],
					quoteFields: []
				}
			},
			boq: {
				checkedBoqItemTypes: [],
				checkedBoqItemTypes2: [],
				checkedLineTypes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 103],
				hideZeroValueLines: true,
				percentageLevels: false
			},
			item: {
				checkedItemTypes: [],
				checkedItemTypes2: []
			},
			// header: {
			// 	leftTemplate: '',
			// 	middleTemplate: '',
			// 	rightTemplate: '',
			// 	leftPicture: '',
			// 	middlePicture: '',
			// 	rightPicture: ''
			// },
			// footer: {
			// 	leftTemplate: '',
			// 	middleTemplate: '',
			// 	rightTemplate: '',
			// 	leftPicture: '',
			// 	middlePicture: '',
			// 	rightPicture: ''
			// }
		},
		boq: {
			bidder: {
				quotes: []
			},
			boq: {
				checkedBoqRanges: []
			},
			analysis: {
				filterBasis: {
					selectedValue: -12
				},
				criteria: {
					selectedValue: '1',
					totalPercent: 0,
					singlePercent: 0,
					amount: 0
				}
			}
		},
		item: {
			bidder: {
				quotes: []
			}
		}
	};

	protected profiles: IComparePrintProfileEntity[] = [];

	protected constructor(private dataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>) {

	}

	private async getProfiles(url: string): Promise<IComparePrintProfileEntity[]> {
		const profiles = await this.httpService.get<IComparePrintProfileEntity[]>(url);
		profiles.forEach((p) => {
			if (p.Description) {
				p.DisplayText = p.Description;
			} else {
				p.DisplayText = this.utilSvc.getTranslationText('procurement.pricecomparison.printing.latestProfile');
			}
			if (p.IsDefault) {
				const type = this.utilSvc.getTranslationText(p.IsSystem ? 'basics.common.configLocation.system' : 'basics.common.configLocation.role');
				p.DisplayText += ' (' + type + ' ' + this.utilSvc.getTranslationText('procurement.pricecomparison.printing.default') + ')';
			}
		});
		return this.profiles = profiles;
	}

	public getProfileDefinitions() {
		return _.cloneDeep(this.profileDefinitions);
	}

	public clearCache() {
		this.genericProfileCache.items = [];
		this.rfqProfileCache.items.clear();
		this.rfqProfileCache.boqs.clear();
	}

	public async getGenericProfiles(reload: boolean = false): Promise<IComparePrintProfileEntity[]> {
		if (reload || !this.genericProfileCache.items.length) {
			const profiles = await this.getProfiles('procurement/pricecomparison/print/getgenericprofile');
			const currentViewObj = this.currentView(ComparePrintConstants.currentView.generic, CompareProfileTypes.generic);
			profiles.push(currentViewObj);
			const latestItem = _.find(this.genericProfileCache.items, {Description: null});
			if (latestItem) {
				const currLatest = _.find(profiles, {Id: latestItem.Id});
				if (currLatest) {
					currLatest.PropertyConfig = _.cloneDeep(latestItem.PropertyConfig);
				} else {
					profiles.push(_.cloneDeep(latestItem));
				}
			}
			this.genericProfileCache.items = profiles;
			_.each(this.genericProfileCache.items, (item) => {
				if (item.PropertyConfig) {
					const propertyConfig = _.isString(item.PropertyConfig) ? JSON.parse(item.PropertyConfig) as IComparePrintGenericProfile : item.PropertyConfig as IComparePrintGenericProfile;
					if (propertyConfig.row && propertyConfig.row.boq) {
						this.utilSvc.assignPercentDeviation(propertyConfig.row.boq.itemFields);
					}
					if (propertyConfig.row && propertyConfig.row.item) {
						this.utilSvc.assignPercentDeviation(propertyConfig.row.item.itemFields);
					}
					this.utilSvc.propCompletion(propertyConfig, this.profileDefinitions.generic);
					item.PropertyConfig = propertyConfig;
				}
			});
			return this.genericProfileCache.items;
		}
		return Promise.resolve(this.genericProfileCache.items);
	}

	public async getRfqProfiles(rfqHeaderId: number, reload?: boolean): Promise<IComparePrintProfileEntity[]> {
		const profileMap = this.getRfqProfileCacheMap();
		const profileType = this.getProfileType();
		if (reload || !profileMap.has(rfqHeaderId)) {
			const profiles = await this.getProfiles('procurement/pricecomparison/print/getrfqprofile?rfqid=' + rfqHeaderId + '&proftype=' + profileType);
			const currentViewObj = this.currentView(ComparePrintConstants.currentView.rfq, profileType);
			profiles.push(currentViewObj);
			const latestItem = _.find(profileMap.get(rfqHeaderId), {Description: null});
			if (latestItem) {
				const currLatest = _.find(profiles, {Id: latestItem.Id});
				if (currLatest) {
					currLatest.PropertyConfig = _.cloneDeep(latestItem.PropertyConfig);
				} else {
					profiles.push(_.cloneDeep(latestItem));
				}
			}
			profileMap.set(rfqHeaderId, profiles);
			_.each(profileMap.get(rfqHeaderId), (item) => {
				if (item.PropertyConfig) {
					item.PropertyConfig = _.isString(item.PropertyConfig) ? JSON.parse(item.PropertyConfig) as IComparePrintRfqProfile : item.PropertyConfig as IComparePrintRfqProfile;
					this.utilSvc.propCompletion(item.PropertyConfig, profileType === CompareProfileTypes.boq ? this.profileDefinitions.boq : this.profileDefinitions.item);
				}
			});
			return profileMap.get(rfqHeaderId) as IComparePrintProfileEntity[];
		}
		return Promise.resolve(profileMap.get(rfqHeaderId) as IComparePrintProfileEntity[]);
	}

	/*private getCorrectPropertyConfig(item) {
		if (!item.PropertyConfig) {
			return item;
		}
		return this.getCorrectPropertyConfig(item.PropertyConfig);
	}
*/

	public currentView(id: number, profileType: CompareProfileTypes): IComparePrintProfileEntity {
		return {
			Id: id,
			IsCurrentView: true,
			IsDefault: false,
			IsSystem: false,
			ProfileType: profileType,
			Description: this.utilSvc.getTranslationText('procurement.pricecomparison.printing.currentViewProfile'),
			PropertyConfig: '',
			DisplayText: this.utilSvc.getTranslationText('procurement.pricecomparison.printing.currentViewProfile')
		};
	}

	/*private setLatestGeneric(genericProfile, current) {
		if (!!this.genericProfileCache.items.length) {
			const user = _.find(genericProfile.options.items, function (item) {
				return !item.Description;
			});

			// var defer = $q.defer(), profiles = [];
			const currentSetting = current && current.PropertyConfig;
			if (currentSetting) {
				const profile = {
					Id: -10,
					DisplayText: this.translateService.instant('procurement.pricecomparison.printing.latestProfile').text,
					Description: null,
					ProfileType: ComparePrintConstants.profileType.generic,
					PropertyConfig: JSON.stringify(_.cloneDeep(currentSetting))
				};
				if (!user) {
					// profiles.push(profile);
					genericProfile.options.items.push(profile);
					genericProfile.selectedValue = profile.Id;
				} else {
					user.PropertyConfig = JSON.stringify(_.cloneDeep(currentSetting));
					genericProfile.selectedValue = user.Id;
				}
				const cacheUser = _.find(this.genericProfileCache.items, function (item) {
					return !item.Description;
				});
				if (!cacheUser) {
					this.genericProfileCache.items.push(profile);
				} else {
					cacheUser.PropertyConfig = JSON.stringify(_.cloneDeep(currentSetting));
				}
			}
		}
	}

	private setLatestRfqProfile(rfqProfile, printType, rfqHeaderId, current) {
		const userItem = _.find(rfqProfile.options.items, function (item) {
			return !item.Description;
		});
		if (printType === ComparePrintConstants.printType.item) {
			const currentItem = current && current[rfqHeaderId] && current[rfqHeaderId].item;
			setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentItem, this.rfqProfileCache.items);

		} else {
			const currentBoq = current && current[rfqHeaderId] && current[rfqHeaderId].boq;
			setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentBoq, this.rfqProfileCache.boqs);
		}
	}

	private setLatestRfq(rfqHeaderId, rfqProfile, userItem, currentItem, cacheItem) {
		// current from this.rfqProfileCache.current
		if (currentItem && currentItem.PropertyConfig) {
			const profileItem = {
				Id: -11,
				DisplayText: this.translateService.instant('procurement.pricecomparison.printing.latestProfile').text,
				RfqHeaderFk: rfqHeaderId,
				Description: null,
				ProfileType: ComparePrintConstants.profileType.item,
				PropertyConfig: JSON.stringify(_.cloneDeep(currentItem.PropertyConfig))
			};
			if (!userItem) {
				// rfqProfile: from scope.setting
				rfqProfile.options.items.push(profileItem);
				rfqProfile.selectedValue = profileItem.Id;
			} else {
				userItem.PropertyConfig = JSON.stringify(_.cloneDeep(currentItem.PropertyConfig));
				rfqProfile.selectedValue = userItem.Id;
			}
			// get item cache: this.rfqProfileCache.items, boqs
			const cacheItemUser = _.find(cacheItem[rfqHeaderId], function (item) {
				return !item.Description;
			});
			if (!cacheItemUser) {
				cacheItem[rfqHeaderId].push(profileItem);
			} else {
				cacheItemUser.PropertyConfig = JSON.stringify(_.cloneDeep(currentItem.PropertyConfig));
			}
		}
	}

	private getRowConfig(configurationFk, compareType, fieldType) {

		if (fieldType === 'quote') {
			return configurationService.getCustomSettingsCompareQuoteRows(configurationFk, compareType);
		}
		if (fieldType === 'billingSchema') {
			return configurationService.getCustomSettingsCompareBillingSchemaRows(configurationFk, compareType);
		}
		if (fieldType === 'item') {
			return configurationService.getCustomSettingsCompareRows(configurationFk, compareType);
		}
		return null;
	}*/

	public abstract getRfqProfileCacheMap(): Map<number, IComparePrintProfileEntity[]>;

	public abstract getProfileType(): CompareProfileTypes;

	public abstract toRfqProfile(setting: IComparePrintBase<T>, rfq?: IComparePrintRfqProfile): IComparePrintRfqProfile;

	public abstract toRfqSetting(rfq: IComparePrintRfqProfile, setting: IComparePrintBase<T>): IComparePrintBase<T>;

	public abstract toGenericProfile(setting: IComparePrintBase<T>, generic?: IComparePrintGenericProfile): IComparePrintGenericProfile ;

	public abstract toGenericSetting(generic: IComparePrintGenericProfile, setting: IComparePrintBase<T>): IComparePrintBase<T>;

	protected abstract processDefaultColumn(column: IComparePrintColumn, visibleColumns: CompareGridColumn<T>[]): IComparePrintColumn;

	protected abstract processRow(row: IComparePrintRow): IComparePrintRow;

	public getDefaultColumnsSetting(): IComparePrintColumn {
		const configColumns = this.dataSvc.columnBuilder.getGridLayoutColumns();
		const visibleColumns = _.filter(configColumns, ['hidden', true]);
		return this.processDefaultColumn({
			boq: {
				printColumns: []
			},
			item: {
				printColumns: []
			}
		}, visibleColumns);
	}

	public getAllRowConfig() {
		return this.processRow({
			boq: {
				billingSchemaFields: [],
				itemFields: [],
				quoteFields: [],
				isCalculateAsPerAdjustedQuantity: false,
				isFinalShowInTotal: false,
				isLineValueColumn: true,
				isVerticalCompareRows: false
			},
			item: {
				billingSchemaFields: [],
				itemFields: [],
				quoteFields: [],
				isFinalShowInTotal: false,
				isLineValueColumn: false,
				isVerticalCompareRows: false
			}
		});
	}

	/*private getPrintContainerGuid(printType) {
		return printType === ComparePrintConstants.printType.boq ? '8b9a53f0a1144c03b8447a99f7b38448' : 'ef496d027ad34b1f8fe282b1d6692ded';
	}

	private getAvailableColumns(printType, configItems) {
		const gridId = this.getPrintContainerGuid(printType);
		const grid = platformGridAPI.grids.element('id', gridId);
		const columnList = grid ? _.cloneDeep(grid.columns.current) : [];
		const bidderColumn = {};
		bidderColumn.id = ComparePrintConstants.bidderFieldName;
		bidderColumn.name = this.translateService.instant('procurement.pricecomparison.printing.bidder').text;
		bidderColumn.width = 200;
		columnList.push(bidderColumn);
		const availableColumns = [];
		_.forEach(columnList, function (item) {
			if (item.id !== 'tree' && item.id !== 'indicator' && !_.startsWith(item.id, commonService.constant.prefix2) && !_.find(configItems, {id: item.id})) {
				const column = {};
				column.id = item.id;
				column.field = item.name;
				column.hidden = true;
				column.width = item.width;
				// column.userLabelName = '';
				availableColumns.push(column);
			}
		});
		return availableColumns;
	}

	private getVisibleColumns(printType, configItems) {
		const gridId = this.getPrintContainerGuid(printType);
		const grid = platformGridAPI.grids.element('id', gridId);
		const columnList = grid ? _.cloneDeep(grid.columns.current) : [];
		const visibleColumns = [];

		_.forEach(configItems, (item) => {
			// set the default value
			item.isOverSize = false;
			item.fieldLeft = null;
			// filter the item witch no in base
			const findInBase = _.find(columnList, {id: item.id});
			if (findInBase || item.id === ComparePrintConstants.bidderFieldName) {
				if (!_.isNumber(item.width) || _.isNaN(item.width)) {
					item.width = 0;
				}
				item.field = findInBase ? findInBase.name : item.field;
				visibleColumns.push(item);
			}
			if (item.id === ComparePrintConstants.bidderFieldName) {
				item.name = this.translateService.instant('procurement.pricecomparison.printing.bidder').text;
				item.field = item.name;
			}
		});
		return visibleColumns;
	}*/

	public abstract processInitialGenericProfile(profile: IComparePrintGenericProfile, baseBidder: IComparePrintBidder): IComparePrintGenericProfile;

	public async getInitialGenericProfile(profile?: IComparePrintGenericProfile): Promise<IComparePrintGenericProfile> {
		if (!profile) {
			profile = _.cloneDeep(this.profileDefinitions.generic);
		} else {
			profile = _.cloneDeep(profile);
		}

		const response = await Promise.all([this.getBaseBidders(), this.getGenericProfiles()]);
		const baseBidder = response[0];
		const genericItems = response[1];
		const latestItem = _.find(genericItems, {Description: null});
		if (latestItem && latestItem.PropertyConfig && _.isString(latestItem.PropertyConfig)) {
			const latestItemJson = JSON.parse(latestItem.PropertyConfig) as IComparePrintGenericProfile;
			if (latestItemJson) {
				profile.report = latestItemJson.report;
			}
		}
		return this.processInitialGenericProfile(profile, baseBidder);
	}

	private async getBaseBidders(): Promise<IComparePrintBidder> {
		const res = await this.httpService.get<{ Item: ICustomCompareColumnEntity[]; Boq: ICustomCompareColumnEntity[]; }>('procurement/pricecomparison/print/getbasecomparecolumns');
		return {
			item: res.Item,
			boq: res.Boq
		};
	}

	public abstract provideInitialRfqProfile(complete: IComparePrintProfileComplete): Promise<IComparePrintBoqProfile | IComparePrintItemProfile>;

	public abstract getBidders(): Promise<ICustomCompareColumnEntity[]>;

	public async getInitialRfqProfile(profile?: IComparePrintRfqProfile): Promise<IComparePrintRfqProfile> {
		const quotes = await this.getBidders();
		if (!profile) {
			profile = _.cloneDeep(await this.provideInitialRfqProfile(this.profileDefinitions));
		} else {
			profile = _.cloneDeep(profile);
		}
		return _.extend(profile, {
			bidder: {
				quotes: quotes
			}
		});
	}

	public async saveProfile(location: CompareProfileSaveLocations, profiles: IComparePrintProfileEntity[]): Promise<IComparePrintProfileEntity[]> {
		profiles.forEach(profile => {
			if (profile.PropertyConfig && !_.isString(profile.PropertyConfig)) {
				profile.PropertyConfig = JSON.stringify(profile.PropertyConfig);
			}
		});
		const results = await this.httpService.post<IComparePrintProfileEntity[]>('procurement/pricecomparison/print/saveprofile?saveType=' + location, profiles);
		results.forEach(r => {
			const target = this.profiles.find(e => e.Id === r.Id);
			if (target) {
				Object.assign(target, r);
			} else {
				this.profiles.push(r);
			}
		});
		return results;
	}

	public async deleteProfile(id: number): Promise<boolean> {
		const r = await this.httpService.post<boolean>('procurement/pricecomparison/print/deleteprofile?id=' + id, null);
		const targetIdx = this.profiles.findIndex(e => e.Id === id);
		if (targetIdx !== -1) {
			this.profiles.splice(targetIdx, 1);
		}
		return r;
	}

	public async setDefault(id: number, location: CompareProfileSaveLocations): Promise<boolean> {
		const r = await this.httpService.post<boolean>('procurement/pricecomparison/print/setdefault', {
			Id: id,
			SaveType: location
		});
		if (r) {
			const target = this.profiles.find(e => e.Id === id);
			if (target) {
				this.profiles.forEach(e_1 => {
					e_1.IsDefault = e_1 === target;
				});
			}
		}
		return r;
	}

	/*
	// set the percent Deviation fields the same as the discountAbsolute
	private setPercentDeviation(compareRows: ICompareRowEntity[]) {
		const percentage = _.find(compareRows, {Field: CompareFields.percentage});
		const discountAbsolute = _.find(compareRows, {Field: CompareFields.absoluteDifference});
		if (percentage && discountAbsolute) {
			percentage.DeviationField = discountAbsolute.DeviationField;
			percentage.DeviationPercent = discountAbsolute.DeviationPercent;
			percentage.DeviationReference = discountAbsolute.DeviationReference;
		}
	}*/
}