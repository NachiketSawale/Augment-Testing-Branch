/**
 * Created by wui on 6/24/2015.
 */

(function(angular){
	'use strict';

	angular.module('basics.material').factory('basicsMaterialWeightTypeDataService', ['$q', 'basicsMaterialLookUpItems',
		function($q, lookUpItems) {
			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(lookUpItems.weightType);
					return deferred.promise;
				},

				getItemByKey: function (value) {
					var item = _.find(lookUpItems.weightType, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);