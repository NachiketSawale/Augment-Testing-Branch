/**
 * Created by pja on 20.03.2018.
 */
(function () {

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionsystemMainLineItem2MdlObjectController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of model objects assigned ti line item.
	 **/
	angular.module(moduleName).controller('constructionsystemMainLineItem2MdlObjectController',
		['$scope', '$translate', 'constructionsystemMainLineItemUIStandardService', 'platformGridControllerService',
			'constructionsystemMainLineitem2mdlobjectService', 'constructionsystemMainLineItem2MdlObjectConfigService','constructionSystemMainInstanceValidationService', 'constructionSystemMainInstanceService',
			'constructionSystemHighlightToggleService','platformGridAPI',
			function ($scope, $translate, constructionsystemMainLineItemUIStandardService, gridControllerService,
				constructionsystemMainLineitem2mdlobjectService, constructionsystemMainLineItem2MdlObjectConfigService,constructionSystemMainInstanceValidationService, constructionSystemMainInstanceService,
				constructionSystemHighlightToggleService,platformGridAPI) {

				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, constructionsystemMainLineItem2MdlObjectConfigService,constructionsystemMainLineitem2mdlobjectService, constructionSystemMainInstanceValidationService, gridConfig);

				var removeItems = ['create', 'createChild', 'delete'];
				$scope.tools.items = _.filter($scope.tools.items, function (item) {
					return item && removeItems.indexOf(item.id) === -1;
				});

				function quantityChanged(lineitem) {
					// only reset the quantities when lineitem has split quantity
					if(lineitem.HasSplitQuantities){
						var factors = lineitem.QuantityFactor1 * lineitem.QuantityFactor2 * lineitem.QuantityFactor3 * lineitem.QuantityFactor4 * lineitem.ProductivityFactor;
						var quantityTotal = lineitem.Quantity * factors;
						var quantityList = constructionsystemMainLineitem2mdlobjectService.getList();

						angular.forEach(quantityList, function(item){
							item.Quantity = quantityTotal;
							item.QuantityDetail = quantityTotal;
							constructionsystemMainLineitem2mdlobjectService.fireItemModified(item);
							constructionsystemMainLineitem2mdlobjectService.markItemAsModified(item);
						});
					}
				}

				/* function setLineItemObjectSelectionOnViewer() {
					var selectedItems = constructionsystemMainLineitem2mdlobjectService.getSelectedEntities();
					constructionSystemHighlightToggleService.setLineItemObjectSelectionOnViewer(selectedItems);
				} */

				// TODO: platformGridAPI.rows.selection need get Selected Rows Items, but now it can't
				function getGridItemList(gridId) {
					return platformGridAPI.rows.getRows(gridId);
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', function (e, arg) {
					constructionSystemHighlightToggleService.setLineItemObjectSelectionOnViewer(e, arg, getGridItemList($scope.gridId));
				});

				var highlightAction = {
					id: 't1000',
					sort: 2,
					caption: $translate.instant('constructionsystem.main.toggleHighlight'),
					type: 'check',
					iconClass: 'tlb-icons ico-view-select',
					value: constructionSystemHighlightToggleService.highlight.isLineItemObject(),
					fn: function (id, item) {
						if (item.value) {
							var selectedItems = constructionsystemMainLineitem2mdlobjectService.getSelectedEntities();
							constructionSystemHighlightToggleService.toggleHighlight(selectedItems,
								constructionSystemHighlightToggleService.highlight.lineItemObject);
						} else {
							constructionSystemHighlightToggleService.toggleHighlight([], '');
						}
					}
				};

				var toggleHighlight = function toggleHighlight() {
					highlightAction.value = constructionSystemHighlightToggleService.highlight.isLineItemObject();
					$scope.tools.update();
				};

				$scope.tools.items.unshift(highlightAction);

				constructionSystemMainInstanceService.onQuantityChanged.register(quantityChanged);
				constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.register(toggleHighlight);
				// constructionsystemMainLineitem2mdlobjectService.registerSelectionChanged(setLineItemObjectSelectionOnViewer);

				$scope.$on('$destroy', function () {
					constructionSystemMainInstanceService.onQuantityChanged.unregister(quantityChanged);
					constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);
					// constructionsystemMainLineitem2mdlobjectService.unregisterSelectionChanged(setLineItemObjectSelectionOnViewer);
				});
			}
		]);
})();