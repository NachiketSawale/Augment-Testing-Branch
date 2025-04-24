(function () {
	'use strict';
	/* global angular, globals, _ */
	const moduleName = 'productionplanning.drawing';

	angular.module(moduleName).factory('productionplanningDrawingSkillDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionplanningDrawingMainService',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, parentService) {
			let container;
			let serviceOptions = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'productionplanningDrawingSkillDataService',
					entityNameTranslationID: 'productionplanning.drawing.skill.entityDrawingSkill',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/drawing/skill/',
						usePostForRead: false,
						endRead: 'listbydrawing',
					},
					entityRole: {
						leaf: {
							itemName: 'EngDrawingSkill',
							parentService: parentService,
							parentFilter: 'mainItemId'
						}
					},
					presenter: {
						list: {
							initCreationData: function (creationData) {
								creationData.PKey1 = parentService.getSelected().Id;
							}
						}
					}

				}
			};

			container = platformDataServiceFactory.createNewComplete(serviceOptions);
			container.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				mustValidateFields: true,
				validationService: 'productionplanningDrawingSkillValidationService'
			}, {typeName: 'EngDrawingSkillDto', moduleSubModule: 'ProductionPlanning.Drawing'}));

			return container.service;
		}
	]);
})();