/**
 * Created by leo on 18.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateModule = angular.module('scheduling.template');

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *  is the data service for all activityTmpGrp2CUGrp related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateModule.factory('schedulingTemplateActivityTmpl2CUGrpService', ['platformDataServiceFactory', 'schedulingTemplateActivityTemplateService', 'platformRuntimeDataService', 'basicsCommonMandatoryProcessor',

		function (platformDataServiceFactory, schedulingTemplateActivityTemplateService, platformRuntimeDataService, basicsCommonMandatoryProcessor) {

			// The instance of the main service - to be filled with functionality below

			function processItem(item) {

				var fields = [
					{field: 'ControllingGroupFk', readonly: item.Inherited},
					{field: 'ControllingGroupDetailFk', readonly: item.Inherited},
					{field: 'Inherited', readonly: item.Inherited}
				];
				platformRuntimeDataService.readonly(item, fields);
			}

			var tmpServiceInfo = {
				flatLeafItem: {
					module: templateModule,
					serviceName: 'schedulingTemplateActivityTmpl2CUGrpService',
					entityNameTranslationID: 'scheduling.template.controllingGroupFk',
					dataProcessor: [{processItem: processItem}],
					httpCreate: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytmpl2cugrp/',
						endCreate: 'create'
					},
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/template/activitytmpl2cugrp/', endRead: 'listbyparent',
						usePostForRead: {},
						initReadData: function (readdata) {
							readdata.PKey1 = schedulingTemplateActivityTemplateService.getSelected().Id;
							readdata.PKey2 = schedulingTemplateActivityTemplateService.getSelected().ActivityTemplateGroupFk;
						}
					},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = schedulingTemplateActivityTemplateService.getSelected();
								creationData.PKey1 = selected.Id;
							},
							incorporateDataRead: function (itemList, data) {
								angular.forEach(itemList, function (item) {
									item.idString = item.Id.toString();
									if (item.Inherited) {
										item.idString += '-' + '1';
									}
								});
								return serviceContainer.data.handleReadSucceeded(itemList, data);
							},
							handleCreateSucceeded: function (newData) {
								newData.idString = newData.Id.toString();
								return newData;
							}
						}
					},
					entityRole: {
						leaf: {
							itemName: 'ActivityTmpl2CUGrp',
							parentService: schedulingTemplateActivityTemplateService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(tmpServiceInfo);

			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'ActivityTmpl2CUGrpDto',
				moduleSubModule: 'Scheduling.Template',
				validationService: 'schedulingTemplateActivityTmpl2CUGrpValidationService'
			});
			return serviceContainer.service;
		}
	]);
})
();
