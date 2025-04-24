/**
 * Created by chk on 10/13/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('constructionSystemMainOutputDataService', [
		'constructionSystemCommonOutputDataService',
		'constructionSystemMainInstanceService',
		'constructionsystemMainLoggingSource',
		'constructionSystemMainJobDataService',
		function (commonOutputDataService,
			constructionSystemMainInstanceService,
			constructionsystemMainLoggingSource,
			constructionSystemMainJobDataService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'constructionSystemMainJobDataService',
				entitySelection: {},
				filter: filter
			};
			var service;

			service = commonOutputDataService.getService(serviceOption);

			function filter(data) {
				if (!service.isFilterByInstance) {
					return data;
				}

				var instance = constructionSystemMainInstanceService.getSelected();

				if (instance) {
					data = data.filter(function (item) {
						return item.Instance === instance.Code ||
							item.LoggingSource === constructionsystemMainLoggingSource.scheduler ||
							item.LoggingSource === constructionsystemMainLoggingSource.TwoQ;
					});
				}

				return data;
			}

			function refresh() {
				service.load();
			}

			constructionSystemMainJobDataService.onSelectedJobCompleted.register(refresh);

			return service;
		}
	]);

})(angular);