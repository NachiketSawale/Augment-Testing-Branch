/**
 * Created by leo on 18.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateModule = angular.module('scheduling.template');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateEventTemplateService
	 * @function
	 *
	 * @description
	 *  is the data service for all EventTemplate related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateModule.factory('schedulingTemplateEventTemplateService', ['platformDataServiceFactory', 'schedulingTemplateActivityTemplateService',

		function (platformDataServiceFactory, schedulingTemplateActivityTemplateService) {

			// The instance of the main service - to be filled with functionality below

			var tmpServiceInfo = {
				flatLeafItem: {
					module: templateModule,
					serviceName: 'schedulingTemplateEventTemplateService',
					entityNameTranslationID: 'scheduling.template.translationDescEvents',
					httpCreate: {route: globals.webApiBaseUrl + 'scheduling/template/eventtemplate/', endCreate: 'create'},
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/template/eventtemplate/', endCreate: 'list'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.PKey1 = schedulingTemplateActivityTemplateService.getSelected().Id;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'EventTemplate',
							parentService: schedulingTemplateActivityTemplateService
						}
					},
					translation: {
						uid: 'schedulingTemplateEventTemplateService',
						title: 'scheduling.template.translationDescEvents',
						columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
						dtoScheme: {
							typeName: 'EventTemplateDto',
							moduleSubModule: 'Scheduling.Template'
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(tmpServiceInfo);

			return serviceContainer.service;
		}
	]);
})
();
