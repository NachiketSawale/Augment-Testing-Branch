/**
 * Created by baf on 26.09.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	let schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainBaselineRelationshipService
	 * @function
	 *
	 * @description
	 * schedulingMainBaselineRelationshipService provides all relationships for a given set of activities
	 */
	schedulingMainModule.factory('schedulingMainBaselineRelationshipService', schedulingMainBaselineRelationshipService);

	schedulingMainBaselineRelationshipService.$inject = [
		'$http', '_', 'platformDataServiceEntityRoleExtension', 'platformDataServiceDataProcessorExtension', 'platformDataServiceModificationTrackingExtension',
		'basicsCommonMandatoryProcessor', 'platformDataServiceFactory', 'schedulingMainService', 'schedulingMainActivityLookupDataProviderService', 'schedulingMainConstantValues',
		'$q', '$injector', 'platformRuntimeDataService', 'platformDataValidationService', 'schedulingMainActivityBaseLineComparisonService'
	];

	function schedulingMainBaselineRelationshipService(
		$http, _, platformDataServiceEntityRoleExtension, platformDataServiceDataProcessorExtension, platformDataServiceModificationTrackingExtension,
		basicsCommonMandatoryProcessor, platformDataServiceFactory, schedulingMainService, schedulingMainActivityLookupDataProviderService, schedulingMainConstantValues,
		$q, $injector, platformRuntimeDataService, platformDataValidationService, schedulingMainActivityBaseLineComparisonService) {
		var serviceContainer;

		var schedulingMainRelationshipServiceOption = {
			module: schedulingMainModule,
			serviceName: 'schedulingMainBaselineRelationshipService',
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

		serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRelationshipServiceOption);
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

		serviceContainer.data.onDataFilterChanged = function onDataFilterChanged() {
			serviceContainer.data.listLoaded.fire();
		};

		schedulingMainService.registerSelectionChanged(serviceContainer.data.onDataFilterChanged);

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
