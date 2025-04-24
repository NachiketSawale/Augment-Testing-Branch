(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';
	var masterModule = angular.module(moduleName);
	var serviceName = 'mountingRequisitionAssignmentService';
	masterModule.factory(serviceName, MountingRequisitionAssignmentService);
	MountingRequisitionAssignmentService.$inject = ['$injector', '$http',
		'productionplanningMountingRequisitionDataService',
		'productionplanningMountingContainerInformationService',
		'resourceReservationPlanningBoardServiceFactory',
		'PlatformMessenger'];

	function MountingRequisitionAssignmentService($injector, $http,
												  productionplanningMountingRequisitionDataService,
												  mountingContainerInformationService,
												  resourceReservationPlanningBoardServiceFactory,
												  PlatformMessenger) {

		var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
		var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;
		var mountingRequisitionMapping = [];

		var container = resourceReservationPlanningBoardServiceFactory.createReservationService({
			initReadData: function initReadData(readData) {
				readData.From = container.data.filter.From;
				readData.To = container.data.filter.To;
				readData.ResourceIdList = container.service.resourceIdList;
				readData.ModuleName = moduleName; // not really necessary - unevaluated here - just to be kept in mind
			},
			moduleName: moduleName,
			// this service will be overridden with the created instance
			serviceName: serviceName,
			itemName: 'PBResReservation',
			parentService: dynamicActivityService,
			dataProcessor: [{
				processItem: function processItem(/*item*/) {
					// optionally set additional info fields 1-3 here by extending json object
					// item.InfoField3 = item.Requisition ? item.Requisition.Project ? item.Requisition.Project.ProjectNo : '' : '';
				}
			}]
		});

		container.service.fireSelectionChanged = container.data.selectionChanged.fire;

		container.service.statusChanged = new PlatformMessenger();

		container.service.fireStatusChanged = function () {
			container.service.statusChanged.fire();
		};

		container.data.onReadSucceeded = function (readData, data) {
			for (var i=0; i < readData.length; i++) {
				if(!_.isUndefined(mountingRequisitionMapping[readData[i].Id])) {
					readData[i].MntRequisitionFk = mountingRequisitionMapping[readData[i].Id].MntRequisitionFk;
					readData[i].ResourceDescription = mountingRequisitionMapping[readData[i].Id].ResourceDescription;
				}
			}
			return container.data.handleReadSucceeded(readData, data);
		};

		container.service.resourceIdList = [];

		container.service.loadLinkedSupplierIds = function loadLinkedSupplierIds() {
			return $http.post(globals.webApiBaseUrl + 'productionplanning/mounting/requisition/getreservations', {
				From: container.data.filter.From,
				To: container.data.filter.To,
				mntRequisitionIds: productionplanningMountingRequisitionDataService.getIdList()
			}).then(function (result) {
				if(result.data.length > 0) {
					var resourceIdList = [];

					container.service.additionalAssignments = _.filter(result.data, function (data) {
						if (_.isNull(data.ResourceFk)) {
							return data;
						} else {
							resourceIdList.push(data);
						}
					});

					container.service.resourceIdList = _.map(resourceIdList, function (data) {
						mountingRequisitionMapping[data.Id] = [];
						mountingRequisitionMapping[data.Id].MntRequisitionFk = data.MntRequisitionFk;
						if(data.Resource && data.Resource.Description) {
							mountingRequisitionMapping[data.Id].ResourceDescription = data.Resource.Description;
						} else {
							mountingRequisitionMapping[data.Id].ResourceDescription = data.Description;
						}

						return data.ResourceFk;
					});
				}
			});
		};

		container.service.additionalAssignments = [];

		return container.service;
	}

})(angular);

