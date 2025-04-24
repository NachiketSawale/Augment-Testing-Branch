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
	 * @name modelEvaluationRuleset2HlSchemeMappingDataService
	 * @description A dummy data service for managing the connection between model rule sets and dynamic highlighting
	 *              schemes.
	 */
	myModule.service('modelEvaluationRuleset2HlSchemeMappingDataService', Service);

	Service.$inject = ['_', 'platformDataServiceFactory', 'modelEvaluationRulesetDataService'];

	function Service(_, platformDataServiceFactory, modelEvaluationRulesetDataService) {
		var self = this;
		var serviceOptions = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'modelEvaluationRuleset2HlSchemeMappingDataService',
				entityNameTranslationID: '', // No human-readable text required as users will not see this entity.
				httpCRUD: {
					route: globals.webApiBaseUrl + 'model/evaluation/ruleset2hlscheme/',
					endRead: 'listByRuleset',
					usePostForRead: false,
					initReadData: function initReadData(readData) {
						var selected = modelEvaluationRulesetDataService.getSelected();
						readData.filter = '?rulesetFk=' + (selected ? selected.Id : '0');
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [{
					processItem: function (item) {
						item.Id = item.ModelRulesetFk + '-' + item.HighlightingScheme.Id;
					}
				}],
				entityRole: {
					node: {itemName: 'HighlightingSchemeMappings', parentService: modelEvaluationRulesetDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(serviceOptions, self);
		serviceContainer.data.Initialised = true;

		modelEvaluationRulesetDataService.registerItemModified(function (e, item) {
			if (_.isNumber(item.HighlightingSchemeFk)) {
				var selMapping = self.getSelected();
				if (!_.isObject(selMapping) || (selMapping.HighlightingScheme.Id !== item.HighlightingSchemeFk)) {
					if (_.isArray(serviceContainer.data.itemList)) {
						selMapping = _.find(serviceContainer.data.itemList, function (loadedItem) {
							return loadedItem.HighlightingScheme.Id === item.HighlightingSchemeFk;
						});
						if (_.isObject(selMapping)) {
							self.setSelected(selMapping);
						}
					}
				}
			}
		});
	}
})(angular);
