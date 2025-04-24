/**
 * Created by chi on 9/21/2017.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(){
	'use strict';

	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).controller('estimateAssembliesUpdateResourcePricesWizardController', estimateAssembliesUpdateResourcePricesWizardController);

	estimateAssembliesUpdateResourcePricesWizardController.$inject = ['$scope', '$translate', '$timeout', '_', 'platformGridAPI',
		'platformTranslateService', 'basicsCommonHeaderColumnCheckboxControllerService',
		'basicsMaterialBoolean3ModeFormatter', 'estimateAssembliesUpdateResourcePricesWizardService'];

	function estimateAssembliesUpdateResourcePricesWizardController($scope, $translate, $timeout, _, platformGridAPI,
		platformTranslateService, basicsCommonHeaderColumnCheckboxControllerService,
		basicsMaterialBoolean3ModeFormatter, estimateAssembliesUpdateResourcePricesWizardService) {
		let options = $scope.modalOptions;
		let filters = options.filters;
		let steps = [
			{
				number: 0,
				identifier: 'option',
				name: options.stepTitle.updatePriceOptionTitle
			},
			{
				number: 1,
				identifier: 'selection',
				name: options.stepTitle.updatePriceFromMaterialTitle
			},
			{
				number: 2,
				identifier: 'result',
				name: options.stepTitle.updatePriceResultTitle
			}
		];

		let materialGridId = '0b87d32df4ee4f1891e63fd09ce57e8c';
		let resultGridId = 'add9f371a3464dcf96058da459df53a0';
		let updateType = {fromBase: '1', fromPriceList: '2'};

		$scope.updatePricesFromMaterial = {
			state: materialGridId
		};

		$scope.updateMaterialPricesResult = {
			state: resultGridId
		};

		$scope.body = {
			updatePriceOptionLabel: $translate.instant('basics.material.updatePriceWizard.updatePriceOptionLabel'),
			fromBaseLabel: $translate.instant('basics.material.updatePriceWizard.fromBaseLabel'),
			fromPriceListLabel: $translate.instant('basics.material.updatePriceWizard.fromPriceListLabel'),
			note: $translate.instant('basics.material.updatePriceWizard.note'),
			noteForUpdateFromPriceVersion1: $translate.instant('basics.material.updatePriceWizard.noteForUpdateFromPriceVersion1'),
			noteForUpdateFromPriceVersion2: $translate.instant('basics.material.updatePriceWizard.noteForUpdateFromPriceVersion2')
		};

		$scope.radio = {Select: updateType.fromBase};
		$scope.currentStep = steps[0];
		$scope.currentRetrievalOption = {
			priceListRetrievalOption: 6
		};
		$scope.showPriceListRetrievalOption = function showPriceListRetrievalOption() {
			return $scope.radio.Select === updateType.fromPriceList;
		};
		$scope.getButtonText = function () {
			if (isLastStep()) {
				return $translate.instant('basics.material.updatePriceWizard.updateBtn');
			}
			return $translate.instant('basics.common.button.nextStep');
		};

		$scope.canPrevious = function() {
			return !isFirstStep();
		};

		$scope.canNext = function() {
			let canNext = false;
			if ($scope.currentStep === steps[1]) {
				let selectionData = estimateAssembliesUpdateResourcePricesWizardService.getSelectionData($scope.radio.Select);
				if (!selectionData || selectionData.length === 0) {
					return canNext;
				}
				for (let i = 0; i < selectionData.length; ++i) {
					if (selectionData[i].Selected) {
						canNext = true;
						break;
					}
				}
			} else if ($scope.currentStep === steps[2]) {
				let resultData = estimateAssembliesUpdateResourcePricesWizardService.getUpdateResult($scope.radio.Select);
				if (!resultData || resultData.length === 0) {
					return canNext;
				}
				canNext = true;
			} else {
				canNext = true;
			}

			return canNext;
		};

		$scope.previousStep = function () {
			if (isFirstStep()) {
				return;
			}

			let currentStepNum = $scope.currentStep.number - 1;
			$scope.currentStep = steps[currentStepNum];
			setCurrentStep(currentStepNum);
		};

		$scope.nextStep = function () {
			if (isLastStep()) {
				update();
				return;
			}
			let currentStepNum = $scope.currentStep.number + 1;
			$scope.currentStep = steps[currentStepNum];
			setCurrentStep(currentStepNum);
		};

		$scope.close = function () {
			$scope.$parent.$close(false); // TODO chi: right?
		};

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist(materialGridId)) {
				platformGridAPI.grids.unregister(materialGridId);
			}

			if (platformGridAPI.grids.exist(resultGridId)) {
				platformGridAPI.grids.unregister(resultGridId);
			}
			estimateAssembliesUpdateResourcePricesWizardService.resetData();
		});

		// ------------- Price List Retrieval Option Selection Page--------------
		let priceListRetrievalOptions = {
			showGrouping: false,
			groups: [
				{
					gid: '1',
					header: '',
					header$r$: '',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}
			],
			rows: [
				{
					gid: '1',
					rid: 'priceListRetrievalOptions',
					label: $translate.instant('basics.material.updatePriceWizard.priceListRetrievalOptions'),
					type: 'directive',
					model: 'priceListRetrievalOption',
					directive: 'basics-material-price-list-option-combobox',  // TODO chi: move to basics.material
					visible: true,
					sortOrder: 1,
					width: 150,
					options: {
						'showClearButton': false
					}
				}
			]
		};

		$scope.priceListRetrievalOptions = {
			configure: priceListRetrievalOptions
		};
		// ------------- Price List Retrieval Option Selection Page--------------

		// ----------material catalog or material catalog with price version---------
		let materialGridColumns = [
			{
				id: 'Selected',
				field: 'Selected',
				name: 'Selected',
				name$tr$: 'basics.import.entitySelected',
				editor: 'boolean',
				formatter: 'boolean',
				width: 75,
				headerChkbox: true
			},
			{
				id: 'CatalogCode',
				field: 'CatalogCode',
				name: 'Catalog Code',
				name$tr$: 'cloud.common.entityMaterialCatalogCode',
				width: 90,
				formatter: 'description'
			},
			{
				id: 'CatalogDescription',
				field: 'CatalogDescription',
				name: 'Catalog Description',
				name$tr$: 'cloud.common.entityMaterialCatalogDescription',
				formatter: 'description',
				width: 150,
				readonly: true
			},
			{
				id: 'BusinessPartnerName',
				field: 'BusinessPartnerFk',
				name: 'Business Partner Name',
				name$tr$: 'businesspartner.main.name1',
				width: 150,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'BusinessPartner',
					displayMember: 'BusinessPartnerName1'
				},
				readonly: true
			},
			{
				id: 'DateVersion',
				field: 'DateVersion',
				name: 'Date Version',
				name$tr$: 'basics.materialcatalog.dataDate',
				width: 90,
				formatter: 'date'
			},
			{
				id: 'Type',
				field: 'Type',
				name: 'Type',
				name$tr$: 'basics.customize.materialcatalogtype',
				width: 150,
				formatter: 'description',
				readonly: true
			},
			{
				id: 'ValidFrom',
				field: 'ValidFrom',
				name: 'Valid From',
				name$tr$: 'basics.materialcatalog.validFrom',
				width: 100,
				formatter: 'date',
				readonly: true
			},
			{
				id: 'ValidTo',
				field: 'ValidTo',
				name: 'Valid To',
				name$tr$: 'basics.materialcatalog.validTo',
				width: 100,
				formatter: 'date',
				readonly: true
			}
		];

		function setupMaterialCatalogGrid() {
			let materialGridConfig = null;
			if ($scope.radio.Select === updateType.fromBase) {
				materialGridConfig = {
					columns: angular.copy(materialGridColumns),
					data: [],
					id: materialGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
			}
			else if ($scope.radio.Select === updateType.fromPriceList) {
				let tempColumns = angular.copy(materialGridColumns);
				let selectedCol = _.find(tempColumns, {id: 'Selected'});
				selectedCol.editor = 'directive';
				selectedCol.editorOptions = {
					directive: 'basics-material-checkbox'
				};
				selectedCol.formatter = basicsMaterialBoolean3ModeFormatter.formatter;
				selectedCol.validator = 'selectedChanged';

				materialGridConfig = {
					columns: tempColumns,
					data: [],
					id: materialGridId,
					lazyInit: true,
					options: {
						tree: true,
						indicator: true,
						idProperty: 'PseudoId',
						parentProp: 'ParentId',
						childProp: 'ChildItems',
						iconClass: ''
					}
				};
			}

			if (!platformGridAPI.grids.exist(materialGridId)) {
				platformGridAPI.grids.config(materialGridConfig);
				platformTranslateService.translateGridConfig(materialGridConfig.columns);
			}

			let headerCheckBoxFields = ['Selected'];
			let headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId(materialGridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);
		}

		function updateMaterialGrid(materialData) {

			platformGridAPI.grids.invalidate(materialGridId);
			platformGridAPI.items.data(materialGridId, materialData);
		}
		// ----------material catalog or material catalog with price version---------

		// ----------material result---------
		let resultGridColumns = [
			{
				id: 'CatalogCode',
				field: 'CatalogCode',
				name: 'Catalog Code',
				name$tr$: 'cloud.common.entityMaterialCatalogCode',
				readonly: true,
				width: 90,
				formatter: 'description'
			},
			{
				id: 'CatalogDescription',
				field: 'CatalogDescription',
				name: 'Catalog Description',
				name$tr$: 'cloud.common.entityMaterialCatalogDescription',
				formatter: 'description',
				width: 150,
				readonly: true
			},
			{
				id: 'MaterialCode',
				field: 'MaterialCode',
				name: 'Material Code',
				name$tr$: 'basics.common.entityMaterialCode',
				width: 90,
				formatter: 'description'
			},
			{
				id: 'MaterialDescription',
				field: 'MaterialDescription',
				name: 'Material Description',
				name$tr$: 'basics.common.entityMaterialDescription',
				width: 150,
				formatter: 'description',
				readonly: true
			},
			{
				id: 'Uom',
				field: 'Uom',
				name: 'UoM',
				name$tr$: 'cloud.common.entityUoM',
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'Uom',
					displayMember: 'Unit'
				},
				width: 100,
				readonly: true
			},
			{
				id: 'OldEstimatePrice',
				field: 'OldEstimatePrice',
				name: 'Old Estimate Price',
				name$tr$: 'basics.common.entityOldEstimatePrice',
				width: 150,
				formatter: 'money',
				readonly: true
			},
			{
				id: 'NewEstimatePrice',
				field: 'NewEstimatePrice',
				name: 'New Estimate Price',
				name$tr$: 'basics.common.entityNewEstimatePrice',
				width: 150,
				formatter: 'money'
			},
			{
				id: 'currencyFk',
				field: 'CurrencyFk',
				name: 'Currency',
				name$tr$: 'cloud.common.entityCurrency',
				searchable: true,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'currency',
					displayMember: 'Currency'
				},
				width: 100
			},
			{
				id: 'Source',
				field: 'Source',
				name: 'Source',
				name$tr$: 'cloud.translation.source',
				width: 100,
				formatter: 'description',
				readonly: true
			},
			{
				id: 'Comment',
				field: 'CommentText',
				name: 'Comment',
				name$tr$: 'cloud.common.entityCommentText',
				width: 150,
				editor: 'description',
				formatter: 'description'
			}
		];

		function setupResultGrid() {
			if (!platformGridAPI.grids.exist(resultGridId)) {
				let resultGridConfig = {
					columns: resultGridColumns,
					data: [],
					id: resultGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(resultGridConfig);
				platformTranslateService.translateGridConfig(resultGridConfig.columns);
			}
		}

		function updateResultGrid(resultGridData) {
			platformGridAPI.grids.invalidate(resultGridId);
			platformGridAPI.items.data(resultGridId, resultGridData);
		}
		// ----------material result---------

		// ////////////////////////

		function setStepName() {
			if ($scope.radio.Select !== updateType.fromBase) {
				steps[1].name = options.stepTitle.updatePriceFromPriceListTitle;
			} else {
				steps[1].name = options.stepTitle.updatePriceFromMaterialTitle;
			}
		}

		function isFirstStep() {
			return $scope.currentStep.number === 0;
		}

		function isLastStep() {
			return $scope.currentStep.number === steps.length - 1;
		}

		function checkAll(e) {
			let isSelected = (e.target.checked);
			let priceVersions = estimateAssembliesUpdateResourcePricesWizardService.getSelectionData($scope.radio.Select);
			resetSelectedChildren(priceVersions, isSelected);
		}
		function resetSelectedChildren(children, value) {
			if (children && children.length > 0) {
				_.forEach(children, function(child) {
					child.Selected = value;
					resetSelectedChildren(child.ChildItems, value);
				});
			}
		}
		function selectedChanged(entity, value, model) {
			entity[model] = value;
			resetSelectedChildren(entity.ChildItems, value);
			let priceVersions = estimateAssembliesUpdateResourcePricesWizardService.getSelectionData($scope.radio.Select);
			if (priceVersions !== null) {
				resetSelectedAll(priceVersions, [], []);
			}
			updateMaterialGrid(priceVersions);

			// //////////////////
			function resetSelectedAll (items, checked, unchecked) {
				if (items.length > 0) {
					_.forEach(items, function(item) {
						let check = [];
						let uncheck = [];
						resetSelectedAll(item.ChildItems, check, uncheck);
						if (item.ChildItems.length > 0) {
							if (check.length === item.ChildItems.length) {
								item.Selected = true;
								checked.push(item);
							} else if (uncheck.length === item.ChildItems.length) {
								item.Selected = false;
								unchecked.push(item);
							} else {
								item.Selected = 'unknown';
							}
						}
						else {
							if (item.Selected === true) {
								checked.push(item);
							} else if (item.Selected === false){
								unchecked.push(item);
							}
						}
					});
				}
			}
		}

		function setCurrentStep(num) {
			switch (steps[num].identifier) {
				case 'selection': {
					let cache = null;
					setStepName();
					if ($scope.radio.Select === updateType.fromPriceList) {
						$scope.selectedChanged = $scope.selectedChanged || selectedChanged;
					}
					setupMaterialCatalogGrid();

					if ($scope.radio.Select === updateType.fromBase) {
						estimateAssembliesUpdateResourcePricesWizardService.getMaterialCatalogs(filters).then(function (response) {

							if (!response.data || response.data.length === 0) {
								return;
							}

							if (response.isCache) {
								cache = response.data;
								$timeout(function () {
									updateMaterialGrid(cache);
								}, 200);
								return;
							}

							let catalogData = response.data;
							let catalogs = [];

							for (let i = 0; i < catalogData.length; ++i) {
								let catalog = catalogData[i];
								let type = estimateAssembliesUpdateResourcePricesWizardService.getMaterialCatalogTypeById(catalog.MaterialCatalogTypeFk);
								let data = {
									Id: catalog.Id,
									Selected: true,
									CatalogCode: catalog.Code,
									CatalogDescription: catalog.DescriptionInfo.Translated,
									BusinessPartnerFk: catalog.BusinessPartnerFk,
									DateVersion: catalog.DataDate,
									Type: type ? type.Description : null,
									ValidFrom: catalog.ValidFrom,
									ValidTo: catalog.ValidTo
								};
								catalogs.push(data);
							}
							$timeout(function () {
								estimateAssembliesUpdateResourcePricesWizardService.setSelectionData(catalogs, $scope.radio.Select);
								updateMaterialGrid(catalogs);
							}, 200);
						});
					}
					else if ($scope.radio.Select === updateType.fromPriceList) {
						estimateAssembliesUpdateResourcePricesWizardService.getMaterialCatalogWithPriceVersion(filters).then(function(response) {
							if (!response.data) {
								return;
							}

							if (response.isCache) {
								cache = response.data;
								if (!cache || cache.length === 0) {
									return;
								}
								$timeout(function () {
									updateMaterialGrid(cache);
								}, 200);
								return;
							}

							let catalogData = response.data.MaterialCatalogs;
							let priceLists = response.data.PriceLists;
							let priceVersions = response.data.PriceVersions;

							if (!priceVersions || priceVersions.length === 0) {
								return;
							}

							let dataSet = [];
							let index = 1;
							for (let i = 0; i < catalogData.length; ++i) {
								let catalog = catalogData[i];
								let type = estimateAssembliesUpdateResourcePricesWizardService.getMaterialCatalogTypeById(catalog.MaterialCatalogTypeFk);
								let data = {
									Id: catalog.Id,
									Selected: true,
									CatalogCode: catalog.Code,
									CatalogDescription: catalog.DescriptionInfo.Translated,
									BusinessPartnerFk: catalog.BusinessPartnerFk,
									DateVersion: catalog.DataDate,
									Type: type ? type.Description : null,
									ValidFrom: catalog.ValidFrom,
									ValidTo: catalog.ValidTo,
									PseudoId: index++,
									ParentId: null,
									objectType: 'Catalog',
									ChildItems: []
								};
								dataSet.push(data);

								let versions = _.filter(priceVersions, {MaterialCatalogFk: catalog.Id});
								let priceList = [];

								for (let j = 0; j < versions.length; ++j) {
									let version = versions[j];
									if (!angular.isArray(priceList[version.PriceListFk])) {
										priceList[version.PriceListFk] = [];
									}
									priceList[version.PriceListFk].push(version);
								}

								for (let prop in priceList) {
									// eslint-disable-next-line no-prototype-builtins
									if (priceList.hasOwnProperty(prop)) {
										let price = _.find(priceLists, {Id: parseInt(prop)});
										let priceListData = {
											Id: parseInt(prop),
											Selected: true,
											CatalogCode: 'Price List',
											CatalogDescription: price.DescriptionInfo.Description,
											PseudoId: index++,
											ParentId: data.PseudoId,
											objectType: 'PriceList',
											ChildItems: []
										};
										data.ChildItems.push(priceListData);

										let vers = priceList[prop];
										for (let k = 0; k < vers.length; ++k) {
											let ver = vers[k];
											let versionData = {
												Id: ver.Id,
												Selected: true,
												CatalogCode: 'Version',
												CatalogDescription: ver.DescriptionInfo.Description,
												PseudoId: index++,
												ParentId: priceListData.PseudoId,
												objectType: 'PriceVersion',
												ChildItems: []
											};
											priceListData.ChildItems.push(versionData);
										}
									}
								}
							}

							$timeout(function () {
								estimateAssembliesUpdateResourcePricesWizardService.setSelectionData(dataSet, $scope.radio.Select);
								updateMaterialGrid(dataSet);
							}, 200);
						});
					}
				}
					break;
				case 'result': {
					setupResultGrid();

					let request = null;
					// get data, use timeout or not
					if ($scope.radio.Select === updateType.fromBase) {
						let selectedCatalogs =  estimateAssembliesUpdateResourcePricesWizardService.getSelectionData($scope.radio.Select);
						let catalogIds = _.map(_.filter(selectedCatalogs, {Selected: true}), function(catalog){
							return catalog.Id;
						});
						request = {
							Filters: filters,
							CatalogIds: catalogIds
						};
						estimateAssembliesUpdateResourcePricesWizardService.getBaseMaterialResult(request).then(function (response) {
							if (!response.data || response.data.length === 0){
								return;
							}
							estimateAssembliesUpdateResourcePricesWizardService.setUpdateResult(response.data, $scope.radio.Select);
							updateResultGrid(response.data);
						});
					} else if ($scope.radio.Select === updateType.fromPriceList) {
						let selectedVersionIds = [];
						let catalogWithVersions = estimateAssembliesUpdateResourcePricesWizardService.getSelectionData($scope.radio.Select);
						_.forEach(catalogWithVersions, function(catalogWithVer) {
							if (catalogWithVer.Selected) {
								addSelection(catalogWithVer, selectedVersionIds);
							}
						});

						let currentOption = estimateAssembliesUpdateResourcePricesWizardService.getPriceListRetrievalOptionIndex($scope.currentRetrievalOption.priceListRetrievalOption);
						request = {
							Filters: filters,
							VersionIds: selectedVersionIds,
							PriceListRetrievalOption: currentOption
						};
						estimateAssembliesUpdateResourcePricesWizardService.getMaterialPriceListResult(request).then(function(response){
							if (!response.data || response.data.Results.length === 0) {
								return;
							}

							estimateAssembliesUpdateResourcePricesWizardService.setUpdateResult(response.data.Results, $scope.radio.Select);
							estimateAssembliesUpdateResourcePricesWizardService.setAdditionalUpdateRequest({
								versionIds: selectedVersionIds,
								priceListRetrievalOption: currentOption
							}, $scope.radio.Select);
							updateResultGrid(response.data.Results);
						});
					}
				}
					break;
				case 'option':
					break;
				default:
					break;
			}

			// ///////////////////
			function addSelection(current, selections) {
				if (current.ChildItems.length > 0) {
					_.forEach(current.ChildItems, function(item) {
						addSelection(item, selections);
					});
				}
				if (current.objectType === 'PriceVersion' && current.Selected) {
					selections.push(current.Id);
				}
			}
		}

		function update() {
			let updateResult = estimateAssembliesUpdateResourcePricesWizardService.getUpdateResult($scope.radio.Select);
			let updateRequest = {
				Filters: filters,
				NewEntities: updateResult
			};
			$scope.isLoading = true;
			let promise = null;
			if ($scope.radio.Select === updateType.fromBase) {
				promise = estimateAssembliesUpdateResourcePricesWizardService.updateResourcePriceFromBaseMaterial(updateRequest);
			} else if ($scope.radio.Select === updateType.fromPriceList) {
				promise = estimateAssembliesUpdateResourcePricesWizardService.updateResourcePriceFromPriceList(updateRequest);
			}

			if (promise !== null) {
				promise.then(function (response) {
					$scope.isLoading = false;
					if (response.data === true) {
						$scope.$close({success: true});
					}
					else {
						$scope.$close({success: false});
					}
				}, function () {
					$scope.isLoading = false;
					$scope.$close({success: false});
				});
			}
		}
	}
})();
