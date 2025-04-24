(function (angular) {
	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	/**
	 * @ngdoc service
	 * @name procurementCommonMilestoneDataService
	 * @function
	 * @requireds milestonesDataService
	 *
	 * @description Provide milestones data service
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.common').factory('procurementCommonMilestoneDataService',
		['procurementCommonDataServiceFactory', 'procurementContextService',
			function (dataServiceFactory, moduleContext) {
				function constructorFn(parentService) {
					// service configuration
					var serviceContainer,
						tmpServiceInfo = {
							flatLeafItem: {
								httpCRUD: {
									route: globals.webApiBaseUrl + 'procurement/common/prcmilestone/'
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											creationData.MainItemId = parentService.getSelected().PrcHeaderEntity.Id;
										}
									}
								},
								entityRole: {leaf: {itemName: 'PrcMilestone', parentService: parentService}}
							}
						};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo, {
						date: ['Milestone'],
						overview: {
							key: moduleContext.overview.keys.milestone
						}
					});
					var setReadonlyor = function () {
						var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
						if (getModuleStatusFn) {
							var status = getModuleStatusFn();
							if(status){
								return !(status.IsReadOnly || status.IsReadonly);
							}
						}
						return false;
					};
					var canCreate = serviceContainer.service.canCreate;
					serviceContainer.service.canCreate = function () {
						return canCreate() && setReadonlyor();
					};
					var canDelete = serviceContainer.service.canDelete;
					serviceContainer.service.canDelete = function () {
						return canDelete() && setReadonlyor();
					};

					return serviceContainer.service;
				}
				return dataServiceFactory.createService(constructorFn, 'procurementCommonMilestoneDataService');
			}]);

})(angular);