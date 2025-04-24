/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerStatusBarService
	 * @function
	 *
	 * @description Provides the default definition of a status bar for model viewer containers.
	 */
	angular.module('model.viewer').factory('modelViewerStatusBarService', ['_', 'projectMainProjectSelectionService',
		'projectMainFixedModuleConfigurationService', 'modelProjectModelDataService', 'modelProjectNiceNameService',
		'modelViewerModelSelectionService', 'mainViewService', '$translate','modelViewerReportingPeriodDialogService',
		function (_, projectMainProjectSelectionService, projectMainFixedModuleConfigurationService,
		          modelProjectModelDataService, modelProjectNiceNameService, modelViewerModelSelectionService,
			mainViewService, $translate, modelViewerReportingPeriodDialogService) {
			var service = {};

			service.initializeStatusBar = function (scope, settings) {
				projectMainFixedModuleConfigurationService.updateProjectSelectionSource();

				var disableModelSelector;
				switch (mainViewService.getCurrentModuleName()) {
					case 'project.main':
						disableModelSelector = true;
						break;
					default:
						disableModelSelector = false;
						break;
				}

				var sb = scope.getUiAddOns().getStatusBar();
				sb.showFields([{
					id: 'status',
					type: 'text',
					align: 'left'
				}, {
					id: 'model',
					align: 'right',
					type: disableModelSelector ? 'text' : 'dropdown-btn'
				}, {
					id: 'selection',
					align: 'right',
					type: 'text'
				}, {
					id: 'filter',
					align: 'right',
					type: 'dropdown-btn',
					value: ''
				}, {
					id: 'filterConfig',
					align: 'right',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-settings block-image',
					list: {
						items: [{
							id: 'combinedFilter',
							caption: 'model.viewer.combinedFilter.editCombinedFilter',
							type: 'item',
							fn: function () {
								settings.modifyCombinedFilter();
							}
						},{
							id: 'reportingPeriod',
							caption: 'model.viewer.reportingPeriod.editreportingPeriod',
							type: 'item',
							fn: function () {
								modelViewerReportingPeriodDialogService.showDialog();
							}
						}]
					},
				}]);

				var link = sb.getLink();
				if (disableModelSelector) {
					link.updateModelsSelector = function () {
					};
				} else {
					link.updateModelsSelector = function () {
						var that = this;
						var selProjectId = projectMainProjectSelectionService.getSelectedProjectId();
						if (selProjectId !== that.selProjectId) {
							modelProjectModelDataService.getQuickSelectableModels().then(function (models) {
								var selectModel = function (id, item) {
									modelViewerModelSelectionService.setSelectedModelId(item.modelId);
								};

								that.updateFields([{
									id: 'model',
									list: {
										items: _.orderBy(_.map(models, function (m) {
											return {
												id: 'm' + m.Id,
												type: 'item',
												caption: modelProjectNiceNameService.generateNiceModelNameFromEntity(m),
												modelId: m.Id,
												fn: selectModel
											};
										}), ['caption'])
									}
								}]);
							});
						}
					};
					link.updateModelsSelector();
				}

				return link;
			};

			return service;
		}]);
})(angular);
