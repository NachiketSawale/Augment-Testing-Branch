(function (angular) {

	'use strict';
	var schedulingTemplateGrpModule = angular.module('scheduling.templategroup');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateGrpContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingTemplateGrpModule.factory('schedulingTemplategroupContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var platformDragdropService = $injector.get('platformDragdropService');
				var config = {};
				var layServ = null;
				switch (guid) {
					case '59E580ECAB1F42608B3AB858DCBC22B0': // schedulingTemplateActivityTmplGrpEditListController
						layServ = $injector.get('schedulingTemplateActivityTmplGrpEditUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTmplGrpEditUIStandardService';
						config.dataServiceName = 'schedulingTemplateGrpEditService';
						config.validationServiceName = 'schedulingTemplateActivityTemplateGroupValidationService';
						config.listConfig = { initCalled: false, columns: [], parentProp: 'ActivityTemplateGroupFk',  childProp: 'ActivityTemplateGroups',
							type: 'group-edit',
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							dragDropService:  $injector.get('schedulingTemplateGrpClipboardService')
						};
						break;
					case '9F6BDD0C5B51423CA2BCA64FE103187C': // schedulingTemplateActivityTmplGrpEditDetailController
						layServ = $injector.get('schedulingTemplateActivityTmplGrpEditUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTmplGrpEditUIStandardService';
						config.dataServiceName = 'schedulingTemplateGrpEditService';
						config.validationServiceName = 'schedulingTemplateActivityTemplateGroupValidationService';
						break;
					case '038BAA2DC7A94E56900B1C3F21FFC7AF': // schedulingTemplateActivityTmplGrp2CUGrpListController
						layServ = $injector.get('schedulingTemplateActivityTmplGrp2CUGrpUIStandardService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTmplGrp2CUGrpUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTmplGrp2CUGrpService';
						config.validationServiceName = 'schedulingTemplateActivityTmplGrp2CUGrpValidationService';
						config.listConfig = { initCalled: false, columns: [],
							type: 'grp2cu',
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							dragDropService: $injector.get('schedulingTemplateGrpClipboardService')
						};
						break;
					case '54259D07F8CC42C7AD5B3CD44D39E3E1': // schedulingTemplateActivityTmplGrp2CUGrpDetailController
						layServ = $injector.get('schedulingTemplateActivityTmplGrp2CUGrpUIStandardService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTmplGrp2CUGrpUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTmplGrp2CUGrpService';
						config.validationServiceName = 'schedulingTemplateActivityTmplGrp2CUGrpValidationService';
						break;


				}
				return config;
			};

			return service;
		}
	]);
})(angular);