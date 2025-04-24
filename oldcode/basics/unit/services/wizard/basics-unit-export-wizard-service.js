(function (angular) {
	/* global globals */
	'use strict';
	var moduleName = 'basics.unit';
	/**
	 * @ngdoc factory
	 * @name schedulingCalendarExceptiondayWizardService
	 * @description
	 *
	 * @example
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsUnitExportWizardService',
		['$rootScope', '$q', '$http', 'platformSidebarWizardCommonTasksService', 'basicsUnitMainService','basicsCommonImportDataService',
			function ($rootScope, $q, $http, platformSidebarWizardCommonTasksService, basicsUnitMainService,basicsCommonImportDataService) {

				var service = {};

				service.exportUom = function exportUom() {
					var defer;
					var unitId = 0;

					if (basicsUnitMainService.getSelected() !== null ) {
						unitId = basicsUnitMainService.getSelected().Id;
					}

					defer = $q.defer();
					$rootScope.$broadcast('asyncInProgress', true);
					$http.get(globals.webApiBaseUrl + 'basics/unit/export/touom?unitId=' + unitId)
						.then(function (response) {

							$rootScope.$broadcast('asyncInProgress', false);
							var template, link, content, markup;
							defer.resolve(response.data);

							template = '<a id="downloadLink" href="" download="" style="visibility: hidden;"></a>';
							markup = angular.element(document.querySelector('#sidebar-wrapper'));
							markup.append(template);

							link = angular.element(document.querySelector('#downloadLink'));
							if (link !== undefined && link.length > 0 && (basicsUnitMainService !== null)) {

								link[0].href = response.data;
								content = response.headers()['content-disposition'];
								link[0].download = content.substr(content.indexOf('filename=') + 9);

								link[0].click();
								link[0].remove();
							}
						}, function (error) {
							$rootScope.$broadcast('asyncInProgress', false);
							// console.log('fail to export data');
							defer.reject(error);
							defer = null;
						});
					return defer.promise;

				};
				service.importUom = function () {
					basicsCommonImportDataService.execute(basicsUnitMainService, moduleName);
				};
				return service;
			}
		]);
})(angular);
