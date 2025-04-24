/**
 * Created by baf on 2016-08-24
 */
(function () {
	'use strict';
	var modName = 'project.inforequest';
	var module = angular.module(modName);

	/**
	 * @ngdoc service
	 * @name projectInfoRequestContributionDataService
	 * @function
	 *
	 * @description
	 * projectInfoRequestContributionDataService is a data service for contribution to information requests
	 */
	module.factory('projectInfoRequestContributionLeafDataService', ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 

		function (platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
			
			function createInfoRequestContributionService(parentDataService) {

				var serviceContainer = null;
				var projectInfoRequestContributionDataServiceOption = {
					hierarchicalLeafItem: {
						module: module,
						serviceName: 'basicsConfigGenWizardStepScriptDataService',
						entityNameTranslationID: 'basics.config.entityTranslation',
						httpCreate: {route: globals.webApiBaseUrl + 'project/rfi/requestcontribution/'},
						httpRead: {
							usePostForRead: true,
							endRead: 'list',
							route: globals.webApiBaseUrl + 'project/rfi/requestcontribution/'
						},
						dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
							typeName: 'RequestContributionDto',
							moduleSubModule: 'Project.InfoRequest'
						})],
						entityRole: {
							leaf: {
								itemName: 'Contributions',
								parentService: parentDataService
							}
						},
						modification: {multi: true},
						presenter: {
							tree: {
								parentProp: 'RequestContributionFk', childProp: 'RelatedContributions',
								initCreationData: function initCreationData(creationData) {
									for (var prop in creationData) {
										if (creationData.hasOwnProperty(prop)) {
											delete creationData[prop];
										}
									}
									creationData.PKey1 = parentDataService.getSelected().Id;
									var sel = serviceContainer.service.getSelected();
									if (sel) {
										creationData.Id = sel.Id;
									}
								}
							}
						}
					}
				};

				serviceContainer = platformDataServiceFactory.createNewComplete(projectInfoRequestContributionDataServiceOption);

				serviceContainer.data.initReadData = function initTranslationReadData(readData) {
					readData.PKey1 = parentDataService.getSelected().Id;
				};

				return serviceContainer.service;
			}
			return {
				createInfoRequestContributionService: createInfoRequestContributionService
			};
		}
	]);
})();