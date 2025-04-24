(function () {
	'use strict';
	/* global globals */
	const moduleName = 'productionplanning.common';
	const angModule = angular.module(moduleName);

	angModule.controller('productionplanningCommonProductItemListController', ProductionplanningCommonProductItemListController);

	ProductionplanningCommonProductItemListController.$inject = ['$scope', '$injector', 'platformGridControllerService',
		'productionplanningCommonProductItemDataService', 'productionplanningCommonProductItemUIStandardService',
		'productionplanningCommonProductValidationFactory', 'productionplanningCommonProductItemClipboardService',
		'platformGridAPI', 'basicsCommonToolbarExtensionService',
		'$translate', '$http',
		'productionplanningProductDocumentDataProviderFactory',
		'ppsDocumentToolbarButtonExtension',
		'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'modelViewerCompositeModelObjectSelectionService',
		'modelViewerModelSelectionService', 'modelViewerModelIdSetService'];

	function ProductionplanningCommonProductItemListController($scope, $injector, gridControllerService,
															   dataService, uiStandardService,
															   validationServiceFactory, clipboardService,
															   platformGridAPI, basicsCommonToolbarExtensionService,
															   $translate, $http,
															   productDocumentDataProviderFactory,
															   ppsDocumentToolbarButtonExtension,
															   basicsLookupdataLookupDataService, basicsLookupdataLookupDescriptorService, modelViewerCompositeModelObjectSelectionService,
															   modelViewerModelSelectionService, modelViewerModelIdSetService) {

		const gridContainerGuid = $scope.getContentValue('uuid');
		const characteristic2SectionId = 64;

		const gridConfig = {
			initCalled: false,
			columns: [],
			dragDropService: clipboardService,
			type: 'ppsItemProduct',
		};
		const eventModuleName = $scope.getContentValue('eventModule');
		const validationService = validationServiceFactory.getValidationService(dataService, eventModuleName);
		gridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'pinForMarkups',
			sort: 1,
			caption: 'productionplanning.item.pinForMarkups',
			type: 'check',
			value: dataService.isPinForMarkups,
			iconClass: 'tlb-icons ico-set-prj-context',
			fn: function (id, item) {
				dataService.pinForMarkups(item.value);
			},
			disabled: function () {
				return _.isNil(dataService.getSelected());
			}
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'moveToRoot',
			sort: 1,
			caption: 'productionplanning.item.moveToRoot',
			type: 'item',
			iconClass: 'tlb-icons ico-grid-row-start',
			fn: function () {
				dataService.moveToRoot();
			},
			disabled: function () {
				const selectedPU = getSelectedPU();
				return !selectedPU || selectedPU.IsForPreliminary || !dataService.canMoveToRoot();
			}
		});

		function doSingleOrMultipleManualProoductCreation(isMultiple = false) {
			isLoadingForSingleOrMultipleManualProductCreation = true;
			let selectedPpsItem = getSelectedPU();
			let childrenIdsAcquisitionPromise = $http.get(`${globals.webApiBaseUrl}basics/sitenew/getchildrenids?siteid=${selectedPpsItem.SiteFk}`);
			let processConfigCheckPromise = $http.get(`${globals.webApiBaseUrl}productionplanning/common/product/isprocessconfigured?productdescriptionid=${selectedPpsItem.ProductDescriptionFk}`);
			let getProdPlace = basicsLookupdataLookupDataService.getList('PpsProductionPlace');
			Promise.all([childrenIdsAcquisitionPromise, processConfigCheckPromise, getProdPlace])
				.then(responses => dataService.createSingleOrMultipleProducts(selectedPpsItem, responses, isMultiple))
				.finally(() => {
					isLoadingForSingleOrMultipleManualProductCreation = false;
					$scope.tools.update();
				});
			// remark: when I try to request data asynchronously(via http) in the initial phase of the "multiple product creation" dialog, there is an issue(a UI error when open the dialog twice) that cannot be solved for the time being,
			// so here we request the data we relied on before opening the dialog
		}

		function singleOrMultipleManualProoductCreationDisableFn() {
			const selectedParent = getSelectedPU();
			return isLoadingForSingleOrMultipleManualProductCreation ||
				!selectedParent || !selectedParent.ProductDescriptionFk || selectedParent.IsForPreliminary;
		}

		let isLoadingForSingleOrMultipleManualProductCreation = false;
		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'createManually',
			sort: 1,
			caption: 'productionplanning.item.createManually',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-new',
			fn: function () {
				doSingleOrMultipleManualProoductCreation();
			},
			disabled: singleOrMultipleManualProoductCreationDisableFn
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'backToStock',
			caption: 'productionplanning.common.product.backToStock',
			type: 'item',
			iconClass: 'tlb-icons ico-back-to-stock',
			fn: function () {
				const selected = dataService.getSelectedEntities();
				$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/backtostock', _.map(selected, 'Id'))
					.then(function (response) {
						if (response.data) {
							dataService.load();
							if($injector.get('transportplanningTransportUtilService').hasShowContainerInFront('productionplanning.item.transportable')){
								$injector.get('ppsItemTransportableDataService').load();
							}
						}
					});
			},
			disabled: function () {
				if (getSelectedPU()?.IsForPreliminary === true) {
					return true;
				}
				return dataService.getSelectedEntities().length < 1 || _.some(dataService.getSelectedEntities(), (product) => {
					return !product.IsCurrentJobInternal || !product.PpsItemStockFk || product.PpsItemStockFk === product.ItemFk;
				});
			}
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'takefromstock',
			sort: 2,
			caption: 'productionplanning.common.product.takeFromStock',
			type: 'item',
			iconClass: 'tlb-icons ico-take-from-stock',
			fn: function () {
				const item = getSelectedPU();
				dataService.takeFromStock(item);
			},
			disabled: function () {
				const selectedPU = getSelectedPU();
				return !selectedPU || !selectedPU.ProductDescriptionFk || selectedPU.IsForPreliminary || isForStock(selectedPU);
			}
		});

		function isForStock(ppsItem) {
			const ppsHeader = basicsLookupdataLookupDescriptorService.getLookupItem('ppsheader', ppsItem.PPSHeaderFk);
			const headerType = basicsLookupdataLookupDescriptorService.getLookupItem('basics.customize.ppsheadertype', ppsHeader.HeaderTypeFk);
			return headerType.IsForStock; // internal header
		}

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'serialProduction',
			caption: 'productionplanning.common.serialProduction.serialProduction',
			type: 'item',
			iconClass: 'tlb-icons ico-mode-relationship',
			fn: function () {
				const selectedSubPU = getSelectedPU();
				dataService.serialProduction(selectedSubPU);
			},
			disabled: function () {
				const selectedParent = getSelectedPU();
				return !selectedParent || selectedParent?.IsForPreliminary || !selectedParent.ProductDescriptionFk;
			}
		});

		basicsCommonToolbarExtensionService.insertBefore($scope, {
			id: 'LinkProductToModel',
			caption: 'productionplanning.common.product.linkProductToModel',
			type: 'item',
			iconClass: 'tlb-icons ico-add-single-model',
			fn: function () {
				dataService.createLinkageToModel();
			},
			disabled: function () {
				return getSelectedPU()?.IsForPreliminary === true || dataService.disableCreateLinkageBtn();
			}
		});

		(function extendPpsDocumentActionButtons() {
			const docTypes = productDocumentDataProviderFactory.ppsDocumentTypes;
			ppsDocumentToolbarButtonExtension.extendDocumentButtons(docTypes, $scope, dataService);
		})();

		platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
		dataService.registerSelectionChanged(onSelectionChanged);
		dataService.registerLookupFilter();
		modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(objectSelectionChanged);

		dataService.registerPinForMarkupStateChanged(updatePinForMarkups);
		dataService.registerAnnotationStatusChanged(reSelectProducts);
		dataService.registerInstallSequenceChanged(updateInstallSequence);

		// extend characteristic2
		const characteristic2ColumnEventsHelper = $injector.get('PpsCommonCharacteristic2ColumnEventsHelper');
		const characteristic2Config = {
			sectionId: characteristic2SectionId,
			gridContainerId: $scope.gridId,
			gridConfig: gridConfig,
			dataService: dataService,
			containerInfoService: 'productionplanningProductContainerInformationService',
		};
		characteristic2ColumnEventsHelper.register(characteristic2Config);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
			dataService.unregisterSelectionChanged(onSelectionChanged);
			dataService.unregisterLookupFilter();
			characteristic2ColumnEventsHelper.unregister($scope.gridId, characteristic2SectionId);
			dataService.unregisterPinForMarkupStateChanged(updatePinForMarkups);
			dataService.unregisterAnnotationStatusChanged(reSelectProducts);
			dataService.unregisterInstallSequenceChanged(updateInstallSequence);
			modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(objectSelectionChanged);
		});

		function onCellChange(e, args) {
			const col = args.grid.getColumns()[args.cell].field;
			dataService.onValueChanged(args.item, col);
		}

		function onSelectionChanged() {
			dataService.handleSelectionChanged();
			$scope.tools.update();
		}

		let grid = $injector.get('platformGridAPI').grids.element('id', $scope.gridId);

		function objectSelectionChanged() {
			dataService.IsCleanModel = false;
			if (dataService.handleProductChanged === false) {
				return;
			}

			let modelId = modelViewerModelSelectionService.getSelectedModelId();
			if (modelId > 0) {
				if (modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() > 0) {
					let objectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
					let totalObjectIds = [];
					_.forEach(objectIds, function (subModel) {
						totalObjectIds = totalObjectIds.concat(subModel);
					});
					let data = {MdlObjectIds: totalObjectIds, MdlModelFk: modelId};
					$http.post(globals.webApiBaseUrl + 'productionplanning/common/model/productids', data).then(function (result) {
						if (result.data.length > 0) {
							//dic: modelIdKey - productIds
							var productIdDic = modelViewerModelIdSetService.createFromCompressedStringWithArrays(result.data).useSubModelIds();
							var productIds = [];
							_.forEach(productIdDic, function (proIds){
								productIds = productIds.concat(proIds);
							})
							var list = dataService.getList();
							let selectedEntities = [];
							_.forEach(productIds, function (productId) {
								var existing = _.find(list, {Id: productId});
								if(!_.isNil(existing || existing !== undefined)){
									selectedEntities.push(existing);
								}
							});
							let ids = _.map(selectedEntities, 'Id');
							let rows = grid.dataView.mapIdsToRows(ids);
							dataService.handleProductChanged = false;
							grid.instance.setSelectedRows(rows, true);
							dataService.setSelectedEntities(selectedEntities);
							dataService.handleProductChanged = true;
						} else {
							grid.instance.setSelectedRows(0, true);
							dataService.setSelectedEntities([]);
							if (modelViewerCompositeModelObjectSelectionService.getSelectedObjectIdCount() === 1) {
								dataService.IsCleanModel = true;
							}
						}
						$scope.tools.update();
					});
				} else {
					grid.instance.setSelectedRows([-1], true);
					$scope.tools.update();
				}
			}
		}

		function updatePinForMarkups(state) {
			let pinForMarkupBtn = _.find($scope.tools.items, function (item) {
				return item.id === 'pinForMarkups';
			});
			if (pinForMarkupBtn !== null) {
				pinForMarkupBtn.value = state;
			}
			$scope.tools.update();
		}

		function reSelectProducts(pinProductIds) {
			if (_.isArray(pinProductIds)) {
				let products = dataService.getList().filter(item => pinProductIds.includes(item.Id));
				let rows = grid.dataView.mapIdsToRows(pinProductIds);
				grid.instance.setSelectedRows(rows, true);
				dataService.setSelectedEntities(products);
			}
		}

		function updateInstallSequence(updateStacks){
			let list = dataService.getList();
			_.forEach(updateStacks, function (stack){
				let product = _.find(list, {Id: stack.PpsProductFk});
				if(product){
					product.InstallSequence = stack.InstallSequence;
				}
			});
			dataService.gridRefresh();
		}

		function getSelectedPU() {
			return dataService.parentService().getSelected();
		}
	}
})();