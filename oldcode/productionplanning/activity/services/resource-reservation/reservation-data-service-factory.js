/**
 * Created by anl on 2/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';
	var resverationName = 'resource.reservation';

	angular.module(moduleName).service('productionplanningActivityReservedForActivityDataServiceFactory', ReservedForActivityDataServiceFactory);

	ReservedForActivityDataServiceFactory.$inject = ['_', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor',
		'productionplanningActivityResReservationValidationService',
		'productionplanningCommonActivityDateshiftService',
		'productionplanningCommonResReservationProcessor'];

	function ReservedForActivityDataServiceFactory(_, platformDataServiceFactory,
												   platformDataServiceProcessDatesBySchemeExtension,
												   basicsCommonMandatoryProcessor,
												   activityResReservationValidationService, ppsActivityDateshiftService,
		productionplanningCommonResReservationProcessor) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo, parentService) {
			var dsName = self.getDataServiceName(parentService.getModule());

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, parentService);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getDataServiceName = function getDataServiceName(moduleInfo) {
			return _.camelCase(moduleInfo.name) + 'ActivityResReservationDataService';
		};

		this.doCreateDataService = function doCreateDataService(dataServiceName, templInfo, parentService) {
			var reservationDataServiceOption = {
				flatLeafItem: {
					module: angular.module(resverationName),
					serviceName: dataServiceName,
					entityNameTranslationID: 'resource.reservation.entityReservation',
					httpCRUD: {
						route: globals.webApiBaseUrl + templInfo.http + '/',
						endRead: 'getForMntActivity',
						usePostForRead: true,
						initReadData: function (readData) {
							readData.Id = 1;
							readData.PKey1 = parentService.getSelected().PpsEventFk;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}), productionplanningCommonResReservationProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {
								var result = {
									FilterResult: readData.FilterResult,
									dtos: readData || []
								};
								var dataRead = serviceContainer.data.handleReadSucceeded(result, data);
								serviceContainer.service.onDataReaded();
								return dataRead;
							},
							handleCreateSucceeded: function (item) {
								var selectActivity = parentService.getSelected();
								item.ReservedFrom = selectActivity.PlannedStart;
								item.ReservedTo = selectActivity.PlannedFinish;
							}
						}
					},
					//actions: {delete: true, create: true },
					entityRole: {
						leaf: {
							itemName: 'ResReservation',
							parentService: parentService
						}
					}
				}
			};

			/*jshint -W003*/
			var serviceContainer = platformDataServiceFactory.createNewComplete(reservationDataServiceOption);

			serviceContainer.service.onDataReaded = function () {
			};

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ReservationDto',
				moduleSubModule: 'Resource.Reservation',
				validationService: activityResReservationValidationService.getReservationValidationService(serviceContainer.service)
			});

			serviceContainer.service.removedItems = function(requisitionFk) {
				var list = serviceContainer.data.itemList;
				_.forEach(list, function(reservation){
					return reservation.RequisitionFk !== requisitionFk;
				});
				serviceContainer.data.setList(list);
			};

			serviceContainer.service.clearModifications = function(list){
				serviceContainer.data.doClearModifications(list, serviceContainer.data);
			};

			//new virtual dateshift registration!
			if (parentService.getModule().name === 'productionplanning.mounting') {
				ppsActivityDateshiftService.registerToVirtualDateshiftService(parentService.getModule().name,serviceContainer, 'resource.reservation');
			}

			return serviceContainer.service;
		};
	}
})(angular);
