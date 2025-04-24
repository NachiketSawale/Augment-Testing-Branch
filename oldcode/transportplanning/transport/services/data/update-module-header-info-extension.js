/**
 * Created by zwz on 2021/9/16.
 */

(function (angular) {
	'use strict';
	var moduleName = 'transportplanning.transport';
	var transportModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name transportplanningTransportUpdateModuleHeaderInfoExtension
	 * @function
	 * @requires $q, basicsLookupdataLookupDescriptorService, cloudDesktopInfoService, cloudDesktopPinningContextService
	 * @description
	 * transportplanningTransportUpdateModuleHeaderInfoExtension provides functionality of updating header info of transport module
	 */
	transportModule.service('transportplanningTransportUpdateModuleHeaderInfoExtension', Extension);
	Extension.$inject = ['$q', 'basicsLookupdataLookupDescriptorService', 'cloudDesktopInfoService', 'cloudDesktopPinningContextService'];

	function Extension($q, basicsLookupdataLookupDescriptorService, cloudDesktopInfoService, cloudDesktopPinningContextService) {

		/**
		 * @ngdoc function
		 * @description update header info of Transport module
		 * @param {Object} route: The selected route record.
		 **/
		this.updateModuleHeaderInfo = function (route) {
			var moduleInfoName = 'cloud.desktop.moduleDisplayNameTransport';
			var text = null;
			if (route) {
				text = cloudDesktopPinningContextService.concate2StringsWithDelimiter(route.Code, route.DescriptionInfo ? route.DescriptionInfo.Translated : null, ' - ');
				if (route.JobDefFk) {
					$q.when(basicsLookupdataLookupDescriptorService.getLookupItem('logisticJobEx', route.JobDefFk)).then(function (job) {
						if (job) {
							text += ' / ';
							text += cloudDesktopPinningContextService.concate2StringsWithDelimiter(job.Code, job.Description, ' - ');
						}
						cloudDesktopInfoService.updateModuleInfo(moduleInfoName, text);
					});
				} else {
					cloudDesktopInfoService.updateModuleInfo(moduleInfoName, text);
				}
			} else {
				cloudDesktopInfoService.updateModuleInfo(moduleInfoName, text);
			}
		};

	}
})(angular);