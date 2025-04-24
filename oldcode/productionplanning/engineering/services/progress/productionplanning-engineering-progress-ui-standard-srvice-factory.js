/**
 * Created by zov on 27/06/2019.
 */
(function () {
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.engineering';
	angular.module(moduleName).factory('ppsEngineeringProgressUIStandardServiceFactory', ppsEngineeringProgressUIStandardServiceFactory);
	ppsEngineeringProgressUIStandardServiceFactory.$inject = ['platformUIConfigInitService',
		'productionplanningEngineeringTranslationService',
		'ppsCommonLayoutOverloadService',
		'ppsEngineeringProgressLayoutFactory'];
	function ppsEngineeringProgressUIStandardServiceFactory(platformUIConfigInitService,
															productionplanningEngineeringTranslationService,
															ppsCommonLayoutOverloadService,
															ppsEngineeringProgressLayoutFactory) {
		function createUIService(layout) {
			var service = {};
			platformUIConfigInitService.createUIConfigurationService({
				service: service,
				layout: layout,
				dtoSchemeId: {
					moduleSubModule: 'ProductionPlanning.Engineering',
					typeName: 'EngDrwProgReportDto'
				},
				translator: productionplanningEngineeringTranslationService
			});

			ppsCommonLayoutOverloadService.findAndTranslate(service, 'engdrawingfkdescription',
				'productionplanning.engineering.engDrawingDescription');
			ppsCommonLayoutOverloadService.findAndTranslate(service, 'engtaskfkdescription',
				'productionplanning.engineering.engTaskDescription');

			return service;
		}

		function createUIService4Drawing() {
			var layout = ppsEngineeringProgressLayoutFactory.createProgressLayout4Drawing();
			return createUIService(layout);
		}

		function createUIService4Task() {
			var layout = ppsEngineeringProgressLayoutFactory.createProgressLayout4Task();
			return createUIService(layout);
		}

		return {
			createUIService4Drawing: createUIService4Drawing,
			createUIService4Task: createUIService4Task
		};

	}
})();