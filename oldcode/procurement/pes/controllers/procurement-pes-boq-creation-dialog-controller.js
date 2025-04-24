/**
 * Created by chi on 3/27/2019.
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pes';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	angular.module(moduleName).controller('procurementPesBoqCreationDialogController', procurementPesBoqCreationDialogController);

	procurementPesBoqCreationDialogController.$inject = ['_', '$scope', '$translate', '$q', '$http', 'basicsLookupdataLookupFilterService', 'basicsLookupdataLookupDescriptorService', 'prcBaseBoqLookupService', 'controllerOptions', '$injector',
	'platformRuntimeDataService', 'platformDataValidationService', 'globals'];

	function procurementPesBoqCreationDialogController(_, $scope, $translate, $q, $http, basicsLookupdataLookupFilterService, basicsLookupdataLookupDescriptorService, prcBaseBoqLookupService, controllerOptions, $injector,
													   platformRuntimeDataService, platformDataValidationService, globals) {

		var enableUseContractBoq = controllerOptions.enableUseContactBoq;
		var enableUsePackageBoq = controllerOptions.enableUsePackageBoq;
		var enableUseWicBoq = controllerOptions.enableUseWicBoq;
		var boqSource = controllerOptions.boqSource; // 1: contract; 2: package; 3: wic
		let promiseCount = 0;

		$scope.currentItem = controllerOptions.currentItem;
		$scope.canStructureShow = angular.isDefined(controllerOptions.canStructureShow) ? controllerOptions.canStructureShow : true;
		$scope.canTaxCodeShow = angular.isDefined(controllerOptions.canTaxCodeShow) ? controllerOptions.canTaxCodeShow : true;
		$scope.canControllingUnitShow = angular.isDefined(controllerOptions.canControllingUnitShow) ? controllerOptions.canControllingUnitShow : true;

		angular.extend($scope.currentItem, {
			ContractBoqFk: null, // prc boq lookup id
			PackageBoqFk: null, // prc boq lookup id
			WicBoqFk: null, // wic boq root item id
			WicGroupFk: null, // wic cat group id
			PrcBoqFk: null, // prc boq id
			SubPackageFk: null,
			TakeOverOption: 1,
			BoqSource: boqSource,
			IsIncludeNotContractedItem: true,
			WicBoqReference: ''
		});

		let contracts = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
		let contract = contracts ? contracts[$scope.currentItem.ConHeaderFk] : null;
		$scope.currentItem.ContractPrcHeaderFk = contract ? contract.PrcHeaderId : -1;

		var validationService = controllerOptions.validationService;
		var filters = [
			{
				key: 'pes-boq-package2header-filter',
				serverKey: 'prc-boq-package2header-filter',
				serverSide: true,
				fn: function (item) {
					var packageFk = -1;
					if (item && item.PackageFk) {
						packageFk = item.PackageFk;
					}

					return {PrcPackageFk: packageFk};
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		$scope.lookupOptions = {
			contract: {
				lookupDirective: 'prc-con-header-dialog',
				descriptionMember: 'Description',
				lookupOptions: {
					showClearButton: false,
					filterKey: 'prc-con-header-for-pes-filter'
				}
			},
			package: {
				lookupDirective: 'procurement-common-package-lookup',
				descriptionMember: 'Description',
				lookupOptions: {
					filterKey: 'pes-boq-package-for-pes-filter',
					showClearButton: true
				}
			},
			contractBoq: {
				filterKey: 'pes-boq-con-merge-boq-filter'
			},
			packageBoq: {
				lookupDirective: 'prc-common-base-boq-lookup',
				descriptionMember: 'BoqRootItem.BriefInfo.Translated',
				lookupOptions: {
					filterKey: 'pes-boq-prc-base-boq-filter'
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
					filter: function () {
						return $scope.currentItem.ConHeaderFk || -1;
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
					filter: function () {
						return $scope.currentItem.WicGroupFk || -1;
					},
					disableDataCaching: true,
					enableCache: false,
					isClientSearch: false,
					isTextEditable: false
				}
			},
			prcStructure: {
				lookupDirective: 'basics-procurementstructure-structure-dialog',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					filterKey: 'basics-materialcatalog-procurement-structure-filter'
				}
			},
			taxCode: {
				lookupDirective: 'basics-master-data-context-tax-code-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {}
			},
			subPackage: {
				filterKey: 'pes-boq-package2header-filter'
			},
			controllingUnit: {
				lookupDirective: 'controlling-structure-dialog-lookup',
				descriptionMember: 'DescriptionInfo.Translated',
				lookupOptions: {
					filterKey: 'pes-boq-controlling-unit-filter',
					considerPlanningElement: true,
					selectableCallback: function (dataItem) {
						return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
					}
				}
			}
		};

		$scope.fieldConfig = {
			contract: {
				model: 'ConHeaderFk',
				validator: validateContract
			},
			package: {
				model: 'PackageFk',
				validator: validatePackage
			},
			contractBoq: {
				enableUseContractBoq: {
					readonly: function () {
						return !enableUseContractBoq || !isPackageHasValue();
					}
				},
				boq: {
					rt$readonly: function () {
						return !enableUseContractBoq || !isPackageHasValue();
					},
					model: 'ContractBoqFk',
					visible: function () {
						return $scope.currentItem.BoqSource === 1;
					},
					validator: validateBoq
				}
			},
			packageBoq: {
				enableUsePackageBoq: {
					readonly: function () {
						return !enableUsePackageBoq || !isPackageHasValue();
					}
				},
				boq: {
					rt$readonly: function () {
						return !enableUsePackageBoq || !isPackageHasValue();
					},
					model: 'PackageBoqFk',
					visible: function () {
						return $scope.currentItem.BoqSource === 2;
					},
					validator: validateBoq
				}
			},
			wicBoq: {
				enableUseWicBoq: {
					readonly: function () {
						return !enableUseWicBoq || !isPackageHasValue();
					}
				},
				boq: {
					rt$readonly: function () {
						return !enableUseWicBoq || !isPackageHasValue();
					},
					model: 'WicBoqFk',
					visible: function () {
						return $scope.currentItem.BoqSource === 3;
					},
					validator: validateBoq
				}
			},
			takeOverOption: {
				enableTakeOverOption: function () {
					return isPackageHasValue() && ((enableUseContractBoq && $scope.currentItem.BoqSource === 1) || (enableUsePackageBoq && $scope.currentItem.BoqSource === 2) || (enableUseWicBoq && $scope.currentItem.BoqSource === 3));
				},
				visible: function () {
					return $scope.currentItem.BoqSource === 1 || $scope.currentItem.BoqSource === 2 || $scope.currentItem.BoqSource === 3;
				},
				enableIncludeNonContractedItem: function () {
					return $scope.fieldConfig.takeOverOption.enableTakeOverOption() && $scope.currentItem.TakeOverOption === 1 && (enableUseContractBoq && $scope.currentItem.BoqSource === 1);
				},
				visibleIncludeNonContractedItem: function () {
					return $scope.fieldConfig.takeOverOption.enableIncludeNonContractedItem();
				}
			},
			prcStructure: {
				model: 'PrcStructureFk',
				validator: validatePrcStructure
			},
			taxCode: {
				model: 'MdcTaxCodeFk',
				validator: validateTaxCode
			},
			wicGroup: {
				model: 'WicGroupFk',
				visible: $scope.currentItem.BoqSource === 3,
				rt$readonly: function () {
					return !isPackageHasValue();
				}
			},
			subPackage: {
				model: 'SubPackageFk',
				rt$readonly: function () {
					return !isPackageHasValue();
				}
			},
			boqSource: {
				rt$change: boqSourceChanged
			},
			controllingUnit: {
				model: 'ControllingUnitFk',
				validator: validateControllingUnit
			},
			wicBoqReference: {
				model: 'WicBoqReference',
				asyncValidator: referenceValidator,
				rt$readonly: function () {
					return !enableUseWicBoq || !isPackageHasValue() || !$scope.currentItem.WicBoqFk;
				},
				rt$hasError: function () {
					return platformRuntimeDataService.hasError($scope.currentItem, 'WicBoqReference');
				},
				rt$errorText: function () {
					return platformRuntimeDataService.getErrorText($scope.currentItem, 'WicBoqReference');
				}
			}
		};

		$scope.modalOptions = {
			headerText: $translate.instant('procurement.pes.createPesBoq'),
			ok: ok,
			cancel: cancel,
			okBtnDisabled: function () {
				let disabled = !$scope.currentItem.PrcBoqFk && ($scope.currentItem.BoqSource === 3 ? !$scope.currentItem.WicBoqFk || !$scope.currentItem.SubPackageFk || platformRuntimeDataService.hasError($scope.currentItem, 'WicBoqReference') || !$scope.currentItem.WicBoqReference : true) ||
					!checkRequiredField($scope.currentItem.PrcStructureFk) || !checkRequiredField($scope.currentItem.MdcTaxCodeFk) || !checkRequiredField($scope.currentItem.ControllingUnitFk);
				return disabled || promiseCount !== 0;
			},
			okBtnDisabledForAutoCreate: function () { // it is for create boq auto when need to validate structure or taxCode.
				return ($scope.canStructureShow ? !checkRequiredField($scope.currentItem.PrcStructureFk) : false) ||
					($scope.canTaxCodeShow ? !checkRequiredField($scope.currentItem.MdcTaxCodeFk) : false) ||
					($scope.canControllingUnitShow ? !checkRequiredField($scope.currentItem.ControllingUnitFk) : false);
			}
		};

		// ////////////////////
		function ok() {
			$scope.$close({isOk: true, currentItem: $scope.currentItem});
		}

		function cancel() {
			$scope.$close({isOk: false});
		}

		function validateContract(entity, value, model) {
			var result = validationService.validateConHeaderFk(entity, value, model);
			entity.PrcBoqFk = entity.ContractBoqFk = entity.PackageBoqFk = entity.WicBoqFk = entity.WicGroupFk = entity.SubPackageFk = null;
			let contracts = basicsLookupdataLookupDescriptorService.getData('ConHeaderView');
			let contract = contracts ? contracts[value] : null;
			$scope.currentItem.ContractPrcHeaderFk = contract ? contract.PrcHeaderId : -1;
			return result;
		}

		function validatePackage(entity, value, model) {
			if (!value) {
				entity.BoqSource = 0;
			} else {
				entity.BoqSource = boqSource;
			}
			var result = validationService.validatePackageFk(entity, value, model);
			entity.PrcBoqFk = entity.PackageBoqFk = entity.WicBoqFk = entity.SubPackageFk = entity.WicGroupFk = null;
			return result;
		}

		function validatePrcStructure(entity, value, model) {
			return validationService.validatePrcStructureFk(entity, value, model);
		}

		function validateTaxCode(entity, value, model) {
			return validationService.validateMdcTaxCodeFk(entity, value, model);
		}

		function validateBoq(entity, value) {
			var item = null;
			if ($scope.currentItem.BoqSource === 3) {
				$scope.currentItem.PrcBoqFk = null;
				$scope.currentItem.WicBoqFk = value;
				let lookupService = $injector.get('procurementCommonWicBoqLookupService');
				let rootItemPromise = lookupService.getBoqRootItemsByWicCatGroupId($scope.currentItem.WicGroupFk); // TODO chi: missing second param
				promiseCount++;
				rootItemPromise.then(function (response) {
					promiseCount--;
					if (!response || !angular.isArray(response.data)) {
						return;
					}
					var dataList = response.data;
					var rootItem = _.find(dataList, {Id: value});

					if (rootItem) {
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
			} else {
				$scope.currentItem.PrcBoqFk = value;
				$scope.currentItem.WicBoqFk = null;
				$scope.currentItem.WicBoqReference = '';
				platformRuntimeDataService.applyValidationResult(true, $scope.currentItem, 'WicBoqReference');

				if ($scope.currentItem.BoqSource === 1) {
					var mergedBoqs = basicsLookupdataLookupDescriptorService.getData('PrcMergeBoqView');
					if (mergedBoqs) {
						item = mergedBoqs[value];
						if (item && (item.ControllingUnitFk || item.MdcControllingunitFk)) {
							$scope.currentItem.ControllingUnitFk = item.ControllingUnitFk || item.MdcControllingunitFk;
						}
					}
				} else {
					promiseCount++;
					prcBaseBoqLookupService.getPrcBaseBoqList().then(function (list) {
						promiseCount--;
						if (list && list.length > 0) {
							item = _.find(list, {Id: value});
							if (item && item.PrcBoq && (item.PrcBoq.ControllingUnitFk || item.PrcBoq.MdcControllingunitFk)) {
								$scope.currentItem.ControllingUnitFk = item.PrcBoq.ControllingUnitFk || item.PrcBoq.MdcControllingunitFk;
							}
						}
					});
				}
			}
		}

		function validateControllingUnit(entity, value, model) {
			return validationService.validateControllingUnitFk(entity, value, model);
		}

		function boqSourceChanged() {
			$scope.$broadcast('form-config-updated');
		}

		function isPackageHasValue() {
			return !!$scope.currentItem.PackageFk;
		}

		function checkRequiredField(value) {
			return !(angular.isUndefined(value) || value === null || value === -1 || value === 0);
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

			let id = entity.Id || 0;
			return $http.get(globals.webApiBaseUrl + 'procurement/common/boq/isunique' + '?id=' + id +'&&prcHeaderFk='+entity.ContractPrcHeaderFk+'&&reference=' + value + '&&isPackage='+ false + '&&packageFk='+entity.PackageFk).then(function (result) {
				promiseCount--;
				if (!result.data) {
					return platformDataValidationService.createErrorObject('procurement.common.boq.PrcBoqReferenceUniqueError');
				} else {
					return true;
				}
			});
		}
	}
})(angular);