/**
 *
 */

/* global globals , _ */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainLineItemLookupService
	 * @function
	 *
	 * @description
	 * estimateMainLineItemLookupService is the data service for all estimate lineitem related functionality of Copy Source LineItem Container.
	 */
	angular.module(moduleName).factory('estimateMainCopySourceLineItemLookupService',
		['platformDataServiceFactory', 'platformPermissionService', 'permissions','$injector','platformGridAPI' ,'estimateMainCopySourceProcessService',
			function (platformDataServiceFactory, platformPermissionService, permissions,$injector,platformGridAPI, estimateMainCopySourceProcessService) {
				let service;
				let selectedEstHeaderFk = null,
					selectedEstProjectFk = null,
					searchText = '',
					pageSize = 200;

				function initReadData(readData){
					let filterData = {
						PageSize: pageSize,
						PageNumber: 0,
						UseCurrentClient: true,
						IncludeNonActiveItems: true,
						ExecutionHints: false,
						PinningContext: [],
						ProjectContextId: selectedEstProjectFk,
						PKeys : [],
						filter: '',
						Pattern : searchText.toLowerCase(),
						furtherFilters: [{Token: 'EST_HEADER', Value: selectedEstHeaderFk},
							{Token: 'EST_SOURCE_LINEITEMS', Value: selectedEstProjectFk}],
						orderBy: [{Field: 'Code'}]
					};
					angular.merge(readData, filterData);
					return readData;
				}
				// The instance of the main service - to be filled with functionality below
				let copySourceEstimateMainServiceOptions = {
					flatRootItem: {
						module: estimateMainModule,
						serviceName: 'estimateMainCopySourceLineItemLookupService',
						entityNameTranslationID: 'estimate.main.copySourceLineItemContainer',

						httpRead: {
							useLocalResource: false,
							initReadData: initReadData,
							route: globals.webApiBaseUrl + 'estimate/main/lineitem/', endRead: 'getsourcelineitems',
							usePostForRead: true
						},
						actions: {
							delete: false,
							canDeleteCallBackFunc: function () {
								return false;
							},
							create: 'flat',
							canCreateCallBackFunc: function (/* selectedItem, data */) {
								return false;
							}
						},
						entityRole: {
							root: {
								codeField: 'Code',
								descField: 'Description',
								itemName: 'SourceEstLineItems',
								moduleName: 'cloud.desktop.moduleDisplayNameEstimate'
							}
						},
						entitySelection: {supportsMultiSelection: true},
						presenter: {
							list: {
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Code', id: 'code'}, isAsc: true},
								incorporateDataRead: function (readData, data) {
									let refreshLineItemStructureContainer = false;
									if(!Object.hasOwnProperty.call(service, 'costGroupCatalogs')){
										refreshLineItemStructureContainer = true;
									}else{
										if(readData.CostGroupCats && service.costGroupCatalogs){
											refreshLineItemStructureContainer = !compareCostGroupCatalog(readData.CostGroupCats, service.costGroupCatalogs);
										}
									}

									$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
										basicsCostGroupAssignmentService.process(readData, service, {
											mainDataName: 'dtos',
											attachDataName: 'LineItem2CostGroups',
											dataLookupType: 'LineItem2CostGroups',
											identityGetter: function identityGetter(entity){
												return {
													EstHeaderFk: entity.RootItemId,
													Id: entity.MainItemId
												};
											}
										});

										refreshStructureContainer(refreshLineItemStructureContainer);
									}]);

									_.forEach(readData.dtos, function (item){
										item.Rule = [];
										item.Param = [];
									});

									let result = data.handleReadSucceeded(readData, data);
									addDynamicColumn(readData);
									$injector.get('estimateMainCommonService').setDynamicColumnsData(readData, serviceContainer.data.dynamicColumns);
									return result;
								}
							}
						},
						dataProcessor: [estimateMainCopySourceProcessService]
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(copySourceEstimateMainServiceOptions);
				service = serviceContainer.service;

				serviceContainer.data.updateOnSelectionChanging = null; // Avoid triggering update for this service
				serviceContainer.data.isRoot = false; // Avoid resetting object permission by selection change for this service

				serviceContainer.data.containerUUID = serviceContainer.data.gridId = service.gridId = '35b7329abce3483abaffd5a437c392dc';

				function compareCostGroupCatalog(source, target){
					if(!source || !target) {
						return false;
					}
					if(source.LicCostGroupCats.length !== target.LicCostGroupCats.length) {
						return false;
					}
					return source.PrjCostGroupCats.length === target.PrjCostGroupCats.length;
				}
				function setDynamicColumnsLayoutToGridSourceLineItem(dynamicColumns){
					let mainViewService = $injector.get('mainViewService');
					let lineItemGridId = '35b7329abce3483abaffd5a437c392dc';
					let grid = platformGridAPI.grids.element('id', lineItemGridId);
					if (grid && grid.instance){
						let columnsDic = {};
						let columns = platformGridAPI.columns.configuration(lineItemGridId).current;
						// Add dynamic columns
						columns = columns.concat(dynamicColumns);
						_.forEach(columns, function(item){
							if (item.id !== 'indicator'){
								columnsDic[item.id] = item;
							}
						});

						let allColumns = [];
						// Persist column order
						let config = mainViewService.getViewConfig(lineItemGridId);
						if (config) {
							let propertyConfig = config.Propertyconfig || [];
							propertyConfig = parseConfiguration(propertyConfig);

							_.forEach(propertyConfig, function(propertyItem){
								let col = columnsDic[propertyItem.id];
								if (col){
									col.hidden = !propertyItem.hidden; // property config hidden is reversed, so we take their opposite value
									col.pinned = propertyItem.pinned;
									allColumns.push(col);

									// Remove from cache dictionary
									delete columnsDic[propertyItem.id];
								}
							});

							let columnToAddToEnd = [];
							for (let item in columnsDic){
								// eslint-disable-next-line no-prototype-builtins
								if (columnsDic.hasOwnProperty(item)){
									columnToAddToEnd.push(columnsDic[item]);
								}
							}
							allColumns = allColumns.concat(columnToAddToEnd);
						}

						platformGridAPI.columns.configuration(lineItemGridId, angular.copy(allColumns));
						platformGridAPI.grids.resize(lineItemGridId); // persist scroll bars
					}
				}
				function refreshStructureContainer (doRefresh){
					if(doRefresh){
						// refresh line item structure container
						let genericStructureConfigService = $injector.get('estimateMainLineitemStructureConfigService');
						genericStructureConfigService.fireRefreshConfigData();
					}
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

				function addDynamicColumn(readData) {
					let dynCols = [];
					let estMainStandardDynamicService = $injector.get('estimateMainDynamicConfigurationService');
					let estMainCombinedStandardDynamicService = $injector.get('estimateMainCombinedLineItemDynamicConfigurationService');
					// cost group column
					let costGroupColumns = $injector.get('basicsCostGroupAssignmentService').createCostGroupColumns(readData.CostGroupCats, false);
					estMainStandardDynamicService.attachData({costGroup: costGroupColumns});
					estMainCombinedStandardDynamicService.attachData({costGroup: costGroupColumns});
					dynCols = dynCols.concat(costGroupColumns);
					if (dynCols.length > 0){

						// Gather all the columns
						serviceContainer.data.dynamicColumns = dynCols;
						// Finally
						// Set all columns to Line Items grid layout
						setDynamicColumnsLayoutToGridSourceLineItem(serviceContainer.data.dynamicColumns);
						// TODO-VICTOR: Update UI configuration ONLY IF we have dynamic columns
					}

				}

				service.loadSourceLineItems = function (filter) {
					if(!filter){
						serviceContainer.data.itemList = [];
						serviceContainer.data.listLoaded.fire();
					}else{
						selectedEstHeaderFk = filter.EstHeaderId;
						selectedEstProjectFk = filter.ProjectId;
						searchText = filter.SearchText;
						pageSize = filter.Records;
						service.load();
					}
				};

				return service;

			}]);
})();
