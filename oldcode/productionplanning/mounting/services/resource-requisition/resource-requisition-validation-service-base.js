/* globals _ */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName = 'productionplanning.mounting';
	angular.module(moduleName).service('productionplanningResourceRequisitionValidationServiceBase', ProductionplanningResourceRequisitionValidationServiceBase);
	ProductionplanningResourceRequisitionValidationServiceBase.$inject = ['$injector','resourceRequisitionValidationServiceFactory', 'productionplanningCommonActivityDateshiftService'];
	function ProductionplanningResourceRequisitionValidationServiceBase($injector, resourceRequisitionValidationServiceFactory, activityDateshiftService) {

		var self = this;
		var instances = [];

		self.getRequisitionValidationService = function(dataService) {

			var srv = instances[dataService.getServiceName()];
			if (!_.isNil(srv)) {
				return srv;
			}

			srv = {};

			resourceRequisitionValidationServiceFactory.createRequisitionValidationService(
				srv, dataService);


			srv.baseValidateUomFkImpl = srv.validateUomFk;
			srv.validateUomFk = function (entity, value, model) {
				return srv.baseValidateUomFkImpl(entity, value === 0 ? null : value, model);
			};
			/*
			srv.baseValidateJobFk = srv.validateJobFk;
			srv.validateJobFk = function validateJobFkImpl(entity, value, model) {
				return srv.baseValidateJobFk(entity, value === 0 ? null : value, model);
			};
			*/
			// Fix console error "Uncaught TypeError: t.baseValidateJobFk is not a function".This error is caused by code changed of revision 559489. (by zwz 2020/2/18)
			srv.baseAsyncValidateJobFk = srv.asyncValidateJobFk;
			srv.asyncValidateJobFk = function asyncValidateJobFkImpl(entity, value, model) {
				return srv.baseAsyncValidateJobFk(entity, value === null ? 0 : value, model);
			};

			let dataserviceModuleName = dataService.getModule().name;
			if (_.includes(['productionplanning.mounting', 'transportplanning.requisition'], dataserviceModuleName)) {
				activityDateshiftService.extendDateshiftActivityValidation(srv, dataService, 'resource.requisition', dataService.dateshiftId);
			}

			instances[dataService.getServiceName()] = srv;
			return srv;
		};



	}
})(angular);
