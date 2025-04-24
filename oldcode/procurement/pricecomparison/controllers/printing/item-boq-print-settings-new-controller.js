/**
 * Created by wed on 9/11/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonItemBoqPrintSettingsNewController', [
		'_',
		'$rootScope',
		'globals',
		'$q',
		'$scope',
		'$modalInstance',
		'$translate',
		'platformGridAPI',
		'platformObjectHelper',
		'platformModalService',
		'procurementPriceComparisonItemConfigService',
		'procurementPriceComparisonBoqConfigService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonPrintProfileService',
		'procurementPriceComparisonPrintHelperService',
		'procurementPriceComparisonItemService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonBoqHelperService',
		'procurementPriceComparisonItemHelperService',
		'procurementPriceComparisonPrintCommonService',
		'procurementPriceComparisonBoqPrintColumnService',
		'procurementPriceComparisonItemPrintColumnService',
		'controllerOptions',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonSettingConfiguration',
		'procurementPriceComparisonCommonHelperService',
		function (_,
			$rootScope,
			globals,
			$q,
			$scope,
			$modalInstance,
			$translate,
			platformGridAPI,
			platformObjectHelper,
			platformModalService,
			itemConfigService,
			boqConfigService,
			commonService,
			printSettingService,
			constants,
			rfqDataService,
			profileService,
			printHelperService,
			itemService,
			boqService,
			boqHelper,
			itemHelper,
			printCommonService,
			boqPrintColumnService,
			itemPrintColumnService,
			controllerOptions,
			lookupDescriptorService,
			settingConfiguration,
			commonHelperService) {

			$scope.tabState = [];
			$scope.modalOptions = {
				LoadDefaultProfileText: $translate.instant('procurement.pricecomparison.printing.loadDefaultProfile'),
				LoadCurrentViewText: $translate.instant('procurement.pricecomparison.printing.loadCurrentView'),
				headerText: controllerOptions.title,
				btnOkText: $translate.instant('basics.common.button.ok'),
				genericProfileText: $translate.instant('procurement.pricecomparison.printing.generalProfile'),
				rfqProfileText: $translate.instant('procurement.pricecomparison.printing.rfqProfile'),
				btnCancelText: $translate.instant('basics.common.button.cancel'),
				btnPrintText: $translate.instant('procurement.pricecomparison.printing.print'),
				saveAsText: $translate.instant('basics.common.button.saveAs'),
				previewText: $translate.instant('basics.common.button.preview'),
				reloadText: $translate.instant('cloud.common.buttonReload'),
				saveAsGeneric: function () {
					printSettingService.onCollectSetting.fire();
					printSettingService.getCurrentGenericSetting().then(function (profile) {
						showSaveProfileDialog(constants.profileType.generic, controllerOptions.printType, profile);
					});
				},
				saveAsRfq: function () {
					printSettingService.onCollectSetting.fire();
					if (controllerOptions.printType === constants.printType.item) {
						printSettingService.getCurrentRfqItemSetting().then(function (profile) {
							showSaveProfileDialog(constants.profileType.item, controllerOptions.printType, profile);
						});
					} else {
						printSettingService.getCurrentRfqBoqSetting().then(function (profile) {
							showSaveProfileDialog(constants.profileType.boq, controllerOptions.printType, profile);
						});
					}
				},
				saveAs: function () {
					var modalOptions = {
						controller: 'itemBoqProfileSaveFirstController',
						templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-profile-save-first-template.html'
					};
					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result && result.isOk) {
							printSettingService.onCollectSetting.fire();
							if (result.isGenericProfile) {
								printSettingService.getCurrentGenericSetting().then(function (profile) {
									showSaveProfileDialog(constants.profileType.generic, controllerOptions.printType, profile);
								});
							} else {
								if (controllerOptions.printType === constants.printType.item) {
									printSettingService.getCurrentRfqItemSetting().then(function (profile) {
										showSaveProfileDialog(constants.profileType.item, controllerOptions.printType, profile);
									});
								} else {
									printSettingService.getCurrentRfqBoqSetting().then(function (profile) {
										showSaveProfileDialog(constants.profileType.boq, controllerOptions.printType, profile);
									});
								}
							}
						}
					});
				},
				doPreview: function () {
					let option = {
						platformModalService: platformModalService,
						updateBidders: updateBidders
					};
					printHelperService.checkQuoteModifiedState(controllerOptions.printType, 'preview', option).then(function () {
						$scope.isLoading = true;
						printSettingService.onCollectSetting.fire();
						printSettingService.getCurrentSetting(controllerOptions.printType).then(function (result) {
							printHelperService.preview(rfqDataService.getIfSelectedIdElse(null), controllerOptions.printType, angular.copy(result));
						}).finally(function () {
							$scope.isLoading = false;
						});
					});
				},
				ok: function () {
					$scope.isLoading = true;
					printSettingService.onCollectSetting.fire();
					$q.all([printSettingService.saveCurrentSetting(controllerOptions.printType, constants.profileSaveType.user)]).then(function () {
						// clear all cache
						printSettingService.clearCache();
						profileService.clearCache();
						$modalInstance.close({cancel: true});
					}).finally(function () {
						$scope.isLoading = false;
					});
				},
				print: function () {
					let option = {
						platformModalService: platformModalService,
						updateBidders: updateBidders
					};
					printHelperService.checkQuoteModifiedState(controllerOptions.printType, 'print', option).then(function () {
						$scope.isLoading = true;
						printSettingService.onCollectSetting.fire();
						printSettingService.saveCurrentSetting(controllerOptions.printType, constants.profileSaveType.user).then(function () {
							printSettingService.getCurrentSetting(controllerOptions.printType).then(function (result) {
								printHelperService.print(rfqDataService.getIfSelectedIdElse(null), controllerOptions.printType, angular.copy(result)).then(function () {
									$modalInstance.close({cancel: true});
								}).finally(function () {
									$scope.isLoading = false;
									// clear all cache
									printSettingService.clearCache();
									profileService.clearCache();
								});
							});
						});
					});
				},
				cancel: function () {
					// clear all cache
					printSettingService.clearCache();
					profileService.clearCache();
					$modalInstance.close({cancel: true});
				}
			};
			$scope.isLoading = true;
			$scope.settings = {
				rfqProfile: {
					selectedValue: 0,
					options: {
						items: [],
						valueMember: 'Id',
						displayMember: 'DisplayText',
						inputDomain: 'description',
						selected: '',
						change: function () {
							if ($scope.settings.rfqProfile.selectedValue === constants.currentView.rfq) {
								if ($scope.settings.genericProfile.selectedValue === constants.currentView.generic) {
									setLoadProfile(constants.loadValue.current, false, true);
								} else {
									setLoadProfile(null, false, false);
								}
								printSettingService.resetRfqSetting();
								return;
							}

							setLoadProfile(null, false, false);
							var item = _.find(this.items, {Id: $scope.settings.rfqProfile.selectedValue});
							setRfqProfile(item);
						},
						getList: getRfqProfile
					}
				},
				genericProfile: {
					selectedValue: 0,
					options: {
						items: [],
						valueMember: 'Id',
						displayMember: 'DisplayText',
						inputDomain: 'description',
						selected: '',
						change: function () {
							if ($scope.settings.genericProfile.selectedValue === constants.currentView.generic) {
								if ($scope.settings.rfqProfile.selectedValue === constants.currentView.rfq) {
									setLoadProfile(constants.loadValue.current, false, true);
								} else {
									setLoadProfile(null, false, false);
								}
								printSettingService.resetGenericSetting();
								return;
							}
							setLoadProfile(null, false, false);
							var item = _.find(this.items, {Id: $scope.settings.genericProfile.selectedValue});
							setGenericProfile(item);
						},
						getList: getGenericProfileList
					}
				},
				LoadValue: 1,
				LoadDefaultProfile: {
					isLoadDefaultProfile: false,
					change: function () {
						setLoadProfile(constants.loadValue.default, true, false);
						printSettingService.setLoadDefaultProfile(constants.printLoadType.loadDefault);
						var genericItems = $scope.settings.genericProfile.options.items;
						var genericItem = printSettingService.getDefaultProfileItem(genericItems);

						if (genericItem && genericItem.Id && genericItem.PropertyConfig) {
							$scope.settings.genericProfile.selectedValue = genericItem.Id;
							setGenericProfile(genericItem);
						}

						var rfqItems = $scope.settings.rfqProfile.options.items;
						var rfqItem = printSettingService.getDefaultProfileItem(rfqItems);

						if (rfqItem && rfqItem.Id && rfqItem.PropertyConfig) {
							$scope.settings.rfqProfile.selectedValue = rfqItem.Id;
							setRfqProfile(rfqItem);
						}
					}
				},
				LoadCurViewProfile: {
					isLoadCurrentViewProfile: false,
					change: function () {
						setLoadProfile(constants.loadValue.current, false, true);
						printSettingService.setLoadDefaultProfile(constants.printLoadType.loadUiView);
						$scope.settings.genericProfile.selectedValue = constants.currentView.generic;
						$scope.settings.rfqProfile.selectedValue = constants.currentView.rfq;
						var genericItems = $scope.settings.genericProfile.options.items;
						var genericItem = _.find(genericItems, {Id: constants.currentView.generic});
						var rfqItems = $scope.settings.rfqProfile.options.items;
						var rfqItem = _.find(rfqItems, {Id: constants.currentView.rfq});
						printSettingService.getCurrentView().then(function (data) {
							genericItem.PropertyConfig = angular.copy(JSON.stringify(data[0]));
							rfqItem.PropertyConfig = angular.copy(JSON.stringify(data[1]));
							setGenericProfile(genericItem);
							setRfqProfile(rfqItem);
						});
					}
				}
			};
			$scope.hasErrors = false;
			$scope.stateErrors = [];
			$scope.stateWarnings = [];

			function setLoadProfile(selectedValue, defaultProfile, curViewProfile) {
				$scope.settings.LoadDefaultProfile.isLoadDefaultProfile = defaultProfile;
				$scope.settings.LoadCurViewProfile.isLoadCurrentViewProfile = curViewProfile;
				$scope.settings.LoadValue = selectedValue;
			}

			function updateBidders(printType, originalToNews, quoteHeaderNews) {
				var rfqPromise = null, helperService = null, columnService = null, setHandler = null;
				if (printType === constants.printType.item) {
					setHandler = printSettingService.setCurrentRfqItemSetting;
					helperService = itemHelper;
					columnService = itemPrintColumnService;
					rfqPromise = printSettingService.getCurrentRfqItemSetting();
				} else {
					setHandler = printSettingService.setCurrentRfqBoqSetting;
					helperService = boqHelper;
					columnService = boqPrintColumnService;
					rfqPromise = printSettingService.getCurrentRfqBoqSetting();
				}

				return rfqPromise.then(function (profile) {
					var bidders = platformObjectHelper.getValue(profile, 'bidder.quotes', []);
					for (var key in originalToNews) {
						// eslint-disable-next-line no-prototype-builtins
						if (originalToNews.hasOwnProperty(key)) {
							var bidder = _.find(bidders, {QtnHeaderFk: _.toInteger(key)}),
								newBidder = originalToNews[key];
							if (bidder && newBidder) {
								bidder = angular.extend(bidder, {
									BusinessPartnerFk: newBidder.BusinessPartnerFk,
									QtnHeaderFk: newBidder.Id,
									RfqHeaderId: newBidder.RfqHeaderFk
								});
							}
						}
					}
					var tree = helperService.restructureQuoteCompareColumns(bidders, quoteHeaderNews, false);
					var treeList = printCommonService.flatTree(tree, 'Children');
					columnService.setList(treeList);
					setHandler({
						bidder: {
							quotes: treeList
						}
					}, true, {
						eventName: constants.eventNames.bidderChange,
						profileType: printType === constants.printType.item ? constants.profileType.item : constants.profileType.boq
					});
				});
			}

			function showSaveProfileDialog(profileType, printType, profile) {
				platformModalService.showDialog({
					scope: $scope,
					resolve: {
						controllerOptions: function () {
							return {
								rfqHeaderId: rfqDataService.getIfSelectedIdElse(null),
								printType: printType,
								profileType: profileType,
								profile: profile,
								onDelete: function (id, profileType) {
									var isResetGeneric = profileType === constants.profileType.generic && $scope.settings.genericProfile.selectedValue === id;
									var isResetRfq = profileType !== constants.profileType.generic && $scope.settings.rfqProfile.selectedValue === id;
									loadProfiles(isResetGeneric, isResetRfq);
								},
								setDefault: function (id, profileType) {
									var isResetGeneric = profileType === constants.profileType.generic;
									var isResetRfq = profileType !== constants.profileType.generic;
									var rfqValue = 0;
									var genericValue = 0;
									if (isResetGeneric) {
										genericValue = $scope.settings.genericProfile.selectedValue;
										$scope.settings.genericProfile.selectedValue = 0;
									} else {
										rfqValue = $scope.settings.rfqProfile.selectedValue;
										$scope.settings.rfqProfile.selectedValue = 0;
									}
									loadProfiles(isResetGeneric, isResetRfq, false, genericValue, rfqValue);
								}
							};
						}
					},
					templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-print-profile-save-template.html',
					controller: 'procurementPriceComparisonItemBoqPrintSaveProfileController'
				}).then(function (result) {
					if (result && result.ok) {
						loadProfiles(false, false, false);
					}
				});
			}

			/* function checkQuoteModifiedState(printType, printAction) {
				var deferred = $q.defer();
				var modifiedCheckPromise = null;
				if (printType === constants.printType.item) {
					modifiedCheckPromise = $q.all([itemService.checkModifiedState(true), itemService.checkModifiedState(false)]);
				} else {
					modifiedCheckPromise = $q.all([boqService.checkModifiedState(true), boqService.checkModifiedState(false)]);
				}
				modifiedCheckPromise.then(function (result) {
					if (result[0].hasModified || result[1].hasModified) {
						platformModalService.showDialog({
							resolve: {
								controllerOptions: function () {
									return {
										printType: printType,
										printAction: printAction
									};
								}
							},
							width: '650px',
							templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/item-boq-print-save-quote.html',
							controller: 'procurementPriceComparisonItemBoqPrintSaveQuoteController'
						}).then(function (result) {
							if (result && result.ok) {
								if (result.isNewVersion) {
									updateBidders(printType, result.OriginalToQuoteHeaderNews, result.QuoteHeaderNews).then(function () {
										deferred.resolve();
									});
								} else {
									deferred.resolve();
								}
							}
						});
					} else {
						deferred.resolve();
					}
				});

				return deferred.promise;
			} */

			function setRfqProfile(item) {
				if (item && item.PropertyConfig) {
					if (controllerOptions.printType === constants.printType.item) {
						printSettingService.setCurrentRfqItemSetting(JSON.parse(item.PropertyConfig), true, {
							eventName: constants.eventNames.applyNewGenericProfile,
							profileType: constants.profileType.item
						});
					} else {
						printSettingService.setCurrentRfqBoqSetting(JSON.parse(item.PropertyConfig), true, {
							eventName: constants.eventNames.applyNewGenericProfile,
							profileType: constants.profileType.boq
						});
					}
				}
			}

			function setGenericProfile(item) {
				if (item && item.PropertyConfig) {
					printSettingService.setCurrentGenericSetting(JSON.parse(item.PropertyConfig), true, {
						eventName: constants.eventNames.applyNewGenericProfile,
						profileType: constants.profileType.generic
					});
				}
			}

			function loadProfiles(isResetGeneric, isResetRfq, isResetDefault, resetGenValue, resetRfqValue) {
				var genericPromise = profileService.getGenericProfiles(true);

				var rfqPromise = null, rfqHeaderId = rfqDataService.getIfSelectedIdElse(-1);
				if (controllerOptions.printType === constants.printType.item) {
					rfqPromise = profileService.getRfqItemProfiles(rfqHeaderId, true);
				} else {
					rfqPromise = profileService.getRfqBoqProfiles(rfqHeaderId, true);
				}
				return $q.all([genericPromise, rfqPromise]).then(function (result) {
					var genericItems = result[0], rfqItems = result[1];
					_.each(_.concat(genericItems, rfqItems), function (p) {
						if (p.Description) {
							p.DisplayText = p.Description;
						} else {
							p.DisplayText = $translate.instant('procurement.pricecomparison.printing.latestProfile');
						}
						if (p.IsDefault) {
							var type = p.IsSystem ? $translate.instant('basics.common.configLocation.system') : $translate.instant('basics.common.configLocation.role');
							p.DisplayText += ' (' + type + ' ' + $translate.instant('procurement.pricecomparison.printing.default') + ')';
						}
					});
					$scope.settings.genericProfile.options.items = genericItems;
					$scope.settings.rfqProfile.options.items = rfqItems;
					lookupDescriptorService.updateData('Profile', genericItems);
					lookupDescriptorService.updateData('Profile', rfqItems);
					if ($scope.settings.genericProfile.selectedValue === 0 && isResetDefault) {
						var currGeneric = printSettingService.getDefaultProfileItem(genericItems);
						if (currGeneric && currGeneric.Id) {
							$scope.settings.genericProfile.selectedValue = currGeneric.Id;
						}
					}
					if (isResetGeneric) {
						if (resetGenValue) {
							$scope.settings.genericProfile.selectedValue = resetGenValue;
						} else {
							$scope.settings.genericProfile.selectedValue = 0;
						}
					}
					if ($scope.settings.rfqProfile.selectedValue === 0 && isResetDefault) {
						var currRfq = printSettingService.getDefaultProfileItem(rfqItems);
						if (currRfq && currRfq.Id) {
							$scope.settings.rfqProfile.selectedValue = currRfq.Id;
						} else {
							$scope.settings.rfqProfile.selectedValue = constants.currentView.rfq;
						}
					}
					if (isResetRfq) {
						if (resetRfqValue) {
							$scope.settings.rfqProfile.selectedValue = resetRfqValue;
						} else {
							$scope.settings.rfqProfile.selectedValue = 0;
						}
					}
				});
			}

			function getGenericProfileList() {
				return $scope.settings.genericProfile.options.items;
			}

			function getRfqProfile() {
				return $scope.settings.rfqProfile.options.items;
			}

			function onTabStateChange(stateInfo) {
				if (stateInfo) {
					var targetState = _.find($scope.tabState, {name: stateInfo.name});
					if (stateInfo.errors && stateInfo.errors.length > 0) {
						_.each(stateInfo.errors, function (error) {
							var targetErr = _.find(targetState.errors, {code: error.code});
							if (targetErr) {
								angular.extend(targetErr, error);
							} else {
								targetState.errors.push(error);
							}
						});
					}
					if (stateInfo.warnings && stateInfo.warnings.length > 0) {
						_.each(stateInfo.warnings, function (warning) {
							var targetWarn = _.find(targetState.warnings, {code: warning.code});
							if (targetWarn) {
								angular.extend(targetWarn, warning);
							} else {
								targetState.warnings.push(warning);
							}
						});
					}
				}

				var stateErrors = [];
				var stateWarnings = [];

				_.each($scope.tabState, function (state) {
					var errors = _.filter(state.errors, {invalid: true});
					var warnings = _.filter(state.warnings, {invalid: true});
					stateErrors = stateErrors.concat(errors);
					stateWarnings = stateWarnings.concat(warnings);
				});

				$scope.hasErrors = stateErrors.length > 0;
				$scope.stateErrors = stateErrors;
				$scope.stateWarnings = stateWarnings;
			}

			function initial() {
				var tabs = (controllerOptions.tabItems || []).concat([
					{
						name: 'pageLayout',
						title: $translate.instant('procurement.pricecomparison.printing.pageLayout'),
						content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-page-layout.html',
						active: true,
						sorting: 10
					},
					{
						name: 'bidder',
						title: $translate.instant('procurement.pricecomparison.printing.bidder'),
						content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-bidders.html',
						sorting: 15
					},
					{
						name: 'report',
						title: $translate.instant('procurement.pricecomparison.printing.reportSetting'),
						content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-report-setting.html',
						sorting: 20
					},
					{
						name: 'column',
						title: $translate.instant('procurement.pricecomparison.printing.columnSetting'),
						content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-column-setting.html',
						sorting: 30
					},
					{
						name: 'row',
						title: $translate.instant('procurement.pricecomparison.printing.rowSetting'),
						content: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-row-setting.html',
						sorting: 40
					}
				]);

				printSettingService.setCurrentPrintType(controllerOptions.printType);

				printSettingService.onTabStateChange.register(onTabStateChange);

				printSettingService.getSystemOptions().then(function (response) {
					// var result = response && response.data && response.data.LoadDefaultProfile || false;
					// setLoadProfile(result ? constants.loadValue.default : null, result, false);
					var printLoadType = systemOptions(response);
					var initPromise = [printSettingService.getCurrentGenericSetting(true, true, printLoadType === constants.printLoadType.loadUiView), commonService.loadDeviation()];
					if (printLoadType === constants.printLoadType.loadUiView) {
						initPromise.push(loadProfiles(true, true, false, constants.currentView.generic, constants.currentView.rfq));
					} else {
						initPromise.push(loadProfiles(false, false, true));
					}

					if (controllerOptions.printType === constants.printType.item) {
						initPromise.push(printSettingService.getCurrentRfqItemSetting(true, true, printLoadType === constants.printLoadType.loadUiView));
					} else {
						initPromise.push(printSettingService.getCurrentRfqBoqSetting(true, true, printLoadType === constants.printLoadType.loadUiView));
					}

					$q.all(initPromise).then(function () {

						$scope.tabs = _.sortBy(tabs, function (item) {
							return item.sorting;
						});
						$scope.tabState = _.map($scope.tabs, function (tab) {
							return {
								name: tab.name,
								warnings: [],
								errors: [],
								loading: true
							};
						});
					}).finally(function () {
						$scope.isLoading = false;
					});
				});
			}

			function systemOptions(response) {
				var printLoadType = response.data ? response.data.ParameterValue : -1;
				printSettingService.setLoadDefaultProfile(printLoadType);
				switch (printLoadType) {
					case constants.printLoadType.loadDefault: // default
						setLoadProfile(constants.loadValue.default, true, false);
						break;
					case constants.printLoadType.loadUiView: // current
						setLoadProfile(constants.loadValue.current, false, true);
						break;
					case constants.printLoadType.loadLatest: // latest
						setLoadProfile(null, false, false);
						break;
					default: // default latest
						setLoadProfile(null, false, false);
						break;
				}
				return printLoadType;
			}

			initial();

			$scope.onTabSelect = function (tab) {
				if (tab && tab.active && tab.name === 'row') {
					printSettingService.onCurrentSettingChanged.fire({
						eventName: constants.eventNames.containerSizeChange
					});
				}
			};

			function setLatest(eventInfo) {
				if (eventInfo &&
					(eventInfo.eventName === constants.eventNames.genericClickChange ||
						eventInfo.eventName === constants.eventNames.rfqClickChange)) {
					printSettingService.onCollectSetting.fire();
					if (eventInfo.eventName === constants.eventNames.genericClickChange) {
						printSettingService.setLatestGeneric($scope.settings.genericProfile, controllerOptions.printType);
						setLoadProfile(null, false, false);
					} else if (eventInfo.eventName === constants.eventNames.rfqClickChange) {
						printSettingService.setLatestRfqProfile($scope.settings.rfqProfile, controllerOptions.printType);
						setLoadProfile(null, false, false);
					}
					$rootScope.safeApply();
				}
			}

			commonService.registerLoadFinish.register(loadOverForItemType);
			var summaryCount = 0;

			function loadOverForItemType(info) {
				if (info.type === 'itemTypeReadonly' && info.value === settingConfiguration.getGids().summaryCompareField) {
					summaryCount++;
					if (summaryCount === 2) {
						commonHelperService.itemTypeReadonlyOnload();
					}
				}
			}

			printSettingService.onCurrentSettingChanged.register(setLatest);
			$scope.$on('$destroy', function () {
				printSettingService.onCurrentSettingChanged.unregister(setLatest);
				printSettingService.onTabStateChange.unregister(onTabStateChange);
				commonService.registerLoadFinish.unregister(loadOverForItemType);
			});

		}
	]);
})(angular);