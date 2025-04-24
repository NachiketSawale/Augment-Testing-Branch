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
	module.factory('projectInfoRequestRelevantToLeafDataService', ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			function createInfoRequestRelevantToService(parentDataService) {

				var projectInfoRequestRelevantToDataServiceOption = {
					flatLeafItem: {
						module: module,
						serviceName: 'basicsConfigGenWizardStepScriptDataService',
						entityNameTranslationID: 'basics.config.entityTranslation',
						httpCreate: {route: globals.webApiBaseUrl + 'project/rfi/requestrelevantto/'},
						httpRead: {
							usePostForRead: true,
							endRead: 'listByParent',
							route: globals.webApiBaseUrl + 'project/rfi/requestrelevantto/'
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'RequestRelevantToDto',
							moduleSubModule: 'Project.InfoRequest'
						})],
						entityRole: {
							leaf: {
								itemName: 'Relevants',
								parentService: parentDataService
							}
						},
						modification: {multi: true},
						presenter: {
							list: {
								initCreationData: function initCreationData(creationData) {
									for (var prop in creationData) {
										if (creationData.hasOwnProperty(prop)) {
											delete creationData[prop];
										}
									}
									creationData.PKey1 = parentDataService.getSelected().Id;
								}
							}
						}
					}
				};

				var serviceContainer = platformDataServiceFactory.createNewComplete(projectInfoRequestRelevantToDataServiceOption);

				serviceContainer.data.initReadData = function initTranslationReadData(readData) {
					readData.PKey1 = parentDataService.getSelected().Id;
				};

				return serviceContainer.service;
			}

			return {
				createInfoRequestRelevantToService: createInfoRequestRelevantToService
			};
		}
	]);
})();