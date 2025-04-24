
(function () {
	/* global globals */
	'use strict';
	let module = angular.module('controlling.configuration');

	module.factory('controllingConfigChartConfigDataService', ['_','$injector','$http', '$translate', 'platformDataServiceFactory','contrConfigChartActionProcessor', 'platformGridAPI',
		'basicsCommonChartConfigCommService','contrConfigFormulaTypeHelper','platformModalService',
		function (_,$injector, $http, $translate, platformDataServiceFactory, contrConfigChartActionProcessor, platformGridAPI,
			basicsCommonChartConfigCommService, contrConfigFormulaTypeHelper,platformModalService) {
			let serviceOptions = {
				flatRootItem: {
					module: module,
					serviceName: 'controllingConfigChartConfigDataService',
					entityNameTranslationID: 'controlling.configuration.chartConfigContainerTitle',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/configuration/contrchart/',
						endRead: 'getlist',
						initReadData: function (readData) {
							readData.filter = '?mdcContrConfigHeaderFk=1';
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + 'controlling/configuration/contrchart/', endCreate: 'create'
					},
					httpUpdate: {
						route: globals.webApiBaseUrl + 'controlling/configuration/contrchart/', endUpdate: 'update'
					},
					httpDelete: {
						route: globals.webApiBaseUrl + 'controlling/configuration/contrchart/', endUpdate: 'delete'
					},
					presenter: {
						list: {
							incorporateDataRead:function (readData, data) {
								if(readData){
									_.forEach(readData, function (item){ item.IsBaseConfigData = (item.Id === 1 || item.Id === 2);});
								}
								return data.handleReadSucceeded(readData ? readData : [], data);
							}
						}
					},
					entityRole: {
						root: {
							itemName: 'MdcContrCharToSave',
							moduleName: 'controlling.configuration.chartConfigContainerTitle',
							mainItemName: 'controllingConfigurationChartConfig',
							descField: 'Description.Translated',
							handleUpdateDone: function (updateData, response, data) {
								serviceContainer.data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					entitySelection: {supportsMultiSelection: true},
					actions: {
						delete: true,
						create: 'flat',
						canDeleteCallBackFunc: function () {
							if(service && service.getSelectedEntities){
								let selectedItems = service.getSelectedEntities();

								return selectedItems && selectedItems.length > 0 && _.filter(selectedItems, {IsBaseConfigData: true}).length <= 0;
							}
						}
					},
					dataProcessor: [contrConfigChartActionProcessor],
					translation: {
						uid: 'controllingConfigChartConfigDataService',
						title: 'controlling.configuration.chartConfigContainerTitle',
						columns: [{header: 'cloud.common.entityDescription', field: 'Description'}],
						dtoScheme: {
							typeName: 'MdcContrChartDto',
							moduleSubModule: 'Controlling.Configuration'
						}
					}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

			serviceContainer.data.doUpdate = null;

			serviceContainer.data.handleOnDeleteSucceeded = function handleOnDeleteSucceeded(deleteParams , data, response) {
				if(response && response.length > 0){
					service.load();
				}
			};

			let service =  serviceContainer.service;

			service.clearSelectedItem = function(){
				serviceContainer.data.selectedItem = null;
			};

			service.handleOnUpdate = function (updateData, response) {
				serviceContainer.data.handleOnUpdateSucceeded(updateData, response, serviceContainer.data, true);
			};

			service.refreshSelected = function (dto){
				if(!gridGuid){return;}
				let selected = _.find(service.getList(), {Id: dto.Id});
				if(!selected){return;}
				let action = selected.Action;
				selected = _.merge(selected, dto);
				selected.Action = action;
				platformGridAPI.rows.refreshRow({gridId: gridGuid, item: selected});
			};

			let gridGuid = '';
			service.setGridGuid = function (guid){
				gridGuid = guid;
			};

			let dialogIsOpening = false;

			service.closeChartDialog = function (){
				dialogIsOpening = false;
			};

			service.openChartDialog = function (entity){
				if(dialogIsOpening){
					return;
				}
				dialogIsOpening = true;

				$injector.get('controllingConfigChartConfigDataService').setSelected(entity);

				$http.get(globals.webApiBaseUrl + 'controlling/configuration/contrchart/getconfig?contrChartId='+ entity.Id).then(function (response){
					if(response && response.data && response.data.MdcContrChartDto){

						response.data.MdcContrChartDto.BasChartTypeFk = entity.BasChartTypeFk;
						response.data.MdcContrChartDto.Description = entity.Description;
						response.data.MdcContrChartDto.IsDefault1 = entity.IsDefault1;
						response.data.MdcContrChartDto.IsDefault2 = entity.IsDefault2;

						basicsCommonChartConfigCommService.showDialog({
							header: response.data.MdcContrChartDto,
							series: initSeriesData(response.data.MdcContrColumnPropDtos, response.data.MdcContrFormulaDtos, response.data.MdcContrChartSeriesDtos),
							categories: initCategories(response.data.MdcContrChartCategoryDtos),
							readonly: entity.IsBaseConfigData
						}).then(function (result){
							dialogIsOpening = false;
							if(result.ok){
								let saveObj = {
									MdcContrChartDto: result.data.header,
									MdcContrChartSeriesDtos: result.data.series,
									MdcContrChartCategoryDtos: result.data.categories
								};
								if(result.data.series && result.data.series.length > 0){
									_.forEach(result.data.series, function (item){
										item.MdcContrChartFk = result.data.header.Id;
										item.MdcContrColumnPropDefFk = item.SeriesType === 1 ? item.itemId : null;
										item.MdcContrFormulapropdefFk = item.SeriesType === 2 ? item.itemId : null;
									});
								}
								if(result.data.categories && result.data.categories.length > 0){
									_.forEach(result.data.categories, function (item){
										item.MdcContrChartFk = result.data.header.Id;
										item.GroupKey = item.Id;
									});
								}
								$http.post(globals.webApiBaseUrl + 'controlling/configuration/contrchart/saveconfig', saveObj).then(function (response){
									response && response.data && response.data.MdcContrChartDto && $injector.get('controllingConfigChartConfigDataService').refreshSelected(response.data.MdcContrChartDto);
								});
							}
						});
					}
					else{
						platformModalService.showMsgBox($translate.instant('controlling.configuration.noDataFound'), 'Warning', 'warning');
						dialogIsOpening = false;
					}
				},function() {
					dialogIsOpening = false;
				});
			};

			function initSeriesData(columnList, formulaList, bindItems){
				let list = [];
				let id = 0;

				columnList.forEach(function(column){
					list.push({
						Id: id++,
						Code: column.Code,
						Description: column.Description,
						SeriesType: 1,
						itemId: column.Id,
						ColumnType: $translate.instant('controlling.configuration.ConfColumnDefinitionTitle')
					});
				});

				formulaList.forEach(function(formula){

					if(contrConfigFormulaTypeHelper.isCac_m(formula.BasContrColumnTypeFk)
						|| contrConfigFormulaTypeHelper.isWcfOrBcf(formula.BasContrColumnTypeFk)
						|| contrConfigFormulaTypeHelper.isCustFactor(formula.BasContrColumnTypeFk)){
						return;
					}

					let newItem = {
						Id: id++,
						Code: formula.Code,
						Description: formula.DisplayInfo,
						SeriesType: 2,
						itemId: formula.Id,
						ColumnType: $translate.instant('controlling.configuration.ConfFormulaDefinitionTitle')
					};
					if(!formula.IsVisible){
						newItem.__rt$data = {
							errors:{
								'Selected': {error: $translate.instant('controlling.configuration.isNotVisible')}
							}
						};
					}

					list.push(newItem);
				});

				if(!bindItems || bindItems.length <= 0){
					return list;
				}

				_.forEach(bindItems, function (item){
					let findItem = _.find(list, {itemId: item.MdcContrColumnPropDefFk, SeriesType: 1});
					if(findItem){
						findItem.Selected = true;
						if(item.ChartDataConfig){
							findItem.DataConfig =  item.ChartDataConfig;
						}
					}
				});

				_.forEach(bindItems, function (item){
					let findItem = _.find(list, {itemId: item.MdcContrFormulapropdefFk, SeriesType: 2});
					if(findItem){
						findItem.Selected = true;
						if(item.ChartDataConfig){
							findItem.DataConfig =  item.ChartDataConfig;
						}
					}
				});

				return list;
			}

			function initCategories(bindItems){
				let categories = [{Id:1, IsDate: true, Description: 'Report Period', Selected: false}, {Id:2, IsDate: false,  Description: 'Grouping Structure', Selected: true}];

				if(bindItems && bindItems.length > 0){
					_.forEach(categories, function (item){
						let findItem = _.find(bindItems, {GroupKey: item.Id});
						item.Selected = !!findItem;
					});
				}

				return categories;
			}


			return service;
		}]);


	module.service('contrConfigChartActionProcessor', ContrConfigChartActionProcessor);

	ContrConfigChartActionProcessor.$inject = ['_', '$translate', '$injector', 'platformRuntimeDataService'];

	function ContrConfigChartActionProcessor(_, $translate, $injector, platformRuntimeDataService) {

		this.processItem = function processItem(item) {
			item.Action = 'open chart config';
			item.actionList = [];
			item.actionList.push({
				toolTip: $translate.instant('controlling.configuration.openChartDialog'),
				icon: 'tlb-icons ico-settings-doc',
				callbackFn: $injector.get('controllingConfigChartConfigDataService').openChartDialog
			});
			// item.ChartType = item.BasChartTypeFk === 1 ? $translate.instant('basics.common.chartType.lineChart') : $translate.instant('basics.common.chartType.barChart');
			if(item.IsBaseConfigData){
				platformRuntimeDataService.readonly(item, [
					{field: 'Description', readonly: true},
					{field: 'BasChartTypeFk', readonly: true}
				]);
			}
		};
	}

})();
