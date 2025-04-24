/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRuleset2ModuleDataService
	 * @description pprovides methods to access, create and update model evaluation ruleset-to-module entities
	 */
	myModule.service('modelEvaluationRuleset2ModuleDataService', ModelEvaluationRuleset2ModuleDataService);

	ModelEvaluationRuleset2ModuleDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'modelEvaluationRulesetDataService'];

	function ModelEvaluationRuleset2ModuleDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, modelEvaluationRulesetDataService) {
		var self = this;
		var modelEvaluationRuleset2ModuleServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelEvaluationRuleset2ModuleDataService',
				entityNameTranslationID: 'model.evaluation.entityModelEvaluationRuleset2Module',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset2module/',
					endRead: 'listByRuleset',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = modelEvaluationRulesetDataService.getSelected();
						readData.filter = '?rulesetFk=' + (selected ? selected.Id : '0');
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = modelEvaluationRulesetDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Ruleset2Modules', parentService: modelEvaluationRulesetDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(modelEvaluationRuleset2ModuleServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
