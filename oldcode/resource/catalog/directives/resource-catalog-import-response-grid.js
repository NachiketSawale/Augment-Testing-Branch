/*
 * $Id: wizard-selection-list.js 501946 2019-07-011 14:26:99Z nitsche $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc directive
	 * @name resource.catalog.directive:resourceCatalogImportResponseGrid
	 * @require _, $compile, platformGridAPI, platformTranslateService, $timeout, math
	 * @element div
	 * @restrict A
	 * @description A directive that displays a grid
	 */
	angular.module('estimate.main').directive('resourceCatalogImportResponseGrid', ['_', '$injector', '$compile', 'platformGridAPI',
		'platformTranslateService', '$timeout', 'math',
		function (_, $injector, $compile, platformGridAPI, platformTranslateService, $timeout, math) {
			return {
				restrict: 'A',
				scope: {
					model: '=',
					groups : '=',
					entity: '='
				},
				link: function ($scope, elem /* , attrs */) {
					$scope.gridId = 'bec4cd8ebb6845abb04ec8969c9350f1-' + math.randomInt(0, 10000);
					$scope.gridData = {
						state: $scope.gridId
					};

					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					var gridOptions = {
						skipPermissionCheck: true,
						tree: false,
						indicator: true,
						idProperty: 'Id',
						editable: true
					};

					var grid = {
						data: [],
						lazyInit: true,
						enableConfigSave: false,
						columns: [
							{
								id: 'unit',
								field: 'Unit',
								name: 'Unit',
								name$tr$: 'resource.catalog.import.unitLabel',
								formatter: 'code',
								editor: null,
								readonly: true,
								width: 100
							},
							{
								id: 'RelatedUnit',
								field: 'RelatedUnit',
								name: 'Refered Unit',
								name$tr$: 'resource.catalog.import.referedUomLabel',
								formatter: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-lookup-data-by-custom-data-service',
									lookupType: 'basicsUnitLookupDataService',
									lookupOptions:{
										uuid: '01faa125dc93475d80a5407dd67e0ed7',
										valueMember: 'Id',
										dataServiceName: 'basicsUnitLookupDataService',
										columns:[
											{id: 'Unit', field: 'UnitInfo', name: 'Unit', formatter: 'translation', name$tr$: 'basics.unit.entityUnit'},
											{id: 'Description', field: 'DescriptionInfo', name: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'}
										],
										isClientSearch: true,
										isTextEditable: false,
										lookupModuleQualifier: 'basicsUnitLookupDataService',
										disableDataCaching: true,
										displayMember: 'UnitInfo.Translated',
										showClearButton: true
									}
								},
								formatterOptions:{
									dataServiceName:'basicsUnitLookupDataService',
									displayMember: 'UnitInfo.Translated',
									filter: undefined,
									imageSelector: '',
									isClientSearch: true,
									lookupType: 'basicsUnitLookupDataService'
								},
								editor: 'lookup',
								readonly: false,
								width: 150
							},
							{
								id: 'Factor',
								field: 'Factor',
								name: 'Factor',
								name$tr$: 'resource.catalog.import.factorLabel',
								formatter: 'factor',
								editor: 'factor',
								readonly: false,
								width: 100
							},
							{
								field: 'ImportTo',
								editor: 'select',
								formatter: 'select',
								id: 'ImportTo',
								name: 'Import to:',
								name$tr$: 'resource.catalog.import.uomImportToLabel',
								editorOptions: {
									displayMember: 'Description',
									valueMember: 'Id',
									inputDomain: 'Description',
									items: [
										{Id: 1, Description: 'None'},
										{Id: 2, Description: 'Unit'},
										{Id: 3, Description: 'Synonym'}
									]
								},
								readonly: false,
								visible: true,
								sortOrder: 1
							}
						],
						id: $scope.gridId,
						options: gridOptions
					};

					platformTranslateService.translateObject(grid.columns, 'name');

					platformGridAPI.grids.config(grid);

					elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

					$timeout(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
					$scope.$on('wzdlgStepChanged', function () {
						platformGridAPI.grids.resize($scope.gridId);
					});

					$scope.$watch('model', function (newValue) {
						platformGridAPI.items.data($scope.gridId, newValue);
					});
				}
			};
		}]);
})();
