/**
 * Created by zwz on 2022/5/16.
 */

(function (angular) {
	/* global globals, _ */
	'use strict';
	var moduleName = 'productionplanning.activity';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningActivityTrsRequisitionDataServiceCreationExtension
	 * @function
	 * @description
	 * productionplanningActivityTrsRequisitionDataServiceCreationExtension provides relative creation functionality for activity trsRequisition data service in MntActivity/Mounting module
	 */
	module.service('productionplanningActivityTrsRequisitionDataServiceCreationExtension', Extension);
	Extension.$inject = ['$http'];

	function Extension($http) {
		var defaultTrsReqDateType = 0;
		$http.get(globals.webApiBaseUrl + 'basics/common/systemoption/inittrsreqdatetype').then(function(response){
			defaultTrsReqDateType = response.data;
		});

		this.handleCreateSucceeded = function (item, data, parentService) {
			if (_.isNull(item.MntActivityFk) || _.isUndefined(item.MntActivityFk)) {
				var activity = parentService.getSelected();
				if (activity) {
					item.MntActivityFk = activity.Id;

					// zwz  3/23/2021 11:02:06 AM
					// Defect: #118909 Businesspartner of Job is missing after creating trs-requisition
					// fix issue about missing setting field ContactFk and BusinessPartnerFk by Job when create new trs-requisition in Mounting-Activity module and Mounting module
					if(!_.isNil(activity.LgmJobFk)) {
						$http.get(globals.webApiBaseUrl + 'logistic/job/getbyid?jobId=' + activity.LgmJobFk).then(function (respond) {
							if (respond && respond.data) {
								item.LgmJobFk = activity.LgmJobFk;
								item.ContactFk = respond.data.DeliveryAddressContactFk;
								item.BusinessPartnerFk = respond.data.BusinessPartnerFk;
								// refresh grid
								data.dataModified.fire();
							}
						});
					}

					// pep  12/3/2020 5:27:28 PM
					// #115712 - Prefill date when creating a Transport Requisition under a Mounting Activity
					// Prefill the date of transport requisition by the system option.
					if (defaultTrsReqDateType === 1) {
						item.PlannedTime = activity.PlannedStart;
						item.PlannedStart = activity.PlannedStart;
						item.PlannedFinish = activity.PlannedFinish;
						item.EarliestStart = activity.EarliestStart;
						item.EarliestFinish = activity.EarliestFinish;
						item.LatestStart = activity.LatestStart;
						item.LatestFinish = activity.LatestFinish;
					}
				}
			}

			if (item.ProjectFk === 0) {
				item.ProjectFk = parentService.getSelected().ProjectId;
			}
		};

	}
})(angular);
