/**
 * Created by anl on 6/5/2019.
 */


(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.eventconfiguration';

	angular.module(moduleName).factory('productionplanningEventconfigurationSequenceDataService', EventConfigDataService);

	EventConfigDataService.$inject = ['platformDataServiceFactory', 'platformModuleStateService',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningEventconfigurationSequenceProcessor',
		'basicsCommonMandatoryProcessor',
		'$injector', '$http',
		'platformDataValidationService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'productionplanningCommonStructureFilterService',
		'cloudCommonGridService'];

	function EventConfigDataService(platformDataServiceFactory, platformModuleStateService,
									basicsLookupdataLookupDescriptorService,
									sequenceProcessor,
									basicsCommonMandatoryProcessor,
									$injector, $http,
									platformDataValidationService,
									platformRuntimeDataService,
									basicsLookupdataLookupFilterService,
									ppsCommonStructureFilterService,
									cloudCommonGridService) {

		var lastFilter = null;
		var flattenMdcGroup = [];
		var serviceOptions = {
			flatRootItem: {
				module: moduleName,
				serviceName: 'productionplanningEventconfigurationSequenceDataService',
				entityNameTranslationID: 'productionplanning.eventconfiguration.entityEventSequence',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/eventconfiguration/sequence/',
					usePostForRead: true,
					endRead: 'filtered',
					endDelete: 'multidelete',
					extendSearchFilter: function extendSearchFilter(readData) {
						ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningEventconfigurationSequenceDataService', readData);
						ppsCommonStructureFilterService.setFilterRequest('productionplanningEventconfigurationSequenceDataService', readData);
						lastFilter = readData;
					}
				},
				entityRole: {
					root: {
						itemName: 'SequenceConfigs',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsEventConfig',
						descField: 'Description'
					}
				},
				dataProcessor: [sequenceProcessor],
				useItemFilter: true,
				entitySelection: {supportsMultiSelection: true},
				presenter: {
					// list: {
					// 	incorporateDataRead: function (readData, data) {
					// 		basicsLookupdataLookupDescriptorService.attachData(readData);
					// 		var result = {
					// 			FilterResult: readData.FilterResult,
					// 			dtos: readData.Main || []
					// 		};
					//
					// 		var dataRead = container.data.handleReadSucceeded(result, data);
					// 		return dataRead;
					// 	}
					// }
				},
				translation: {
					uid: 'productionplanningEventconfigurationSequenceDataService',
					title: 'productionplanning.eventconfiguration.entityEventSequence'
				},
				//sidebarWatchList: {active: true},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: null,
						includeNonActiveItems: false,
						showOptions: true,
						withExecutionHints: true,
						pinningOptions: {
							isActive: false
						}
					}
				}
			}
		};

		var container = platformDataServiceFactory.createNewComplete(serviceOptions);

		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EventSeqConfigDto',
			moduleSubModule: 'ProductionPlanning.EventConfiguration',
			validationService: 'productionpalnningEventconfigurationSequenceValidationService',
			mustValidateFields: ['MaterialGroupFk', 'SiteFk']
		});

		container.service.handleFieldChanged = function (entity, field) {
			switch (field) {
				case 'IsTemplate':
					setValidation(entity);
					break;
				case 'EventSeqConfigFk':
					getParentTemplates(entity);
			}
		};

		function setValidation(entity) {
			var validationService = $injector.get('productionpalnningEventconfigurationSequenceValidationService');
			if (!entity.IsTemplate) {
				var result1 = validationService.validateMaterialGroupFk(entity, entity.MaterialGroupFk, 'MaterialGroupFk');
				var result2 = validationService.validateSiteFk(entity, entity.SiteFk, 'SiteFk');
				platformRuntimeDataService.applyValidationResult(result1, entity, 'MaterialGroupFk');
				platformRuntimeDataService.applyValidationResult(result2, entity, 'SiteFk');

				sequenceProcessor.setColumnsReadOnly(entity, ['EventSeqConfigFk'], entity.IsTemplate);
				container.service.gridRefresh();
			} else {
				//var modState = platformModuleStateService.state(container.service.getModule());
				platformDataValidationService.removeFromErrorList(entity, 'MaterialGroupFk', validationService, container.service);
				platformDataValidationService.removeFromErrorList(entity, 'SiteFk', validationService, container.service);
				platformRuntimeDataService.applyValidationResult(true, entity, 'MaterialGroupFk');
				platformRuntimeDataService.applyValidationResult(true, entity, 'SiteFk');
				sequenceProcessor.setColumnsReadOnly(entity, ['EventSeqConfigFk'], entity.IsTemplate);
				container.service.gridRefresh();
			}
			container.service.markItemAsModified(entity);
		}

		function getParentTemplates(entity) {
			// get parent config's event-templates and set to event-template container
			if (entity.EventSeqConfigFk !== null) {
				sequenceProcessor.setColumnsReadOnly(entity, ['IsTemplate'], true);
				container.service.gridRefresh();
				$http.get(globals.webApiBaseUrl + 'productionplanning/eventconfiguration/template/getparenttemplates?parentConfigId=' + entity.EventSeqConfigFk).then(function (response) {
					var templates = response.data;
					if (templates !== null) {
						setTemplates(templates);
					}
				});
			} else {
				sequenceProcessor.setColumnsReadOnly(entity, ['IsTemplate'], false);
				container.service.gridRefresh();
			}
		}

		function setTemplates(templates) {
			var templateService = $injector.get('productionplanningEventconfigurationTemplateDataService');
			var existTemplates = container.service.getList();
			templateService.setList(templates);
			var modState = platformModuleStateService.state(container.service.getModule());
			modState.modifications.EntitiesCount = modState.modifications.EntitiesCount - templates.length +
			angular.isDefined(existTemplates.length) ? existTemplates.length : 0;
			modState.modifications.TemplateToSave = null;
		}

		var filters = [
			{
				key: 'pps-event-config-filter',
				fn: function (entity) {
					return entity.IsTemplate;
				}
			},
			{
				key: 'pps-material-group-filter',
				fn: function (entity) {
					return _.find(flattenMdcGroup, {Id: entity.Id});
				}
			},
			{
				key: 'pps-event-seq-config-factory-site-filter',
				serverSide: true,
				fn: function () {
					return {IsFactory : true};
				}
			}
		];
		basicsLookupdataLookupFilterService.registerFilter(filters);

		container.service.unRegisterFilter = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		container.service.initMdcGroupTree = function () {
			flattenMdcGroup = basicsLookupdataLookupDescriptorService.getData('flattenMdcGroup');
			if (!angular.isDefined(flattenMdcGroup)) {
				$http.get(globals.webApiBaseUrl + 'basics/materialcatalog/group/pps/grouptree').then(function (response) {
					flattenMdcGroup = [];
					flattenMdcGroup = cloudCommonGridService.flatten(response.data, flattenMdcGroup, 'ChildItems');
					basicsLookupdataLookupDescriptorService.updateData('flattenMdcGroup', response.data);
				});
			}
		};

		//Filter Structure
		ppsCommonStructureFilterService.setFilterFunction('productionplanningEventconfigurationSequenceDataService', ppsCommonStructureFilterService.getCombinedFilterFunction); // default filter
		container.service.getLastFilter = function () {
			if (_.isNil(lastFilter)) {
				lastFilter = {};
				ppsCommonStructureFilterService.extendSearchFilterAssign('productionplanningEventconfigurationSequenceDataService', lastFilter);
			}
			return lastFilter;
		};

		container.service.initMdcGroupTree();

		return container.service;
	}

})(angular);
