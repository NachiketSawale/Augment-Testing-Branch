/**
 * Created by wed on 9/14/2018.
 */

(function (angular) {

	'use strict';

	const moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).factory('procurementPriceComparisonPrintSettingService', [
		'_',
		'globals',
		'$q',
		'$http',
		'$translate',
		'PlatformMessenger',
		'platformContextService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintProfileService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonPrintCommonService',
		function (_,
			globals,
			$q,
			$http,
			$translate,
			PlatformMessenger,
			platformContextService,
			constants,
			profileService,
			rfqDataService,
			printCommonService) {

			let genericProfileCache = {
				user: null,
				current: null
			};
			let rfqProfileCache = {
				user: {},
				current: {}
			};
			let currentPrintType = null;
			let isForceLoadFromBase = false;
			let onCurrentSettingChanged = new PlatformMessenger();
			let onCollectSetting = new PlatformMessenger();
			let onTabStateChange = new PlatformMessenger();
			let loadDefaultProfile = constants.printLoadType.loadDefault;

			function clearCache() {
				genericProfileCache = {
					user: null,
					current: null
				};
				rfqProfileCache = {
					user: {},
					current: {}
				};
			}

			function getDefaultProfileItem(items, extendData, isGetLastedProfile) {
				// var userProfile = _.find(items, {Description: null}), item = null;
				let userProfile = null, item = null;
				let roleDefaultItem = _.find(items, {
					IsDefault: true,
					FrmAccessRoleFk: platformContextService.permissionRoleId
				});
				let systemDefaultItem = _.find(items, {IsDefault: true, IsSystem: true});
				let lastSaveItem = _.find(items, {Description: null});

				if (loadDefaultProfile === constants.printLoadType.loadDefault) {
					item = roleDefaultItem || systemDefaultItem; // || lastSaveItem;
				} else {
					item = lastSaveItem || roleDefaultItem || systemDefaultItem;
				}

				if (isGetLastedProfile) {
					item = lastSaveItem;
				}

				if (item) {
					userProfile = angular.copy(item);
				}

				if (!userProfile) {
					userProfile = {
						Description: null
					};
				}
				if (extendData) {
					userProfile = angular.extend(userProfile, extendData);
				}
				return userProfile;
			}

			function getCurrentProfileItem(items, extendData) {
				let userProfile = getDefaultProfileItem(items, extendData);
				if (userProfile.Description) {
					userProfile = angular.extend(userProfile, {
						IsDefault: false,
						Version: 0,
						Id: 0,
						Description: null
					});
				}
				if (angular.isString(userProfile.PropertyConfig)) {
					userProfile.PropertyConfig = JSON.parse(userProfile.PropertyConfig);
				}
				return userProfile;
			}

			function getCurrentPrintType() {
				return currentPrintType;
			}

			function setCurrentPrintType(printType) {
				currentPrintType = printType;
			}

			function currentView(id, profileType) {
				return {
					Id: id,
					IsCurrentView: true,
					ProfileType: profileType,
					Description: $translate.instant('procurement.pricecomparison.printing.currentViewProfile')
				};
			}

			function mergeWidthDefaultConfig(userConfig) {
				let defaultConfig = profileService.getProfileDefinitions();

				if (userConfig.boq && !angular.isDefined(userConfig.boq.hideZeroValueLines)) {
					userConfig.boq.hideZeroValueLines = defaultConfig.generic.boq.hideZeroValueLines;
				}

				return userConfig;
			}

			function getCurrentGenericSetting(isFromInitial, reload) {
				let printType = getCurrentPrintType();
				let defer = $q.defer();
				if (loadDefaultProfile === constants.printLoadType.loadUiView && (isFromInitial || !genericProfileCache.current)) {
					profileService.getInitialGenericProfile(printType).then(function (setting) {
						genericProfileCache.current = angular.copy(currentView(constants.currentView.generic, constants.profileSaveType.user));
						genericProfileCache.current.PropertyConfig = angular.copy(setting);
						defer.resolve(genericProfileCache.current.PropertyConfig);
					});
					return defer.promise;
				} else if ((isFromInitial && loadDefaultProfile === constants.printLoadType.loadDefault) || !genericProfileCache.current || isForceLoadFromBase) {
					profileService.getGenericProfiles(reload).then(function (items) {
						genericProfileCache.user = getCurrentProfileItem(items, {
							ProfileType: constants.profileType.generic
						});
						if (!isForceLoadFromBase) {
							genericProfileCache.current = angular.copy(genericProfileCache.user);
						}
						if (!genericProfileCache.user.PropertyConfig || isForceLoadFromBase) {
							profileService.getInitialGenericProfile(printType).then(function (setting) {
								if (!isForceLoadFromBase) {
									genericProfileCache.user.PropertyConfig = angular.copy(setting);
								}
								if (!isForceLoadFromBase) {
									genericProfileCache.current.PropertyConfig = angular.copy(setting);
								} else {
									genericProfileCache.current.PropertyConfig = printCommonService.merge2(genericProfileCache.current.PropertyConfig, {
										column: angular.copy(setting.column),
										row: angular.copy(setting.row),
										bidder: angular.copy(setting.bidder),
										report: angular.copy(setting.report)
									});
								}
								defer.resolve(mergeWidthDefaultConfig(genericProfileCache.current.PropertyConfig));
							});
							return defer.promise;
						} else {
							let propertyName = constants.compareType[printType];
							if (!genericProfileCache.current.PropertyConfig.row[propertyName]) {
								genericProfileCache.current.PropertyConfig.row[propertyName] = profileService.getAllRowConfig(printType)[propertyName];
							}
						}
						defer.resolve(mergeWidthDefaultConfig(genericProfileCache.current.PropertyConfig));
					});
					return defer.promise;
				} else {
					let propertyName = constants.compareType[printType];
					if (!genericProfileCache.current.PropertyConfig.row[propertyName]) {
						genericProfileCache.current.PropertyConfig.row[propertyName] = profileService.getAllRowConfig(printType)[propertyName];
					}

					if (!genericProfileCache.current.PropertyConfig.column[propertyName]) {
						genericProfileCache.current.PropertyConfig.column[propertyName] = profileService.getDefaultColumnsSetting(printType)[propertyName];
					}
				}
				return $q.when(mergeWidthDefaultConfig(genericProfileCache.current.PropertyConfig));
			}

			function getCurrentRfqItemSetting(reload, isFromInitial) {
				let selectedItem = rfqDataService.getSelected(), rfqHeaderId = selectedItem.Id;
				let defer = $q.defer();
				if (!rfqProfileCache.current[rfqHeaderId]) {
					rfqProfileCache.user[rfqHeaderId] = {};
					rfqProfileCache.current[rfqHeaderId] = {};
				}
				let currentItem = rfqProfileCache.current[rfqHeaderId].item;
				if (loadDefaultProfile === constants.printLoadType.loadUiView && (isFromInitial || !currentItem)) {
					profileService.getInitialRfqItemProfile().then(function (setting) {
						rfqProfileCache.current[rfqHeaderId].item = currentItem = angular.copy(currentView(constants.currentView.rfq, constants.profileSaveType.user));
						currentItem.PropertyConfig = angular.copy(setting);
						defer.resolve(currentItem.PropertyConfig);
					});
					return defer.promise;
				} else if ((isFromInitial && loadDefaultProfile === constants.printLoadType.loadDefault) || !currentItem || isForceLoadFromBase) {
					profileService.getRfqItemProfiles(rfqHeaderId, reload).then(function (items) {
						let userItem = rfqProfileCache.user[rfqHeaderId].item = getCurrentProfileItem(items, {
							ProfileType: constants.profileType.item,
							RfqHeaderFk: rfqHeaderId
						});
						if (!isForceLoadFromBase) {
							rfqProfileCache.current[rfqHeaderId].item = currentItem = angular.copy(userItem);
						}
						if (!userItem.PropertyConfig || isForceLoadFromBase) {
							profileService.getInitialRfqItemProfile().then(function (setting) {
								if (!isForceLoadFromBase) {
									userItem.PropertyConfig = angular.copy(setting);
								}
								if (!isForceLoadFromBase) {
									currentItem.PropertyConfig = angular.copy(setting);
								} else {
									currentItem.PropertyConfig = printCommonService.merge2(currentItem.PropertyConfig, {
										bidder: angular.copy(setting.bidder)
									});
								}
								defer.resolve(currentItem.PropertyConfig);
							});
							return defer.promise;
						}
						defer.resolve(currentItem.PropertyConfig);
					});
					return defer.promise;
				}
				return $q.when(currentItem.PropertyConfig);
			}

			function getCurrentRfqBoqSetting(reload, isFromInitial) {
				let selectedItem = rfqDataService.getSelected(), rfqHeaderId = selectedItem.Id;
				let defer = $q.defer();
				if (!rfqProfileCache.current[rfqHeaderId]) {
					rfqProfileCache.user[rfqHeaderId] = {};
					rfqProfileCache.current[rfqHeaderId] = {};
				}
				let currentBoq = rfqProfileCache.current[rfqHeaderId].boq;
				if (loadDefaultProfile === constants.printLoadType.loadUiView && (isFromInitial || !currentBoq)) {
					profileService.getInitialRfqBoqProfile().then(function (setting) {
						rfqProfileCache.current[rfqHeaderId].boq = currentBoq = angular.copy(currentView(constants.currentView.rfq, constants.profileSaveType.user));
						currentBoq.PropertyConfig = angular.copy(setting);
						defer.resolve(currentBoq.PropertyConfig);
					});
					return defer.promise;
				} else if ((isFromInitial && loadDefaultProfile === constants.printLoadType.loadDefault) || !currentBoq || isForceLoadFromBase) {
					profileService.getRfqBoqProfiles(rfqHeaderId, reload).then(function (items) {
						let userBoq = rfqProfileCache.user[rfqHeaderId].boq = getCurrentProfileItem(items, {
							ProfileType: constants.profileType.boq,
							RfqHeaderFk: rfqHeaderId
						});
						if (!isForceLoadFromBase) {
							rfqProfileCache.current[rfqHeaderId].boq = currentBoq = angular.copy(userBoq);
						}
						if (!userBoq.PropertyConfig || isForceLoadFromBase) {
							profileService.getInitialRfqBoqProfile().then(function (setting) {
								if (!isForceLoadFromBase) {
									userBoq.PropertyConfig = angular.copy(setting);
								}
								if (!isForceLoadFromBase) {
									currentBoq.PropertyConfig = angular.copy(setting);
								} else {
									currentBoq.PropertyConfig = printCommonService.merge2(currentBoq.PropertyConfig, {
										bidder: angular.copy(setting.bidder)
									});
								}
								defer.resolve(currentBoq.PropertyConfig);
							});
							return defer.promise;
						}
						defer.resolve(currentBoq.PropertyConfig);
					});
					return defer.promise;
				}
				return $q.when(currentBoq.PropertyConfig);
			}

			function setCurrentGenericSetting(data, isEmitProfileChangedMessage, eventInfo) {
				if (genericProfileCache.current) {
					genericProfileCache.current.PropertyConfig = printCommonService.merge2(genericProfileCache.current.PropertyConfig || {}, data);
					if (isEmitProfileChangedMessage) {
						onCurrentSettingChanged.fire(eventInfo);
					}
				}
			}

			function setCurrentRfqItemSetting(data, isEmitProfileChangedMessage, eventInfo) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id,
					currItem = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].item : null;
				if (currItem) {
					currItem.PropertyConfig = printCommonService.merge2(currItem.PropertyConfig || {}, data);
					if (isEmitProfileChangedMessage) {
						onCurrentSettingChanged.fire(eventInfo);
					}
				}
			}

			function setCurrentRfqBoqSetting(data, isEmitProfileChangedMessage, eventInfo) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id,
					currBoq = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].boq : null;
				if (currBoq) {
					currBoq.PropertyConfig = printCommonService.merge2(currBoq.PropertyConfig || {}, data);
					if (isEmitProfileChangedMessage) {
						onCurrentSettingChanged.fire(eventInfo);
					}
				}
			}

			function getCurrentSetting(printType) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id,
					currItem = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].item : null,
					currBoq = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].boq : null;
				let defer = $q.defer(), promises = [getCurrentGenericSetting()];
				if (printType === constants.printType.item) {
					promises.push(getCurrentRfqItemSetting());
				} else {
					promises.push(getCurrentRfqBoqSetting());
				}
				$q.all(promises).then(function () {
					defer.resolve({
						generic: genericProfileCache.current,
						rfq: printType === constants.printType.item ? currItem : currBoq
					});
				});
				return defer.promise;
			}

			function saveCurrentSetting(printType, saveType) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id;
				let defer = $q.defer();
				getLastedProfile(printType).then(function (result) {
					let saveProfiles = [result.generic, result.rfq];
					saveProfiles = _.map(saveProfiles, function (item) {
						let profile = angular.copy(item);
						if (angular.isObject(profile.PropertyConfig)) {
							profile.PropertyConfig = JSON.stringify(profile.PropertyConfig);
						}
						return profile;
					});
					profileService.saveProfile(saveType, saveProfiles).then(function (response) {
						if (response.data) {
							genericProfileCache.current = response.data[0];
							genericProfileCache.current.PropertyConfig = JSON.parse(genericProfileCache.current.PropertyConfig);
							// genericProfileCache.user = angular.copy(genericProfileCache.current);
							if (printType === constants.printType.item) {
								rfqProfileCache.current[rfqHeaderId].item = response.data[1];
								rfqProfileCache.current[rfqHeaderId].item.PropertyConfig = JSON.parse(rfqProfileCache.current[rfqHeaderId].item.PropertyConfig);
								// rfqProfileCache.user[rfqHeaderId].item = angular.copy(rfqProfileCache.current[rfqHeaderId].item);
							}
							if (printType === constants.printType.boq) {
								rfqProfileCache.current[rfqHeaderId].boq = response.data[1];
								rfqProfileCache.current[rfqHeaderId].boq.PropertyConfig = JSON.parse(rfqProfileCache.current[rfqHeaderId].boq.PropertyConfig);
								// rfqProfileCache.user[rfqHeaderId].boq = angular.copy(rfqProfileCache.current[rfqHeaderId].boq);
							}
							defer.resolve(true);
						} else {
							defer.reject(response);
						}
					}, function (response) {
						defer.reject(response);
					});
				});
				return defer.promise;
			}

			function getLastedProfile(printType) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id;

				let defer = $q.defer(), promises = [getGenericLastedProfileSetting(printType)];
				if (printType === constants.printType.item) {
					promises.push(getLastedRfqItemSetting(rfqHeaderId));
				} else {
					promises.push(getLastedRfqBoqSetting(rfqHeaderId));
				}
				$q.all(promises).then(function (result) {
					defer.resolve({
						generic: result[0],
						rfq: result[1]
					});
				});
				return defer.promise;
			}

			function getGenericLastedProfileSetting(printType) {
				let defer = $q.defer();
				profileService.getGenericProfiles(true).then(function (items) {
					let user = getDefaultProfileItem(items, {
						ProfileType: constants.profileType.generic
					}, true);
					let currentSetting = genericProfileCache.current && genericProfileCache.current.PropertyConfig;
					if (currentSetting) {
						user.PropertyConfig = JSON.stringify(angular.copy(currentSetting));
					}
					if (!user.PropertyConfig) {
						profileService.getInitialGenericProfile(printType).then(function (setting) {
							if (!isForceLoadFromBase) {
								user.PropertyConfig = JSON.stringify(angular.copy(setting));
							}
							defer.resolve(user);
						});
						return;
					}

					defer.resolve(user);
				});

				return defer.promise;
			}

			function setLatestGeneric(genericProfile) {
				profileService.setLatestGeneric(genericProfile, genericProfileCache.current);
			}

			function setLatestRfqProfile(rfqProfile, printType) {
				let selectedItem = rfqDataService.getSelected(),
					rfqHeaderId = selectedItem.Id;
				profileService.setLatestRfqProfile(rfqProfile, printType, rfqHeaderId, rfqProfileCache.current);
			}

			function getLastedRfqItemSetting(rfqHeaderId) {
				let defer = $q.defer();
				profileService.getRfqItemProfiles(rfqHeaderId, true).then(function (items) {

					let userItem = getDefaultProfileItem(items, {
						ProfileType: constants.profileType.item,
						RfqHeaderFk: rfqHeaderId
					}, true);
					let currentItem = rfqProfileCache.current && rfqProfileCache.current[rfqHeaderId] && rfqProfileCache.current[rfqHeaderId].item;

					if (currentItem && currentItem.PropertyConfig) {
						userItem.PropertyConfig = JSON.stringify(angular.copy(currentItem.PropertyConfig));
					}
					if (!userItem.PropertyConfig) {
						profileService.getInitialRfqItemProfile().then(function (setting) {
							userItem.PropertyConfig = JSON.stringify(angular.copy(setting));
							defer.resolve(userItem);
						});
						return;
					}

					defer.resolve(userItem);
				});

				return defer.promise;
			}

			function getLastedRfqBoqSetting(rfqHeaderId) {
				let defer = $q.defer();
				profileService.getRfqBoqProfiles(rfqHeaderId, true).then(function (items) {

					let userBoq = getDefaultProfileItem(items, {
						ProfileType: constants.profileType.boq,
						RfqHeaderFk: rfqHeaderId
					}, true);
					let currentBoq = rfqProfileCache.current && rfqProfileCache.current[rfqHeaderId] && rfqProfileCache.current[rfqHeaderId].boq;

					if (currentBoq && currentBoq.PropertyConfig) {
						userBoq.PropertyConfig = JSON.stringify(angular.copy(currentBoq.PropertyConfig));
					}
					if (!userBoq.PropertyConfig) {
						profileService.getInitialRfqBoqProfile().then(function (setting) {
							userBoq.PropertyConfig = JSON.stringify(angular.copy(setting));
							defer.resolve(userBoq);
						});
						return;
					}

					defer.resolve(userBoq);
				});

				return defer.promise;
			}

			function getPrintPaperWidth(paperSize, orientation, useDpi) {
				let width = 0, currDpi = useDpi || constants.screenDpi.D72, currOrientation = orientation.toString(),
					portrait = constants.orientation.portrait.toString();
				if (paperSize === constants.paperSize.A4) {/* jshint -W106 */
					width = currOrientation === portrait ? constants.paperSizeWidth.A4_portrait
						: constants.paperSizeWidth.A4_landscape;
				} else if (paperSize === constants.paperSize.A3) {
					width = currOrientation === portrait ? constants.paperSizeWidth.A3_portrait
						: constants.paperSizeWidth.A3_landscape;/* jshint -W106 */
				} else {
					width = currOrientation === portrait ? constants.paperSizeWidth.letter_portrait
						: constants.paperSizeWidth.letter_landscape;
				}
				return width * currDpi;
			}

			function resetSetting() {
				isForceLoadFromBase = true;
				let printType = getCurrentPrintType(), loadPromises = [getCurrentGenericSetting()];
				if (printType === constants.printType.item) {
					loadPromises.push(getCurrentRfqItemSetting());
				} else {
					loadPromises.push(getCurrentRfqBoqSetting());
				}
				return $q.all(loadPromises).then(function () {
					isForceLoadFromBase = false;
					onCurrentSettingChanged.fire({
						eventName: constants.eventNames.loadProfileFromBase
					});
				});
			}

			function getCurrentView() {
				let printType = getCurrentPrintType();
				angular.extend(genericProfileCache.current.PropertyConfig.report, {
					bidderPageSizeCheck: false
				});
				let loadPromises = [profileService.getInitialGenericProfile(printType, genericProfileCache.current.PropertyConfig)];
				let selectedItem = rfqDataService.getSelected(), rfqHeaderId = selectedItem.Id;
				if (printType === constants.printType.item) {
					let currItemProfile = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].item : null;
					loadPromises.push(profileService.getInitialRfqItemProfile(currItemProfile.PropertyConfig));
				} else {
					let currBoqProfile = rfqProfileCache.current[rfqHeaderId] ? rfqProfileCache.current[rfqHeaderId].boq : null;
					loadPromises.push(profileService.getInitialRfqBoqProfile(currBoqProfile.PropertyConfig));
				}

				return $q.all(loadPromises);
			}

			function resetGenericSetting() {
				isForceLoadFromBase = true;
				let loadPromises = [getCurrentGenericSetting()];
				return $q.all(loadPromises).then(function () {
					isForceLoadFromBase = false;
					onCurrentSettingChanged.fire({
						eventName: constants.eventNames.applyNewGenericProfile,
						profileType: constants.profileType.generic
					});
				});
			}

			function resetRfqSetting() {
				isForceLoadFromBase = true;
				let printType = getCurrentPrintType(), loadPromises = [];
				if (printType === constants.printType.item) {
					loadPromises.push(getCurrentRfqItemSetting());
				} else {
					loadPromises.push(getCurrentRfqBoqSetting());
				}
				return $q.all(loadPromises).then(function () {
					isForceLoadFromBase = false;
					onCurrentSettingChanged.fire({
						eventName: constants.eventNames.applyNewGenericProfile,
						profileType: printType
					});
				});
			}

			// for row data formatter, response: base data, fields: print row fields
			function formatterRowData(response, fields) {
				let list = [];
				_.forEach(fields, function (item) {
					var baseData = _.find(response, {Field: item.Field});
					if (baseData) {
						item.DefaultDescription = baseData.DefaultDescription;
						item.UserLabelName = baseData.UserLabelName;
						item.FieldName = baseData.FieldName;
						item.DescriptionInfo = angular.copy(baseData.DescriptionInfo);
						item.DisplayName = baseData.DisplayName;
						list.push(item);
					}
				});
				_.forEach(response, function (base) {
					let quoteData = _.find(list, {Field: base.Field});
					if (!quoteData) {
						list.push(base);
					}
				});

				return _.orderBy(list, ['Sorting']);
			}

			// make it to be a common function.
			function getUserOptions() {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getuseroptions');
			}

			// make it to be a common function.
			function setUserOptions(options) {
				return $http.post(globals.webApiBaseUrl + 'procurement/pricecomparison/print/setuseroptions', options);
			}

			// make it to be a common function.
			function getSystemOptions() {
				return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getsystemoptions');
			}

			function setLoadDefaultProfile(value) {
				loadDefaultProfile = value;
			}

			function visibleBidderNumChange(bidders) {
				let visibleBidders = _.filter(bidders, {Visible: true});
				onCurrentSettingChanged.fire({
					eventName: constants.eventNames.bidderVisibleNumChange,
					value: visibleBidders.length,
					visibleBidders: visibleBidders
				});
			}

			return {
				getDefaultProfileItem: getDefaultProfileItem,
				getCurrentPrintType: getCurrentPrintType,
				setCurrentPrintType: setCurrentPrintType,
				getCurrentGenericSetting: getCurrentGenericSetting,
				setCurrentGenericSetting: setCurrentGenericSetting,
				getCurrentRfqItemSetting: getCurrentRfqItemSetting,
				setCurrentRfqItemSetting: setCurrentRfqItemSetting,
				getCurrentRfqBoqSetting: getCurrentRfqBoqSetting,
				setCurrentRfqBoqSetting: setCurrentRfqBoqSetting,
				getCurrentSetting: getCurrentSetting,
				saveCurrentSetting: saveCurrentSetting,
				onCurrentSettingChanged: onCurrentSettingChanged,
				onCollectSetting: onCollectSetting,
				onTabStateChange: onTabStateChange,
				getAvailableColumns: profileService.getAvailableColumns,
				getVisibleColumns: profileService.getVisibleColumns,
				getPrintPaperWidth: getPrintPaperWidth,
				formatterRowData: formatterRowData,
				resetSetting: resetSetting,
				getUserOptions: getUserOptions,
				setUserOptions: setUserOptions,
				getSystemOptions: getSystemOptions,
				setLoadDefaultProfile: setLoadDefaultProfile,
				visibleBidderNumChange: visibleBidderNumChange,
				resetGenericSetting: resetGenericSetting,
				resetRfqSetting: resetRfqSetting,
				setLatestGeneric: setLatestGeneric,
				setLatestRfqProfile: setLatestRfqProfile,
				clearCache: clearCache,
				getCurrentView: getCurrentView
			};

		}]);
})(angular);