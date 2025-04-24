/**
 * Created by wed on 2/6/2018.
 */

(function lookupPageSizeServiceDefinition(angular) {

	'use strict';

	const moduleName = 'basics.lookupdata';
	angular.module(moduleName).factory('lookupPageSizeService', [
		'_',
		'globals',
		'$q',
		'$http',
		function lookupPageSizeService(
			_,
			globals,
			$q,
			$http) {

			const _defaultPageSize = 100;
			let _pageSize = -1;

			function getPageSizeAsync() {
				if (_pageSize > 0) {
					return $q.when(_pageSize);
				}
				return $http.get(globals.webApiBaseUrl + 'basics/common/systemoption/lookuppagesize').then(r => {
					_pageSize = _.isNumber(r.data) && r.data > 0 ? r.data : _defaultPageSize;
					return _pageSize;
				});
			}

			return {
				getPageSizeAsync: getPageSizeAsync
			};

		}]);

})(angular);

