/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.main.modelMainObjectSelectorService
	 * @function
	 * @requires platformWizardDialogService, $http, modelViewerSelectorService, $translate,
	 *           modelViewerModelSelectionService, $timeout, _, basicsLookupdataConfigGenerator,
	 *           modelViewerModelIdSetService
	 *
	 * @description Provides object selectors related to the model.main module.
	 */
	angular.module('model.main').factory('modelMainObjectSelectorService', ['platformWizardDialogService', '$http',
		'modelViewerSelectorService', '$translate', 'modelViewerModelSelectionService', '$timeout', '_',
		'basicsLookupdataConfigGenerator', 'modelViewerModelIdSetService',
		function (platformWizardDialogService, $http, modelViewerSelectorService, $translate,
		          modelViewerModelSelectionService, $timeout, _, basicsLookupdataConfigGenerator,
		          modelViewerModelIdSetService) {
			var service = {};

			modelViewerSelectorService.registerSelector({
				name: 'model.main.selectors.objectSet.name',
				category: 'general',
				isAvailable: function () {
					return true;
				},
				getObjects: function (settings) {
					return $http.get(globals.webApiBaseUrl + 'model/main/objectset/modelObjectsFromObjectSets', {
						params: {
							modelId: modelViewerModelSelectionService.getSelectedModelId(),
							objectSetIds: settings.objectSets.selectedId.join(':')
						}
					}).then(function (response) {
						return {
							objectIds: modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds()
						};
					});
				},
				createWizardSteps: function (modelPrefix) {
					return [{
						id: 'findObjectSetStep',
						title: $translate.instant('model.main.selectors.objectSet.loadingSets'),
						loadingMessage: $translate.instant('model.main.selectors.objectSet.loadingSetsMessage'),
						disallowBack: true,
						disallowNext: true,
						canFinish: false,
						prepareStep: function (info) {
							return $http.get(globals.webApiBaseUrl + 'model/main/objectset/listformodel', {
								params: {
									modelId: modelViewerModelSelectionService.getSelectedModelId()
								}
							}).then(function (response) {
								var objSets = _.isArray(response.data) ? response.data : [];

								_.set(info.model, modelPrefix + 'objectSets.items', objSets);

								info.scope.$evalAsync(function () {
									info.step.disallowNext = false;
									$timeout(function () {
										info.commands.goToNext();
									});
								});
							});
						}
					}, _.assign(platformWizardDialogService.createListStep({
						title: $translate.instant('model.main.selectors.objectSet.selObjectSets'),
						topDescription: $translate.instant('model.main.selectors.objectSet.selObjectSetsDesc'),
						model: modelPrefix + 'objectSets'
					}), {
						disallowBack: true
					})];
				},
				createSettings: function () {
					var filterFunc = function (item, text) {
						var str = _.get(item, 'Description.Translated');
						if (_.isString(str)) {
							return str.toLowerCase().includes(text);
						}
						return false;
					};

					return {
						objectSets: {
							selectionListConfig: {
								idProperty: 'Id',
								columns: [{
									id: 'desc',
									field: 'Name',
									name: $translate.instant('cloud.common.entityDescription'),
									formatter: 'description',
									sortable: true,
									width: 250
								}, _.assign({
									id: 'status',
									field: 'ObjectSetStatusFk',
									name: $translate.instant('model.main.objectSet.objectSetStatus'),
									width: 180
								}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
									lookupName: 'basics.customize.objectsetstatus',
									readOnly: true,
									options: {
										showIcon: true
									}
								})), _.assign({
									id: 'type',
									field: 'ObjectSetTypeFk',
									name: $translate.instant('model.main.objectSet.objectSetType'),
									width: 180
								}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForGrid({
									lookupName: 'basics.customize.objectsettype',
									readOnly: true
								}))],
								multiSelect: true,
								filterItem: filterFunc
							}
						}
					};
				}
			});

			return service;
		}]);
})(angular);
