(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global globals, _, moment */
	var moduleName = 'procurement.contract';

	angular.module(moduleName).controller('updateFrameworkMaterialCatalogController', [
		'$scope',
		'$q',
		'$http',
		'$translate',
		'platformFormConfigService',
		'basicsLookupdataConfigGenerator',
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataLookupDescriptorService',
		'platformRuntimeDataService',
		'platformModuleNavigationService',
		'basicsLookupdataSimpleLookupService', '$timeout',
		'platformTranslateService',
		function (
			$scope,
			$q,
			$http,
			$translate,
			platformFormConfigService,
			basicsLookupdataConfigGenerator,
			lookupFilterService,
			basicsLookupdataLookupDescriptorService,
			platformRuntimeDataService,
			navigateService,
			basicsLookupdataSimpleLookupService, $timeout,
			platformTranslateService
		) {
			var mdcCatalogDescriptionMaxLength = $scope.modalOptions.mdcCatalogDescriptionMaxLength;
			var selectedContract = $scope.modalOptions.item;
			var mdcCatalogCodeIsUniqueUrl = globals.webApiBaseUrl + 'basics/materialcatalog/catalog/isunique';
			var mdcCatalogUpdateUrl = globals.webApiBaseUrl + 'basics/materialcatalog/catalog/updatefromcontract';
			$scope.updateType = 'update';
			$scope.step = 'step1';
			$scope.iconStyle = 'ico-info';
			$scope.successText = $translate.instant('procurement.contract.updateFrameworkMaterialCatalog.successText');
			$scope.codeText = $translate.instant('procurement.contract.updateFrameworkMaterialCatalog.entityCode');
			$scope.newMaterialCatalog = null;
			$scope.isLoading = false;
			$scope.type = $scope.updateType;
			$scope.currentItem = {
				Code: '',
				MaterialCatalogFk: null,
				Description: '',
				MaterialCatalogTypeFk: null,
				BasRubricCategoryFk: null,
				ValidFrom: null,
				ValidTo: null,
				PaymentTermFiFk: null,
				PaymentTermAdFk: null,
				PaymentTermPaFk: null,
				PrcIncotermFk: null,
				ClerkFk: null
			};
			var catalogTypesFramework = {};

			var mdcCatalogTypeLookupConfig = basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.materialcatalog.type', null, {
				'sortOrder': 2,
				'gid': 'basicData',
				'rid': 'materialcatalogTypeFk',
				'model': 'MaterialCatalogTypeFk',
				'label': 'Catalog Type',
				'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityMaterialCatalogTypeFk',
				'required': true
			}, false, {
				'filterKey': 'con-wizard-update-framework-material-catalog-type-filter',
				'customBoolProperty': 'ISFRAMEWORK',
				'required': true
			});
			basicsLookupdataSimpleLookupService.refreshCachedData(mdcCatalogTypeLookupConfig.options).then(function (res) {
				if (res && res.length) {
					getIsFrameworkTypes(res);
				}
				else if (res === false) {
					basicsLookupdataSimpleLookupService.getList(mdcCatalogTypeLookupConfig.options).then(function (res2) {
						if (res2 && res2.length) {
							getIsFrameworkTypes(res2);
						}
					});
				}
			});

			function getIsFrameworkTypes(typs) {
				_.forEach(typs, function (i) {
					if (i.sorting && i.isLive && i.Isframework) {
						catalogTypesFramework[i.Id] = i;
					}
				});
			}

			var filters = [
				{
					key: 'con-wizard-update-framework-material-catalog-materialCatalog-filter',
					fn: function (item) {
						return item.BusinessPartnerFk === selectedContract.BusinessPartnerFk && catalogTypesFramework[item.MaterialCatalogTypeFk];
					}
				},
				{
					key: 'con-wizard-update-framework-material-catalog-rubriccategory-filter',
					serverSide: true,
					fn: function () {
						return 'RubricFk = ' + 12; // material rubricFK is 12
					}
				},
				{
					key: 'con-wizard-update-framework-material-catalog-type-filter',
					fn: function (item){
						return item.Isframework === true;
					}
				}
			];
			lookupFilterService.registerFilter(filters);

			var formConfig = {
				'fid': 'updateFrameworkMaterialCatalogWizard',
				'version': '1.0.0',     // if same version setting can be reused, otherwise discard settings
				'showGrouping': false,
				'groups': [{
					'gid': 'basicData',
					'header$tr$': 'procurement.common.wizard.generatePaymentSchedule.wizard',
					'isOpen': true,
					'sortOrder': 1
				}],
				'rows': [
					{
						'sortOrder': 1,
						'gid': 'basicData',
						'rid': 'materialCatalogFk',
						'model': 'MaterialCatalogFk',
						'label': 'Code',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityCode',
						'type': 'directive',
						'required': true,
						'directive': 'basics-material-material-catalog-lookup',
						'options': {
							'lookupOptions': {
								'title': {name: 'Material Catalog', name$tr$: 'basics.material.materialCatalog'},
								'isTextEditable': false
							},
							'model': 'MaterialCatalogFk',
							'filterKey': 'con-wizard-update-framework-material-catalog-materialCatalog-filter'
						},
						'validator': validateMaterialCatalogFk,
						'visible': $scope.type === $scope.updateType
					},
					{
						'sortOrder': 1,
						'gid': 'basicData',
						'rid': 'code',
						'model': 'Code',
						'label': 'Code',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityCode',
						'type': 'code',
						'required': true,
						'asyncValidator': asyncValidateCode,
						'visible': $scope.type !== $scope.updateType
					},
					{
						'sortOrder': 2,
						'gid': 'basicData',
						'rid': 'description',
						'model': 'Description',
						'label': 'Description',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityDescription',
						'type': 'description',
						'maxLength': mdcCatalogDescriptionMaxLength
					},
					mdcCatalogTypeLookupConfig,
					{
						'sortOrder': 3,
						'gid': 'basicData',
						'rid': 'basrubricCategoryFk',
						'model': 'BasRubricCategoryFk',
						'label': 'Rubric Category',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityBasRubricCategoryFk',
						'type': 'directive',
						'directive': 'basics-lookupdata-rubric-category-combo-box',
						'required': true,
						'options': {
							'filterKey': 'con-wizard-update-framework-material-catalog-rubriccategory-filter'
						}
					},
					{
						'sortOrder': 4,
						'gid': 'basicData',
						'rid': 'validFrom',
						'model': 'ValidFrom',
						'label': 'Valid From',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityValidFrom',
						'type': 'date'
					},
					{
						'sortOrder': 5,
						'gid': 'basicData',
						'rid': 'validTo',
						'model': 'ValidTo',
						'label': 'Valid To',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityValidTo',
						'type': 'date'
					},
					{
						'sortOrder': 6,
						'gid': 'basicData',
						'rid': 'paymentTermFiFk',
						'model': 'PaymentTermFiFk',
						'label': 'Payment Term (Fi)',
						'label$tr$': 'cloud.common.entityPaymentTermFI',
						'type': 'directive',
						'directive': 'basics-lookupdata-payment-term-lookup',
						'options': {
							'showClearButton': true
						}
					},
					{
						'sortOrder': 7,
						'gid': 'basicData',
						'rid': 'paymentTermAdFk',
						'model': 'PaymentTermAdFk',
						'label': 'Payment Term (Ad)',
						'label$tr$': 'cloud.common.entityPaymentTermAD',
						'type': 'directive',
						'directive': 'basics-lookupdata-payment-term-lookup',
						'options': {
							'showClearButton': true
						}
					},
					{
						'sortOrder': 8,
						'gid': 'basicData',
						'rid': 'paymentTermPaFk',
						'model': 'PaymentTermPaFk',
						'label': 'Payment Term (Pa)',
						'label$tr$': 'cloud.common.entityPaymentTermPA',
						'type': 'directive',
						'directive': 'basics-lookupdata-payment-term-lookup',
						'options': {
							'showClearButton': true
						}
					},
					{
						'sortOrder': 9,
						'gid': 'basicData',
						'rid': 'prcincotermfk',
						'model': 'PrcIncotermFk',
						'label': 'Incoterm',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityPrcIncotermFk',
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'basics-lookupdata-incoterm-combobox',
							'descriptionMember': 'Description',
							'lookupOptions': {
								'showClearButton': true
							}
						}
					},
					{
						'sortOrder': 10,
						'gid': 'basicData',
						'rid': 'clerkFk',
						'model': 'ClerkFk',
						'label': 'Responsible',
						'label$tr$': 'procurement.contract.updateFrameworkMaterialCatalog.entityClerkFk',
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'options': {
							'lookupDirective': 'cloud-clerk-clerk-dialog',
							'descriptionMember': 'Description',
							'lookupOptions': {
								'showClearButton': true
							}
						}
					}
				]
			};
			$scope.formContainerOptions = {};
			var formTranslatedConfig = platformTranslateService.translateFormConfig(formConfig);
			$scope.formContainerOptions.formOptions = {
				configure: formTranslatedConfig, showButtons: [], validationMethod: function () {
				}
			};

			function validateMaterialCatalogFk(item, value, model) {
				var materialCatalogs = basicsLookupdataLookupDescriptorService.getData('MaterialCatalog');
				if (materialCatalogs && value) {
					var materialCatalog = _.find(materialCatalogs, {Id: value});
					item[model] = value;
					item.Code = materialCatalog.Code;
					item.Description = materialCatalog.DescriptionInfo.Translated;
					item.MaterialCatalogTypeFk = materialCatalog.MaterialCatalogTypeFk;
					item.BasRubricCategoryFk = materialCatalog.BasRubricCategoryFk;
					item.ValidFrom = getTimeObject(materialCatalog.ValidFrom);
					item.ValidTo = getTimeObject(materialCatalog.ValidTo);
					item.PaymentTermPaFk = materialCatalog.PaymentTermFk;
					item.PaymentTermFiFk = materialCatalog.PaymentTermFiFk;
					item.PaymentTermAdFk = materialCatalog.PaymentTermAdFk;
					item.PrcIncotermFk = materialCatalog.IncotermFk;
					item.ClerkFk = materialCatalog.ClerkFk;
				}
			}
			function asyncValidateCode(item, value, model) {
				var defer = $q.defer();
				if (value === undefined) {
					defer.resolve(true);
					return defer.promise;
				}
				if (!value) {
					item[model] = value;
					defer.resolve({
						apply: true,
						valid: false,
						error: $translate.instant('cloud.common.ValidationRule_ForeignKeyRequired', {object:  model.toLowerCase()})
					});
				}
				else {
					item[model] = value;
					$http.get(mdcCatalogCodeIsUniqueUrl + '?id=-1&&code=' + value).then(function (result) {
						if (!result.data) {
							defer.resolve({
								apply: true,
								valid: false,
								error: $translate.instant('cloud.common.uniqueValueErrorMessage', {object:  model.toLowerCase()})
							});
						}
						else {
							item[model] = value;
							if (item.__rt$data.errors) {
								item.__rt$data.errors.Code = null;
							}
						}
						defer.resolve(result.data);
					});
				}
				return defer.promise;
			}

			var readonlyFields = ['Description', 'MaterialCatalogTypeFk', 'BasRubricCategoryFk', 'ValidFrom', 'ValidTo', 'PaymentTermFiFk', 'PaymentTermAdFk', 'PaymentTermPaFk', 'PrcIncotermFk', 'ClerkFk'];
			function readonlyFieldsWhenUpdate(readonly) {
				_.forEach(readonlyFields, function(field) {
					platformRuntimeDataService.readonly($scope.currentItem, [{ field: field, readonly: readonly }]);
				});
			}
			readonlyFieldsWhenUpdate(true);

			$scope.typeChange = function(type) {
				if (!$scope.currentItem.Code) {
					$scope.currentItem.Code = '';
				}
				$scope.type = type;
			};

			$scope.okBtnDisable = function() {
				if ($scope.type === $scope.updateType) {
					return !$scope.currentItem.MaterialCatalogFk;
				}
				else {
					if ($scope.currentItem.__rt$data.errors && $scope.currentItem.__rt$data.errors.Code) {
						return true;
					}
					return !$scope.currentItem.Code || !$scope.currentItem.MaterialCatalogTypeFk || !$scope.currentItem.BasRubricCategoryFk;
				}
			};

			function getTimeString(time) {
				return (_.isObject(time) && _.isFunction(time.format)) ? time.format('YYYY[-]MM[-]DD[T00:00:00Z]') : time;
			}

			function getTimeObject(time) {
				return (_.isString(time) && time.length) ? moment.utc(time) : null;
			}

			function updateConfigAfterChangeType(formTranslatedConfig, newType) {
				formTranslatedConfig.rowsDict.code.visible = (newType !== $scope.updateType);
				formTranslatedConfig.rowsDict.materialCatalogFk.visible = (newType === $scope.updateType);
			}

			$scope.ok = function() {
				var param = {
					Code: $scope.currentItem.Code,
					Description: $scope.currentItem.Description,
					MaterialCatalogFk: $scope.type === $scope.updateType ? $scope.currentItem.MaterialCatalogFk : null,
					MaterialCatalogTypeFk: $scope.currentItem.MaterialCatalogTypeFk,
					BasRubricCategoryFk: $scope.currentItem.BasRubricCategoryFk,
					ValidFrom: getTimeString($scope.currentItem.ValidFrom),
					ValidTo: getTimeString($scope.currentItem.ValidTo),
					PaymentTermFk: $scope.currentItem.PaymentTermPaFk,
					PaymentTermFiFk: $scope.currentItem.PaymentTermFiFk,
					PaymentTermAdFk: $scope.currentItem.PaymentTermAdFk,
					PrcIncotermFk: $scope.currentItem.PrcIncotermFk,
					ClerkFk: $scope.currentItem.ClerkFk,
					ConHeaderFk: selectedContract.Id,
					PrcHeaderFk: selectedContract.PrcHeaderFk
				};
				$scope.isLoading = true;
				$http.post(mdcCatalogUpdateUrl, param).then(function (result) {
					$scope.step = 'step2';
					$scope.newMaterialCatalog = result.data;
					let request = {
						ConHeaderFk: selectedContract.Id,
						MaterialCatalogFk: $scope.newMaterialCatalog.Id,
						PaymentTermPaFk: $scope.currentItem.PaymentTermPaFk,
						PaymentTermFiFk: $scope.currentItem.PaymentTermFiFk,
						PaymentTermAdFk: $scope.currentItem.PaymentTermAdFk
					};
					return $http.post(globals.webApiBaseUrl + 'procurement/contract/header/setisframework',request);

				}).finally(function() {
					$scope.isLoading = false;
				});
			};

			$scope.goToMaterialCatalog = function () {
				navigateService.navigate({
					moduleName: 'basics.materialcatalog'
				}, $scope.newMaterialCatalog, 'Id');
				$scope.modalOptions.cancel();
			};

			var orginalCancel = $scope.modalOptions.cancel;
			$scope.modalOptions.cancel = function () {
				if ($scope.step === 'step2') {
					$scope.modalOptions.dataService.refreshSelectedEntities();
					orginalCancel();
				} else {
					orginalCancel();
				}
				if ($scope.modalOptions.dataService.isFrameworkChanged) {
					$timeout(function () {
						$scope.modalOptions.dataService.isFrameworkChanged.fire();
					}, 1000);
				}
			};

			var unwatchType = $scope.$watch('type', function (newVal, oldVal) {
				if (newVal !== oldVal) {
					if (newVal === $scope.updateType) {
						$scope.currentItem.Description = '';
						$scope.currentItem.MaterialCatalogFk = null;
						$scope.currentItem.MaterialCatalogTypeFk = null;
						$scope.currentItem.BasRubricCategoryFk = null;
						$scope.currentItem.ValidFrom = null;
						$scope.currentItem.ValidTo = null;
						$scope.currentItem.PaymentTermFiFk = null;
						$scope.currentItem.PaymentTermAdFk = null;
						$scope.currentItem.PaymentTermPaFk = null;
						$scope.currentItem.PrcIncotermFk = null;
						$scope.currentItem.ClerkFk = null;
						updateConfigAfterChangeType(formTranslatedConfig, newVal);
						$scope.$broadcast('form-config-updated');
						readonlyFieldsWhenUpdate(true);
					}
					else {
						$scope.currentItem.Code = '';
						$scope.currentItem.Description = '';
						$scope.currentItem.MaterialCatalogTypeFk = null;
						$scope.currentItem.BasRubricCategoryFk = null;
						$scope.currentItem.ValidFrom = selectedContract.ValidFrom;
						$scope.currentItem.ValidTo = selectedContract.ValidTo;
						$scope.currentItem.PaymentTermFiFk = selectedContract.PaymentTermFiFk;
						$scope.currentItem.PaymentTermAdFk = selectedContract.PaymentTermAdFk;
						$scope.currentItem.PaymentTermPaFk = selectedContract.PaymentTermPaFk;
						$scope.currentItem.PrcIncotermFk = selectedContract.IncotermFk;
						$scope.currentItem.ClerkFk = selectedContract.ClerkPrcFk;
						updateConfigAfterChangeType(formTranslatedConfig, newVal);
						$scope.$broadcast('form-config-updated');
						readonlyFieldsWhenUpdate(false);
					}
				}
			});
			$scope.$on('$destroy', function () {
				unwatchType();
				lookupFilterService.unregisterFilter(filters);
			});
		}]);
})(angular);