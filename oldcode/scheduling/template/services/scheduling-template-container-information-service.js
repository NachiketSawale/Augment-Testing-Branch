(function (angular) {

	'use strict';
	var schedulingTemplateModule = angular.module('scheduling.calendar');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	schedulingTemplateModule.factory('schedulingTemplateContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector ) {

			var service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				var platformDragdropService = $injector.get('platformDragdropService');
				var config = {};
				switch (guid) {
					case 'AFECDE4A08404395855258B70652D04D': // schedulingTemplateActivityTemplateListController
						config.layout = $injector.get('schedulingTemplateActivityTemplateUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTemplateService';
						config.validationServiceName = 'schedulingTemplateActivityTemplateValidationService';
						config.listConfig = {
							initCalled: false, columns: [],
							type: 'activity',
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							dragDropService: $injector.get('schedulingTemplateClipboardService')
						};
						break;
					case 'AFECDE4A08404395855258B70652D060': // schedulingTemplateActivityTemplateDetailController
						config = $injector.get('schedulingTemplateActivityTemplateUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTemplateService';
						config.validationServiceName = 'schedulingTemplateActivityTemplateValidationService';
						break;
					case 'AFECDE4A08404395855258B70652D04C': // schedulingTemplateActivityTemplateGroupListController
						config.layout = $injector.get('schedulingTemplateActivityTemplateGroupUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateGroupUIStandardService';
						config.dataServiceName = 'schedulingTemplateGrpMainService';
						config.validationServiceName = 'schedulingTemplateGroupValidationService';
						config.listConfig = { initCalled: false, columns: [], parentProp: 'ActivityTemplateGroupFk',  childProp: 'ActivityTemplateGroups',
							type: 'group',
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							dragDropService: $injector.get('schedulingTemplateClipboardService')
						};
						break;
					case 'AFECDE4A08404395855258B70652F060': // schedulingTemplateActivityTmplGrpDetailController
						config = $injector.get('schedulingTemplateActivityTemplateGroupUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateGroupUIStandardService';
						config.dataServiceName = 'schedulingTemplateGrpMainService';
						config.validationServiceName = 'schedulingTemplateGroupValidationService';
						break;
					case 'AFECDE4A08404395855258B70652D050': // schedulingTemplateActivityTmpl2CUGrpListController
						config.layout = $injector.get('schedulingTemplateActivityTmpl2CUGrpUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTmpl2CUGrpUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTmpl2CUGrpService';
						config.validationServiceName = 'schedulingTemplateActivityTmpl2CUGrpValidationService';
						config.listConfig = { initCalled: false, columns: [],
							type: 'tmp2cu',
							dragDropService: $injector.get('schedulingTemplateClipboardService'),
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							idProperty: 'idString'
						};
						break;
					case 'AFECDE4A08404395855258B70652D080': // schedulingTemplateActivityTmpl2CUGrpDetailController
						config = $injector.get('schedulingTemplateActivityTmpl2CUGrpUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTmpl2CUGrpUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityTmpl2CUGrpService';
						config.validationServiceName = 'schedulingTemplateActivityTmpl2CUGrpValidationService';
						break;
					case 'AFECDE4A08404395855258B70652D04E': // schedulingTemplateEventTemplateListController
						config.layout = $injector.get('schedulingTemplateEventTemplateUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateEventTemplateUIStandardService';
						config.dataServiceName = 'schedulingTemplateEventTemplateService';
						config.validationServiceName = 'schedulingTemplateEventTemplateValidationService';
						config.listConfig = { initCalled: false, columns: [],
							type: 'event',
							allowActions: [platformDragdropService.actions.move, platformDragdropService.actions.copy],
							dragDropService:  $injector.get('schedulingTemplateClipboardService')
						};
						break;
					case 'AFECDE4A08404395855258B70652D070': // schedulingTemplateEventTemplateDetailController
						config = $injector.get('schedulingTemplateEventTemplateUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateEventTemplateUIStandardService';
						config.dataServiceName = 'schedulingTemplateEventTemplateService';
						config.validationServiceName = 'schedulingTemplateEventTemplateValidationService';
						break;
					case 'A7F6EEA9117C4F72BB73F88709F6583D': // schedulingTemplatePerformanceRuleListController
						config.layout = $injector.get('schedulingTemplatePerformanceRuleConfigurationService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplatePerformanceRuleConfigurationService';
						config.dataServiceName = 'schedulingTemplatePerformanceRuleService';
						config.validationServiceName = 'schedulingTemplatePerformanceRuleValidationService';
						config.listConfig = { initCalled: false, columns: [], type: 'performancerule', dragDropService: $injector.get('schedulingTemplateClipboardService')
						};
						break;
					case '8CBBCED1A6E142D095F19E0387AF0664': // schedulingTemplatePerformanceRuleDetailController
						config = $injector.get('schedulingTemplatePerformanceRuleConfigurationService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplatePerformanceRuleConfigurationService';
						config.dataServiceName = 'schedulingTemplatePerformanceRuleService';
						config.validationServiceName = 'schedulingTemplatePerformanceRuleValidationService';
						break;
					case '1760df4e1cb24c218e70e3c9f3fbe092': // schedulingTemplateActivityCriteriaListController
						config.layout = $injector.get('schedulingTemplateActivityCriteriaUIStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityCriteriaUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityCriteriaService';
						config.validationServiceName = 'schedulingTemplateActivityCriteriaValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'f4960681c4a84df28dcb77aee3802a9c': // schedulingTemplateActivityCriteriaDetailController
						config = $injector.get('schedulingTemplateActivityCriteriaUIStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityCriteriaUIStandardService';
						config.dataServiceName = 'schedulingTemplateActivityCriteriaService';
						config.validationServiceName = 'schedulingTemplateActivityCriteriaValidationService';
						break;
					case 'e573dacc1e3c4a60aee6043ea736dfdf': // schedulingTemplateActivityTemplateDocumentListController
						config.layout = $injector.get('schedulingTemplateActivityTemplateDocumentUiStandardService').getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateDocumentUiStandardService';
						config.dataServiceName = 'schedulingTemplateDocumentService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '680410db44fb436282e502f7d386c64c': // SchedulingTemplateActivitytemplatedocumentDetailController
						config.layout = $injector.get('schedulingTemplateActivityTemplateDocumentUiStandardService').getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'schedulingTemplateActivityTemplateDocumentUiStandardService';
						config.dataServiceName = 'schedulingTemplateDocumentService';
						config.listConfig = { initCalled: false, columns: [] };
						break;

				}

				return config;
			};

			return service;
		}
	]);
})(angular);
