/**
 * Created by baf on 2016-08-24
 */
(function () {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestRelevantToDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestRelevantToDataService is a data service for contribution to information requests
	 */
	module.factory('projectInfoRequestRelevantToDataService', ['platformDataServiceFactory', 'projectInfoRequestDataService', 'platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, projectInfoRequestDataService, platformDataServiceProcessDatesBySchemeExtension) {

			var projectInfoRequestRelevantToDataServiceOption = {
				flatLeafItem: {
					module: module,
					serviceName: 'basicsConfigGenWizardStepScriptDataService',
					entityNameTranslationID: 'basics.config.entityTranslation',
					httpCreate: {route: globals.webApiBaseUrl + 'project/rfi/requestrelevantto/'},
					httpRead: {
						usePostForRead: true,
						route: globals.webApiBaseUrl + 'project/rfi/requestrelevantto/',
						endRead: 'listByParent'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'RequestRelevantToDto',
						moduleSubModule: 'Project.InfoRequest'
					})],
					entityRole: {
						leaf: {
							itemName: 'Relevants',
							parentService: projectInfoRequestDataService
						}
					},
					modification: {multi: true},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								for(var prop in creationData) {
									if(creationData.hasOwnProperty(prop)) {
										delete creationData[prop];
									}
								}
								creationData.PKey1 = projectInfoRequestDataService.getSelected().Id;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectInfoRequestRelevantToDataServiceOption);

			serviceContainer.data.initReadData = function initTranslationReadData(readData) {
				readData.PKey1 = projectInfoRequestDataService.getSelected().Id;
			};

			return serviceContainer.service;
		}
	]);
})();