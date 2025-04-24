/**
 * Created by wui on 6/24/2015.
 */

(function(angular){
	'use strict';

	angular.module('basics.material').factory('basicsMaterialWeightNumberDataService', ['$q', 'basicsMaterialLookUpItems',
		function($q, lookUpItems) {
			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(lookUpItems.weightNumber);
					return deferred.promise;
				},

				getItemByKey: function (value) {
					var item = _.find(lookUpItems.weightNumber, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);