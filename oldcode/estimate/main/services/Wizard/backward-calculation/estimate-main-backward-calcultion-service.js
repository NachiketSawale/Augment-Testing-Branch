
(function (angular) {
	'use strict';
	/* global globals */

	var moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 *
	 * @name estimateMainBackwardCalculationService
	 * @function
	 * @description
	 */

	angular.module(moduleName).factory('estimateMainBackwardCalculationService', ['$injector', '$http', '_', 'estimateMainBackwardCalculationGridDataService',
		function ($injector, $http, _, estimateMainBackwardCalculationGridDataService) {

			let service = {};

			service.execute = function execute(basicData) {
				let estimateMainService = $injector.get('estimateMainService');
				let projectId = estimateMainService.getProjectId();
				let estHeaderFk = estimateMainService.getSelectedEstHeaderId();
				let postData = {
					ProjectId: projectId,
					EstHeaderFk: estHeaderFk
				};
				postData = angular.extend(postData, angular.copy(basicData));
				postData.SettingDetails = _.filter(estimateMainBackwardCalculationGridDataService.getList(), {IsChange: true});
				return $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/excutebackwardcalculation', postData).then(function (response) {
					if (response && response.data) {
						return response.data;
					}
					return false;
				});
			};

			return service;
		}]);
})(angular);
