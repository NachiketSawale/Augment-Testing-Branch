/**
 * Created by wui on 10/21/2015.
 */

(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonChartService', [
		'platformDataServiceFactory', 'procurementPriceComparisonMainService', 'PlatformMessenger',
		'procurementPriceComparisonBoqService', 'procurementPriceComparisonItemService', 'platformGridAPI',
		function (platformDataServiceFactory, mainDataService, PlatformMessenger, boqDataService, itemDataService, platformGridAPI) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonChartService',
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Items'
					}
				},
				entitySelection: {}
			};

			var data = {
				entities: [],
				quotes: [],
				context: {}
			};

			var grids = {
				boq: '8b9a53f0a1144c03b8447a99f7b38448',
				item: 'ef496d027ad34b1f8fe282b1d6692ded'
			};

			var service = platformDataServiceFactory.createNewComplete(serviceOption).service;
			service.onDataLoaded = new PlatformMessenger();

			service.getTree = function () {
				return data.entities;
			};

			service.getData = function () {
				return data;
			};

			var handleBoqChanged = handleParentSelectionChanged(boqDataService, 'boq');
			var handleItemChanged = handleParentSelectionChanged(itemDataService, 'item');

			boqDataService.onActiveCellChanged.register(handleBoqChanged);
			boqDataService.onColumnsChanged.register(handleBoqChanged);
			itemDataService.onActiveCellChanged.register(handleItemChanged);
			itemDataService.onColumnsChanged.register(handleItemChanged);
			mainDataService.registerSelectionChanged(discardData);

			handleBoqChanged();
			handleItemChanged();

			function buildEntities(items) {
				data.entities = [];
				data.quotes = [];

				if (angular.isArray(items) && items.length) {
					data.entities = items.map(function (item) {
						// business partner entity
						var bpEntity = generateEntity(null, item.columnTitle, 0, 'BP');
						bpEntity.Items = item.comparingValues.map(function (cItem) {
							// quote item entity
							var quoteEntity = generateEntity(item.Id, cItem.title, cItem.value, 'QUOTE');
							if (!data.quotes.some(hasQuote)) {
								data.quotes.push({
									Id: quoteEntity.Id,
									Name: quoteEntity.Name,
									IsSelected: true
								});
							}

							function hasQuote(quote) {
								return quote.Name === quoteEntity.Name;
							}

							return quoteEntity;
						});
						return bpEntity;
					});
				}
			}

			var nextId = 0;

			function generateEntity(pid, name, value, type) {
				return {
					Id: ++nextId,
					ParentId: pid,
					Name: name,
					Value: value,
					Type: type,
					Items: [],
					IsSelected: true
				};
			}

			/**
			 * get selection changed event handler according to parent service.
			 * @param parentService
			 * @param type
			 * @returns {Function}
			 */
			function handleParentSelectionChanged(parentService, type) {
				return function () {
					if (parentService.hasSelection()) {
						var gridId = type === 'boq' ? grids.boq : grids.item,
							grid = platformGridAPI.grids.element('id', gridId),
							gridInstance = grid ? grid.instance : null,
							activeCell = gridInstance ? gridInstance.getActiveCell() : null,
							activeColumn = activeCell ? gridInstance.getColumns()[activeCell.cell] : null;

						buildEntities(activeColumn ? parentService.getDataForGraphicalEvaluation(activeColumn) : []);
					} else {
						buildEntities([]);
					}
					data.context.type = type; // boq or item
					data.context.selected = parentService.getSelected() || {}; // is an item selected

					service.onDataLoaded.fire(data);
				};
			}

			/**
			 * discard chart data when main item changed.
			 */
			function discardData() {
				data.entities = [];
				data.quotes = [];
				service.onDataLoaded.fire([]);
			}

			return service;
		}
	]);
})(angular);