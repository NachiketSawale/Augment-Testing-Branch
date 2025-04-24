/**
 * Created by zwz on 8/30/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.package';
	var module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningCommonLayoutHelper
	 * @description
	 * Provides methods for job lookupdata
	 */
	module.service('transportplanningPackageJobLookupdataHelper', Helper);

	Helper.$inject = ['basicsLookupdataLookupDescriptorService'];

	function Helper(basicsLookupdataLookupDescriptorService) {

		this.checkAndLoadJobByKey = function(key) {
			if (key && !basicsLookupdataLookupDescriptorService.hasLookupItem('logisticJobEx',key) ){
				basicsLookupdataLookupDescriptorService.loadItemByKey({
					options: {
						lookupType: 'logisticJobEx',
						version: 3
					},
					ngModel: key
				});
			}
		};
	}
})(angular);

