/**
 * Created by leo on 18.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateGroupModule = angular.module('scheduling.templategroup');


	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *  is the data service for all activityTmpGrp2CUGrp related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateGroupModule.factory('schedulingTemplateActivityTmplGrp2CUGrpService', ['platformDataServiceFactory', 'schedulingTemplateGrpEditService', 'basicsCommonMandatoryProcessor',

		function (platformDataServiceFactory, schedulingTemplateGrpEditService, basicsCommonMandatoryProcessor) {

			// The instance of the main service - to be filled with functionality below

			var tmpServiceInfo = {// new SubItemBase(globals.webApiBaseUrl + 'project/location/', 'Locations', projectMainService, locationCRUDInfo);
				flatLeafItem: {
					module: templateGroupModule,
					serviceName: 'schedulingTemplateActivityTmplGrp2CUGrpService',
					entityNameTranslationID: 'scheduling.template.controllingGroupFk',
					httpCreate: { route: globals.webApiBaseUrl + 'scheduling/template/activitytmplgrp2cugrp/', endCreate: 'create' },
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/template/activitytmplgrp2cugrp/', endRead: 'list'},
					presenter: { list: {
						initCreationData: function initCreationData(creationData) {
							var selected = schedulingTemplateGrpEditService.getSelected();
							if (selected) {
								creationData.PKey1 = selected.Id;
							}
						}
					}},
					entityRole: { leaf: { itemName: 'ActivityTmplGrp2CUGrp', parentService: schedulingTemplateGrpEditService } }
				} };

			var serviceContainer = platformDataServiceFactory.createNewComplete(tmpServiceInfo);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ActivityTmplGrp2CUGrpDto',
				moduleSubModule: 'Scheduling.Template',
				validationService: 'schedulingTemplateActivityTmplGrp2CUGrpValidationService'
			});

			return serviceContainer.service;
		}
	]);
})
();
