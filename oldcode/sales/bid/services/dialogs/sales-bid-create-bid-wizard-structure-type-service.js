/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name sales-bid-create-bid-wizard-structure-type-service.js
	 * @function
	 *
	 * @description
	 * sales-bid-create-bid-wizard-structure-type-service.js is the data service to gather the structure type items based upon which the wizard generates bid boqs
	 */
	angular.module('sales.bid').factory('salesBidCreateBidWizardStructureTypeService', ['_', 'platformLookupDataServiceFactory', '$injector', '$q',

		function (_, platformLookupDataServiceFactory, $injector, $q) {

			var salesBidCreateBidWizardStructureTypeServiceConfig = {
				httpRead: { route: '', endPointRead: '' }, // Only to fulfill the interface -> calls are redirected according to given structure type
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}],
				filterParam: 'structureType' // This param is only needed to be able to set a filter via setFilter. The filter is given by a special filter object that helps to create a hash for the lookup cache.
			};

			var filterObject = {
				selectedTypeId: -1,
				selectedProjectId: -1
			};

			var container = platformLookupDataServiceFactory.createInstance(salesBidCreateBidWizardStructureTypeServiceConfig);

			if(container) {

				if(container.data && container.service) {
					// Add functions to externally be able to adjust type id and project fk
					container.service.setStructureTypeId = function setStructureTypeId(typeId) {
						filterObject.selectedTypeId = typeId;
					};

					container.service.setProjectId = function setProjectId(projectId) {
						filterObject.selectedProjectId = projectId;
					};

					// Set the filter object to be able to do proper caching
					container.service.setFilter(filterObject);
				}

				if(container.data && container.data.readData) {
					// Replace original readData with new version redirecting the http calls to the corresponding data sources determined by the given structure type
					container.data.readData = function readData(/* filterData */) {

						var deferred = $q.defer();
						var mapToSimpleItem = null;

						// React on changing the structure tpye entry in the corresponding select control
						var structureTypeService = null;

						// First determine corresponding data service
						switch(filterObject.selectedTypeId) {
							case 1: // Project BoQ
								structureTypeService = angular.copy($injector.get('boqProjectService'));
								mapToSimpleItem = function(loadedItems) {
									var simpleItems = null;
									if(loadedItems && _.isArray(loadedItems)) {
										simpleItems = _.map(loadedItems, function(item) {
											return {Id: item.BoqHeader.Id, Code: item.BoqRootItem.Reference, DescriptionInfo: item.BoqRootItem.BriefInfo};
										});
									}

									return simpleItems;
								};
								break;
							case 2: // Project Estimate
								structureTypeService = angular.copy($injector.get('estimateProjectService'));
								mapToSimpleItem = function(loadedItems) {
									var simpleItems = null;
									if(loadedItems && _.isArray(loadedItems)) {
										simpleItems = _.map(loadedItems, function(item) {
											return {Id: item.EstHeader.Id, Code: item.EstHeader.Code, DescriptionInfo: item.EstHeader.DescriptionInfo};
										});
									}

									return simpleItems;
								};
								break;
							case 3: // Project schedule
								structureTypeService = angular.copy($injector.get('schedulingScheduleEditService'));
								mapToSimpleItem = function(/* loadedItems */) {
									var simpleItems = null;
									/* if (loadedItems && _.isArray(loadedItems)) {
										simpleItems = _.map(loadedItems, function (item) {
											return { Id: item.EstHeader.Id, Code: item.EstHeader.Code, DescriptionInfo: item.EstHeader.DescriptionInfo };
										});
									} */

									return simpleItems;
								};
								break;
							case 4: // Project Cost Codes
								structureTypeService = angular.copy($injector.get('projectCostCodesMainService'));
								mapToSimpleItem = function(/* loadedItems */) {
									var simpleItems = null;
									/* if (loadedItems && _.isArray(loadedItems)) {
										simpleItems = _.map(loadedItems, function (item) {
											return { Id: item.EstHeader.Id, Code: item.EstHeader.Code, DescriptionInfo: item.EstHeader.DescriptionInfo };
										});
									} */

									return simpleItems;
								};
								break;
						}

						structureTypeService.setFilter('projectId=' + filterObject.selectedProjectId);
						structureTypeService.load().then(function(response) {
							var mappedItems = mapToSimpleItem(response);
							// Wrap into return object that fulfills the interface of the underlying lookup functionality
							var myResponse = {data: mappedItems};
							deferred.resolve(myResponse);
						});

						return deferred.promise;
					};
				}
			}

			return container.service;
		}]);
})(angular);
