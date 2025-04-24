/**
 * Created by luo on 2016/3/4.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionSystemMainController
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 * data service for construction system main's model container
	 */
	angular.module(moduleName).controller('constructionSystemMainController', [
		'$scope', '$injector', '$http', '$q', 'platformMainControllerService', 'constructionSystemMainInstanceService',
		'constructionsystemMainTranslationService', 'constructionSystemMainHeaderService',
		'modelViewerStandardFilterService','constructionSystemCommonContextService', 'modelWdeViewerComparisonService',
		function ($scope, $injector, $http, $q, platformMainControllerService, mainDataService, translateService, cosMasterHeaderService,
			modelViewerStandardFilterService,constructionSystemCommonContextService, modelWdeViewerComparisonService) {
			var sidebarOption = {
				search: true, reports: true, wizard: true, auditTrail: '60f6d4f9d4ee43ef9804b81eb9444cc0'
			};

			var result = platformMainControllerService.registerCompletely($scope, mainDataService, {}, translateService, moduleName, sidebarOption);

			modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('constructionSystemMainModelFilterService');

			mainDataService.ensureInitContext();

			$injector.get('constructionsystemMainObjectSelectorService');

			constructionSystemCommonContextService.setMainService(mainDataService);

			modelWdeViewerComparisonService.defaultSettingsProvider = {
				execute: function () {
					var instanceHeaderId = mainDataService.getCurrentInstanceHeaderId();

					if(instanceHeaderId) {
						return $http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/oldmodelinfo?instanceHeaderId=' + instanceHeaderId).then(function (res) {
							if(res.data) {
								return {
									refModelId: res.data.Id,
									refDrawingId: res.data.Uuid
								};
							}
							return {};
						});
					}

					return $q.when({});
				}
			};

			$scope.$on('$destroy', function () {
				modelWdeViewerComparisonService.defaultSettingsProvider = null;
				platformMainControllerService.unregisterCompletely(mainDataService, result, translateService, sidebarOption);
				constructionSystemCommonContextService.removeModuleValue(constructionSystemCommonContextService.cosCommonMainService);
			});
		}
	]);
})(angular);
