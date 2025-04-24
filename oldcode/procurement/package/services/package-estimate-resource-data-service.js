/**
 * Created by zos on 9/15/2015.
 */
(function (angular) {

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_,Platform */

	var moduleName = 'procurement.package';
	var procurementPackageModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name procurementPackageEstimateResourceDataService
	 * @function
	 * @description
	 * procurementPackageEstimateResourceDataService is the data service for package estimate line item resource related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('procurementPackageEstimateResourceDataService',
		['platformDataServiceFactory', 'procurementPackageEstimateLineItemDataService','estimateMainResourceImageProcessor','packageResourceTypeProcessor','$injector','procurementPackageDataService',
			function (platformDataServiceFactory,lineItemDataService,estimateMainResourceImageProcessor,packageResourceTypeProcessor, $injector, procurementPackageDataService) {

				// The instance of the main service - to be filled with functionality below
				var estimateMainResourceServiceOption = {
					hierarchicalLeafItem: {
						module: procurementPackageModule,
						serviceName: 'procurementPackageEstimateResourceService',
						httpRead: {
							route: globals.webApiBaseUrl + 'estimate/main/resource/',
							endRead: 'tree',
							initReadData: function initReadData(readData) {
								var selectedItem = lineItemDataService.getSelected();
								readData.estHeaderFk = selectedItem.EstHeaderFk;
								if(selectedItem.EstLineItemFk > 0){
									readData.estLineItemFk = selectedItem.EstLineItemFk;
								}else{
									readData.estLineItemFk = selectedItem.Id;
								}

								var currentPackageItem = procurementPackageDataService.getSelected();
								if(currentPackageItem && currentPackageItem.ProjectFk){
									readData.projectId = currentPackageItem.ProjectFk;
								}

							},
							usePostForRead: true
						},

						httpUpdate: {route: globals.webApiBaseUrl + 'procurement/package/package/', endUpdate: 'updatepackage'},
						presenter: {
							tree: {
								parentProp: 'EstResourceFk', childProp: 'EstResources', childSort : true, isDynamicModified : true,
								incorporateDataRead: function incorporateDataRead(readItems, data) {
									// serviceContainer.data.sortByColumn(readItems);

									setDynamicColumnsLayout(readItems);
									return serviceContainer.data.handleReadSucceeded(readItems.dtos, data, true);
								}
							}
						},
						dataProcessor: [ estimateMainResourceImageProcessor, packageResourceTypeProcessor],
						entityRole: {leaf: {itemName: 'EstResource', parentService: lineItemDataService}},
						actions:{
							delete:false,
							create:false
						}
					}
				};

				/* jshint -W003 */
				var serviceContainer = platformDataServiceFactory.createNewComplete(estimateMainResourceServiceOption);
				serviceContainer.data.usesCache = false;
				var service = serviceContainer.service;
				// noinspection JSUnresolvedVariable
				service.onReadOnlyGrid = new Platform.Messenger();

				function setDynamicColumnsLayout(readData){
					var dynColumns = readData.dynamicColumns;
					var estLineItemCharacteristics = dynColumns.Characteristics || [];
					var characterisitcsDefaults = dynColumns.Defaults || [];

					var estLineItemCharacteristicsColumns = [];
					var dynamicColService = $injector.get('estimateMainResourceDynamicColumnService');
					var estimateMainCommonService = $injector.get('estimateMainCommonService');

					if(_.size(estLineItemCharacteristics) > 0 && estimateMainCommonService){
						estimateMainCommonService.appendCharactiricColumnData(estLineItemCharacteristics, service, readData.dtos);
						estLineItemCharacteristicsColumns = estimateMainCommonService.getCharactCols(estLineItemCharacteristics);
					}

					serviceContainer.data.characteristicsDefaults = characterisitcsDefaults;
					serviceContainer.data.dynamicColumns = estLineItemCharacteristicsColumns;
					dynamicColService.setDynCharCols(serviceContainer.data.dynamicColumns);
					service.setDynamicColumnsLayoutToGrid();
				}

				function getDynamicColumns(){
					return serviceContainer.data.dynamicColumns;
				}

				function parseConfiguration(propertyConfig) {
					propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

					_.each(propertyConfig, function (config) {
						if (_.has(config, 'name')) {
							_.unset(config, 'name');
							_.unset(config, 'name$tr$');
							_.unset(config, 'name$tr$param$');
						}
					});

					return propertyConfig;
				}

				service.setDynamicColumnsLayoutToGrid = function setDynamicColumnsLayoutToGrid(){
					var mainViewService = $injector.get('mainViewService');
					var platformGridAPI = $injector.get('platformGridAPI');

					var gridId = '691DF3BC90574BE182ED007600A15D44'; // Resource container grid Id
					var grid = platformGridAPI.grids.element('id', gridId);
					if (grid && grid.instance){
						var cols = grid.columns.current; // platformGridAPI.columns.getColumns(gridId);
						var dynamicCols = _.filter(cols, function(col){
							return (col.id.indexOf('ConfDetail') > -1 || col.id.indexOf('charactercolumn_') > -1 ||  col.id.indexOf('NotAssignedCostTotal') > -1);
						});
						if(dynamicCols.length === 0){
							var allColumns = cols.concat(getDynamicColumns());

							var config = mainViewService.getViewConfig(gridId);

							if (config) {
								var propertyConfig = config.Propertyconfig || [];
								propertyConfig = parseConfiguration(propertyConfig);

								var mappedConfigIds = {};

								propertyConfig.forEach(function (el, i) {
									mappedConfigIds[el.id] = {
										'idx': i,
										'prop': el
									};
								});

								allColumns.forEach(function(col/* , i */){
									// eslint-disable-next-line no-prototype-builtins
									if(mappedConfigIds.hasOwnProperty((col.id))){
										col.hidden = !mappedConfigIds[col.id].prop.hidden;
									}
								});
							}

							platformGridAPI.columns.configuration(gridId, allColumns);
							platformGridAPI.grids.resize(gridId);
						}
					}
				};


				return service;
			}]);
})(angular);