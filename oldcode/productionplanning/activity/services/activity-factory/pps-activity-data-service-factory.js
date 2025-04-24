/**
 * Created by anl on 4/11/2018.
 */

(function (angular) {
	'use strict';
	/*global moment*/
	var module = 'productionplanning.activity';

	angular.module(module).service('productionplanningActivityActivityDataServiceFactory', ActivityDataServiceFactory);

	ActivityDataServiceFactory.$inject = ['basicsLookupdataLookupDescriptorService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory',
		'basicsLookupdataLookupFilterService',
		'basicsCommonMandatoryProcessor',
		'productionpalnningActivityActivityValidationFactory',
		'platformDataServiceModificationTrackingExtension',
		'$http',
		'$translate',
		'platformRuntimeDataService',
		'productionplanningCommonActivityDateshiftService'];

	function ActivityDataServiceFactory(
		basicsLookupdataLookupDescriptorService,
		platformDataServiceProcessDatesBySchemeExtension,
		platformDataServiceFactory,
		basicsLookupdataLookupFilterService,
		basicsCommonMandatoryProcessor,
		activityValidationFactory,
		platformDataServiceModificationTrackingExtension,
		$http,
		$translate,
		platformRuntimeDataService,
		ppsActivityDateshiftService) {

		var serviceCache = {};
		var self = this;

		//get service or create service by data-service name
		this.getService = function (templInfo, parentService) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo.moduleName, parentService);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.getDataServiceName = function (templInfo) {
			return _.camelCase(templInfo.moduleName) + 'ActivityDataService';
		};

		this.doCreateDataService = function (serviceName, moduleName, parentService) {
			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				{
					typeName: 'ActivityDto',
					moduleSubModule: 'ProductionPlanning.Activity'
				}
			);

			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.activity.entityActivity',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/activity/activity/',
						endRead: 'list',
						endDelete: 'multidelete'

					},
					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						node: {
							itemName: 'Activity',
							parentService: parentService,
							parentFilter: 'MntRequisitionFk'
						}
					},
					dataProcessor: [dateProcessor,
						{
							processItem: function (item) {
								var fields = [
									{field: 'DateshiftMode', readonly: item.Version > 0},
									{field: 'Code', readonly: item.Version === 0}
								];
								platformRuntimeDataService.readonly(item, fields);
								if(item.Version === 0){
									// set code
									item.Code = $translate.instant('cloud.common.isGenerated');
								}
							}
						}],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								basicsLookupdataLookupDescriptorService.attachData(readData.Lookups);
								var result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								return serviceContainer.data.handleReadSucceeded(result, data);
							},
							handleCreateSucceeded: function (item) {
								item.ProjectId = parentService.getSelected().ProjectFk;
								if (item.Version === 0 && item.EventTypeFk === 0) {
									item.PlannedStart = null;
									item.PlannedFinish = null;
									item.EarliestStart = null;
									item.EarliestFinish = null;
									item.LatestStart = null;
									item.LatestFinish = null;
								}
							},
							initCreationData: function (creationData) {
								creationData.Pkey1 = parentService.getSelected().Id;

							}
						}
					},
					translation: {
						uid: serviceName,
						title: 'productionplanning.activity.entityActivity',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'ActivityDto',
							moduleSubModule: 'ProductionPlanning.Activity',
						},
					}
				}
			};

			var filters = [{
				key: 'productionplanning-mounting-activity-eventtype-filter',

				fn: function (item) {
					if (item) {
						return item.PpsEntityFk !== null && item.PpsEntityFk === 1;
					}
					return false;
				}
			}];


			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			serviceContainer.data.forceNodeItemCreation = true;

			var validationService = activityValidationFactory.createActivityValidationService(serviceContainer.service);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ActivityDto',
				moduleSubModule: 'ProductionPlanning.Activity',
				validationService: validationService
			});

			var service = serviceContainer.service;

			serviceContainer.service.registerFilter = function () {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			serviceContainer.service.unregisterFilter = function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};


			service.updateActivity = function (item) {
				$http.get(globals.webApiBaseUrl + 'productionplanning/activity/activity/updateactivity?PpsEventTypeFk=' + item.EventTypeFk).then(function (respond) {
					if (respond.data !== '') {
						var activity = respond.data;
						item.PlannedStart = moment.utc(activity.PlannedStart);
						item.PlannedFinish = moment.utc(activity.PlannedFinish);
						item.EarliestStart = moment.utc(activity.EarliestStart);
						item.EarliestFinish = moment.utc(activity.EarliestFinish);
						item.LatestStart = moment.utc(activity.LatestStart);
						item.LatestFinish = moment.utc(activity.LatestFinish);
						validationService.validateEntity(item);
						platformDataServiceModificationTrackingExtension.markAsModified(service, item, serviceContainer.data);
					}
				});
			};

			//new virtual dateshift registration!
			if (moduleName === 'productionplanning.mounting') {
				ppsActivityDateshiftService.registerToVirtualDateshiftService(moduleName, serviceContainer, 'productionplanning.activity');
			}

			return service;
		};
	}
})(angular);
