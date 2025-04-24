(function(angular){
	'use strict';

	angular.module('estimate.main').factory('estimateMainAllowanceAreaValueColumnGenerator', ['_', '$injector', '$q', 'platformGridAPI', 'estimateMainAllowanceAreaValidationService',
		'estimateMainAllowanceAreaUIConfigService', 'estimateMainAllowanceAreaValueService','accounting','platformModalService','$translate',
		function(_, $injector, $q, platformGridAPI, estimateMainAllowanceAreaValidationService, estimateMainAllowanceAreaUIConfigService, estimateMainAllowanceAreaValueService,accounting,platformModalService,$translate){
			let service = {};

			let allowanceAreaGrid = '4265ca844fcb457e83e0fd8fadda115f';
			let originalAreaColumnsConfig = estimateMainAllowanceAreaUIConfigService.getStandardConfigForListView();
			let areaValueColumns = [];

			// replace getStandardConfigForListView function
			estimateMainAllowanceAreaUIConfigService.getStandardConfigForListView = function(){
				let config = angular.copy(originalAreaColumnsConfig);
				config.columns = angular.copy(originalAreaColumnsConfig.columns);
				if(angular.isArray(areaValueColumns) && areaValueColumns.length > 0){
					config.columns = config.columns.concat(areaValueColumns);
				}
				return config;
			};

			function refreshColumns(){
				let areas = $injector.get('estimateMainAllowanceAreaService').getList();
				areas = _.sortBy (areas, ['AreaType', 'Id']);
				let area2GcAreaValues = estimateMainAllowanceAreaValueService.getList();
				process(areas, area2GcAreaValues);
			}

			function process(areas, area2GcAreaValues){
				areaValueColumns = [];
				if(!areas || !angular.isArray(areas)){
					return;
				}

				let gcAreas = _.filter(areas, function(item){
					return [3,4].indexOf(item.AreaType) > -1;
				});

				if(gcAreas.length === 0){
					let columns =  angular.copy(estimateMainAllowanceAreaUIConfigService.getStandardConfigForListView().columns);
					autoValidation(columns, estimateMainAllowanceAreaValidationService);
					let multiSelect = angular.copy($injector.get('estimateMainAllowanceAreaService').getMultiSelectStatus());
					platformGridAPI.columns.configuration(allowanceAreaGrid, columns);
					handleMarkMultiSelect(columns, multiSelect);
					platformGridAPI.grids.refresh(allowanceAreaGrid);
					platformGridAPI.grids.invalidate(allowanceAreaGrid);
					return;
				}

				// build async validation function
				_.forEach(gcAreas, function(gcArea){
					estimateMainAllowanceAreaValidationService['async'+generateAreaValueColumnName(gcArea)] = createValidationFunc(gcArea);
					areaValueColumns.push(createAreaValueColumn(gcArea));
				});

				// attach Area Value to Area
				_.forEach(areas, function(area){
					_.forEach(gcAreas, function(gcArea){
						area['Area_'+gcArea.Id] = 0;
						area['Area_'+gcArea.Id] = 0;
						area['Area_'+gcArea.Id] = 0;
					});
				});

				let areaValueMap = {};
				_.forEach(area2GcAreaValues, function(item){
					areaValueMap[item.EstAllowanceAreaFk + '-' + item.EstAllowanceGcAreaFk] = item.Value;
				});

				let normalAreas = _.filter(areas, function(item){
					return [1,2].indexOf(item.AreaType) > -1;
				});

				if(normalAreas.length > 0){
					_.forEach(normalAreas, function(normalArea){
						_.forEach(gcAreas, function(gcArea){
							if(areaValueMap[normalArea.Id + '-' + gcArea.Id]){
								normalArea['Area_'+gcArea.Id] = areaValueMap[normalArea.Id + '-' + gcArea.Id];
							}else{
								normalArea['Area_'+gcArea.Id] = null;
							}
						});
					});
				}

				$injector.get('estimateMainAllowanceAreaProcessor').processItems(areas);

				// refresh
				let originalColumns =  angular.copy(estimateMainAllowanceAreaUIConfigService.getStandardConfigForListView().columns);
				autoValidation(originalColumns, estimateMainAllowanceAreaValidationService);
				// originalColumns = originalColumns.concat(areaValueColumns);
				let multiSelect = angular.copy($injector.get('estimateMainAllowanceAreaService').getMultiSelectStatus());
				platformGridAPI.columns.configuration(allowanceAreaGrid, originalColumns);
				handleMarkMultiSelect(originalColumns, multiSelect);
				platformGridAPI.grids.refresh(allowanceAreaGrid);
				platformGridAPI.grids.invalidate(allowanceAreaGrid);
			}

			function autoValidation(columns, validationService){
				if (columns && !!validationService) {
					_.forEach(columns, function (row) {
						let rowModel = row.name.replace(/\./g, '$');

						let syncName = 'validate' + rowModel;
						let asyncName = 'asyncValidate' + rowModel;

						if (validationService[syncName]) {
							row.validator = validationService[syncName];
						}

						if (validationService[asyncName]) {
							row.asyncValidator = validationService[asyncName];
						}
					});
				}
			}

			function createAreaValueColumn(gcArea){
				return {
					id : generateAreaValueColumnName(gcArea).toLowerCase(),
					field : 'Area_'+gcArea.Id,
					name : gcArea.Code + '[%]',
					name$tr$ : undefined,
					formatter: function(row, cell, value, column, entity){
						let currentValue = getCurrentAreaValue(entity, gcArea);
						if(!currentValue && entity.AreaType === 2){
							currentValue = {Value : 100};
						}
						let isSetEmpty = entity.AreaType === 1 && currentValue && (currentValue.Value === 0 || !currentValue.Value);
						if(isSetEmpty){
							entity[column.field] = null;
							return '';
						}
						return currentValue ? accounting.formatNumber(currentValue.Value, 2 ,',','.') : '';
					},
					editor: 'money',
					editorOptions:{
						allownull: true
					},
					domain: function (entity, column) {
						let domain ='money';
						column.regex ='(^[+]?\\d*$)|(^(?:[+]?[\\d]*(?:[,\\.\\s\\d]*))([,\\.][\\d]{0,2})$)';
						return domain;
					},
					sortable: true,
					required : true,
					hidden : false,
					bulkSupport: false,
					validator : validatorValue(gcArea),
					asyncValidator : createValidationFunc(gcArea)
				};
			}

			function validatorValue(gcArea) {
				return function (item, value, field) {
					if(item.__rt$data && item.__rt$data.errors && item.__rt$data.errors[field]){
						delete  item.__rt$data.errors[field];
					}
					let restAreaValue = getRestAreaValue(gcArea);
					let currentValue = getCurrentAreaValue(item, gcArea);
					let percent = 0;
					let allAreaValue = $injector.get('estimateMainAllowanceAreaValueService').getList();
					let currentGcAreaValue = _.filter(allAreaValue,function (item) {
						return  item.EstAllowanceGcAreaFk === gcArea.Id && (restAreaValue ? item.Id !== restAreaValue.Id : true) && (currentValue ? item.Id !== currentValue.Id : true);
					});
					_.forEach(currentGcAreaValue,function (item) {
						percent += item.Value;
					});
					percent += value;
					if(percent > 100){
						platformModalService.showMsgBox($translate.instant('estimate.main.underbalance'), 'cloud.common.informationDialogHeader', 'info');
					}
					let result = {apply: percent <= 100, valid: percent <= 100, error: ''};
					return result;
				};
			}

			function generateAreaValueColumnName(gcArea){
				return 'GcArea_' + gcArea.Code;
			}

			function getCurrentAreaValue(entity, gcArea){
				let values = $injector.get('estimateMainAllowanceAreaValueService').getList();
				return _.find(values, {'EstAllowanceGcAreaFk': gcArea.Id, 'EstAllowanceAreaFk' : entity.Id});
			}

			function getRestAreaValue(gcArea){
				let values = $injector.get('estimateMainAllowanceAreaValueService').getList();

				let normalRestArea = getNormalRestArea();

				if(normalRestArea && values){
					return _.find($injector.get('estimateMainAllowanceAreaValueService').getList(), {'EstAllowanceGcAreaFk': gcArea.Id, 'EstAllowanceAreaFk' : normalRestArea.Id});
				}
				return null;
			}

			function getNormalRestArea(){
				return _.find($injector.get('estimateMainAllowanceAreaService').getList(), { AreaType : 2});
			}

			function calcRestAreaValue(gcArea){
				let normalRestArea = getNormalRestArea();
				let geAreaValueTotal = 0;
				_.forEach($injector.get('estimateMainAllowanceAreaValueService').getList(), function(item){
					if(item.EstAllowanceGcAreaFk === gcArea.Id && item.Value){
						if(!normalRestArea || normalRestArea.Id !== item.EstAllowanceAreaFk){
							geAreaValueTotal += item.Value;
						}
					}
				});
				return 100 - geAreaValueTotal;
			}

			function createValidationFunc(gcArea){
				return function(item, value, field){
					let defer = $q.defer();

					let currentValue = getCurrentAreaValue(item, gcArea);
					if(currentValue){
						currentValue.Value = value;
						item[field] = value;
						estimateMainAllowanceAreaValueService.markItemAsModified(currentValue);

						// update or create normal rest area value
						calcNormalRestAreaValue(gcArea, function(){
							defer.resolve(true);
						});
					}else{
						let createOption = {
							EstAllowanceAreaFk: item.Id,
							EstAllowanceGcAreaFk: gcArea.Id,
							Value : value
						};
						estimateMainAllowanceAreaValueService.createItem(createOption).then(function(newEntity){
							estimateMainAllowanceAreaValueService.addEntity(newEntity);

							calcNormalRestAreaValue(gcArea, function(){
								defer.resolve(true);
							});
						});
					}

					return defer.promise;
				};
			}

			function calcNormalRestAreaValue(gcArea, callbackFunc){
				// update or create normal rest area value
				let normalRestArea = getNormalRestArea();
				let restAreaValue = getRestAreaValue(gcArea);
				if(restAreaValue){
					restAreaValue.Value = calcRestAreaValue(gcArea);
					normalRestArea['Area_'+gcArea.Id] = restAreaValue.Value;
					$injector.get('estimateMainAllowanceAreaService').fireItemModified(normalRestArea);
					estimateMainAllowanceAreaValueService.markItemAsModified(restAreaValue);
					callbackFunc();
				}else{
					if(normalRestArea){
						let createOption = {
							EstAllowanceAreaFk: normalRestArea.Id,
							EstAllowanceGcAreaFk: gcArea.Id,
							Value : calcRestAreaValue(gcArea)
						};
						estimateMainAllowanceAreaValueService.createItem(createOption).then(function(newEntity){
							estimateMainAllowanceAreaValueService.addEntity(newEntity);
							normalRestArea['Area_'+gcArea.Id] = newEntity.Value;
							$injector.get('estimateMainAllowanceAreaService').fireItemModified(normalRestArea);
							estimateMainAllowanceAreaValueService.markItemAsModified(newEntity);
							callbackFunc();
						});
					}else{
						callbackFunc();
					}
				}
			}

			service.process = process;
			service.refreshColumns = refreshColumns;
			service.getAreaValueColumns = function(){
				return areaValueColumns;
			};

			service.deleteAreaValueColumns = function (deleteArea, isGcArea) {
				estimateMainAllowanceAreaValueService.reSetList(deleteArea, isGcArea);

				if(isGcArea){
					areaValueColumns = _.filter(areaValueColumns,function (item) {
						return item.id !== generateAreaValueColumnName(deleteArea).toLowerCase();
					});
				}else {
					let gcAreas = _.filter($injector.get('estimateMainAllowanceAreaService').getList(),function (item) {
						return item.AreaType === 3 || item.AreaType === 4;
					});

					let normalRestArea = getNormalRestArea();
					let values = estimateMainAllowanceAreaValueService.getList();
					_.forEach(gcAreas, function (gcArea) {
						let geAreaValueTotal = 0;
						_.forEach($injector.get('estimateMainAllowanceAreaValueService').getList(), function(item){
							if(item.EstAllowanceGcAreaFk === gcArea.Id && item.Value){
								if(!normalRestArea || normalRestArea.Id !== item.EstAllowanceAreaFk){
									geAreaValueTotal += item.Value;
								}
							}
						});
						normalRestArea['Area_'+gcArea.Id] = 100 - geAreaValueTotal;

						let restValue = _.find(values, {'EstAllowanceGcAreaFk': gcArea.Id, 'EstAllowanceAreaFk' : normalRestArea.Id});
						if(restValue){
							restValue.Value = 100 - geAreaValueTotal;
						}
					});
				}
			};

			service.refreshConfigurationColumn = function refreshConfigurationColumn() {
				let originalColumns =  angular.copy(estimateMainAllowanceAreaUIConfigService.getStandardConfigForListView().columns);
				autoValidation(originalColumns, estimateMainAllowanceAreaValidationService);
				// originalColumns = originalColumns.concat(areaValueColumns);
				let multiSelect = angular.copy($injector.get('estimateMainAllowanceAreaService').getMultiSelectStatus());
				platformGridAPI.columns.configuration(allowanceAreaGrid, originalColumns);
				handleMarkMultiSelect(originalColumns, multiSelect);
				platformGridAPI.grids.refresh(allowanceAreaGrid);
				platformGridAPI.grids.invalidate(allowanceAreaGrid);
			};

			function handleMarkMultiSelect(originCols, multiSelect) {
				let filterCol = _.find(originCols, {id: 'marker'});
				if (filterCol && filterCol.editorOptions) {
					filterCol.editorOptions.multiSelect = multiSelect;
				}
				let cols = platformGridAPI.columns.configuration(allowanceAreaGrid);
				_.forEach(cols.current, function (col) {
					if(col.id === 'marker'){
						col.editorOptions.multiSelect = multiSelect;
					}
				})
			}

			return service;
		}]);
})(angular);