/**
 * Created by lnb on 11/17/2014.
 */
(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').controller('procurementContractSetPrcBoqCodeDialogController',
		['_', '$scope', '$translate', '$http', '$injector', '$q', 'platformTranslateService', 'procurementCommonPrcBoqValidationService', 'prcBoqMainService', 'procurementCommonPrcBoqService', 'procurementContextService', 'platformRuntimeDataService', 'prcBaseBoqLookupService', 'basicsLookupdataLookupDefinitionService', 'basicsLookupdataLookupFilterService', 'controllerOptions',
			function (_, $scope, $translate, $http, $injector, $q, platformTranslateService, procurementCommonPrcBoqValidationService, prcBoqMainService, procurementCommonPrcBoqService, moduleContext, platformRuntimeDataService, prcBaseBoqLookupService, basicsLookupdataLookupDefinitionService, basicsLookupdataLookupFilterService, controllerOptions) {

				var boqMainService = prcBoqMainService.getService(moduleContext.getMainService());
				var dataService = procurementCommonPrcBoqService.getService(moduleContext.getMainService(), boqMainService);
				var validationService = procurementCommonPrcBoqValidationService(dataService);
				var readOnlyFields = ['BoqRootItem.Reference', 'BoqRootItem.BriefInfo'/* , 'PrcBoq.BasCurrencyFk' */];

				basicsLookupdataLookupDefinitionService.load(['procurementPackagePackage2HeaderCombobox', 'prcCommonBaseBoqLookup']);
				var copyModeFk = controllerOptions.defaults.PrcCopyModeFk;
				var enableUseBaseBoq = controllerOptions.defaults.enableUseBaseBoq;
				var enableUseWicBoq = controllerOptions.defaults.enableUseWicBoq;
				var enableNewBoq = controllerOptions.defaults.enableNewBoq;
				var boqSource = controllerOptions.defaults.boqSource; // 1: package; 2: wic; 3: new
				var enableUseBaseBoqOri = enableUseBaseBoq;
				var enableUseWicBoqOri = enableUseWicBoq;
				var enableNewBoqOri = enableNewBoq;
				let promiseCount = 0;

				$scope.currentItem = {
					PrcBoq: {
						PrcHeaderFk: controllerOptions.defaults.PrcHeaderFk,
						PackageFk: controllerOptions.defaults.PackageFk,
						baseBasCurrencyFk: controllerOptions.defaults.BasCurrencyFk,// keep.
						BasCurrencyFk: controllerOptions.defaults.BasCurrencyFk,// keep.
						wicBoqCurrencyFk: null
					},
					BoqRootItem: {
						baseReference: controllerOptions.defaults.Reference,
						baseBriefInfo: {
							Description: controllerOptions.defaults.OutlineDescription || '',
							Translated: controllerOptions.defaults.OutlineDescription || ''
						},
						Reference: controllerOptions.defaults.Reference,
						BriefInfo: {
							Description: controllerOptions.defaults.OutlineDescription || '',
							Translated: controllerOptions.defaults.OutlineDescription || ''
						},
						BoqItemPrjBoqFk: null, // BoqHeader of base boq root item
						BoqItemPrjItemFk: null, // Id of base boq root item
						BoqHeaderFk: null
					},
					PrcHeaderFkOriginal: 0,
					BaseBoqReference: '',
					takeOverOption: 1, // 1:Take Over Entire Boq 2:Take Over Boq Header Only
					WicBoqReference: controllerOptions.defaults.WicBoqReference,
					ConReqHasWicBoq: controllerOptions.defaults.ConReqHasWicBoq,
					wicGroupFk: controllerOptions.defaults.ConReqHasWicBoq ? controllerOptions.defaults.BoqWicCatFk : null,
					wicBoqFk: controllerOptions.defaults.ConReqHasWicBoq ? controllerOptions.defaults.BoqWicCatBoqFk : null,
					boqSource: boqSource,
					Package2HeaderFk: null
				};

				$scope.lookupOptions = {
					package: {
						lookupDirective: 'procurement-common-package-lookup',
						descriptionMember: 'Description',
						lookupOptions: {
							filterKey: 'prc-boq-package-filter',
							readOnly: true
						}
					},
					subpackage: {
						filterKey: 'prc-boq-package2header-filter',
						events: [
							{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									var selectedItem = args.selectedItem;
									fireSubPackageSelectedChangeEvent(selectedItem);
								}
							}
						]
					},
					baseBoq: {
						lookupDirective: 'prc-common-base-boq-lookup',
						descriptionMember: 'BoqRootItem.BriefInfo.Translated',
						lookupOptions: {
							filterKey: 'prc-base-boq-filter'
						}
					},
					wicGroup: {
						lookupDirective: 'basics-lookup-data-by-custom-data-service',
						descriptionMember: 'DescriptionInfo.Translated',
						lookupOptions: {
							valueMember: 'Id',
							displayMember: 'Code',
							lookupModuleQualifier: 'procurementCommonWicGroupByMasterRestrictionLookupService',
							dataServiceName: 'procurementCommonWicGroupByMasterRestrictionLookupService',
							showClearButton: false,
							lookupType: 'procurementCommonWicGroupByMasterRestrictionLookupService',
							columns: [
								{
									id: 'Code',
									field: 'Code',
									name: 'Code',
									formatter: 'code',
									name$tr$: 'cloud.common.entityCode'
								},
								{
									id: 'Description',
									field: 'DescriptionInfo',
									name: 'Description',
									formatter: 'translation',
									name$tr$: 'cloud.common.entityDescription'
								}
							],
							uuid: 'aee374374c634e27ba45e6e145f872ae',
							filter: function (){
								return controllerOptions.defaults.headerId;
							},
							disableDataCaching: true,
							enableCache: false,
							isClientSearch: false,
							isTextEditable: false,
							treeOptions: {
								parentProp: 'WicGroupFk',
								childProp: 'WicGroups',
								initialState: 'expanded',
								inlineFilters: true,
								hierarchyEnabled: true
							}
						}
					},
					wicBoq: {
						lookupDirective: 'basics-lookup-data-by-custom-data-service',
						descriptionMember: 'BriefInfo.Translated',
						lookupOptions: {
							valueMember: 'Id',
							displayMember: 'Reference',
							lookupModuleQualifier: 'procurementCommonWicBoqLookupService',
							dataServiceName: 'procurementCommonWicBoqLookupService',
							showClearButton: false,
							lookupType: 'procurementCommonWicBoqLookupService',
							columns: [
								{
									id: 'Reference',
									field: 'Reference',
									name: 'Reference',
									name$tr$: 'cloud.common.entityReference'
								},
								{
									id: 'BriefInfo',
									field: 'BriefInfo.Translated',
									name: 'Description',
									name$tr$: 'cloud.common.entityBrief'
								}
							],
							uuid: '907712c1326f4481a00562d6d862687f',
							filter: function (){
								return $scope.currentItem.wicGroupFk || -1;
							},
							disableDataCaching: true,
							enableCache: false,
							isClientSearch: false,
							isTextEditable: false
						}
					}/* ,
					currency:{
						readOnly: true
					} */
				};

				if ($scope.currentItem.ConReqHasWicBoq) {
					$scope.lookupOptions.wicGroup.lookupOptions.lookupModuleQualifier = 'estimateAssembliesWicGroupLookupDataService';
					$scope.lookupOptions.wicGroup.lookupOptions.dataServiceName = 'estimateAssembliesWicGroupLookupDataService';
					$scope.lookupOptions.wicGroup.lookupOptions.lookupType = 'estimateAssembliesWicGroupLookupDataService';
					delete $scope.lookupOptions.wicGroup.lookupOptions.filter;
				}

				$scope.fieldConfig = {
					package: {
						model: 'PrcBoq.PackageFk',
						validator: validatePackageFk
					},
					subpackage: {
						model: 'Package2HeaderFk',
						validator: validateSubPakcagePrcHeaderFk,
						rt$hasError: function () {
							return platformRuntimeDataService.hasError($scope.currentItem, 'Package2HeaderFk');
						},
						rt$errorText: function () {
							return platformRuntimeDataService.getErrorText($scope.currentItem, 'Package2HeaderFk');
						}
					},
					brief: {
						model: 'BoqRootItem.BriefInfo.Translated',
						rt$readonly: isReadonlyNewBoq
					},
					reference: {
						model: 'BoqRootItem.Reference',
						asyncValidator: referenceValidator,
						rt$readonly: isReadonlyNewBoq,
						rt$hasError: function () {
							return platformRuntimeDataService.hasError($scope.currentItem, 'BoqRootItem.Reference');
						},
						rt$errorText: function () {
							return platformRuntimeDataService.getErrorText($scope.currentItem, 'BoqRootItem.Reference');
						}
					},
					baseBoq: {
						enableUseBaseBoq: {
							readonly: function () {
								return !enableUseBaseBoq;
							}
						},
						rt$readonly: function () {
							return $scope.currentItem.boqSource !== 1 || !enableUseBaseBoq;
						},
						model: 'BaseBoqReference',
						validator: validateBaseBoqReference,
						visible: $scope.currentItem.boqSource !== 2
					},
					newBoq: {
						enableUseNewBoq: {
							readonly: function () {
								return !enableNewBoq;
							}
						}
					},
					wicBoq: {
						enableUseWicBoq: {
							readonly: function () {
								return !enableUseWicBoq;
							}
						},
						rt$readonly: isReadonlyWicBoqInfo,
						isDisable: isDisableWicInfo,
						model: 'wicBoqFk',
						validator: validateWicBoqFk,
						visible: $scope.currentItem.boqSource === 2, // $scope.currentItem.boqSource === 2
						visibleWic: angular.isDefined(copyModeFk) || controllerOptions.defaults.inReq
					},
					wicGroup: {
						model: 'wicGroupFk',
						rt$readonly: isReadonlyWicInfo,
						isDisable: isDisableWicInfo,
						validator: validateWicGroupFk,
						visible: $scope.currentItem.boqSource === 2
					},
					boqSource: {
						rt$change: boqSourceChanged
					},
					takeOverOption: {
						enableTakeOverOption: function () {
							return ($scope.currentItem.boqSource === 1 && enableUseBaseBoq) || ($scope.currentItem.boqSource === 2 && enableUseWicBoq);
						}
					},
					wicBoqReference: {
						model: 'WicBoqReference',
						asyncValidator: referenceValidator,
						rt$readonly: function () {
							return $scope.currentItem.boqSource !== 2 || !enableUseWicBoq || !$scope.currentItem.wicBoqFk;
						},
						rt$hasError: function () {
							return platformRuntimeDataService.hasError($scope.currentItem, 'WicBoqReference');
						},
						rt$errorText: function () {
							return platformRuntimeDataService.getErrorText($scope.currentItem, 'WicBoqReference');
						},
						isDisable: function () {
							return $scope.currentItem.boqSource !== 2 || !enableUseWicBoq || !$scope.currentItem.wicBoqFk;
						}
					}
				};

				$scope.setTools = function (tools) {
					$scope.tools = tools;
				};

				$scope.modalOptions = {
					closeButtonText: 'Cancel',
					actionButtonText: 'OK',
					headerText: $translate.instant('procurement.common.boq.createDialogTitle')
				};

				$scope.modalOptions.ok = function onOK() {
					if (updateValidation()) {
						var userData = angular.copy($scope.currentItem);
						if (userData.boqSource === 1) {
							userData.BoqRootItem.BriefInfo = $scope.currentItem.BoqRootItem.baseBriefInfo;
							userData.BoqRootItem.Reference = $scope.currentItem.BoqRootItem.baseReference;
							userData.PrcBoq.BasCurrencyFk = $scope.currentItem.PrcBoq.baseBasCurrencyFk;
						}
						else if (userData.boqSource === 2) {
							userData.PrcBoq.BasCurrencyFk = null;
							userData.BoqRootItem.BoqHeaderFk = $scope.currentItem.BoqRootItem.BoqHeaderFk;
							userData.WicGroupFk = $scope.currentItem.wicGroupFk;
							userData.WicBoqFk = $scope.currentItem.wicBoqFk;
							userData.BoqRootItem.Reference = $scope.currentItem.WicBoqReference;
						}
						$scope.$close(userData);
					}
				};

				$scope.modalOptions.cancel = function onCancel() {
					$scope.$close(false);
				};

				// Set callback for currently loaded items
				prcBaseBoqLookupService.setCurrentlyLoadedItemsCallback(controllerOptions.defaults.CurrentlyLoadedItemsCallbackFn);

				// Set initial package to base boq lookup
				prcBaseBoqLookupService.setCurrentPrcPackage(controllerOptions.defaults.PackageFk);

				if ($scope.currentItem.WicBoqReference) {
					if ($scope.currentItem.WicBoqReference.length > 16) {
						$scope.currentItem.WicBoqReference = $scope.currentItem.WicBoqReference.substring(0, 16);
					}
					referenceValidator($scope.currentItem, $scope.currentItem.WicBoqReference, 'WicBoqReference')
						.then(function (result) {
							platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'WicBoqReference');
						});
				}

				function validatePackageFk(entity, value, model) {
					var result = validationService.validatePrcBoq$PackageFk.apply(validationService, arguments);
					if (result && model === 'PrcBoq.PackageFk') {
						// if change Package, then should reset sub package
						if (Object.prototype.hasOwnProperty.call(entity,'PrcHeaderFkOriginal')) {
							// Reset values to defaults
							$scope.currentItem.BoqRootItem.Reference = controllerOptions.defaults.Reference;
							$scope.currentItem.BoqRootItem.baseReference = controllerOptions.defaults.Reference;
							$scope.currentItem.PrcHeaderFkOriginal = 0;
							$scope.currentItem.BaseBoqReference = 0;
							// if change package, then should remove BoqRootItem.Reference's validate error
							platformRuntimeDataService.applyValidationResult(true, $scope.currentItem, 'BoqRootItem.Reference');
						}
						readOnlyRefenceAndBriefInfo(false);
						prcBaseBoqLookupService.setCurrentPrcPackage(value);
						entity.PackageFk = value;
					} else if (result) {
						prcBaseBoqLookupService.setCurrentPrcPackage(value);
					}
					if (entity.PrcBoq) {
						entity.PrcBoq.PackageFk = value;
					}
					chooseFirstSubPackage();
					return result;
				}

				function validateSubPakcagePrcHeaderFk(entity, value) {
					// Reset values to defaults
					$scope.currentItem.BaseBoqReference = 0;

					// when change sub package , should validate Reference at runtime
					initialValidateReference(function () {
						chooseFirstBaseBoq();
					});
					var validateResult = {valid: false, error: 'required'};
					if (value !== null && value > 0) {
						validateResult.valid = true;
						enableUseBaseBoq = enableUseBaseBoqOri;
						enableUseWicBoq = enableUseWicBoqOri;
						enableNewBoq = enableNewBoqOri;
						$scope.currentItem.boqSource = boqSource;
					} else {
						// disabledDialog();
						$scope.currentItem.boqSource = 0;
						$scope.currentItem.BaseBoqReference = 0;
						$scope.currentItem.takeOverOption = 0;
						enableUseBaseBoq = false;
						enableUseWicBoq = false;
						enableNewBoq = false;
						clearCreateNew();
					}
					platformRuntimeDataService.applyValidationResult(validateResult, $scope.currentItem, 'Package2HeaderFk');
					return validateResult;
				}

				// noinspection JSUnusedLocalSymbols
				function validateBaseBoqReference(entity, value) {
					promiseCount++;
					prcBaseBoqLookupService.getPrcBaseBoqList().then(function (baseBoqs) {
						promiseCount--;
						var basePrcBoqExtended = _.find(baseBoqs, {Id: value});
						if (angular.isDefined(basePrcBoqExtended) && (basePrcBoqExtended !== null)) {
							var baseBoqReference = basePrcBoqExtended.BoqRootItem.Reference;
							var baseBoqBriefInfoTranslated = basePrcBoqExtended.BoqRootItem.BriefInfo.Translated;

							// Based on the base boq reference we set the initial reference for the version boq that's to be created
							$scope.currentItem.BoqRootItem.baseReference = baseBoqReference;
							$scope.currentItem.BoqRootItem.baseBriefInfo.Translated = baseBoqBriefInfoTranslated;

							// We link the boq root item to be created to the currently selected base boq by two special foreign keys
							$scope.currentItem.BoqRootItem.BoqItemPrjBoqFk = basePrcBoqExtended.BoqRootItem.BoqHeaderFk; // BoqHeader of base boq root item
							$scope.currentItem.BoqRootItem.BoqItemPrjItemFk = basePrcBoqExtended.BoqRootItem.Id; // Id of base boq root item

							readOnlyRefenceAndBriefInfo(true);
							$scope.currentItem.PrcBoq.baseBasCurrencyFk = basePrcBoqExtended.BoqHeader.BasCurrencyFk;
							clearCreateNew();
						}
						else {
							readOnlyRefenceAndBriefInfo(false);

							if ($scope.currentItem.boqSource === 2) {
								clearCreateNew(true);
							} else if ($scope.currentItem.boqSource === 3) {
								// Reset values to defaults
								$scope.currentItem.BoqRootItem.Reference = controllerOptions.defaults.Reference;
								$scope.currentItem.BoqRootItem.baseReference = controllerOptions.defaults.Reference;
								$scope.currentItem.BoqRootItem.BriefInfo = {Description: '', Translated: ''};
								$scope.currentItem.BoqRootItem.baseBriefInfo = {Description: '', Translated: ''};
								$scope.currentItem.BoqRootItem.BoqItemPrjBoqFk = null;
								$scope.currentItem.BoqRootItem.BoqItemPrjItemFk = null;
								$scope.currentItem.PrcBoq.baseBasCurrencyFk = controllerOptions.defaults.BasCurrencyFk;
								$scope.currentItem.PrcBoq.BasCurrencyFk = controllerOptions.defaults.BasCurrencyFk;
								referenceValidator($scope.currentItem, $scope.currentItem.BoqRootItem.Reference, 'BoqRootItem.Reference')
									.then(function (result) {
										platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'BoqRootItem.Reference');
									});
							}
						}
					});
					return true;
				}

				// set readOnly to BoqRootItem.Reference And BoqRootItem.BriefInfo when select a BaseBoqReference
				function readOnlyRefenceAndBriefInfo(readOnly) {
					readOnly = !enableNewBoq;
					if ($scope.currentItem.PrcHeaderFkOriginal === 0) {// default PrcHeaderFkOriginal is 0
						readOnly = true;
					}
					readOnlyFields.forEach(function (field) {
						platformRuntimeDataService.readonly($scope.currentItem, [{
							field: field,
							readonly: readOnly
						}]);
					});
				}

				function initialValidateReference(onCheckComplete) {
					readOnlyRefenceAndBriefInfo(false);
					if ($scope.currentItem.PrcHeaderFkOriginal !== 0) {
						promiseCount++;
						$http.get(globals.webApiBaseUrl + 'procurement/common/boq/getuniquereference?prcHeaderFk=' +
							$scope.currentItem.PrcBoq.PrcHeaderFk + '&&packageFk=' + $scope.currentItem.PrcBoq.PackageFk).then(function (result) {
							$scope.currentItem.BoqRootItem.Reference = '';
							$scope.currentItem.BoqRootItem.baseReference = result.data;
							// if get unique reference, need remove BoqRootItem.Reference's validate error
							platformRuntimeDataService.applyValidationResult(true, $scope.currentItem, 'BoqRootItem.Reference');
						}).finally(function () {
							promiseCount--;
							if (angular.isFunction(onCheckComplete)) {
								onCheckComplete();
							}
						});
					}
				}

				function updateValidation() {
					var result1 = validatePackageFk($scope.currentItem, $scope.currentItem.PrcBoq.PackageFk);
					platformRuntimeDataService.applyValidationResult(result1, $scope.currentItem, 'PrcBoq.PackageFk');
					var result2 = validationService.validatePrcBoq$PackageFk($scope.currentItem, $scope.currentItem.PrcHeaderFkOriginal);
					platformRuntimeDataService.applyValidationResult(result2, $scope.currentItem, 'Package2HeaderFk');
					return result1 === true && result2 === true;
				}

				function fireSubPackageSelectedChangeEvent(selectedItem) {
					if (angular.isDefined(selectedItem) && (selectedItem !== null)) {
						var prcHeaderFk = selectedItem.PrcHeaderFk;
						$scope.currentItem.PrcHeaderFkOriginal = prcHeaderFk;

						var result2 = validationService.validatePrcBoq$PackageFk($scope.currentItem, $scope.currentItem.PrcHeaderFkOriginal);
						platformRuntimeDataService.applyValidationResult(result2, $scope.currentItem, 'Package2HeaderFk');

						prcBaseBoqLookupService.setCurrentPrcHeader(prcHeaderFk);
					}
				}

				function chooseFirstSubPackage() {
					if ($scope.currentItem.PrcBoq.PackageFk) {
						var lookupInstance = basicsLookupdataLookupDefinitionService.get('PrcPackage2Header');
						var filter = basicsLookupdataLookupFilterService.getFilterByKey('prc-boq-package2header-filter');
						var request = {
							SearchFields: [],
							SearchText: '',
							FilterKey: 'prc-boq-package2header-filter',
							AdditionalParameters: filter.fn($scope.currentItem),
							TreeState: {
								StartId: null,
								Depth: null
							}
						};
						var searchRequest = lookupInstance.version === 3 ? request : angular.toJson(request);
						promiseCount++;
						lookupInstance.dataProvider.getSearchList(searchRequest, lookupInstance).then(function (items) {
							promiseCount--;
							if (items && items.length > 0) {
								$scope.currentItem.Package2HeaderFk = items[0].Id;
								fireSubPackageSelectedChangeEvent(items[0]);
							} else {
								$scope.currentItem.Package2HeaderFk = 0;
							}
							validateSubPakcagePrcHeaderFk($scope.currentItem, $scope.currentItem.Package2HeaderFk);
						});
					}
				}

				function chooseFirstBaseBoq() {
					if ($scope.currentItem.PrcBoq.PackageFk) {
						var lookupInstance = basicsLookupdataLookupDefinitionService.get('prcBaseBoqs');
						var filter = basicsLookupdataLookupFilterService.getFilterByKey('prc-base-boq-filter');
						promiseCount++;
						lookupInstance.dataProvider.getList().then(function (items) {
							promiseCount--;
							var filterResult = items && items.length > 0 ? items.filter(filter.fn) : null;
							if (filterResult && filterResult.length > 0) {
								if ($scope.currentItem.boqSource === 1) {
									$scope.currentItem.BaseBoqReference = filterResult[0].Id;
									$scope.currentItem.takeOverOption = 1;
								} else if ($scope.currentItem.boqSource === 2) {
									$scope.currentItem.takeOverOption = 1;
									if ($scope.currentItem.WicBoqReference) {
										referenceValidator($scope.currentItem, $scope.currentItem.WicBoqReference, 'WicBoqReference')
											.then(function (result) {
												platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'WicBoqReference');
											});
									}
								}
							} else if (enableUseWicBoq) {
								$scope.currentItem.BaseBoqReference = 0;
								$scope.currentItem.boqSource = 2;
								$scope.currentItem.takeOverOption = 1;
								enableUseBaseBoq = false;
							}
							else if (enableNewBoq){
								$scope.currentItem.BaseBoqReference = 0;
								$scope.currentItem.boqSource = 3;
								$scope.currentItem.takeOverOption = 0;
								enableUseBaseBoq = false;
							} else {
								$scope.currentItem.BaseBoqReference = 0;
								$scope.currentItem.boqSource = 0;
								$scope.currentItem.takeOverOption = 0;
								enableUseBaseBoq = false;
							}
							validateBaseBoqReference($scope.currentItem, $scope.currentItem.BaseBoqReference);
						});
					}
				}

				function clearCreateNew(clear) {
					$scope.currentItem.BoqRootItem.Reference = '';
					$scope.currentItem.BoqRootItem.BriefInfo.Translated = '';
					// if BoqRootItem.Reference is set readOnly, then should remove BoqRootItem.Reference's validate error
					platformRuntimeDataService.applyValidationResult(true, $scope.currentItem, 'BoqRootItem.Reference');
					$scope.currentItem.PrcBoq.BasCurrencyFk = null;

					if (clear) {
						$scope.currentItem.BoqRootItem.BoqItemPrjBoqFk = null;
						$scope.currentItem.BoqRootItem.BoqItemPrjItemFk = null;
					}
				}

				initialValidateReference();

				updateValidation();

				$scope.commitableFn = commitableFn;

				// ////////////////////////////////

				function commitableFn() {
					let valid = !platformRuntimeDataService.hasError($scope.currentItem, 'PrcBoq.PackageFk') &&
						!platformRuntimeDataService.hasError($scope.currentItem, 'Package2HeaderFk');

					if ($scope.currentItem.boqSource === 3 &&
						(!$scope.currentItem.BoqRootItem.Reference ||
							platformRuntimeDataService.hasError($scope.currentItem, 'BoqRootItem.Reference'))) {
						valid = false;
					}

					if ($scope.currentItem.boqSource === 2 &&
						(!$scope.currentItem.wicBoqFk || $scope.currentItem.wicBoqFk <= 0 ||
							platformRuntimeDataService.hasError($scope.currentItem, 'WicBoqReference') ||
							!$scope.currentItem.WicBoqReference)) {
						valid = false;
					}

					return valid && promiseCount === 0;
				}

				function validateWicGroupFk(entity) {
					entity.wicBoqFk = null;
				}

				function validateWicBoqFk(entity, value) {
					if (entity.wicGroupFk <= 0) {
						return true;
					}
					var lookupService = $injector.get('procurementCommonWicBoqLookupService');
					var rootItemPromise = lookupService.getBoqRootItemsByWicCatGroupId(entity.wicGroupFk); // TODO chi: missing second param

					promiseCount++;
					rootItemPromise.then(function (response) {
						promiseCount--;
						if (!response || !angular.isArray(response.data)) {
							return;
						}
						var dataList = response.data;
						var rootItem = _.find(dataList, {Id: value});

						if (rootItem) {
							$scope.currentItem.BoqRootItem.BoqHeaderFk = rootItem.BoqHeaderFk;
							$scope.currentItem.WicBoqReference = rootItem.Reference;
							if (rootItem.Reference && rootItem.Reference.length > 16) {
								$scope.currentItem.WicBoqReference = rootItem.Reference.substring(0, 16);
							}
							referenceValidator($scope.currentItem, $scope.currentItem.WicBoqReference, 'WicBoqReference')
								.then(function (result) {
									platformRuntimeDataService.applyValidationResult(result, $scope.currentItem, 'WicBoqReference');
								});
						}
					});
					return true;
				}

				function boqSourceChanged() {
					if ($scope.currentItem.boqSource === 1 || $scope.currentItem.boqSource === 2) {
						$scope.currentItem.takeOverOption = 1;
						$scope.currentItem.PrcBoq.BasCurrencyFk = null;
						$scope.fieldConfig.baseBoq.visible = $scope.currentItem.boqSource === 1;
						$scope.fieldConfig.wicBoq.visible = $scope.currentItem.boqSource === 2;
						if ($scope.currentItem.boqSource === 1) {
							chooseFirstBaseBoq();
						} else {
							clearCreateNew(true);
						}
						$scope.$broadcast('form-config-updated');
					} else {
						$scope.currentItem.BaseBoqReference = 0;
						$scope.currentItem.takeOverOption = 0;
						$scope.currentItem.PrcBoq.BasCurrencyFk = controllerOptions.defaults.BasCurrencyFk;

						validateBaseBoqReference($scope.currentItem, validateBaseBoqReference.BaseBoqReference);
					}
				}

				function isReadonlyNewBoq() {
					return $scope.currentItem.boqSource !== 3 || !enableNewBoq;
				}

				function isReadonlyWicInfo() {
					return $scope.currentItem.boqSource !== 2 || !enableUseWicBoq || $scope.currentItem.ConReqHasWicBoq;
				}

				function isReadonlyWicBoqInfo() {
					return $scope.currentItem.boqSource !== 2 || !enableUseWicBoq || (controllerOptions.defaults.BoqWicCatBoqFk && $scope.currentItem.ConReqHasWicBoq);
				}

				function isDisableWicInfo() {
					return $scope.currentItem.boqSource !== 2 || !enableUseWicBoq;
				}

				function referenceValidator(entity, value, model) {
					promiseCount++;
					if (!value) {
						promiseCount--;
						return $q.when({
							valid: false,
							apply: true,
							error: '...',
							error$tr$: 'procurement.common.boq.wicBoqRefEmptyError'
						})
					}
					return validationService.asyncValidateBoqRootItem$Reference(entity, value)
						.then(function (result) {
							promiseCount--;
							return result;
						});
				}
			}]);
})(angular);