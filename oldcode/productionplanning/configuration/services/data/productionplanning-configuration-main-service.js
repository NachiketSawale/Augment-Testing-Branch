(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.configuration';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningConfigurationMainService
	 * @function
	 *
	 * @description
	 * productionplanningConfigurationMainService is the main service. It is the data service for eventtype2restype.
	 */

	angModule.factory('productionplanningConfigurationMainService', DataService);
	DataService.$inject = ['_',
		'$injector',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'productionplanningConfigurationSortingProcessor',
		'productionplanningConfigurationIssystemtypeProcessor',
		'basicsLookupdataLookupFilterService',
		'ProductionPlanningCommonUtcTimeProcessor',
		'ppsEntityConstant'];

	function DataService(_, $injector,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 basicsLookupdataLookupDescriptorService,
						 basicsCommonMandatoryProcessor,
						 sortingProcessor,
						 issystemtypeProcessor,
						 basicsLookupdataLookupFilterService,
						 ProductionPlanningCommonUtcTimeProcessor,
						 ppsEntityConstant) {

		var timeProcessor = new ProductionPlanningCommonUtcTimeProcessor(['PlannedStart']);

		var serviceInfo = {
			flatRootItem: {
				module: angModule,
				serviceName: 'productionplanningConfigurationMainService',
				entityNameTranslationID: 'productionplanning.configuration.entityEventType',
				dataProcessor: [timeProcessor,
				platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'EventTypeDto',
					moduleSubModule: 'ProductionPlanning.Configuration'
				}), sortingProcessor, issystemtypeProcessor],
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/configuration/eventtype/',
					endRead: 'filtered',
					usePostForRead: true
				},
				entityRole: {
					root: {
						itemName: 'EventType',
						moduleName: 'cloud.desktop.moduleDisplayNamePpsConfiguration',
						descField: 'DescriptionInfo.Translated'
					}
				},
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							basicsLookupdataLookupDescriptorService.attachData(readData);
							var result = {
								FilterResult: readData.FilterResult,
								dtos: readData.dtos || []
							};
							return container.data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {
					delete: {},
					create: 'flat',
					canDeleteCallBackFunc: function (selectedItem) {
						return !selectedItem.IsSystemEvent;
					}
				},
				translation: {
					uid: 'productionplanningConfigurationMainService',
					title: 'productionplanning.configuration.entityEventType',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'EventTypeDto',
						moduleSubModule: 'ProductionPlanning.Configuration',
					},
				},
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: false,
						pattern: '',
						pageSize: 100,
						useCurrentClient: false,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true
					}
				}
			}
		};

		initialize();
		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceInfo);
		//container.data.usesCache = true;
		container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'EventTypeDto',
			moduleSubModule: 'ProductionPlanning.Configuration',
			validationService: 'productionplanningConfigurationValidationService'
		});
		container.service.name = 'configurationServ';

		// angular.extend(container.service, {
		// 	markItemAsModified: markItemAsModified
		// });
		//
		// function markItemAsModified(entity){
		// 	entity.PlannedStart = entity.PlannedStart.format('LTS');
		// 	platformDataServiceModificationTrackingExtension.markAsModified(container.service, entity, container.data);
		// }

		return container.service;

		function initialize() {
			var filters = [{
						key: 'productionplanning-configuration-eventtype-rubric-category-by-rubric-filter',
						fn: function (rc, entity) {
							if (entity.RubricFk === null || entity.RubricFk === 0) {
								return true;
							}
							return rc.RubricFk === entity.RubricFk;
						}
					}, {
						key: 'productionplanning-configuration-eventtype-ppsentityfk-filter',
						fn: function (item) {
							if (item) {
								//return item.Foreventtype === true;
								//return _.includes([1,2,5,6,13],item.Id);
								return item.Foreventtype === true || _.includes([13],item.Id);
							}
							return false;
						}
					}, {
						key: 'productionplanning-configuration-clerkrole-ppsentityfk-filter',
						fn: function (item) {
							if (item) {
								// Transport Route, Engineering Task, Transport Requisition, PPS Header, PPS Item, Engineering Drawing
								var entityIds = [2, 5, 6, 11, 12, 18];
								return _.includes(entityIds, item.Id);
							}
							return false;
						}
					}, {
						key: 'productionplanning-configuration-eventtypeslot-ppsentityfk-filter',
						fn: function (item, entity) {
							if (item) {
								if (entity && isDateTimeColumn(entity.ColumnSelection) &&(entity.PpsEntityRefFk === ppsEntityConstant.PPSProduct || entity.PpsEntityRefFk === ppsEntityConstant.FabricationUnit)) {
									// if Source of Date slots is PPS Product or FabricationUnit, then show only PPS Product in "Show On" column
									return item.Id === ppsEntityConstant.PPSProduct;
								}
								// Engineering Task, Transport Bundle, PPS Item, PPS Product, PPSProductionSet, Transport Package
								return item.Id === ppsEntityConstant.EngineeringTask || item.Id === ppsEntityConstant.TransportBundle ||
										item.Id === ppsEntityConstant.PPSItem || item.Id === ppsEntityConstant.PPSProduct ||
										item.Id === ppsEntityConstant.PPSProductionSet || item.Id === ppsEntityConstant.TransportPackage;
							}
							return false;
						}
					}, {
						key: 'productionplanning-configuration-eventtypeslot-ppsentityreffk-filter',
						fn: function (item, entity) {
							if (item) {
								if (entity && isDateTimeColumn(entity.ColumnSelection)) {
									if(entity.PpsEntityFk === ppsEntityConstant.PPSProduct){
										return item.Id === ppsEntityConstant.PPSItem || item.Id === ppsEntityConstant.PPSProduct || item.Id === ppsEntityConstant.FabricationUnit;
									}
									return item.Id === ppsEntityConstant.PPSItem || item.Id === ppsEntityConstant.PPSProduct;
								} else {
									return item.Id === ppsEntityConstant.PPSItem;
								}
							}
							return false;
						}
					}, {
						key: 'productionplanning-configuration-eventtypeslot-eventtype-filter',
						fn: function (item, entity) {
							if (item) {
								if(entity.PpsEntityRefFk === ppsEntityConstant.FabricationUnit) {
									return item.PpsEntityFk === ppsEntityConstant.FabricationUnit;
								}
								return true;
							}
							return false;
						}
					}, {
						key: 'productionplanning-configuration-clerkrole-ppsentityreffk-filter',
						fn: function (item) {
							if (item) {
								// Engineering Task,  PPS Item
								return item.Id === ppsEntityConstant.EngineeringTask || item.Id === ppsEntityConstant.PPSItem;
							}
							return false;
						}
					}];
			basicsLookupdataLookupFilterService.registerFilter(filters);
		}

		function isDateTimeColumn(column) {
			return column >= 0 && column <= 5;
		}
	}
})(angular);
