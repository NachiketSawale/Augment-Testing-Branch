/**
 * Created by lnt on 4/19/2017.
 */

(function () {
	/* global globals, _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainWicRelateAssemblyService
	 * @function
	 *
	 * @description
	 * estimateMainWicRelateAssemblyService is the data service for wic2assembly related functionality.
	 */
	angular.module(moduleName).factory('estimateMainWicRelateAssemblyService',
		['platformDataServiceFactory','$injector','$http','$q', 'PlatformMessenger', 'basicsLookupdataLookupDescriptorService', 'estimateMainBoqService', 'boqMainWic2AssemblyProcessorService', 'ServiceDataProcessArraysExtension',
			'boqMainWic2AssemblyValidationProcessorService', 'boqMainCommonService', 'estimateMainWicBoqService','estimateMainAssembliesCategoryService','estimateMainFilterCommon',
			function (platformDataServiceFactory,$injector,$http,$q, PlatformMessenger, basicsLookupdataLookupDescriptorService, estimateMainBoqService, boqMainWic2AssemblyProcessorService, ServiceDataProcessArraysExtension,
				boqMainWic2AssemblyValidationProcessorService, boqMainCommonService, estimateMainWicBoqService,estimateMainAssembliesCategoryService,estimateMainFilterCommon) {

				let dtosByPagination = null;
				let wicCatBoqServiceOption = {
					flatRootItem: {
						module: moduleName,
						serviceName: 'estimateMainWicRelateAssemblyService',
						httpRead: {
							route: globals.webApiBaseUrl + 'boq/main/wic2assembly/',
							endRead: 'list',
							usePostForRead: true,
							initReadData: initReadData
						},
						actions: {
							delete: false,
							create: ''
						},
						entitySelection: { supportsMultiSelection: false },
						entityRole: {
							root: {
								addToLastObject: true,
								lastObjectModuleName: moduleName,
								itemName: 'boqMainWic2Assembly'
							}
						},
						presenter: {
							list: {
								incorporateDataRead: incorporateDataRead
							}
						},
						dataProcessor: [new ServiceDataProcessArraysExtension(['BoqMainWic2Assembly']), boqMainWic2AssemblyProcessorService]
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(wicCatBoqServiceOption);

				let estimateCommonPaginationService = $injector.get('estimateCommonPaginationService');
				estimateCommonPaginationService.extendPaginationService(serviceContainer);

				angular.extend(serviceContainer.data, {
					markItemAsModified: angular.noop,

					showHeaderAfterSelectionChanged: null, // disable hint text updating the main heading title
					updateOnSelectionChanging: null,
					newEntityValidator: boqMainWic2AssemblyValidationProcessorService,
					filterTypes: {
						filterByBoQ:'filterByBoQ',
						filterByWicBoQ:'filterByWicBoQ',
						filterByAssemblyCat:'filterByAssemblyCat'
					},
					selectedFilterType: 'filterByBoQ' // Default selected
				});

				angular.extend(serviceContainer.service, {
					markItemAsModified: angular.noop,

					toolHasAdded: false,
					gridId: null,

					init: init,
					setGridId:setGridId,
					getGridId: getGridId,
					updateList: updateList,
					activateStrLayout: activateStrLayout,
					deactivateStrLayout: deactivateStrLayout,
					getFilterTools: getFilterTools,
					getCurrentFilterType: getCurrentFilterType,
					dealDoubleData:dealDoubleData,
					updateCacheList:updateCacheList,
					dealCostGroupData:dealCostGroupData,
					setDefaultFilterBtn:setDefaultFilterBtn,
					setDtosByPagination:setDtosByPagination,
					getDtosByPagination:getDtosByPagination,
				});

				let service = serviceContainer.service;
				let data = serviceContainer.data;

				/* cost group load event */
				service.onCostGroupCatalogsLoaded = new PlatformMessenger();
				service.updateFilterTools = new PlatformMessenger();

				function setDtosByPagination(items){
					dtosByPagination = items;
				}

				function getDtosByPagination(){
					return dtosByPagination;
				}

				service.updateAssemblies = function updateAssemblies(){
					switch (data.selectedFilterType){
						case data.filterTypes.filterByBoQ:
							if(_.isEmpty(estimateMainBoqService.getSelected())){
								service.updateList([]);
							}
							break;
						case data.filterTypes.filterByWicBoQ:
							if(_.isEmpty(estimateMainWicBoqService.getSelected())){
								service.updateList([]);
							}
							break;
						case data.filterTypes.filterByAssemblyCat:
							if(_.isEmpty(estimateMainAssembliesCategoryService.getSelected())){
								service.updateList([]);
							}
							break;
					}
				};

				return service;

				function setDefaultFilterBtn(value) {
					service.toolHasAdded = false;
					data.selectedFilterType = 'filterByBoQ';
					if (value === 3) {
						data.selectedFilterType = 'filterByAssemblyCat';
					} else if (value === 2) {
						data.selectedFilterType = 'filterByWicBoQ';
					}
					estimateMainBoqService.setSelected(null);
					estimateMainWicBoqService.setSelected(null);
					estimateMainAssembliesCategoryService.setSelected(null);
					service.updateFilterTools.fire();
				}

				function init(){
					data.itemList = [];
					data.selectedItem = null;

					data.itemFilter = null;
					data.itemFilterEnabled = false;
				}

				function updateCacheList(data){
					basicsLookupdataLookupDescriptorService.attachData(data || {});
				}

				function dealDoubleData(data) {
					let projectAssemblies = _.filter(data, function(projectAssembly){
						return  (projectAssembly.EstAssemblyFk || 0) > 0;
					});
					let projectAssembliesKeys = _.map(projectAssemblies, 'EstAssemblyFk');

					let filteredEstAssembliesFromProjectAssembly = _.filter(data, function(masterAssembly){
						return projectAssembliesKeys.indexOf(masterAssembly.Id) === -1;
					});
					data = filteredEstAssembliesFromProjectAssembly;
					return data;
				}

				function dealCostGroupData(responseData) {
					$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
						basicsCostGroupAssignmentService.attach(responseData, {
							mainDataName: 'dtos',
							attachDataName: 'WicAssembly2CostGroups',
							dataLookupType: 'WicAssembly2CostGroups',
							isReadonly: true,
							identityGetter: function identityGetter(entity){
								return {
									EstHeaderFk: entity.RootItemId,
									EstLineItemFk: entity.MainItemId
								};
							}
						});
					}]);
					return responseData;
				}

				function initReadData(readData) {
					let selectItem;
					let allFilterIds=[];
					init();

					readData.UseMasterDataFilter = true;
					readData.ProjectId = $injector.get('estimateMainService').getSelectedProjectId();

					switch (data.selectedFilterType) {
						case data.filterTypes.filterByBoQ:
							selectItem = estimateMainBoqService.getSelected();
							if (selectItem) {
								let boqList = estimateMainFilterCommon.collectItems(selectItem, 'BoqItems');

								angular.forEach(boqList,function(item){
									if(boqMainCommonService.isTextElement(item)){
										allFilterIds.push(item.BoqItemFk);
									}else{
										allFilterIds.push(item.Id);
									}
								});

								readData.BoqHeaderFk = selectItem.BoqHeaderFk;
								readData.BoqItemFks = allFilterIds;
								readData.FilterType = data.filterTypes.filterByBoQ;

							}
							break;
						case data.filterTypes.filterByWicBoQ:
							selectItem = estimateMainWicBoqService.getSelected();
							if (selectItem) {
								allFilterIds = _.map(estimateMainFilterCommon.collectItems(selectItem, 'BoqItems'), 'Id');
								readData.BoqHeaderFk = selectItem.BoqHeaderFk;
								readData.BoqItemFks = allFilterIds;
								readData.FilterType = data.filterTypes.filterByWicBoQ;
							}
							break;
						case data.filterTypes.filterByAssemblyCat:
							selectItem = estimateMainAssembliesCategoryService.getSelected();
							if (selectItem ) {
								var assembliesCatalogs = estimateMainFilterCommon.collectItems(selectItem, 'AssemblyCatChildren');

								let assembliesSroucesCatalogs = _.filter(assembliesCatalogs, function(aSourceCat){
									return aSourceCat.PrjProjectFk > 0 && aSourceCat.EstAssemblyCatSourceFk > 0;
								});

								allFilterIds = _.map(assembliesCatalogs, 'Id').concat(_.map(assembliesSroucesCatalogs, 'EstAssemblyCatSourceFk'));
								if(allFilterIds && allFilterIds.length) {
									readData.BoqHeaderFk = selectItem.BoqHeaderFk;
									readData.BoqItemFks = null;
									readData.AssemblyCatFks = allFilterIds;
									readData.FilterType = data.filterTypes.filterByAssemblyCat;
								}
							}
							break;
					}

					// Paging Info
					readData.PageSize = 30;
					// readData.Pattern = null; //GET GRID SEARCH KEYWORD
				}

				function incorporateDataRead(responseData, data) {
					if(!responseData){
						return null;
					}

					let codes = _.uniqBy(_.map(responseData.dtos,'Code'));
					let assemblys = _.groupBy(responseData.dtos,'Code');

					let matchAssebmlys = [];

					_.forEach(codes,function (code) {
						if(assemblys[code].length ===1){
							matchAssebmlys.push(assemblys[code][0]);
						}else {
							let assembly = _.filter (assemblys[code], {'EstHeaderFk': responseData.prjAsssemblyHeader.EstHeaderFk});
							if (assembly && assembly.length === 1) {

								matchAssebmlys = matchAssebmlys.concat (assembly);

							} else if(assembly && assembly.length>1){

								let estHeader = $injector.get ('estimateMainService').getSelectedEstHeaderItem ();
								if (estHeader && estHeader.LgmJobFk) {
									let _assembly =  _.find(assembly,{'LgmJobFk':estHeader.LgmJobFk});
									if(_assembly) {
										matchAssebmlys.push (_assembly);
									}else {
										_assembly = _.filter(assembly, function (d) {
											return !d.LgmJobFk;
										});
										matchAssebmlys = matchAssebmlys.concat (_assembly[0]);
									}
								}
							}
						}
					});

					responseData.dtos = matchAssebmlys;

					setDtosByPagination(responseData.dtos);

					basicsLookupdataLookupDescriptorService.attachData(responseData || {});


					$injector.invoke(['basicsCostGroupAssignmentService', function(basicsCostGroupAssignmentService){
						basicsCostGroupAssignmentService.process(responseData, service, {
							mainDataName: 'dtos',
							attachDataName: 'WicAssembly2CostGroups',
							dataLookupType: 'WicAssembly2CostGroups',
							isReadonly: true,
							identityGetter: function identityGetter(entity){
								return {
									EstHeaderFk: entity.RootItemId,
									EstLineItemFk: entity.MainItemId
								};
							}
						});
					}]);

					data.handleReadSucceeded(matchAssebmlys, data);
					return responseData;
				}

				function setGridId(gridId) {
					service.gridId = gridId;
				}

				function getGridId() {
					return service.gridId;
				}

				function updateList(resList) {
					return data.handleReadSucceeded(resList, data);
				}

				function activateStrLayout() {
					let fieldsToAdd = ['WorkContentInfo', 'Wic2AssemblyQuantity', 'WicEstAssembly2WicFlagFk'];
					let fieldsToRemove = ['CommentText'];

					updateGridLayoutColumns(fieldsToAdd, fieldsToRemove);
				}

				function deactivateStrLayout() {
					let fieldsToAdd = ['CommentText'];
					let fieldsToRemove = ['WorkContentInfo', 'Wic2AssemblyQuantity', 'WicEstAssembly2WicFlagFk'];

					updateGridLayoutColumns(fieldsToAdd, fieldsToRemove);
				}

				function updateGridLayoutColumns(fieldsToAdd, fieldsToRemove) {
					let gridId = service.getGridId();
					let platformGridAPI = $injector.get('platformGridAPI');
					let estimateMainCommonUIService = $injector.get('estimateMainCommonUIService');

					let isLayoutChanged = false;

					let grid = platformGridAPI.grids.element('id', gridId);
					if (grid && grid.instance) {
						let columns = platformGridAPI.columns.configuration(gridId).current;

						// Remove fields
						let isAlreadyAdded = _.findIndex(columns, {field: _.first(fieldsToRemove)}) !== -1;
						if (isAlreadyAdded) {
							columns = _.filter(platformGridAPI.columns.configuration(gridId).current, function (column) {
								return fieldsToRemove.indexOf(column.field) === -1;
							});
							isLayoutChanged = true;
						}

						// Add fields
						isAlreadyAdded = _.findIndex(columns, {field: _.first(fieldsToAdd)}) !== -1;
						if (!isAlreadyAdded) {
							let uiService = estimateMainCommonUIService.createUiService(fieldsToAdd);
							let strCols = uiService.getStandardConfigForListView().columns;
							columns = columns.concat(strCols);
							isLayoutChanged = true;
						}

						if (isLayoutChanged) {
							platformGridAPI.columns.configuration(gridId, columns);
						}
					}
				}

				function getFilterTools() {
					// Update grid layout based on current Filter
					setTimeout(function() {
						onFilterToolClicked();
					}, 50);

					return [
						{
							filterIconsGroup: 'assemblyFilterTypes',
							type: 'sublist',
							'id':'assemblyFilterTypes',
							list: {
								activeValue: data.selectedFilterType,// default
								cssClass: 'radio-group',
								showTitles: true,
								items: [
									{
										id: 'with_boq',
										caption: 'estimate.main.filterBoq',
										type: 'radio',
										value: data.filterTypes.filterByBoQ,
										iconClass: 'tlb-icons ico-filter-boq',
										fn: onFilterToolClicked,
										disabled: false
									},
									{
										id: 'with_wicboq',
										caption: 'estimate.main.filterBoqWic',
										type: 'radio',
										value: data.filterTypes.filterByWicBoQ,
										iconClass: 'tlb-icons  ico-filter-wic-boq',
										fn: onFilterToolClicked,
										disabled: false
									},
									{
										id: 'with_assemblyStructure',
										caption: 'estimate.main.filterAssemblyStructure',
										type: 'radio',
										value: data.filterTypes.filterByAssemblyCat,
										iconClass: 'tlb-icons  ico-filter-assembly-cat',
										fn: onFilterToolClicked,
										disabled: false
									}
								]
							}
						}

					];
				}

				function onFilterToolClicked(id, item){
					data.selectedFilterType = item ? item.value : data.selectedFilterType;

					let isReady = false;
					switch (data.selectedFilterType){
						case data.filterTypes.filterByBoQ:
							isReady = !_.isEmpty(estimateMainBoqService.getSelected());
							activateStrLayout();
							break;
						case data.filterTypes.filterByWicBoQ:
							isReady = !_.isEmpty(estimateMainWicBoqService.getSelected());
							activateStrLayout();
							break;
						case data.filterTypes.filterByAssemblyCat:
							isReady = !_.isEmpty(estimateMainAssembliesCategoryService.getSelected());
							deactivateStrLayout();
							break;
					}

					if (isReady){
						// Reload based on filter
						service.load();
					}else{
						service.updateList([]);
					}
				}

				function getCurrentFilterType(){
					if  (service.getGridId()){
						// Only when container grid is available
						let platformGridAPI = $injector.get('platformGridAPI');
						let grid = platformGridAPI.grids.element('id',service.getGridId());
						if (grid && grid.instance){
							return data.selectedFilterType;
						}
					}

					return '';
				}
			}
		]);
})();
