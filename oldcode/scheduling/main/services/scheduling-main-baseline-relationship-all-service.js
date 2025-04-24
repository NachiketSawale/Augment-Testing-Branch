/**
 * Created by baf on 26.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainBaselineRelationshipAllService
	 * @function
	 *
	 * @description
	 * schedulingMainBaselineRelationshipAllService provides all relationships for a given set of activities
	 */
	schedulingMainModule.factory('schedulingMainBaselineRelationshipAllService', schedulingMainBaselineRelationshipAllService);

	schedulingMainBaselineRelationshipAllService.$inject = [
		'$http', '_', 'platformDataServiceEntityRoleExtension', 'platformDataServiceDataProcessorExtension', 'platformDataServiceModificationTrackingExtension',
		'basicsCommonMandatoryProcessor', 'platformDataServiceFactory', 'schedulingMainService', 'schedulingMainActivityLookupDataProviderService', 'schedulingMainConstantValues',
		'$q', '$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'schedulingMainActivityBaseLineComparisonService'
	];

	function schedulingMainBaselineRelationshipAllService(
		$http, _, platformDataServiceEntityRoleExtension, platformDataServiceDataProcessorExtension, platformDataServiceModificationTrackingExtension,
		basicsCommonMandatoryProcessor, platformDataServiceFactory, schedulingMainService, schedulingMainActivityLookupDataProviderService, schedulingMainConstantValues,
		$q, $injector, platformRuntimeDataService, platformDataValidationService, schedulingMainActivityBaseLineComparisonService) {
		var serviceContainer;

		function getActivityIds(readData) {
			var immediateresult = schedulingMainService.getList();
			var result;

			if (!immediateresult || immediateresult.length === 0) {
				readData.filter = [-1]; // Workaround for empty request
				return;
			}
			result = immediateresult.map(function getId(item) {
				return item.Id;
			});
			result = _.compact(result); // throw out null values
			readData.filter = result;
		}

		var schedulingMainRelationshipAllServiceOption = {
			module: schedulingMainModule,
			serviceName: 'schedulingMainBaselineRelationshipAllService',
			entityNameTranslationID: 'scheduling.main.entityBaselineRelationship',
			dataProcessor: [schedulingMainActivityLookupDataProviderService],
			actions: {
				delete: false,
				create: false
			},
			entityRole: {
				leaf: {
					itemName: 'Relationships',
					parentService: schedulingMainService
				}
			},
			presenter: {
				list: {}
			}
		};

		serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRelationshipAllServiceOption);
		serviceContainer.data.doNotLoadOnSelectionChange = true;
		serviceContainer.data.createPredeccessorRequested = false;
		var service = serviceContainer.service;

		serviceContainer.data.clearContent = function clearListContent() {
		};

		serviceContainer.data.handleReadSucceeded = function onReadAllRelationshipsSucceeded(result, data) {
			data.itemList.length = 0;
			_.forEach(result, function (entity) {
				schedulingMainService.processActivity(entity.ChildActivityFk);
				data.itemList.push(entity);
			});

			platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

			data.listLoaded.fire(result);
		};

		serviceContainer.data.loadAllBaselineRelationships = function loadAllBaselineRelationships() {
			var data = serviceContainer.data;
			var httpReadRoute = globals.webApiBaseUrl + 'scheduling/main/relationship/listallbaseline';

			var readData = {};
			readData.filter = '';
			getActivityIds(readData);

			return $http.post(httpReadRoute, readData)
				.then(function (response) {
					return data.handleReadSucceeded(response.data, data);
				});
		};

		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};

		// schedulingMainService.registerListLoaded(serviceContainer.data.loadAllBaselineRelationships);
		// schedulingMainService.registerSelectionChanged(serviceContainer.data.onDataFilterChanged);

		service.getFilteredList = function getFilteredList() {
			var result = [];
			var selectedItem = schedulingMainActivityBaseLineComparisonService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ParentActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getSuccessorList = function getSuccessorList() {
			var result = [];
			var selectedItem = schedulingMainActivityBaseLineComparisonService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ParentActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getPredecessorList = function getPredecessorList() {
			var result = [];
			var selectedItem = schedulingMainActivityBaseLineComparisonService.getSelected();
			if (selectedItem && selectedItem.Id) {
				result = _.filter(serviceContainer.data.itemList, {
					ChildActivityFk: selectedItem.Id
				});
			}
			return result;
		};

		service.getPredecessor = function getPredecessor(activityId) {
			return _.filter(serviceContainer.data.itemList, {
				ParentActivityFk: activityId
			});
		};

		serviceContainer.service.initService = _.noop; // Just one method doing nothing

		return serviceContainer.service;
	}
})(angular);
