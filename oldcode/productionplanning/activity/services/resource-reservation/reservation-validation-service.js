/* globals _ */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceReservationValidationService
	 * @description provides validation methods for reservation
	 */
	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).service('productionplanningActivityResReservationValidationService', ActivityResReservationValidationService);
	ActivityResReservationValidationService.$inject = ['$injector','resourceReservationValidationServiceFactory', 'productionplanningCommonActivityDateshiftService'];
	function ActivityResReservationValidationService($injector, resourceReservationValidationServiceFactory, activityDateshiftService) {

		var self = this;
		var instances = [];

		self.getReservationValidationService = function(dataService) {

			var srv = instances[dataService.getServiceName()];
			if (!_.isNil(srv)) {
				return srv;
			}

			srv = {};

			resourceReservationValidationServiceFactory.createReservationValidationService(
				srv, dataService);


			srv.baseValidateUomFkImpl = srv.validateUomFk;
			srv.validateUomFk = function (entity, value, model) {
				return srv.baseValidateUomFkImpl(entity, value === 0 ? null : value, model);
			};

			srv.baseValidateResourceFk = srv.validateResourceFk;
			srv.validateResourceFk = function (entity, value, model) {
				return srv.baseValidateResourceFk(entity, value === 0 ? null : value, model);
			};

			srv.baseValidateRequisitionFk = srv.validateRequisitionFk;
			srv.validateRequisitionFk = function (entity, value, model) {
				return srv.baseValidateRequisitionFk(entity, value === 0 ? null : value, model);
			};


			let dataserviceModuleName = dataService.getModule().name;
			if (_.includes(['productionplanning.mounting', 'transportplanning.requisition'], dataserviceModuleName)) {
				activityDateshiftService.extendDateshiftActivityValidation(srv, dataService, 'resource.reservation', dataService.dateshiftId);
			}

			instances[dataService.getServiceName()] = srv;
			return srv;
		};



	}
})(angular);
