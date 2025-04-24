/**
 * Created by pet on 7/18/2018.
 */
/* global ,  _ */
(function(angular){
	'use strict';
	var moduleName = 'defect.main';
	angular.module(moduleName).factory('defectQuestionStatusDataService', ['$q', 'defectQuestionLookupItems',
		function($q, lookUpItems) {
			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(lookUpItems.questionStatusItems);
					return deferred.promise;
				},

				getItemByKey: function (value) {
					var item = _.find(lookUpItems.questionStatusItems, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);