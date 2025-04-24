/**
 * Created by wul on 9/3/2020.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	let module = angular.module('procurement.common');
	module.factory('prcCommonUpdateEstimatePrcStructureDataSerivce',
		['$q', '$http', '$injector', '$translate','platformDataServiceFactory','basicsProcurementStructureImageProcessor','basicsLookupdataLookupDescriptorService', 'ServiceDataProcessArraysExtension','platformRuntimeDataService',
			'basicsLookupdataLookupFilterService',
			function ($q, $http, $injector, $translate, platformDataServiceFactory,imageProcessor, basicsLookupdataLookupDescriptorService, ServiceDataProcessArraysExtension, platformRuntimeDataService, basicsLookupdataLookupFilterService) {

				let serviceOption = {
					hierarchicalRootItem:{
						module: module,
						serviceName : 'prcCommonUpdateEstimatePrcStructureDataSerivce',
						httpRead:{
							route: globals.webApiBaseUrl + 'basics/procurementstructure/',
							endRead: 'gettreebyidsforupdateestimate',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								readData.Ids = structureIds;
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), imageProcessor],
						presenter: {
							tree: {
								parentProp: 'PrcStructureFk', childProp: 'ChildItems',
								incorporateDataRead: incorporateDataRead
							}
						},
						translation: {
							uid: 'basicsProcurementStructureService',
							title: 'basics.procurementstructure.moduleName',
							columns: [
								{header: 'cloud.common.entityCode', field: 'Code'},
								{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}
							]
						},
						entityRole: {root: {
							moduleName: 'procurement.common',
							itemName: 'PrcStructure'
						}
						}
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
				serviceContainer.data.updateOnSelectionChanging = null;
				serviceContainer.data.doUpdate = null;
				let service = serviceContainer.service;

				let estCostCodeFilter = {
					key: 'prc-common-update-est-cost-code-filter',
					serverKey: 'prc-common-update-est-cost-code-filter',
					serverSide: true,
					fn: function (dataContext) {
						let element = $injector.get('platformGridAPI').grids.element('id', 'FA740FF0A2094DA085175A2E379F60A7');
						let grid = element.instance;
						let selectedColumn = grid.getColumns()[grid.getActiveCell().cell];
						let costCodeFk = dataContext[selectedColumn.field];
						return {IsEstimateCc: true, CostCodeFk: costCodeFk || null, FilterByCompany: true};
					}
				};

				basicsLookupdataLookupFilterService.registerFilter([estCostCodeFilter]);

				service.loadData = function () {
					return $http.post(globals.webApiBaseUrl + 'procurement/common/prcitemassignment/getusingprcstructureids', updateEstOption).then(function (response) {
						if(response && response.data){
							structureIds = response.data;
							return service.load();
						}

						return $q.when([]);
					});

				};

				let structureIds = [];

				service.setProcurementMainData = function (headerId, itemIds, type) {
					updateEstOption = {};
					updateEstOption.headerId = headerId || 0;
					updateEstOption.qtnHeaderIds = itemIds;
					updateEstOption.sourceType = type;
				};

				let updateEstOption = null;

				function incorporateDataRead(readData, data) {
					let result = {
						FilterResult: readData.FilterResult,
						dtos: readData.Main || []
					};

					let list = $injector.get('cloudCommonGridService').flatten(result.dtos, [], 'ChildItems');
					_.forEach(list, function (item) {
						if(structureIds.indexOf(item.Id) < 0){
							platformRuntimeDataService.readonly(item, true);
						}else{
							if(!item.CostCodeFk){
								item.__rt$data = item.__rt$data || {};
								item.__rt$data.errors = item.__rt$data.errors || {};
								item.__rt$data.errors.CostCodeFk = {error: $translate.instant('cloud.common.emptyOrNullValueErrorMessage', {fieldName: 'CostCodeFk'})};
							}
						}
					});

					let costCodeIds = [];
					_.forEach(list, function (item){
						costCodeIds.push(item.CostCodeFk || 0);
						costCodeIds.push(item.CostCodeURP1Fk || 0);
						costCodeIds.push(item.CostCodeURP2Fk || 0);
						costCodeIds.push(item.CostCodeURP3Fk || 0);
						costCodeIds.push(item.CostCodeURP4Fk || 0);
						costCodeIds.push(item.CostCodeURP5Fk || 0);
						costCodeIds.push(item.CostCodeURP6Fk || 0);
					});

					// TODO: need to remove? now the masterCostCodeFk query from server-side directly.
					// append root costCode info
					$http.post(globals.webApiBaseUrl + 'basics/costcodes/getrootidbycostcodeids', costCodeIds).then(function (response) {
						let dict = response.data;
						if(dict){
							_.forEach(list, function (item) {
								item.MasterCostCodeFk = dict[item.CostCodeFk];
								item.MasterCostCodeURP1Fk = dict[item.CostCodeURP1Fk];
								item.MasterCostCodeURP2Fk = dict[item.CostCodeURP2Fk];
								item.MasterCostCodeURP3Fk = dict[item.CostCodeURP3Fk];
								item.MasterCostCodeURP4Fk = dict[item.CostCodeURP4Fk];
								item.MasterCostCodeURP5Fk = dict[item.CostCodeURP5Fk];
								item.MasterCostCodeURP6Fk = dict[item.CostCodeURP6Fk];
							});
						}
					});

					// set unusing structure to readonly.
					return serviceContainer.data.handleReadSucceeded(result, data, true);
				}

				service.getfilterList = function () {
					let list = service.getList();
					list = _.filter(list, function (item) {
						return !item.__rt$data || !item.__rt$data.entityReadonly;
					});

					return list;
				};

				return service;

			}]);
})(angular);


(function (angular) {
	'use strict';

	angular.module('procurement.common').factory('prcCommonUpdateEstimatePrcStructureUISerivce',
		['platformTranslateService', 'platformRuntimeDataService',
			function (platformTranslateService, platformRuntimeDataService) {
				let service = {};

				let gridColumns = [
					{ id: '1_code', field: 'Code', name: 'code',  width:100, toolTip: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'},
					{ id: '1_descriptioninfo', field: 'DescriptionInfo', name: 'Description',  width:200, toolTip: 'Description', formatter: 'translation', name$tr$: 'cloud.common.entityDescription'},
					{ id: '1_prcstructuretypefk', field: 'PrcStructureTypeFk', name: 'Type',  width:100, toolTip: 'Type',  name$tr$: 'cloud.common.entityType'},
					{ id: '1_costcodefk', field: 'CostCodeFk', name: 'Cost Code',  width:100, toolTip: 'Cost Code',  name$tr$: 'basics.procurementstructure.costCode'},
					{ id: '1_costcodeurp1fk', field: 'CostCodeURP1Fk', name: 'Cost Code URP 1',  width:100, toolTip: 'Cost Code URP 1', name$tr$: 'basics.procurementstructure.costCodeURP1'},
					{ id: '1_costcodeurp2fk', field: 'CostCodeURP2Fk', name: 'Cost Code URP 2',  width:100, toolTip: 'Cost Code URP 2', name$tr$: 'basics.procurementstructure.costCodeURP2'},
					{ id: '1_costcodeurp3fk', field: 'CostCodeURP3Fk', name: 'Cost Code URP 3',  width:100, toolTip: 'Cost Code URP 3', name$tr$: 'basics.procurementstructure.costCodeURP3'},
					{ id: '1_costcodeurp4fk', field: 'CostCodeURP4Fk', name: 'Cost Code URP 4',  width:100, toolTip: 'Cost Code URP 4', name$tr$: 'basics.procurementstructure.costCodeURP4'},
					{ id: '1_costcodeurp5fk', field: 'CostCodeURP5Fk', name: 'Cost Code URP 5',  width:100, toolTip: 'Cost Code URP 5', name$tr$: 'basics.procurementstructure.costCodeURP5'},
					{ id: '1_costcodeurp6fk', field: 'CostCodeURP6Fk', name: 'Cost Code URP 6',  width:100, toolTip: 'Cost Code URP 6', name$tr$: 'basics.procurementstructure.costCodeURP6'},
				];

				_.forEach(gridColumns, function (column) {
					if(column.id === '1_prcstructuretypefk'){
						column.formatterOptions = {
							lookupType: 'PrcStructureType',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'basicsProcurementStructureImageProcessor'
						};
						column.formatter = 'lookup';
					}

					if(column.id.indexOf('costcode') >0){
						column.formatterOptions = {
							lookupType: 'EstimateCostCode',
							displayMember: 'Code'
						};
						column.formatter = 'lookup';
						column.editor = 'lookup';
						column.editorOptions = {
							lookupField: 'CostCodeFk',
							lookupOptions: {
								showClearButton: false,
								'events': [
									{
										name: 'onSelectedItemChanged',
										handler: function (e, args) {
											let entity = args.entity;
											if(entity && args.selectedItem && args.selectedItem.Id){
												entity[column.field] = args.selectedItem.Id;
												if(column.id === '1_costcodefk' && entity.__rt$data && entity.__rt$data.errors){
													entity.__rt$data.errors[column.field] = null;
												}
											}
										}
									}
								],
								filterKey: 'prc-common-update-est-cost-code-filter',
								selectableCallback: function (dataItem) {
									return dataItem.IsEstimateCostCode;
								}
							},
							directive: 'basics-cost-codes-lookup'
						};
					}

					if(column.id === '1_costcodefk'){
						column.validator = function (entity, value, module) {
							let result = {
								apply: true,
								valid: !!value,
								error: '...',
								error$tr$: 'cloud.common.emptyOrNullValueErrorMessage',
								error$tr$param$: {fieldName: module}
							};
							platformRuntimeDataService.applyValidationResult(result, entity, module);
						};
					}
				});

				platformTranslateService.translateGridConfig(gridColumns);

				service.getStandardConfigForListView = function () {
					return {
						addValidationAutomatically: false,
						columns: gridColumns
					};
				};

				return service;
			}
		]);
})(angular);
