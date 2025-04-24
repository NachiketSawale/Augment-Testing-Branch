/**
 * Created by anl on 12/10/2021.
 */

(function (angular) {
	'use strict';

	angular.module('productionplanning.common').factory('ppsCommonBizPartnerOwnerService', ppsCommonBizPartnerOwnerService);

	ppsCommonBizPartnerOwnerService.$inject = ['$q', '$translate'];

	function ppsCommonBizPartnerOwnerService($q, $translate) {
		var service = {};
		var activeModule;

		service.setModule = function (moduleName){
			activeModule = moduleName;
		};

		service.getItems = function getItems() {
			var defer = $q.defer();
			var fullItems = [{
				value: 'PROJECT',
				display: $translate.instant('project.main.sourceProject')
			}, {
				value: 'PPSHEADER',
				display: $translate.instant('productionplanning.common.header.headerTitle')
			}, {
				value: 'MNTREQ',
				display: $translate.instant('productionplanning.mounting.entityRequisition')
			}];

			var filteredItems = [{
				value: 'PROJECT',
				display: $translate.instant('project.main.sourceProject')
			}, {
				value: 'PPSHEADER',
				display: $translate.instant('productionplanning.common.header.headerTitle')
			}];
			var items = activeModule === 'productionplanning.mounting' ? fullItems : filteredItems;
			defer.resolve(items);
			return defer.promise;
		};

		return service;
	}
})(angular);
