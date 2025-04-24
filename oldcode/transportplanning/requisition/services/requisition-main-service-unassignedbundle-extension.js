/**
 * Created by zwz on 3/25/2021.
 */
/* global angular*/
(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.requisition';
	/**
	 * @ngdoc service
	 * @name transportplanningRequisitionMainServiceUnassignedBundleExtension
	 * @function
	 * @requires _, $injector, platformRuntimeDataService, moment
	 *
	 * @description
	 * transportplanningRequisitionMainServiceUnassignedBundleExtension provides functions for supporting functionalities(like CreateTrsReqButton) of unassigned bundles container
	 *
	 */
	angular.module(moduleName).factory('transportplanningRequisitionMainServiceUnassignedBundleExtension', Extension);

	Extension.$inject = ['_', '$injector', 'platformRuntimeDataService', 'moment'];

	function Extension(_, $injector, platformRuntimeDataService, moment) {
		var service = {};

		service.addMethods = function addMethods(dataService) {
			// add method `onCreatedTrsReq`

			function copy(trsRequisition, newItem) {
				newItem.ParentPpsEventFk = trsRequisition.ParentPpsEventFk;
				newItem.SiteFk = trsRequisition.SiteFk;

				var validationServ = $injector.get('transportplanningRequisitionValidationService');
				_.each(['ProjectFk', 'LgmJobFk', 'BusinessPartnerFk', 'ContactFk'], function (field) {
					if (newItem[field] !== trsRequisition[field]) {
						newItem[field] = trsRequisition[field];
						var validateFunc = validationServ['validate' + field];
						if (_.isFunction(validateFunc)) {
							var result = validateFunc(newItem, newItem[field], field);
							// temporary code for removing error tips on the UI if validation is passed.
							if (result === true || (result.apply === true && result.valid === true)) {
								return platformRuntimeDataService.applyValidationResult(result, newItem, field);
							}
						}
					}
				});

				_.each(['PlannedStart', 'PlannedFinish', 'EarliestStart', 'LatestStart', 'EarliestFinish', 'LatestFinish', 'PlannedTime'], function (field) {
					if (newItem[field] !== moment(trsRequisition[field])) {
						newItem[field] = moment(trsRequisition[field]);
					}
				});

				dataService.gridRefresh();
			}

			dataService.onCreatedTrsReq = function (trsRequisition, assignBundlesToTrsReq) {
				dataService.createItem().then(function (newItem) {
					copy(trsRequisition, newItem);
					assignBundlesToTrsReq();
				});
			};

		};

		return service;
	}
})(angular);