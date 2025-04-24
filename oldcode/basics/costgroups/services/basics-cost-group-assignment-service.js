/**
 * Created by xia on 8/9/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupAssignmentService', ['_', '$injector', 'platformGridAPI', 'platformTranslateService', 'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService', 'basicsCostGroupColumnGenerationService', 'platformRuntimeDataService',
		function (_, $injector, platformGridAPI, platformTranslateService, basicsLookupdataLookupDescriptorService, cloudCommonGridService, basicsCostGroupColumnGenerationService, platformRuntimeDataService) {

			var fieldTag = 'costgroup_';
			var service = {};

			function initCostGroupColumnValue(entities, costGroupCats, option){
				/* initialize lic cost group columns */
				if (costGroupCats && costGroupCats.length > 0) {

					var costGroupColumnNames = _.map(costGroupCats, function(item){
						return {field: fieldTag + item.Id , readonly: true};
					});

					_.each(entities, function (entity) {

						/* set cost group columns readonly */
						if(option.isReadonly){
							platformRuntimeDataService.readonly(entity, costGroupColumnNames);
						}

						/* set the initialize value of cost group column is null */
						_.each(costGroupCats, function (catalog) {
							entity[fieldTag + catalog.Id.toString()] = null;
						});
					});
				}
			}

			function initCostGroupColumnValidate(dataService, validationService, costGroupColumns) {
				if(dataService && validationService){
					_.forEach(_.filter(costGroupColumns, {bulkSupport: true}), function(costGroup){
						if(!validationService.hasOwnProperty('validate' + costGroup.field)){
							validationService['validate' + costGroup.field] = validationService['validate' + costGroup.field + 'ForBulkConfig'] = function(entity, value, field,isBulkEditor) {
								if(isBulkEditor) {
									entity[field] = value;
									if (dataService.costGroupService) {
										dataService.costGroupService.createCostGroup2Save(entity, costGroup);
									}
								}

								return true;
							};
						}
					});
				}
			}

			/* attach costGroupFk to main entity list */
			service.attachCostGroupValueToEntity = function (entities, entity2CostGroups, identityGetter, dataLookupType) {
				if (angular.isArray(entities) && entities.length > 0 && angular.isArray(entity2CostGroups) && entity2CostGroups.length > 0) {
					_.forEach(entity2CostGroups, function (entity2CostGroup) {
						var entity = _.find(entities, identityGetter(entity2CostGroup));
						if (entity) {
							entity[fieldTag + entity2CostGroup.CostGroupCatFk] = entity2CostGroup.CostGroupFk;
						}
					});

					if (dataLookupType) {
						let lookupData = basicsLookupdataLookupDescriptorService.getData(dataLookupType);
						if (lookupData) {
							_.forEach(entity2CostGroups, function (entity2CostGroup) {
								let item = _.find(lookupData, {'MainItemId': entity2CostGroup.MainItemId, 'CostGroupCatFk': entity2CostGroup.CostGroupCatFk, 'CostGroupFk': entity2CostGroup.CostGroupFk});
								if (!item) {
									basicsLookupdataLookupDescriptorService.addData(dataLookupType, [entity2CostGroup]);
								}
							});
						} else {
							basicsLookupdataLookupDescriptorService.updateData(dataLookupType, entity2CostGroups);
						}
					}
				}
			};

			service.attach2NewEntity = function (newEntity, costGroupCats){
				if(!newEntity || !costGroupCats || costGroupCats.length <=0){ return; }

				let option = {
					isReadonly: false,
				};

				initCostGroupColumnValue([newEntity], costGroupCats.LicCostGroupCats, option);
				initCostGroupColumnValue([newEntity], costGroupCats.PrjCostGroupCats, option);
			};

			service.attach = function (readData, createOption) {

				var option = angular.extend({
					mainDataName: 'dtos',
					attachDataName: 'entity2CostGroups',// boqItem2CostGroup
					dataLookupType: 'entity2CostGroups',// boqItem2CostGroup
					isTreeStructure: false,// true
					isReadonly: false,
					childrenName: '',// boq
					identityGetter: function () {
						/* function identityGetter(entity){
                         return {
                         BoqHeaderFk: entity.RootItemId,
                         Id: entity.MainItemId
                         }
                         } */
						return {};
					}
				}, createOption);

				// to init the costgroup columns
				if(readData[option.mainDataName]) {
					var entities = option.isTreeStructure ? cloudCommonGridService.flatten(readData[option.mainDataName], [], option.childrenName) : readData[option.mainDataName];

					if (readData.CostGroupCats) {
						initCostGroupColumnValue(entities, readData.CostGroupCats.LicCostGroupCats, option);
						initCostGroupColumnValue(entities, readData.CostGroupCats.PrjCostGroupCats, option);
					}

					if(readData[option.attachDataName]){
						basicsLookupdataLookupDescriptorService.removeData(option.dataLookupType);
						basicsLookupdataLookupDescriptorService.updateData(option.dataLookupType, readData[option.attachDataName]);
						service.attachCostGroupValueToEntity(entities, readData[option.attachDataName], option.identityGetter);
					}
				}
			};

			service.createCostGroupColumns = function (costGroupCats, uiConfigService, gridId) {
				if(!costGroupCats) { return []; }

				var dynamicCostgroups =  basicsCostGroupColumnGenerationService.createCostGroupColumns(costGroupCats.LicCostGroupCats, costGroupCats.PrjCostGroupCats, false, costGroupCats.ProjectId);
				if(uiConfigService && gridId){
					// parseConfiguration
					var dynamicConfigService = $injector.get('estimateCommonDynamicConfigurationServiceFactory').getService(uiConfigService);
					dynamicCostgroups = dynamicConfigService.resolveColumns(gridId, dynamicCostgroups);
				}

				return dynamicCostgroups;
			};

			service.createCostGroupColumnsForDetail = function(costGroupCats, costGroupDataService){
				if(!costGroupCats) { return []; }

				return basicsCostGroupColumnGenerationService.createCostGroupColumnsForDetail(costGroupCats.LicCostGroupCats, costGroupCats.PrjCostGroupCats, costGroupDataService, costGroupCats.ProjectId);
			};

			service.process = function(readData, dataService, createOption){

				service.attach(readData, createOption);

				if(!readData || !readData.CostGroupCats) { return []; }

				if(dataService){
					dataService.costGroupCatalogs = readData.CostGroupCats;

					if(dataService.onCostGroupCatalogsLoaded){
						dataService.onCostGroupCatalogsLoaded.fire(readData.CostGroupCats);
					}
				}
			};

			service.addCostGroupColumns = function(gridId, UIStandardConfigService, costGroupCats, dataService, validationService, options){
				/* generate the cost group columns */
				var costGroupColumns = service.createCostGroupColumns(costGroupCats, false);

				if(options && options.isReadonly){
					_.forEach(costGroupColumns, function(item){
						item.editor = null;
					});
				}

				/* enhance the validation service to support the bulk editor */
				initCostGroupColumnValidate(dataService, validationService, costGroupColumns);

				/* set the cost group columns */
				var configurationExtendService = UIStandardConfigService.isExtendService ? UIStandardConfigService : $injector.get('estimateCommonDynamicConfigurationServiceFactory').getService(UIStandardConfigService, validationService);
				configurationExtendService.applyToScope({gridId: gridId});
				if (costGroupCats.ProjectId && costGroupCats.ProjectId !== costGroupCats.PreviousProjectId){
					configurationExtendService.setIsDynamicColumnConfigChanged(true);
				}
				configurationExtendService.attachCostGroupColumnsForList(costGroupColumns);
				configurationExtendService.fireRefreshConfigLayout();
			};

			service.getCostGroupColumnsForDetail = function(costGroupCats, costGroupDataService, groupName) {
				var costGroupColumns = service.createCostGroupColumnsForDetail(costGroupCats, costGroupDataService);

				var gid = groupName ? groupName : 'assignments';

				var sortOrder = 1000;

				_.forEach(costGroupColumns, function (costGroupColumn) {
					angular.extend(costGroupColumn, {
						gid: gid, // Add to assignments group
						sortOrder: sortOrder++
					});
				});

				return costGroupColumns;
			};

			function autoValidation(formConfig, validationService){
				if (formConfig.addValidationAutomatically && !!validationService) {
					_.forEach(formConfig.rows, function (row) {
						var rowModel = row.model.replace(/\./g, '$');

						var syncName = 'validate' + rowModel;
						var asyncName = 'asyncValidate' + rowModel;

						if (validationService[syncName]) {
							row.validator = validationService[syncName];
						}

						if (validationService[asyncName]) {
							row.asyncValidator = validationService[asyncName];
						}
					});
				}
			}

			service.refreshDetailForm = function(costGroupCatalogs, configOption){

				if(!costGroupCatalogs || !configOption) { return; }

				var option = angular.extend({
					scope : null,
					dataService : null,
					validationService: null,
					costGroupDataService : null,
					formConfiguration : null,
					costGroupName : 'assignments'
				}, configOption);

				var costGroupDataService = option.costGroupDataService ? option.costGroupDataService : (option.dataService ? option.dataService.costGroupService : null);

				var costGroupRows = service.getCostGroupColumnsForDetail(costGroupCatalogs, costGroupDataService, option.costGroupName);

				if(costGroupRows && angular.isArray(costGroupRows) && costGroupRows.length > 0) {

					var originalRows = _.filter(option.scope.formOptions.configure.rows, function (row) {
						return !row.hasOwnProperty('costGroupCatId');
					});

					autoValidation(option.scope.formOptions.configure, option.validationService);

					option.scope.formOptions.configure.rows = originalRows.concat(costGroupRows);

					// add costGroups rows to rowsDict
					if (option.scope.formOptions.configure.hasOwnProperty('rowsDict')){
						_.forEach(costGroupRows, function(costGroupRow){
							option.scope.formOptions.configure.rowsDict[costGroupRow.rid] = costGroupRow;
						});
					}
				}else{
					var rowsWithoutCostGroup = _.filter(option.scope.formOptions.configure.rows, function (row) {
						return !row.hasOwnProperty('costGroupCatId');
					});

					option.scope.formOptions.configure.rows = rowsWithoutCostGroup;
				}

				option.scope.$broadcast('form-config-updated');
			};

			service.initCostGroupColumnValidate = initCostGroupColumnValidate;

			return service;
		}]);
})(angular);
