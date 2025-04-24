/* globals angular */
// eslint-disable-next-line func-names
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionTrsGoodsDocumentService', TrsGoodsDocumentService);

	TrsGoodsDocumentService.$inject = [
		'_',
		'$translate',
		'platformDataServiceFactory',
		'basicsCommonServiceUploadExtension',
		'trsGoodsTypes'
	];

	function TrsGoodsDocumentService(
		_,
		$translate,
		platformDataServiceFactory,
		basicsCommonServiceUploadExtension,
		trsGoodsTypes) {

		var service = {};

		service.getPreviewButtons = function getPreviewButtons(dataService, $scope, documentDataService) {
			return {
				id: 'preview',
				caption: $translate.instant('productionplanning.common.document.previewDocument'),
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-preview-form',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [
						createBtnItem(trsGoodsTypes.Bundle, 'previewBundle', $translate.instant('productionplanning.common.document.previewBundle'), dataService, $scope, documentDataService),
						createBtnItem(trsGoodsTypes.Product, 'previewProduct', $translate.instant('productionplanning.common.document.previewProduct'), dataService, $scope, documentDataService),
					]
				},
				disabled: function () {
					var selectedItem = dataService.getSelected();
					return !selectedItem ||
						!(selectedItem.TrsGoodsTypeFk === trsGoodsTypes.Product || selectedItem.TrsGoodsTypeFk === trsGoodsTypes.Bundle);
				}
			};
		};

		service.getTrsGoodsDocumentDataService = function getTrsGoodsDocumentDataService(parentService) {
			var serviceOption = {
				flatLeafItem: {
					module: angular.module(moduleName),
					serviceName: 'transportplanningRequisitionTrsGoodsDocumentDataService',
					entityRole: {
						leaf: {
							itemName: 'PpsDocument',
							parentService: parentService,
							doesRequireLoadAlways: false
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOption);

			container.service.setDocuments = function setDocuments(trsGoods) {
				var items = [];

				_.forEach(trsGoods, function (good) {
					if (good.TrsGoodsTypeFk === trsGoodsTypes.Product || good.TrsGoodsTypeFk === trsGoodsTypes.Bundle) {
						if (good.PpsStackListDocument) {
							items.push(good.PpsStackListDocument);
						}
						if (good.PpsLayoutDrawingDocument) {
							items.push(good.PpsLayoutDrawingDocument);
						}
						if (good.PpsQTODocument) {
							items.push(good.PpsQTODocument);
						}
						if (good.PpsPositionPlanDocument) {
							items.push(good.PpsPositionPlanDocument);
						}
					}
				});

				container.data.handleReadSucceeded(items, container.data);
			};

			basicsCommonServiceUploadExtension.extendWidthPreview(container.service, {canPreview: true});
			return container.service;
		};

		return service;

		function createBtnItem (type, id, caption, dataService, $scope, documentDataService) {
			const isType = selected => selected && selected.TrsGoodsTypeFk === type;

			return {
				id,
				caption,
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-preview-form',
				list: {
					showImages: true,
					listCssClass: 'dropdown-menu-right',
					items: [
						{
							id: 'previewStackList',
							caption: $translate.instant('productionplanning.common.document.previewStackList'),
							type: 'item',
							iconClass: 'tlb-icons ico-preview-form',
							fn: function () {
								var selectedItem = dataService.getSelected();
								documentDataService.setSelected(selectedItem.PpsStackListDocument).then(function () {
									documentDataService.previewDocument($scope, true);
								});
							},
							disabled: function () {
								var selectedItem = dataService.getSelected();
								return !isType(selectedItem) || !selectedItem.PpsStackListDocument;
							}
						}, {
							id: 'previewLayoutDrawing',
							caption: $translate.instant('productionplanning.common.document.previewLayoutDrawing'),
							type: 'item',
							iconClass: 'tlb-icons ico-preview-form',
							fn: function () {
								var selectedItem = dataService.getSelected();
								documentDataService.setSelected(selectedItem.PpsLayoutDrawingDocument).then(function () {
									documentDataService.previewDocument($scope, true);
								});
							},
							disabled: function () {
								var selectedItem = dataService.getSelected();
								return !isType(selectedItem) || !selectedItem.PpsLayoutDrawingDocument;
							}
						},
						{
							id: 'previewQTO',
							caption: $translate.instant('productionplanning.common.document.previewQTO'),
							type: 'item',
							iconClass: 'tlb-icons ico-preview-form',
							fn: function () {
								var selectedItem = dataService.getSelected();
								documentDataService.setSelected(selectedItem.PpsQTODocument).then(function () {
									documentDataService.previewDocument($scope, true);
								});
							},
							disabled: function () {
								var selectedItem = dataService.getSelected();
								return !isType(selectedItem) || !selectedItem.PpsQTODocument;
							}
						},
						{
							id: 'previewPositionPlan',
							caption: $translate.instant('productionplanning.common.document.previewPositionPlan'),
							type: 'item',
							iconClass: 'tlb-icons ico-preview-form',
							fn: function () {
								var selectedItem = dataService.getSelected();
								documentDataService.setSelected(selectedItem.PpsPositionPlanDocument).then(function () {
									documentDataService.previewDocument($scope, true);
								});
							},
							disabled: function () {
								var selectedItem = dataService.getSelected();
								return !isType(selectedItem) || !selectedItem.PpsPositionPlanDocument;
							}
						}
					]
				},
				disabled: function () {
					var selectedItem = dataService.getSelected();
					return !isType(selectedItem) ||
						(!selectedItem.PpsStackListDocument &&
							!selectedItem.PpsLayoutDrawingDocument &&
							!selectedItem.PpsQTODocument &&
							!selectedItem.PpsPositionPlanDocument);
				}
			};
		}
	}

})(angular);