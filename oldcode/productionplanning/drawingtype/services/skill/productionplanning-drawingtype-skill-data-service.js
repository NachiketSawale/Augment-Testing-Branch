(function () {
	'use strict';
	/* global angular, globals, _ */
	const moduleName = 'productionplanning.drawingtype';

	angular.module(moduleName).factory('productionPlanningDrawingTypeSkillDataService', [
		'platformDataServiceFactory', 'basicsCommonMandatoryProcessor', 'productionPlanningDrawingTypeConstantValues', 'productionPlanningDrawingTypeDataService',
		function (platformDataServiceFactory, basicsCommonMandatoryProcessor, constantValues, parentService) {
			let container;
			let serviceOptions = {
				flatRootItem: {
					module: moduleName,
					serviceName: 'productionPlanningDrawingTypeSkillDataService',
					entityNameTranslationID: 'productionplanning.drawingtype.skill.entityDrawingTypeSkill',
					addValidationAutomatically: true,
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/drawingtype/skill/',
						usePostForRead: false,
						endRead: 'listbydrawingtype',
					},
					entityRole: {
						leaf: {
							itemName: 'EngDrawingTypeSkill',
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
				validationService: 'productionPlanningDrawingTypeSkillValidationService'
			}, constantValues.schemes.drawingTypeSkill));

			return container.service;
		}
	]);
})();