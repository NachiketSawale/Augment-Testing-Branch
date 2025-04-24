/**
 * Created by xia on 5/3/2017.
 */
(function (angular) {
	'use strict';

	let moduleName = 'estimate.rule';
	angular.module(moduleName).factory('estimateSequenceLookupProcessService',
		[function () {

			let service = {};

			service.select = function (lookupItem, entity) {
				if (!lookupItem || !entity) {
					return '';
				}

				let iconName = '';

				if(lookupItem.Ischangeable){
					iconName = 'editable';
				}else{
					iconName = 'not-editable';
				}

				return 'cloud.style/content/images/control-icons.svg#ico-'+ iconName;
			};

			return service;
		}]);
})(angular);
