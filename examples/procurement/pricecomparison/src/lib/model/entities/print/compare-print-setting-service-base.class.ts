/*
 * Copyright(c) RIB Software GmbH
 */

import _ from 'lodash';
import { ContextService, PlatformHttpService, PlatformTranslateService, ServiceLocator } from '@libs/platform/common';
import { ComparePrintConstants } from '../../constants/print/compare-print-constats';
import { ComparePrintProfileServiceBase } from './compare-print-profile-service-base.class';
import { IComparePrintGenericProfile } from './compare-print-generic-profile.interface';
import { ICompositeBaseEntity } from '../composite-base-entity.interface';
import { ICompareTreeResponseBase } from '../compare-tree-response-base.interface';
import { IComparePrintProfileEntity } from './compare-print-profile-entity.interface';
import { ProcurementPricecomparisonCompareDataBaseService } from '../../../services/compare-data-base.service';
import { IComparePrintRfqProfile } from './compare-print-rfq-profile.interface';
import { CompareProfileSaveLocations } from '../../enums/compare-profile-save-locations.enum';
import { IComparePrintBase } from './compare-print-base.interface';
import { ProcurementPricecomparisonUtilService } from '../../../services/util.service';
import { CompareProfileTypes } from '../../enums/compare-profile-types.enum';

export abstract class ComparePrintSettingServiceBase<
	T extends ICompositeBaseEntity<T>,
	RT extends ICompareTreeResponseBase<T>,
