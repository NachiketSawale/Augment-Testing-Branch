(function (angular) {
	'use strict';
	var module = angular.module('resource.requisition');

	module.service('resourceRequisitionPlanningBoardServiceFactory', ResourceRequisitionPlanningBoardServiceFactory);

	ResourceRequisitionPlanningBoardServiceFactory.$inject = ['platformPlanningBoardServiceFactoryProviderService', 'basicsCommonMandatoryProcessor'];

	function ResourceRequisitionPlanningBoardServiceFactory(platformPlanningBoardServiceFactoryProviderService, mandatoryProcessor) {

		var self = this;

		self.createRequisitionService = function createService(options) {

			var factoryOptions = platformPlanningBoardServiceFactoryProviderService.createDemandCompleteOptions({
				baseSettings: options,
				module: module,
				translationId: 'resource.requisition.entityRequisition',
				http: platformPlanningBoardServiceFactoryProviderService.createHttpOptions({
					routePostFix: 'resource/requisition/',
					endRead: 'getForPlanningBoard',
					endDelete: 'multidelete',
					usePostForRead: true
				}),
				processor: [platformPlanningBoardServiceFactoryProviderService.createDateProcessor('RequisitionDto', 'Resource.Requisition')],
				role: {
					itemName: 'Requisitions',
					moduleName: 'cloud.desktop.moduleDisplayNameResourceRequisition',
					addToLastObject: true,
					useIdentification: true
				}
			});

			var serviceContainer = platformPlanningBoardServiceFactoryProviderService.createFactory(factoryOptions);
			serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			    mustValidateFields: true,
			    typeName: 'RequisitionDto',
				moduleSubModule: 'Resource.Requisition',
				validationService: 'resourceRequisitionValidationService'
			});

			return serviceContainer;
		};
	}
})(angular);
