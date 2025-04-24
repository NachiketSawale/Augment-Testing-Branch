/**
 * Created by lcn on 20/12/2024.
 */
(function (angular) {
	'use strict';

	let moduleName = 'procurement.common';

	angular.module(moduleName).service('procurementCommonInterCompanyDrillDownFactoryService', [
		'_', '$injector', 'basicsLookupdataPopupService', 'BasicsCommonDateProcessor', 'platformGridAPI', 'platformModuleNavigationService',
		function (_, $injector, basicsLookupdataPopupService, BasicsCommonDateProcessor, platformGridAPI, naviService) {

			const dateProcessor = new BasicsCommonDateProcessor(['PostDate', 'InvoiceDate']);
			// Helper function to recursively process date fields
			const processItemRecursively = (item) => {
				dateProcessor.processItem(item);
				if (item.ChildItems) {
					item.ChildItems.forEach(processItemRecursively);
				}
			};

			// Main function to create the service
			function create(config) {
				const {getColumns, gridId, options, showGoto} = config;
				const popupToggle = basicsLookupdataPopupService.getToggleHelper();

				return {
					openPopup: function (e, scope, dataItem) {
						const popupOptions = {
							id: 'drillDownPopup',
							templateUrl: globals.appBaseUrl + '/procurement.invoice/templates/inter-company-drill-down-lookup.html',
							showLastSize: true,
							controller: ['$scope', 'basicsLookupdataLookupControllerFactory', '$popupInstance', function ($scope, lookupControllerFactory, $popupInstance) {
								initController($scope, lookupControllerFactory, $popupInstance, dataItem);
							}],
							level: -2,
							width: 760,
							height: 300,
							focusedElement: angular.element(e.target.parentElement),
							relatedTarget: angular.element(e.target),
							scope: scope.$new()
						};
						popupToggle.toggle(popupOptions);
					}
				};

				// Initialize the controller for the popup
				function initController(scope, lookupControllerFactory, popupInstance, dataItem) {
					// Temporarily disable the hidePopup method
					const tempHidePopup = basicsLookupdataPopupService.hidePopup;
					basicsLookupdataPopupService.hidePopup = angular.noop;

					// Process date fields in DrillDownEntities
					dataItem.DrillDownEntities.forEach(processItemRecursively);

					// Configure grid options for the popup
					const optionsConfig = {
						gridId,
						gridData: dataItem.DrillDownEntities || [],
						columns: getColumns,
						idProperty: 'Id',
						lazyInit: true,
						grouping: true,
						enableDraggableGroupBy: true,
						...(options?.treeOptions && {treeOptions: options.treeOptions})
					};

					// Initialize the grid
					scope.service = lookupControllerFactory.create({grid: true}, scope, optionsConfig);

					if (showGoto) {
						const gotoModule = 'procurement.invoice';
						scope.rightClickTools = {items: []};
						scope.toolbarCopyItem = {
							caption: 'cloud.common.Navigator.goTo',
							contextAreas: ['grid-row'],
							iconClass: `tlb-icons ico-goto ${_.uniqueId('_navigator')}`,
							id: 't-navigation-to',
							type: 'item',
							contextGroup: 1,
							disabled: function () {
								const selectedEntity = platformGridAPI.rows.selection({gridId: gridId});
								return !selectedEntity.InvHeaderId || !naviService.hasPermissionForModule(gotoModule);
							},
							fn: function () {
								const selectedEntity = platformGridAPI.rows.selection({
									gridId: gridId
								});
								if (selectedEntity.InvHeaderId) {
									naviService.navigate({moduleName: gotoModule, targetIdProperty: 'Id', forceNewTab: true}, {'Id': selectedEntity.InvHeaderId});
								}
							}
						};

						scope.rightClickTools.items.push(scope.toolbarCopyItem);
					}
					// Resize handler for grid
					popupInstance.onResizeStop.register(() => {
						$injector.get('platformGridAPI').grids.resize(scope.grid.state);
					});

					// Clean up when the scope is destroyed
					scope.$on('$destroy', () => {
						basicsLookupdataPopupService.hidePopup = tempHidePopup;
					});

				}
			}

			// Create a column for the grid
			function createColumn(id, field, width, translate, formatter, lookupType, displayMember) {
				const column = {
					id,
					field,
					width,
					name$tr$: translate + id,
					formatter,
					readonly: true
				};

				if (formatter === 'lookup' && lookupType && displayMember) {
					column.formatterOptions = {lookupType, displayMember};
				}

				return column;
			}

			return {create, createColumn};
		}

	]);

})(angular);