> {
	protected readonly contextService = ServiceLocator.injector.get(ContextService);
	protected readonly translateService = ServiceLocator.injector.get(PlatformTranslateService);
	protected readonly httpService = ServiceLocator.injector.get(PlatformHttpService);
	protected readonly utilService = ServiceLocator.injector.get(ProcurementPricecomparisonUtilService);

	protected genericProfileCache: {
		user: IComparePrintProfileEntity | null,
		current: IComparePrintProfileEntity | null
	} = {
		user: null,
		current: null
	};
	protected rfqProfileCache = {
		user: new Map<number, { boq: IComparePrintProfileEntity | null, item: IComparePrintProfileEntity | null }>(),
		current: new Map<number, { boq: IComparePrintProfileEntity | null, item: IComparePrintProfileEntity | null }>(),
	};
	private currentPrintType = null;
	private isForceLoadFromBase = false;
	// TODO-DRIZZLE: To be checked.
	// private onCurrentSettingChanged = new PlatformMessenger();
	// private onCollectSetting = new PlatformMessenger();
	// private onTabStateChange = new PlatformMessenger();
	private loadModeValue = ComparePrintConstants.loadMode.default;

	protected constructor(
		private profileService: ComparePrintProfileServiceBase<T, RT>,
		private dataSvc: ProcurementPricecomparisonCompareDataBaseService<T, RT>
	) {
	}

	private getCurrentProfileItem(items: IComparePrintProfileEntity[], extendData: Partial<IComparePrintProfileEntity>) {
		let userProfile = this.getDefaultProfileItem(items, extendData);
		if (userProfile.Description) {
			userProfile = _.extend(userProfile, {
				IsDefault: false,
				Version: 0,
				Id: 0,
				Description: null
			});
		}
		if (userProfile.PropertyConfig && _.isString(userProfile.PropertyConfig)) {
			userProfile.PropertyConfig = JSON.parse(userProfile.PropertyConfig);
		}
		return userProfile;
	}

	// TODO-DRIZZLE: To be checked.
	// private getCurrentPrintType() {
	// 	return currentPrintType;
	// }
	//
	// private setCurrentPrintType(printType) {
	// 	currentPrintType = printType;
	// }

	private mergeWithDefaultConfig(userConfig: IComparePrintGenericProfile) {
		const defaultConfig = this.profileService.getProfileDefinitions();

		if (userConfig.boq && _.isUndefined(userConfig.boq.hideZeroValueLines)) {
			userConfig.boq.hideZeroValueLines = defaultConfig.generic.boq.hideZeroValueLines;
		}

		return userConfig;
	}

	private processGenericProfile(profile: IComparePrintGenericProfile): IComparePrintGenericProfile {
		const compareRows = this.dataSvc.getCompareRows();
		const quoteRows = this.dataSvc.getCompareQuoteRows();
		const billingSchemaRows = this.dataSvc.getCompareBillingSchemaRows();

		if (profile.row.boq) {
			if (profile.row.boq.itemFields && profile.row.boq.itemFields.length) {
				this.utilService.mergeCompareRows(compareRows, profile.row.boq.itemFields);
			}
			if (profile.row.boq.quoteFields && profile.row.boq.quoteFields.length) {
				this.utilService.mergeCompareRows(quoteRows, profile.row.boq.quoteFields);
			}
			if (profile.row.boq.billingSchemaFields && profile.row.boq.billingSchemaFields.length) {
				this.utilService.mergeCompareRows(billingSchemaRows, profile.row.boq.billingSchemaFields);
			}
		}

		if (profile.row.item) {
			if (profile.row.item.itemFields && profile.row.item.itemFields.length) {
				this.utilService.mergeCompareRows(compareRows, profile.row.item.itemFields);
			}
			if (profile.row.item.quoteFields && profile.row.item.quoteFields.length) {
				this.utilService.mergeCompareRows(quoteRows, profile.row.item.quoteFields);
			}
			if (profile.row.item.billingSchemaFields && profile.row.item.billingSchemaFields.length) {
				this.utilService.mergeCompareRows(billingSchemaRows, profile.row.item.billingSchemaFields);
			}
		}
		return profile;
	}

	public async getCurrentGenericSetting(isFromInitial?: boolean, reload?: boolean): Promise<IComparePrintGenericProfile> {
		if (this.loadModeValue === ComparePrintConstants.loadMode.current && (isFromInitial || !this.genericProfileCache.current)) {
			const setting = await this.profileService.getInitialGenericProfile();
			this.genericProfileCache.current = _.cloneDeep(this.profileService.currentView(ComparePrintConstants.currentView.generic, CompareProfileTypes.generic));
			this.genericProfileCache.current.PropertyConfig = _.cloneDeep(setting);
			return this.processGenericProfile(this.genericProfileCache.current.PropertyConfig as IComparePrintGenericProfile);
		} else if ((isFromInitial && this.loadModeValue === ComparePrintConstants.loadMode.default) || !this.genericProfileCache.current || this.isForceLoadFromBase) {
			const items = await this.profileService.getGenericProfiles(reload);
			this.genericProfileCache.user = this.getCurrentProfileItem(items, {
				ProfileType: CompareProfileTypes.generic
			});
			if (!this.isForceLoadFromBase) {
				this.genericProfileCache.current = _.cloneDeep(this.genericProfileCache.user);
			}
			const genericCurrent = this.genericProfileCache.current as IComparePrintProfileEntity;
			if (!this.genericProfileCache.user.PropertyConfig || this.isForceLoadFromBase) {
				return this.profileService.getInitialGenericProfile().then((setting_1) => {
					if (!this.isForceLoadFromBase && this.genericProfileCache.user) {
						this.genericProfileCache.user.PropertyConfig = _.cloneDeep(setting_1);
					}
					if (!this.isForceLoadFromBase) {
						genericCurrent.PropertyConfig = _.cloneDeep(setting_1);
					} else {
						genericCurrent.PropertyConfig = _.mergeWith(genericCurrent.PropertyConfig, {
							column: _.cloneDeep(setting_1.column),
							row: _.cloneDeep(setting_1.row),
							bidder: _.cloneDeep(setting_1.bidder),
							report: _.cloneDeep(setting_1.report)
						});
					}
					const mergeDefault = this.mergeWithDefaultConfig(genericCurrent.PropertyConfig as IComparePrintGenericProfile);
					return this.processGenericProfile(mergeDefault);
				});
			} else {
				const config = genericCurrent.PropertyConfig as IComparePrintGenericProfile;
				if (config && !config.row) {
					config.row = this.profileService.getAllRowConfig();
				}
			}
			const mergeDefault = this.mergeWithDefaultConfig(genericCurrent.PropertyConfig as IComparePrintGenericProfile);
			return this.processGenericProfile(mergeDefault);
		} else {
			const genericCurrent = this.genericProfileCache.current as IComparePrintProfileEntity;
			const config = genericCurrent.PropertyConfig as IComparePrintGenericProfile;
			if (config && !config.row) {
				config.row = this.profileService.getAllRowConfig();
			}

			if (config && !config.column) {
				config.column = this.profileService.getDefaultColumnsSetting();
			}
		}
		const genericCurrent = this.genericProfileCache.current as IComparePrintProfileEntity;
		const mergeDefault = this.mergeWithDefaultConfig(genericCurrent.PropertyConfig as IComparePrintGenericProfile);
		return Promise.resolve(this.processGenericProfile(mergeDefault));
	}

	public abstract getProfileType(): CompareProfileTypes;

	protected abstract getCurrentRfqProfileCache(rfqHeaderId: number): IComparePrintProfileEntity | null;

	protected abstract syncCurrentGenericSetting(generic: IComparePrintGenericProfile, settings: IComparePrintBase<T>): void;

	protected abstract syncCurrentRfqSetting(rfq: IComparePrintRfqProfile, settings: IComparePrintBase<T>): void;

	public async getCurrentRfqSetting(isFromInitial?: boolean, reload?: boolean): Promise<IComparePrintRfqProfile> {
		const rfqHeaderId = this.dataSvc.parentService.getSelectedEntity()?.Id ?? -1;
		const profileType = this.getProfileType();
		let userCache = this.rfqProfileCache.current.get(rfqHeaderId);
		let currentCache = this.rfqProfileCache.current.get(rfqHeaderId);
		if (!userCache) {
			userCache = {
				boq: null,
				item: null
			};
			this.rfqProfileCache.user.set(rfqHeaderId, userCache);
		}
		if (!currentCache) {
			currentCache = {
				boq: null,
				item: null
			};
			this.rfqProfileCache.current.set(rfqHeaderId, currentCache);
		}
		let currentItem = profileType === CompareProfileTypes.boq ? currentCache.boq : currentCache.item;
		if (this.loadModeValue === ComparePrintConstants.loadMode.current && (isFromInitial || !currentItem)) {
			const setting = await this.profileService.getInitialRfqProfile();
			currentItem = _.cloneDeep(this.profileService.currentView(ComparePrintConstants.currentView.rfq, profileType));
			if (currentCache) {
				if (profileType === CompareProfileTypes.boq) {
					currentCache.boq = currentItem = _.cloneDeep(this.profileService.currentView(ComparePrintConstants.currentView.rfq, profileType));
				} else {
					currentCache.item = currentItem = _.cloneDeep(this.profileService.currentView(ComparePrintConstants.currentView.rfq, profileType));
				}
			}
			currentItem.PropertyConfig = _.cloneDeep(setting);
			return currentItem.PropertyConfig as IComparePrintRfqProfile;
		} else if ((isFromInitial && this.loadModeValue === ComparePrintConstants.loadMode.default) || !currentItem || this.isForceLoadFromBase) {
			const items = await this.profileService.getRfqProfiles(rfqHeaderId, reload);
			if (userCache) {
				if (profileType === CompareProfileTypes.boq) {
					userCache.boq = this.getCurrentProfileItem(items, {
						ProfileType: CompareProfileTypes.boq,
						RfqHeaderFk: rfqHeaderId
					});
				} else {
					userCache.item = this.getCurrentProfileItem(items, {
						ProfileType: CompareProfileTypes.item,
						RfqHeaderFk: rfqHeaderId
					});
				}
				const userItem = profileType === CompareProfileTypes.boq ? userCache.boq : userCache.item;
				if (!this.isForceLoadFromBase) {
					if (currentCache) {
						if (profileType === CompareProfileTypes.boq) {
							currentCache.boq = currentItem = _.cloneDeep(userItem);
						} else {
							currentCache.item = currentItem = _.cloneDeep(userItem);
						}
					}
				}
				if (!userItem?.PropertyConfig || this.isForceLoadFromBase) {
					return this.profileService.getInitialRfqProfile().then((setting) => {
						if (!this.isForceLoadFromBase) {
							if (userItem) {
								userItem.PropertyConfig = _.cloneDeep(setting);
							}
						}

						if (currentItem) {
							if (!this.isForceLoadFromBase) {
								currentItem.PropertyConfig = _.cloneDeep(setting);
							} else {
								currentItem.PropertyConfig = _.mergeWith(currentItem?.PropertyConfig as unknown as IComparePrintRfqProfile, {
									bidder: _.cloneDeep(setting.bidder)
								});
							}
						}
						return currentItem?.PropertyConfig as unknown as IComparePrintRfqProfile;
					});
				}
			}
			const config = currentItem?.PropertyConfig as unknown as IComparePrintRfqProfile;
			return _.isString(config) ? JSON.parse(config) as unknown as IComparePrintRfqProfile : config as IComparePrintRfqProfile;
		}
		return Promise.resolve(currentItem?.PropertyConfig as unknown as IComparePrintRfqProfile);
	}

	public async getSystemOptions(): Promise<string> {
		const p = await this.httpService.get<{ ParameterValue: string; }>('procurement/pricecomparison/print/getsystemoptions');
		return this.loadModeValue = p.ParameterValue ?? '-1';
	}

	private async getLastedRfqSetting(rfqHeaderId: number) {
		const items = await this.profileService.getRfqProfiles(rfqHeaderId, true);
		const userProfile = this.getDefaultProfileItem(items, {
			ProfileType: CompareProfileTypes.boq,
			RfqHeaderFk: rfqHeaderId
		}, true);
		const current = this.getCurrentRfqProfileCache(rfqHeaderId);
		if (current && current.PropertyConfig) {
			userProfile.PropertyConfig = JSON.stringify(_.cloneDeep(current.PropertyConfig));
		}
		if (!userProfile.PropertyConfig) {
			return this.profileService.getInitialRfqProfile().then(function (setting) {
				userProfile.PropertyConfig = JSON.stringify(_.cloneDeep(setting));
				return userProfile;
			});
		}
		return userProfile;
	}

	private async getGenericLastedProfileSetting() {
		const items = await this.profileService.getGenericProfiles(true);
		const user = this.getDefaultProfileItem(items, {
			ProfileType: CompareProfileTypes.generic
		}, true);
		const currentSetting = this.genericProfileCache.current && this.genericProfileCache.current.PropertyConfig;
		if (currentSetting) {
			user.PropertyConfig = JSON.stringify(_.cloneDeep(currentSetting));
		}
		if (!user.PropertyConfig) {
			return this.profileService.getInitialGenericProfile().then((setting) => {
				if (!this.isForceLoadFromBase) {
					user.PropertyConfig = JSON.stringify(_.cloneDeep(setting));
				}
				return user;
			});
		}
		return user;
	}

	private async getLastedProfile() {
		const rfqHeaderId = this.dataSvc.getParentSelectedIdElse();
		const results = await Promise.all([
			this.getGenericLastedProfileSetting(),
			this.getLastedRfqSetting(rfqHeaderId),
		]);
		return {
			generic: results[0],
			rfq: results[1]
		};
	}

	protected syncCurrentSetting(rfqHeaderId: number, settings: IComparePrintBase<T>) {
		const genericCurrent = this.genericProfileCache.current;
		if (genericCurrent) {
			const generic = genericCurrent.PropertyConfig as IComparePrintGenericProfile;
			generic.pageLayout = settings.pageLayout;
			generic.report = settings.report;
			this.syncCurrentGenericSetting(generic, settings);
		}

		const rfqCurrent = this.getCurrentRfqProfileCache(rfqHeaderId);
		if (rfqCurrent) {
			const rfq = rfqCurrent.PropertyConfig as IComparePrintRfqProfile;
			this.syncCurrentRfqSetting(rfq, settings);
		}
	}

	public async saveCurrentSetting(settings: IComparePrintBase<T>): Promise<boolean> {
		const rfqHeaderId = this.dataSvc.getParentSelectedIdElse();
		this.syncCurrentSetting(rfqHeaderId, settings);
		const results = await this.getLastedProfile();
		const saveProfiles = _.map([results.generic, results.rfq], (item) => {
			const profile = _.cloneDeep(item);
			if (_.isObject(profile.PropertyConfig)) {
				profile.PropertyConfig = JSON.stringify(profile.PropertyConfig);
			}
			return profile;
		});
		const profiles = await this.profileService.saveProfile(CompareProfileSaveLocations.user, saveProfiles);
		if (profiles.length > 1) {
			this.genericProfileCache.current = profiles[0];

			if (_.isString(this.genericProfileCache.current.PropertyConfig)) {
				this.genericProfileCache.current.PropertyConfig = JSON.parse(this.genericProfileCache.current.PropertyConfig);
			}

			const current = this.getCurrentRfqProfileCache(rfqHeaderId);
			if (current) {
				Object.assign(current, profiles[1]);
				if (_.isString(current.PropertyConfig)) {
					current.PropertyConfig = JSON.parse(current.PropertyConfig);
				}
			}
		}
		return false;
	}

	public getCurrentSetting() {
		const rfqHeaderId = this.dataSvc.getParentSelectedIdElse();
		const current = this.genericProfileCache.current as IComparePrintProfileEntity;
		const rfq = this.getCurrentRfqProfileCache(rfqHeaderId) as IComparePrintProfileEntity;
		return {
			generic: current.PropertyConfig as IComparePrintGenericProfile,
			rfq: rfq.PropertyConfig as IComparePrintRfqProfile
		};
	}

	public clearCache() {
		this.genericProfileCache.user = null;
		this.genericProfileCache.current = null;

		this.rfqProfileCache.user.clear();
		this.rfqProfileCache.current.clear();
	}

	public getDefaultProfileItem(items: IComparePrintProfileEntity[], extendData?: Partial<IComparePrintProfileEntity>, isGetLastedProfile?: boolean): IComparePrintProfileEntity {
		let userProfile: IComparePrintProfileEntity | undefined;
		let item: IComparePrintProfileEntity | undefined;
		const roleDefaultItem = items.find(item => {
			return item.IsDefault && item.FrmAccessRoleFk === this.contextService.permissionRoleId;
		});
		const systemDefaultItem = _.find(items, {IsDefault: true, IsSystem: true});
		const lastSaveItem = _.find(items, {Description: null});

		if (this.loadModeValue === ComparePrintConstants.loadMode.default) {
			item = roleDefaultItem ?? systemDefaultItem;
		} else {
			item = lastSaveItem || roleDefaultItem || systemDefaultItem;
		}

		if (isGetLastedProfile) {
			item = lastSaveItem;
		}

		if (item) {
			userProfile = _.cloneDeep(item);
		}

		if (!userProfile) {
			userProfile = this.profileService.currentView(-1, 1);
		}
		if (extendData) {
			userProfile = _.extend(userProfile, extendData);
		}
		return userProfile as IComparePrintProfileEntity;
	}

	public setLoadMode(value: string) {
		this.loadModeValue = value;
	}

	public getCurrentView(rfqHeaderId:number) {
		const currGenericProfile = this.genericProfileCache.current as IComparePrintProfileEntity;
		const currRfqProfile = this.getCurrentRfqProfileCache(rfqHeaderId) as IComparePrintProfileEntity;

		const genericConfig = currGenericProfile.PropertyConfig as IComparePrintGenericProfile;
		const rfqConfig = currRfqProfile.PropertyConfig as IComparePrintRfqProfile;

		_.extend(genericConfig.report, {
			bidderPageSizeCheck: false
		});

		const loadPromises:Array<Promise<IComparePrintGenericProfile|IComparePrintRfqProfile>> = [
			this.profileService.getInitialGenericProfile(genericConfig),
			this.profileService.getInitialRfqProfile(rfqConfig)
		];
		return Promise.all(loadPromises);
	}

	/*private setCurrentGenericSetting(data, isEmitProfileChangedMessage, eventInfo) {
		if (this.genericProfileCache.current) {
			this.genericProfileCache.current.PropertyConfig = printCommonService.merge2(this.genericProfileCache.current.PropertyConfig || {}, data);
			if (isEmitProfileChangedMessage) {
				onCurrentSettingChanged.fire(eventInfo);
			}
		}
	}

	private setCurrentRfqItemSetting(data, isEmitProfileChangedMessage, eventInfo) {
		let selectedItem = rfqDataService.getSelected(),
			rfqHeaderId = selectedItem.Id,
			currItem = this.rfqProfileCache.current[rfqHeaderId] ? this.rfqProfileCache.current[rfqHeaderId].item : null;
		if (currItem) {
			currItem.PropertyConfig = printCommonService.merge2(currItem.PropertyConfig || {}, data);
			if (isEmitProfileChangedMessage) {
				onCurrentSettingChanged.fire(eventInfo);
			}
		}
	}

	private setCurrentRfqBoqSetting(data, isEmitProfileChangedMessage, eventInfo) {
		let selectedItem = rfqDataService.getSelected(),
			rfqHeaderId = selectedItem.Id,
			currBoq = this.rfqProfileCache.current[rfqHeaderId] ? this.rfqProfileCache.current[rfqHeaderId].boq : null;
		if (currBoq) {
			currBoq.PropertyConfig = printCommonService.merge2(currBoq.PropertyConfig || {}, data);
			if (isEmitProfileChangedMessage) {
				onCurrentSettingChanged.fire(eventInfo);
			}
		}
	}

	private setLatestGeneric(genericProfile) {
		this.profileService.setLatestGeneric(genericProfile, this.genericProfileCache.current);
	}

	private setLatestRfqProfile(rfqProfile, printType) {
		let selectedItem = rfqDataService.getSelected(),
			rfqHeaderId = selectedItem.Id;
		this.profileService.setLatestRfqProfile(rfqProfile, printType, rfqHeaderId, this.rfqProfileCache.current);
	}

	private getPrintPaperWidth(paperSize, orientation, useDpi) {
		let width = 0, currDpi = useDpi || ComparePrintConstants.screenDpi.D72, currOrientation = orientation.toString(),
			portrait = ComparePrintConstants.orientation.portrait.toString();
		if (paperSize === ComparePrintConstants.paperSize.A4) {/!* jshint -W106 *!/
			width = currOrientation === portrait ? ComparePrintConstants.paperSizeWidth.A4_portrait
				: ComparePrintConstants.paperSizeWidth.A4_landscape;
		} else if (paperSize === ComparePrintConstants.paperSize.A3) {
			width = currOrientation === portrait ? ComparePrintConstants.paperSizeWidth.A3_portrait
				: ComparePrintConstants.paperSizeWidth.A3_landscape;/!* jshint -W106 *!/
		} else {
			width = currOrientation === portrait ? ComparePrintConstants.paperSizeWidth.letter_portrait
				: ComparePrintConstants.paperSizeWidth.letter_landscape;
		}
		return width * currDpi;
	}

	private resetSetting() {
		this.isForceLoadFromBase = true;
		let printType = getCurrentPrintType(), loadPromises = [getCurrentGenericSetting()];
		if (printType === ComparePrintConstants.printType.item) {
			loadPromises.push(getCurrentRfqItemSetting());
		} else {
			loadPromises.push(getCurrentRfqBoqSetting());
		}
		return $q.all(loadPromises).then(function () {
			this.isForceLoadFromBase = false;
			onCurrentSettingChanged.fire({
				eventName: ComparePrintConstants.eventNames.loadProfileFromBase
			});
		});
	}

	private resetGenericSetting() {
		this.isForceLoadFromBase = true;
		let loadPromises = [getCurrentGenericSetting()];
		return $q.all(loadPromises).then(function () {
			this.isForceLoadFromBase = false;
			onCurrentSettingChanged.fire({
				eventName: ComparePrintConstants.eventNames.applyNewGenericProfile,
				profileType: ComparePrintConstants.profileType.generic
			});
		});
	}

	private resetRfqSetting() {
		this.isForceLoadFromBase = true;
		let printType = getCurrentPrintType(), loadPromises = [];
		if (printType === ComparePrintConstants.printType.item) {
			loadPromises.push(getCurrentRfqItemSetting());
		} else {
			loadPromises.push(getCurrentRfqBoqSetting());
		}
		return $q.all(loadPromises).then(function () {
			this.isForceLoadFromBase = false;
			onCurrentSettingChanged.fire({
				eventName: ComparePrintConstants.eventNames.applyNewGenericProfile,
				profileType: printType
			});
		});
	}

	// for row data formatter, response: base data, fields: print row fields
	private formatterRowData(response: ICompareRowEntity[], fields: ICompareRowEntity[]) {
		const list = [];
		_.forEach(fields, function (item) {
			const baseData = _.find(response, {Field: item.Field});
			if (baseData) {
				item.DefaultDescription = baseData.DefaultDescription;
				item.UserLabelName = baseData.UserLabelName;
				item.FieldName = baseData.FieldName;
				item.DescriptionInfo = _.cloneDeep(baseData.DescriptionInfo);
				item.DisplayName = baseData.DisplayName;
				list.push(item);
			}
		});
		_.forEach(response, function (base) {
			const quoteData = _.find(list, {Field: base.Field});
			if (!quoteData) {
				list.push(base);
			}
		});

		return _.orderBy(list, ['Sorting']);
	}

	// make it to be a common function.
	private getUserOptions() {
		return this.httpService.get('procurement/pricecomparison/print/getuseroptions');
	}

	// make it to be a common function.
	private setUserOptions(options) {
		return this.httpService.post('procurement/pricecomparison/print/setuseroptions', options);
	}

	private visibleBidderNumChange(bidders) {
		const visibleBidders = _.filter(bidders, {Visible: true});
		this.onCurrentSettingChanged.fire({
			eventName: ComparePrintConstants.eventNames.bidderVisibleNumChange,
			value: visibleBidders.length,
			visibleBidders: visibleBidders
		});
	}*/
}