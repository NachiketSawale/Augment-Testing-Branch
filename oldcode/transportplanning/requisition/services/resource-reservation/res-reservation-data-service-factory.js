/**
 * Created by zweig on 02/06/2018.
 */

(function (angular) {
	'use strict';

	var module = 'transportplanning.requisition';
	//var resverationName = 'resource.reservation';

	angular.module(module).factory('transportplanningRequisitionResReservationDataServiceFactory', DataService);

	DataService.$inject = ['_', 'basicsLookupdataLookupDescriptorService', 'platformDataServiceProcessDatesBySchemeExtension',
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor','productionplanningActivityResReservationValidationService',
		'productionplanningCommonActivityDateshiftService', 'productionplanningCommonResReservationProcessor'];

	function DataService(_, basicsLookupdataLookupDescriptorService, platformDataServiceProcessDatesBySchemeExtension,
						 platformDataServiceFactory, basicsCommonMandatoryProcessor,productionplanningMountingResReservationValidationService, activityDateshiftService, productionplanningCommonResReservationProcessor) {
		var serviceFactory = {};
		var serviceCache = {};

		//get service or create service by module name
		serviceFactory.getService = function getService(templInfo, parentService) {
			if (!serviceCache[templInfo.id]) {
				serviceCache[templInfo.id] = serviceFactory.createNewComplete(templInfo, parentService);
			}
			return serviceCache[templInfo.id];
		};

		serviceFactory.createNewComplete = function (templInfo, parentService) {

			var serviceOption = {
				flatLeafItem: {
					module: angular.module(module),
					serviceName: parentService.getServiceName() + 'ResReservationDataService',
					entityNameTranslationID: 'transportplanning.requisition.resource.reservation.listTitle',
					httpCreate: {route: globals.webApiBaseUrl + 'resource/reservation/'},
					httpRead: {
						route: globals.webApiBaseUrl + 'transportplanning/requisition/trsgoods/',
						endRead: 'listResReservation'
					},
					entityRole: {
						leaf: {
							itemName: 'ResReservation',
							parentService: parentService,
							parentFilter: 'trsRequisitionId'
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}),productionplanningCommonResReservationProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								// set additional field TrsRequisitionFk for each items, it uses for setting filter of lookup config of column RequisitionFk of Reservation entity, just for fixing issue of #113473 (by zwz 2020/9/4)
								if (readData.length > 0) {
									var trsRequisitionId = data.filter.substring(data.filter.lastIndexOf('=')+1);
									if (!_.isNil(trsRequisitionId) && trsRequisitionId !== '') {
										angular.forEach(readData, function (item) {
											item.TrsRequisitionFk = trsRequisitionId;
										});
									}
								}

								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								basicsLookupdataLookupDescriptorService.attachData(readData);
								var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
								serviceContainer.service.onDataReaded();
								return dataRead;
							},
							handleCreateSucceeded: function (item) {
								// set additional field TrsRequisitionFk for new created item, it uses for setting filter of lookup config of column RequisitionFk of Reservation entity, just for fixing issue of #113473 (by zwz 2020/9/7)
								var selectedTrsRequisition = parentService.getSelected();
								item.TrsRequisitionFk = selectedTrsRequisition.Id;

								if(parentService.parentService()) {
									var selectActivity = parentService.parentService().getSelected();
									item.ReservedFrom = selectActivity.PlannedStart;
									item.ReservedTo = selectActivity.PlannedFinish;
								}
							}
						}
					}
					// ,
					// actions: {
					// 	create: 'flat',
					// 	delete: {}
					// }
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			// if dataservice is in foreing module: set distinct dateshift id!
			let dataserviceModuleName = serviceContainer.service.getModule().name;
			if(_.includes(['productionplanning.mounting'], dataserviceModuleName)) {
				serviceContainer.service.dateshiftId = 'trs.resource.reservation';
			}

			//serviceContainer.data.usesCache = false;
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ReservationDto',
				moduleSubModule: 'Resource.Reservation',
				validationService: productionplanningMountingResReservationValidationService.getReservationValidationService(
					serviceContainer.service)
			});

			serviceContainer.service.canCreate = function () {
				var hlp = parentService.getSelected() && !parentService.isSelectedItemAccepted();
				return _.isNil(hlp) ? false : hlp;
			};

			serviceContainer.service.canDelete = function () {
				var hlp = serviceContainer.service.getSelected() && parentService.getSelected() && !parentService.isSelectedItemAccepted();
				return _.isNil(hlp) ? false : hlp;
			};

			serviceContainer.service.onDataReaded = function () {};

			serviceContainer.service.clearModifications = function(list){
				serviceContainer.data.doClearModifications(list, serviceContainer.data);
			};

			//new virtual dateshift registration!
			activityDateshiftService.registerToVirtualDateshiftService(parentService.getModule().name,serviceContainer, 'resource.reservation');

			return serviceContainer.service;
		};

		return serviceFactory;
	}
})(angular);
