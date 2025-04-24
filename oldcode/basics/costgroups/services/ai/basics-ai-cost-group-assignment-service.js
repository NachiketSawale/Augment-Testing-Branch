/**
 * @author: chd
 * @date: 10/23/2020 1:16 PM
 * @description:
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsAICostGroupAssignmentService', ['_', '$injector', 'platformGridAPI', 'platformTranslateService', 'basicsLookupdataLookupDescriptorService',
		'cloudCommonGridService', 'basicsAICostGroupColumnGenerationService', 'platformRuntimeDataService', 'basicsAICostGroupDataService',
		function (_, $injector, platformGridAPI, platformTranslateService, basicsLookupdataLookupDescriptorService, cloudCommonGridService, basicsAICostGroupColumnGenerationService, platformRuntimeDataService, basicsAICostGroupDataService) {

			var fieldTag = 'costgroup_';
			var suggestedFieldTag = 'suggested_costgroup_';
			var service = {};

			function initAICostGroupColumnValue(entities, costGroupCats, option){
				/* initialize ai lic cost group columns */
				if (costGroupCats && costGroupCats.length > 0) {

					var costGroupColumnNames = _.map(costGroupCats, function(item){
						return {field: fieldTag + item.Id , readonly: true};
					});

					var suggestedCostGroupColumnNames = _.map(costGroupCats, function(item){
						return {field: suggestedFieldTag + item.Id , readonly: true};
					});

					var allCostGroupColumnNames = costGroupColumnNames.concat(suggestedCostGroupColumnNames);

					_.each(entities, function (entity) {

						if (!entity.IsCheckAi) {
							platformRuntimeDataService.readonly(entity, [{field: 'IsCheckAi', readonly: true}]);
						}

						/* set cost group columns readonly */
						if(option.isReadonly){
							platformRuntimeDataService.readonly(entity, allCostGroupColumnNames);
						}

						/* set the initialize value of cost group column is null */
						_.each(costGroupCats, function (catalog) {
							entity[fieldTag + catalog.Id.toString()] = null;
							entity[suggestedFieldTag + catalog.Id.toString()] = null;
						});
					});
				}
			}

			function initAICostGroupColumnValidate(dataService, validationService, costGroupColumns) {
				if(dataService && validationService){
					_.forEach(_.filter(costGroupColumns, {bulkSupport: true}), function(costGroup){
						if(!validationService.hasOwnProperty('validate' + costGroup.field)){
							validationService['validate' + costGroup.field] = validationService['validate' + costGroup.field + 'ForBulkConfig'] = function(entity, value, field,isBulkEditor) {
								if(isBulkEditor){
									entity[field] = value;
									if(dataService.costGroupService){
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
			service.attachAICostGroupValueToEntity = function (entities, entity2CostGroups, identityGetter, dataLookupType) {
				if (angular.isArray(entities) && entities.length > 0 && angular.isArray(entity2CostGroups) && entity2CostGroups.length > 0) {
					_.forEach(entity2CostGroups, function (entity2CostGroup) {
						var entity = _.find(entities, identityGetter(entity2CostGroup));
						if (entity) {
							entity[fieldTag + entity2CostGroup.CostGroupCatFk] = entity2CostGroup.CostGroupFk;
							entity[suggestedFieldTag + entity2CostGroup.CostGroupCatFk] = entity2CostGroup.SuggestedCostGroupFk;
							if (entity2CostGroup.CostGroupFk !== entity2CostGroup.SuggestedCostGroupFk && entity2CostGroup.SuggestedCostGroupFk !== null) {
								platformRuntimeDataService.readonly(entity, [
									{field: suggestedFieldTag + entity2CostGroup.CostGroupCatFk, readonly: false}]
								);
							}
						}
					});

					if(dataLookupType){
						basicsLookupdataLookupDescriptorService.updateData(dataLookupType, entity2CostGroups);
					}
				}
			};

			service.aiAttach = function (readData, createOption) {

				var option = angular.extend({
					mainDataName: 'dtos',
					attachDataName: 'entity2CostGroups',//lineItem2CostGroup
					dataLookupType: 'entity2CostGroups',//lineItem2CostGroup
					isTreeStructure: false,//true
					isReadonly: true,
					childrenName: '',
					identityGetter: function () {
						return {};
					}
				}, createOption);

				// to init the costgroup columns
				if(readData[option.mainDataName]) {
					var entities = option.isTreeStructure ? cloudCommonGridService.flatten(readData[option.mainDataName], [], option.childrenName) : readData[option.mainDataName];

					if (readData.CostGroupCats) {
						initAICostGroupColumnValue(entities, readData.CostGroupCats.LicCostGroupCats, option);
						initAICostGroupColumnValue(entities, readData.CostGroupCats.PrjCostGroupCats, option);
					}

					if(readData[option.attachDataName]){
						basicsLookupdataLookupDescriptorService.updateData(option.dataLookupType, readData[option.attachDataName]);
						service.attachAICostGroupValueToEntity(entities, readData[option.attachDataName], option.identityGetter);
					}
				}
			};

			service.createAICostGroupColumns = function (costGroupCats, uiConfigService, gridId) {
				if(!costGroupCats) { return []; }

				var dynamicCostgroups =  basicsAICostGroupColumnGenerationService.createAICostGroupColumns(costGroupCats.LicCostGroupCats, costGroupCats.PrjCostGroupCats, costGroupCats.ProjectId);
				if(uiConfigService && gridId){
					// parseConfiguration
					var dynamicConfigService = $injector.get('estimateCommonDynamicConfigurationServiceFactory').getService(uiConfigService);
					dynamicCostgroups = dynamicConfigService.resolveColumns(gridId, dynamicCostgroups);
				}

				return dynamicCostgroups;
			};

			service.aiProcess = function(readData, dataService, createOption){

				basicsAICostGroupDataService.attachSuggestedCostGroupsData(readData);
				service.aiAttach(readData, createOption);

				if(!readData || !readData.CostGroupCats) { return []; }

				if(dataService){
					dataService.costGroupCatalogs = readData.CostGroupCats;

					if(dataService.onCostGroupCatalogsLoaded){
						dataService.onCostGroupCatalogsLoaded.fire(readData.CostGroupCats);
					}
				}
			};

			service.addAICostGroupColumns = function(gridId, UIStandardConfigService, costGroupCats, dataService, validationService, options){
				/* generate the cost group columns */
				var costGroupColumns = service.createAICostGroupColumns(costGroupCats, false);

				if(options && options.isReadonly){
					_.forEach(costGroupColumns, function(item){
						item.editor = null;
					});
				}

				/* enhance the validation service to support the bulk editor */
				initAICostGroupColumnValidate(dataService, validationService, costGroupColumns);

				/* set the cost group columns */
				var configurationExtendService = UIStandardConfigService.isExtendService ? UIStandardConfigService : $injector.get('estimateCommonDynamicConfigurationServiceFactory').getService(UIStandardConfigService, validationService);
				configurationExtendService.applyToScope({gridId: gridId});
				configurationExtendService.attachCostGroupColumnsForList(costGroupColumns);
				configurationExtendService.fireRefreshConfigLayout();
			};

			service.initAICostGroupColumnValidate = initAICostGroupColumnValidate;

			return service;
		}]);
})(angular);
