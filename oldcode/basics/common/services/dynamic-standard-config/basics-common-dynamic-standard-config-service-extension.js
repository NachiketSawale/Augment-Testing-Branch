/**
 * Created by mov on 02.28.2022.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonDynamicStandardConfigServiceExtension
	 * @function
	 *
	 * @description: Create Grid And Detail configuration dynamically, this extension should be added to the StandardConfigurationService to be able to handle the GRID or Detail configuration on the fly.
	 *
	 */
	angular.module(moduleName).service('basicsCommonDynamicStandardConfigServiceExtension', ['_',
		'$injector', 'platformGridAPI', 'platformUIStandardExtentService', 'platformUIStandardConfigService', 'platformFormConfigService', 'basicsCommonDynamicStandardConfigMergeViewService', 'basicsCommonDynamicStandardConfigValidationService', 'basicsCommonDynamicStandardConfigTranslationService',
		function (_,$injector, platformGridAPI, platformUIStandardExtentService, platformUIStandardConfigService, platformFormConfigService, basicsCommonDynamicStandardConfigMergeViewService, basicsCommonDynamicStandardConfigValidationService, basicsCommonDynamicStandardConfigTranslationService) {

			let service = {};

			angular.extend(service, {
				extend: extend
			});

			return service;

			function extend(standardConfigurationService, dynamicUIColumnToAdd, entitySchema, translationService){

				let baseStandardConfigForListView = standardConfigurationService.getStandardConfigForListView();
				let baseStandardConfigForDetailView = standardConfigurationService.getStandardConfigForDetailView();

				angular.extend(standardConfigurationService, {
					isDynamicColumnInit: false,
					dynamicGroupOptions: [],
					dynamicConfig: {},
					usageContext: null,
					validationService: null,

					// groupObject = { gid: 'groupId', [{dtoData}] }
					attachFields: function (groupObject){
						return attachFieldsToCache(standardConfigurationService, groupObject, translationService);
					},
					// usage: detachGroup({gid: 'GroupId'});
					detachFields: function (groupObject){
						return detachFieldsFromCache(standardConfigurationService, groupObject);
					},
					attachGroup: function(groupObject){
						return attachGroupFromCache(standardConfigurationService, groupObject, translationService);
					},
					// usage: detachGroup({gid: 'GroupId'});
					detachGroup: function(groupObject){
						return detachGroupFromCache(standardConfigurationService, groupObject);
					},
					getStandardConfigForListView: function(){
						return getStandardConfigForListView(standardConfigurationService, baseStandardConfigForListView);
					},
					getStandardConfigForDetailView: function(){
						return getStandardConfigForDetailView(standardConfigurationService, baseStandardConfigForDetailView);
					},
					refreshGridConfig: function(){
						refreshGridLayout(standardConfigurationService);
					},
					refreshDetailConfig: function(scope){
						refreshDetailConfig(scope, standardConfigurationService);
					}
				});

				processDynamicUIColumns(standardConfigurationService, dynamicUIColumnToAdd);
			}

			function getStandardConfigForListView(standardConfigService, baseStandardConfigForListView) {
				let dynamicConfig = standardConfigService.dynamicConfig;
				let mergedColsConfigs = [];

				for (let prop in dynamicConfig) {
					if (Object.hasOwnProperty.call(dynamicConfig, prop) && dynamicConfig[prop].isActive === true) {
						mergedColsConfigs = mergedColsConfigs.concat(dynamicConfig[prop].getStandardConfigForListView().columns);
					}
				}
				// baseStandardConfigForListView.columns = baseStandardConfigForListView.columns.concat(columnsToAttachForList);

				let staticAndDynamicColumns = baseStandardConfigForListView.columns.concat(mergedColsConfigs);

				let standardStaticAndDynamic = angular.copy(baseStandardConfigForListView);
				standardStaticAndDynamic.columns = staticAndDynamicColumns;
				return standardStaticAndDynamic;
			}

			function getStandardConfigForDetailView(standardConfigService, baseStandardConfigForDetailView){
				// Get dynamic columns from configuration
				// let detailDynamicConfig = getAllConfig(standardConfigService.dynamicConfig, 'getStandardConfigForDetailView');

				let dynamicConfig = standardConfigService.dynamicConfig;
				let mergedGroupsConfigs = [],
					mergedRowsConfigs = [];

				for (let prop in dynamicConfig) {
					if (Object.hasOwnProperty.call(dynamicConfig, prop)&& dynamicConfig[prop].isActive === true) {
						mergedGroupsConfigs = mergedGroupsConfigs.concat(dynamicConfig[prop].getStandardConfigForDetailView().groups);
						mergedRowsConfigs = mergedRowsConfigs.concat(dynamicConfig[prop].getStandardConfigForDetailView().rows);
					}
				}

				let standardStaticAndDynamicGroups = baseStandardConfigForDetailView.groups.concat(mergedGroupsConfigs);
				let standardStaticAndDynamicRows = baseStandardConfigForDetailView.rows.concat(mergedRowsConfigs);

				let standardStaticAndDynamic = angular.copy(baseStandardConfigForDetailView);
				standardStaticAndDynamic.groups = standardStaticAndDynamicGroups;
				standardStaticAndDynamic.rows = standardStaticAndDynamicRows;

				return standardStaticAndDynamic;
			}

			function processDynamicUIColumns(baseStandardConfigurationService, dynConfig){
				if (dynConfig && dynConfig.version === '1.0.0' && dynConfig.usageServiceContext){

					// baseStandardConfigurationService.usageContext = dynConfig.usageServiceContext;
					// baseStandardConfigurationService.validationService = dynConfig.usageValidationContext;

					if(dynConfig.usageServiceContext){
						if(_.isString(dynConfig.usageServiceContext)){
							baseStandardConfigurationService.usageContext = $injector.get(dynConfig.usageServiceContext);
						}else{
							baseStandardConfigurationService.usageContext = dynConfig.usageServiceContext;
						}
						// Register event to mainService
						// let usageContextService = $injector.get(baseStandardConfigurationService.usageContext);
						baseStandardConfigurationService.usageContext.registerDynamicConfiguration = function (){
							return registerDynamicConfiguration(arguments, baseStandardConfigurationService);
						};
					}

					if(dynConfig.usageValidationContext){
						if(_.isString(dynConfig.usageValidationContext)){
							baseStandardConfigurationService.validationService = $injector.get(dynConfig.usageValidationContext);
						}else{
							baseStandardConfigurationService.validationService = dynConfig.usageValidationContext;
						}
					}

					baseStandardConfigurationService.overloads = dynConfig.overloads || {};
					baseStandardConfigurationService.addition = dynConfig.addition || {};

					_.forEach(dynConfig.groups, function(group){
						baseStandardConfigurationService.dynamicGroupOptions.push(group);
					});
				}
			}

			function resetDynamicConfigs(standardConfigurationService, dynamicGroupSettings){
				standardConfigurationService.isDynamicColumnInit = false;
				delete standardConfigurationService.dynamicConfig[dynamicGroupSettings.gid];
			}

			function registerDynamicConfiguration(args, standardConfigurationService){
				// let dtos = [];
				let dtoDynamicGroupConfigs = {};
				let serviceContainerData = {};

				if (args && args.length > 1){
					// dtos = args[0];
					dtoDynamicGroupConfigs = args[1];
					serviceContainerData = args[2];
				}

				_.forEach(standardConfigurationService.dynamicGroupOptions, function(dynamicGroupSettings){
					// Clear
					resetDynamicConfigs(standardConfigurationService, dynamicGroupSettings);

					// // A. Add dynamic columns to grid
					let groupId = dynamicGroupSettings.gid;

					// Attach
					let groupConfig = dtoDynamicGroupConfigs[dynamicGroupSettings.options.dtoName];
					if (groupConfig) {
						standardConfigurationService.attachFields({
							gid: groupId,
							fields: groupConfig
						});
					}

					// B. Add data to dynamic columns
					// let columnsByGroup = standardConfigurationService.dynamicConfig[groupId].getStandardConfigForListView().columns;
				});

				// init
				standardConfigurationService.isDynamicColumnInit = true;

				// TODO-VICTOR: process DTOColumns dtoDynamicGroupConfigs[dynamicGroupSettings.options.dtoName]
				standardConfigurationService.gridId = _.first(serviceContainerData.usingContainer);
				standardConfigurationService.refreshGridConfig();



			}

			function applyProcessorFn(standardConfigurationService, dtoObject, baseTranslateService){

				let getDtoScheme = standardConfigurationService.getDtoScheme();
				let dynamicGroupSettings = _.find(standardConfigurationService.dynamicGroupOptions, {gid: dtoObject.gid});

				// A. Add dynamic columns to grid
				let groupId = dtoObject.gid;//  dynamicGroupSettings.gid;

				// Make all dynamic groups from ui configuration service // @next
				// Processed
				let dtosToProcess = dtoObject.fields;

				if (dynamicGroupSettings.options.filter){
					dtosToProcess = _.filter(dtosToProcess, dynamicGroupSettings.options.filter);
				}

				let dynamicDTOScheme = {};

				/* 1. Add to newDtoSchema */
				if (dynamicGroupSettings.attributes && dynamicGroupSettings.attributes.length > 0){
					_.forEach(dynamicGroupSettings.attributes, function(attr){
						let objPropertyNameToAdd =  _.find(Object.getOwnPropertyNames(getDtoScheme), function(objPropertyName){
							return objPropertyName.toLowerCase() === attr.toLowerCase();
						});
						if (objPropertyNameToAdd){
							let staticFieldOverload = standardConfigurationService.overloads[objPropertyNameToAdd.toLowerCase()];
							let staticField = getDtoScheme[objPropertyNameToAdd];
							staticField.isStaticForField = true;
							dynamicDTOScheme[objPropertyNameToAdd] = angular.extend(staticField, staticFieldOverload);
						}
					});
				}

				let propertyFn = dynamicGroupSettings.options.propertyFn;
				if (propertyFn){
					_.forEach(dtosToProcess, function(dtoToProcess){
						let propertyToAdd = propertyFn(dtoToProcess);
						propertyToAdd.domain = propertyToAdd.domain || (propertyToAdd.grid ? propertyToAdd.grid.formatter : null) || 'description';
						dynamicDTOScheme[propertyToAdd.id || dtoToProcess.Id || -1] = propertyToAdd; //  if -1 will throw error, set id in processor, or set Id in Dto data
					});
				}else{
					console.error('propertyFn is not defined.');
				}

				let allAttributes = _.map(dynamicDTOScheme, function(value, key){ return key.toLowerCase(); }) || [];

				let group = {
					'gid': groupId,
					'attributes': allAttributes
				};

				let overloads = {};
				_.forEach(dynamicDTOScheme, function(value, key){
					overloads[key.toLowerCase()] = value;
				});

				// layout, dtoScheme, translationService
				let layout = {
					'fid': moduleName + '.dynamic.' + groupId,
					// 'version': '1.0.0',
					'showGrouping': true,
					'change': 'change',
					'addValidationAutomatically': true,
					'groups': [group],
					'overloads':  overloads,
					'addition': null
				};

				let dynamicUIStandardConfiguration = new platformUIStandardConfigService(layout, angular.extend(getDtoScheme, dynamicDTOScheme),
					basicsCommonDynamicStandardConfigTranslationService.getTranslationInfo(baseTranslateService, dynamicDTOScheme));

				platformUIStandardExtentService.extend(dynamicUIStandardConfiguration, layout.addition, dynamicDTOScheme);

				// ValidationService
				if (Object.hasOwnProperty.call(standardConfigurationService, 'validationService')&&standardConfigurationService.validationService){
					let valService = standardConfigurationService.validationService;// $injector.get(standardConfigurationService.validationService);
					// Add validation to configuration
					basicsCommonDynamicStandardConfigValidationService.addValidationConfiguration(dynamicGroupSettings, dynamicUIStandardConfiguration, valService, standardConfigurationService);
				}

				return dynamicUIStandardConfiguration;
			}

			function attachFieldsToCache(standardConfigurationService, groupObject, translationService){
				standardConfigurationService.dynamicConfig[groupObject.gid] = angular.extend(applyProcessorFn(standardConfigurationService, groupObject, translationService), {isActive: true});
			}

			function detachFieldsFromCache(standardConfigurationService, groupObject){
				if (Object.hasOwnProperty.call(standardConfigurationService.dynamicConfig, groupObject.gid)){

					let colIds = _.map(groupObject.columns, function(dtoItem){
						return dtoItem.Id;
					});
					standardConfigurationService.dynamicConfig[groupObject.gid] = _.filter(standardConfigurationService.dynamicColDictionary[groupObject.gid], function(col){
						return colIds.indexOf(col.id) === -1;
					});
				}
			}

			function attachGroupFromCache(standardConfigurationService, groupObject, translationService){
				attachFieldsToCache(standardConfigurationService, groupObject, translationService);
			}

			function detachGroupFromCache(standardConfigurationService, groupObject){
				if (Object.hasOwnProperty.call(standardConfigurationService.dynamicConfig, groupObject.gid)){
					// delete standardConfigurationService.dynamicConfig[groupObject.gid];
					standardConfigurationService.dynamicConfig[groupObject.gid].isActive = false;
				}
			}

			function refreshGridLayout(standardConfigurationService) {
				if (!standardConfigurationService.isDynamicColumnInit){
					return;
				}

				let columns = standardConfigurationService.getStandardConfigForListView().columns;

				let columnsMergedWithSavedConfiguration = basicsCommonDynamicStandardConfigMergeViewService.mergeWithViewConfig(standardConfigurationService.gridId, columns);

				applyConfiguration(standardConfigurationService, columnsMergedWithSavedConfiguration);

			}

			function refreshDetailConfig(scope, standardConfigurationService) {
				angular.extend(scope.formOptions.configure, standardConfigurationService.getStandardConfigForDetailView());
				platformFormConfigService.initialize(scope.formOptions, scope.formOptions.configure);
				scope.$broadcast('form-config-updated');
			}

			function applyConfiguration(standardConfigurationService, cols){
				platformGridAPI.columns.configuration(standardConfigurationService.gridId, cols);
			}

			}
	]);
})(angular);
