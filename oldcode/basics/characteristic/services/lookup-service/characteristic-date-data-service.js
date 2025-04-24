/**
 * Created by wui on 6/23/2015.
 */

(function (angular) {

	'use strict';

	angular.module('basics.characteristic').factory('basicsCharacteristicCharacteristicDateDataService', ['$q', 'basicsCharacteristicTypeHelperService', 'moment',
		function ($q, basicsCharacteristicTypeHelperService, moment) {

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(basicsCharacteristicTypeHelperService.dateList);
					return deferred.promise;
				},
				getItemByKey: function (value) {

					var deferred = $q.defer();
					if (value) {

						if (value._isAMomentObject) {
							value = value._i;
						}

						var dataSource = basicsCharacteristicTypeHelperService.dateList;
						for (var i = 0; i < dataSource.length; i++) {
							if (dataSource[i].Id === value) {
								deferred.resolve(dataSource[i]);
								break;
							}
						}
					}
					else
					{
						deferred.resolve(null);
					}
					return deferred.promise;
				}
			};
		}
	]);

})(angular);