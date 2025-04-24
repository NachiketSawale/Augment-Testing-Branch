(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).factory('procurementCommonMaterialSpecificationFactory', ['basicsLookupdataLookupDescriptorService', '$q', 'PlatformMessenger', '$injector', '$http', 'richTextControlBarDefinition', 'procurementContextService',
		function procurementCommonMaterialSpecificationFactory(basicsLookupdataLookupDescriptorService, $q, PlatformMessenger, $injector, $http, richTextControlBarDefinition, procurementContextService) {

			function getMaterialSpecificationController(scope, itemService) {
				scope.richTextControlBar = richTextControlBarDefinition;

				// 'containerScope.tools.items' && 'containerScope.tools.update' not found in platformContainerUiAddOnService
				if (!scope.tools) {
					scope.tools = { items: [], update: function(){} };
				}

				scope.getCurrentMaterial = function () {
					var item = itemService.getSelected();
					if (item.MdcMaterialFk) {
						var basMaterialData = basicsLookupdataLookupDescriptorService.getData('MaterialCommodity');
						if (!basMaterialData) {
							basicsLookupdataLookupDescriptorService.loadData('MaterialCommodity');
						} else {
							var basMaterial = _.find(basMaterialData, {'Id': item.MdcMaterialFk});
							if (basMaterial) {
								return basMaterial;
							}
						}
					}
					return null;
				};

				scope.onPropertyChanged = function () {
					itemService.markCurrentItemAsModified();
				};

				scope.specificationItem = itemService.getItemSpecification();
				var isSelectChange = false;

				scope.onTextChanged = function () {
					var item = itemService.getSelected();
					var text = angular.copy(scope.specificationItem);
					if (item && text && (text.Id > 0 || (text.Content && text.Id === 0))) {
						item.BlobSpecificationToSave = {};
						item.BlobSpecificationToSave.Id = angular.copy(text.Id);
						item.BlobSpecificationToSave.Content = angular.copy(text.Content);
						item.BlobSpecificationToSave.Version = angular.copy(text.Version);
						itemService.fireItemModified(item);
						if (isSelectChange) {
							isSelectChange = false;
						} else {
							itemService.markCurrentItemAsModified();
						}
					}
				};
				scope.specificationEditable = true;
				itemService.registerSelectionChanged(onHeaderSelectionChange);

				function onHeaderSelectionChange() {
					isSelectChange = true;
					scope.specificationEditable = canEdit();
				}

				scope.specificationEditorOptions = {};

				function canEdit() {
					// var item = itemService.getSelected();
					// return !_.isEmpty(item) && itemService.canCreate();
					// return !_.isEmpty(item);
					var item = itemService.getSelected();
					if (!item) {
						return false;
					}
					var currentModuleName = itemService.parentService().getModule().name;
					if ((currentModuleName === 'procurement.contract' || currentModuleName === 'procurement.requisition') && item) {
						var isFrameworkContractCallOffByMdc = itemService.parentService().isFrameworkContractCallOffByMdc();
						if (isFrameworkContractCallOffByMdc) {
							if (item.MdcMaterialFk) {
								return false;
							}
						}
					}
					return true;
				}

				return scope;
			}

			function getItemSpecification(itemService) {
				itemService.itemSpecification = {
					Content: null,
					Id: 0,
					Version: 0
				};
				itemService.itemSpecificationChanged = new PlatformMessenger();
				itemService.itemSpecificationLoadCanceler = $q.defer();
				itemService.getItemSpecification = function getItemSpecification() {
					if (!itemService.itemSpecification || itemService.itemSpecification.Id === 0) {
						itemService.loadMaterialPlainSpecification();
					}
					return itemService.itemSpecification;
				};
				itemService.clearItemSpecification = function clearItemSpecification() {
					itemService.itemSpecification.Content = null;
					itemService.itemSpecification.Id = 0;
					itemService.itemSpecification.Version = 0;
					itemService.itemSpecificationChanged.fire(itemService.itemSpecification);
				};
				itemService.loadMaterialSpecification = function (isValidation){
					itemService.loadMaterialPlainSpecification(isValidation);
				};
				itemService.loadMaterialPlainSpecification = function (isValidation) {
					itemService.clearItemSpecification();
					var currentItem = itemService.getSelected();
					if (_.isNull(currentItem)) {
						return;
					}
					if (currentItem.BlobSpecificationToSave && currentItem.BlobSpecificationToSave.Content && isValidation !== true) {
						itemService.itemSpecification.Id = angular.copy(currentItem.BlobSpecificationToSave.Id);
						itemService.itemSpecification.Content = angular.copy(currentItem.BlobSpecificationToSave.Content);
						itemService.itemSpecification.Version = angular.copy(currentItem.BlobSpecificationToSave.Version);
						itemService.itemSpecificationChanged.fire(itemService.itemSpecification);
					} else if (currentItem.BasBlobsSpecificationFk && isValidation !== true) {
						itemService.loadItemSpecificationById(currentItem.BasBlobsSpecificationFk, false, currentItem);
					} else if (currentItem.MdcMaterialFk && (currentItem.BasBlobsSpecificationFk === null || isValidation === true)) {
						var lookupDataService = $injector.get('basicsLookupdataLookupDataService');
						lookupDataService.getItemByKey('MaterialCommodity', currentItem.MdcMaterialFk).then(function (response) {
							itemService.clearItemSpecification();
							if (response && response.BasBlobsSpecificationFk) {
								itemService.loadItemSpecificationById(response.BasBlobsSpecificationFk, true, currentItem);
							}
						});
					} else if (isValidation === true && currentItem.MdcMaterialFk === null && currentItem.BlobSpecificationToSave){
						currentItem.BlobSpecificationToSave.Content = null;
						itemService.fireItemModified(currentItem);
					}
				};
				itemService.loadItemSpecificationById = function loadItemSpecificationById(fkId, isMaterial, currentItem) {
					itemService.itemSpecificationLoadCanceler.resolve();
					itemService.itemSpecificationLoadCanceler = $q.defer();

					if (fkId) {
						$http({
							method: 'GET',
							url: globals.webApiBaseUrl + 'cloud/common/blob/getblobstring?id=' + fkId,
							timeout: itemService.itemSpecificationLoadCanceler.promise
						}).then(function (response) {
							if (response && response.data) {
								itemService.itemSpecification.Content = response.data.Content;
								if(itemService.itemSpecification.Id === 0){
									itemService.itemSpecification.Id = isMaterial ? 0 : response.data.Id;
									itemService.itemSpecification.Version = isMaterial ? 0 : response.data.Version;
								}
								itemService.itemSpecificationChanged.fire(itemService.itemSpecification);
								currentItem = currentItem || itemService.getSelected();
								currentItem.BlobSpecificationToSave = {};
								currentItem.BlobSpecificationToSave.Id = angular.copy(itemService.itemSpecification.Id);
								currentItem.BlobSpecificationToSave.Content = angular.copy(itemService.itemSpecification.Content);
								currentItem.BlobSpecificationToSave.Version = angular.copy(itemService.itemSpecification.Version);
								itemService.fireItemModified(currentItem);
							}
						}, function () {
							itemService.clearItemSpecification();
						});
					} else {
						itemService.clearItemSpecification();
					}
				};
				itemService.registerSelectionChanged(itemService.loadMaterialPlainSpecification);
				return itemService;
			}
			function getMaterialSpecificationPlainController(scope, itemService) {

				itemService.onSpecificationChanged.register(function(value){
					scope.currentItem = value;
				});

				// 'containerScope.tools.items' && 'containerScope.tools.update' not found in platformContainerUiAddOnService
				if (!scope.tools) {
					scope.tools = { items: [], update: function(){} };
				}

				var isItemSelected = function () {
					var item = itemService.getSelected();
					if (!item) {
						return null;
					}
					return item.Specification || item.PrcItemSpecification;
				};

				scope.currentItem = isItemSelected();

				itemService.registerSelectionChanged(onSelectionChange);

				function onSelectionChange() {
					scope.currentItem = isItemSelected();
				}

				scope.rt$readonly = readonly;

				function readonly() {
					return true;
				}

				return scope;
			}

			return {
				getItemSpecification: getItemSpecification,
				getMaterialSpecificationController: getMaterialSpecificationController,
				getMaterialSpecificationPlainController: getMaterialSpecificationPlainController
			};
		}
	]);
})(angular);