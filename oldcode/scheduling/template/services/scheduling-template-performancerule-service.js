/**
 * Created by leo on 23.03.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var templateModule = angular.module('scheduling.template');

	/**
	 * @ngdoc service
	 * @name schedulingTemplatePerformanceRuleService
	 * @function
	 *
	 * @description
	 * schedulingTemplatePerformanceRuleService is a data service for managing performance rules in the template module.
	 */
	templateModule.factory('schedulingTemplatePerformanceRuleService', ['schedulingTemplateActivityTemplateService', 'platformDataServiceFactory',

		function (schedulingTemplateActivityTemplateService, platformDataServiceFactory) {

			var tmpServiceInfo = {
				flatLeafItem: {
					module: templateModule,
					serviceName: 'schedulingTemplatePerformanceRuleService',
					entityNameTranslationID: 'scheduling.template.translationDescRules',
					httpCreate: { route: globals.webApiBaseUrl + 'scheduling/template/performancerule/', endCreate: 'create' },
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/template/performancerule/',  endCreate:'list'},
					presenter: { list: {
						initCreationData: function initCreationData(creationData) {
							creationData.PKey1 = schedulingTemplateActivityTemplateService.getSelected().Id;
						}}},
					entityRole: { leaf: { itemName: 'PerformanceRule', parentService: schedulingTemplateActivityTemplateService } },
					translation: { uid: 'schedulingTemplatePerformanceRuleService',
						title: 'scheduling.template.translationDescPerformance',
						columns: [{ header: 'cloud.common.entityDescription', field: 'DescriptionInfo' }],
						dtoScheme: {
							typeName: 'PerformanceRuleDto',
							moduleSubModule: 'Scheduling.Template'
						}
					}
				} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(tmpServiceInfo);

			return serviceContainer.service;
		}
	]);
})();
