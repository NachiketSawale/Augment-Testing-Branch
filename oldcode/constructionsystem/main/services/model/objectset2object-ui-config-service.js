(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainObjectSet2ObjectUIConfigService
	 * @function
	 * @requires platformUIConfigInitService
	 *
	 * @description
	 * #
	 * ui configuration service for constructionSystem main objectset2object grid/form controller.
	 */
	angular.module(moduleName).service('constructionSystemMainObjectSet2ObjectUIConfigService', [
		'platformUIConfigInitService', 'constructionSystemMainInstanceService', 'modelMainUIConfigurationService', 'modelMainTranslationService',
		function (platformUIConfigInitService, constructionSystemMainInstanceService, modelMainUIConfigurationService, modelMainTranslationService) {

			var layout = modelMainUIConfigurationService.getModelObjectSet2ObjectLayout();

			// set all grid columns and form rows readonly and reset lookup filter
			_.each(layout.overloads, function (fieldConfig, field) {
				fieldConfig.readonly = true;

				if (fieldConfig.grid) {
					// fieldObj.grid.editor = null;
					// if (fieldObj.grid.editorOptions) {
					// fieldObj.grid.editorOptions = null;
					// }
					if (fieldConfig.grid.formatterOptions) {
						if (field === 'modelfk') {
							fieldConfig.grid.formatterOptions.filter = function () {
								return getProjectId();
							};
						}
						// if (field === 'objectfk') {
						// fieldConfig.grid.formatterOptions.filter = function () {
						// return getModelId();
						// };
						// }
					}
				}

				if (fieldConfig.detail) {
					if (field === 'modelfk' && fieldConfig.detail.options) {
						fieldConfig.detail.options.filter = function () {
							return getProjectId();
						};
					}
					// if (field === 'objectfk' && fieldConfig.detail.options) {
					//     fieldConfig.detail.options.filter = function () {
					//     return getModelId();
					//    };
					// }
				}
			});

			platformUIConfigInitService.createUIConfigurationService({
				service: this,
				dtoSchemeId: {typeName: 'ObjectSet2ObjectDto', moduleSubModule: 'Model.Main'},
				layout: layout,
				translator: modelMainTranslationService
			});

			function getProjectId() {
				return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
			}

			// function getModelId() {
			// return constructionSystemMainInstanceService.getCurrentSelectedModelId();
			// }
		}
	]);
})(angular);