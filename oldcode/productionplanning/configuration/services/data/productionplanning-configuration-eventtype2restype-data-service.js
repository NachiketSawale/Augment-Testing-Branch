(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	/**
     * @ngdoc service
     * @name productionplanningConfigurationEventtype2restypeDataService
     * @function
     *
     * @description
     * productionplanningConfigurationEventtype2restypeDataService is the data service for eventtype2restype.
     */

	angModule.factory('productionplanningConfigurationEventtype2restypeDataService', DataService);
	DataService.$inject = [
		'$injector',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'basicsLookupdataLookupFilterService',
		'productionplanningConfigurationMainService',
		'productionplanningConfigurationEventtype2restypeProcessor',
		'platformRuntimeDataService'
	];

	function DataService($injector,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		basicsLookupdataLookupDescriptorService,
		basicsCommonMandatoryProcessor,
		basicsLookupdataLookupFilterService,
		parentService,
		processor,
		platformRuntimeDataService) {

		var serviceInfo = {
			flatLeafItem: {
				module: angModule,
				serviceName: 'productionplanningConfigurationEventtype2restypeDataService',
				entityNameTranslationID: 'productionplanning.configuration.entityEventType2ResType',
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EventType2ResTypeDto',
					moduleSubModule: 'ProductionPlanning.Configuration'
				}), processor],
				httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtype2restype/'},
				httpRead: {route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtype2restype/'},
				/* httpCRUD: {
                 route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtype2restype/'
                 }, */
				entityRole: {
					leaf: {
						itemName: 'EventType2ResType',
						parentService: parentService,
						parentFilter: 'eventTypeId'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var dtos = (angular.isArray(readData) && !readData.Main) ? readData : readData.Main;

							var result = {
								FilterResult: readData.FilterResult,
								dtos: dtos || []
							};
							return container.data.handleReadSucceeded(result, data);
						},
						initCreationData: function (creationData) {
							creationData.Id = parentService.getSelected().Id;
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat'
					/* canCreateCallBackFunc: function () {
                        var parentItem = parentService.getSelected();
                        return parentItem && !parentItem.IsSystemType;
                    },
                    canDeleteCallBackFunc: function (selectedItem) {
                        if (selectedItem.Version <= 0) {
                            return true;
                        }
                        var parentItem = parentService.getSelected();
                        return parentItem && !parentItem.IsSystemType;
                    } */
				}


			}
		};

		/* function registerLookupFilters() {
         var filters = [{
         key: 'resource-master-resource-filter',

         fn: function (item) {
         if (item) {
         return item.PpsEntityFk !== null && item.PpsEntityFk === 1;
         }
         return false;
         }
         }];
         basicsLookupdataLookupFilterService.registerFilter(filters);
         } */

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		// container.data.usesCache = true;
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EventType2ResTypeDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationEventtype2restypeValidationService'
		});
		// registerLookupFilters();
		container.service.name = 'eventtype2restypeServ';

		container.service.onValueChanged = function (entity, field) {
			if (field === 'ResTypeFk') {
				entity.ResResourceFk = null;
			} else if (field === 'BasResourceContextFk') {
				entity.ResTypeFk = null;
				entity.ResResourceFk = null;
			} else if (field === 'IsLinkedFixToReservation') {
				let validationService = $injector.get('productionplanningConfigurationEventtype2restypeValidationService');
				let result = validationService.validateResResourceFk(entity, entity.ResResourceFk, 'ResResourceFk');
				platformRuntimeDataService.applyValidationResult(result, entity, 'ResResourceFk');
			}
		};

		return container.service;
	}
})(angular);
