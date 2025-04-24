/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('model.evaluation');

	/**
	 * @ngdoc service
	 * @name modelEvaluationRule2HlItemDataService
	 * @description Provides methods to access, create and update model evaluation rule to highlighting item entities
	 */
	myModule.service('modelEvaluationRule2HlItemDataService', ModelEvaluationRule2HlItemDataService);

	ModelEvaluationRule2HlItemDataService.$inject = ['_', '$q', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'modelEvaluationRuleset2HlSchemeMappingDataService'];

	function ModelEvaluationRule2HlItemDataService(_, $q, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, modelEvaluationRuleset2HlSchemeMappingDataService) {

		const self = this;
		const svcOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'modelEvaluationRule2HlItemDataService',
				entityNameTranslationID: 'model.evaluation.entityModelEvaluationRuleToHlItem',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/evaluation/rule2hlitem/',
					endRead: 'getmapping',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						const selected = modelEvaluationRuleset2HlSchemeMappingDataService.getSelected();
						readData.filter = '?rulesetFk=' + (selected ? selected.ModelRulesetFk : '0') + '&hlSchemeFk=' + (selected ? selected.HighlightingScheme.Id : '0');
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							const selected = modelEvaluationRuleset2HlSchemeMappingDataService.getSelected();
							creationData.PKey2 = selected.ModelRulesetFk;
							creationData.PKey1 = selected.HighlightingScheme.Id;
						}/* ,
						handleCreateSucceeded : function(newData){
							if (serviceContainer.data.itemList && (serviceContainer.data.itemList.length > 0)) {
								newData.Sorting = _.max(_.map(serviceContainer.data.itemList, function (existingItem) {
									return existingItem.Sorting;
								})) + 1;
							} else {
								newData.Sorting = 1;
							}
							return newData;
						} */
					}
				},
				entityRole: {
					leaf: {
						itemName: 'Rule2HighlightingItems',
						parentService: modelEvaluationRuleset2HlSchemeMappingDataService
					}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(svcOption, self);
		serviceContainer.data.Initialised = true;

		self.findMappingEntity = function (ruleId) {
			if (serviceContainer.data.itemList) {
				return _.find(serviceContainer.data.itemList, function (mappingEntity) {
					return mappingEntity.ModelRuleFk === ruleId;
				});
			} else {
				return null;
			}
		};

		self.findOrCreateMappingEntity = function (ruleId) {
			if (serviceContainer.data.itemList) {
				const result = self.findMappingEntity(ruleId);
				if (!result) {
					return self.createItem().then(function (newMapping) {
						newMapping.ModelRuleFk = ruleId;
						return newMapping;
					});
				} else {
					return $q.when(result);
				}
			} else {
				return $q.when(null);
			}
		};
	}
})(angular);
