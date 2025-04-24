(function () {
	'use strict';
	/*global angular*/
	const moduleName = 'productionplanning.strandpattern';

	angular.module(moduleName).factory('productionplanningStrandpattern2materialDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionplanningStrandpatternDataService',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, parentService) {
			let container;
			let serviceOptions = {
				flatLeafItem: {
					module: moduleName,
					serviceName: 'productionplanningStrandpattern2materialDataService',
					entityNameTranslationID: 'productionplanning.strandpattern.strandpattern2material.entityStrandPattern2Mat',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/strandpattern/strandpattern2material/',
						endDelete: 'multidelete',
						endRead: 'listbystrandpattern'
					},
					entityRole: {
						leaf: {
							itemName: 'StrandPattern2Material',
							parentService: parentService,
							parentFilter: 'strandPatternId'
						}
					},
					entitySelection: { supportsMultiSelection: true },
					presenter: {
						list: {
							initCreationData: function (creationData) {
								var selected = parentService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					}
				}
			};
			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'PpsStrandPattern2MaterialDto',
				moduleSubModule: 'Productionplanning.StrandPattern',
				validationService: 'productionplanningStrandpattern2materialValidationService'
			});

			return container.service;
		}
	]);
})();