/**
 * Created by chi on 8/10/2016.
 */
/* global _ */
(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('cosCommonPropertyOperationLookupService', ['$q',
		function ($q) {
			var service = {
				getList: getList,
				getItemByKey: getItemByKey
			};

			// optype see: constructionsystemCommonPropertyValueTypeService

			var lookupData = {
				operations: [
					// common operation
					// optype = 2^0
					{Id: 1, OpType: 1, Description: 'IsEqual'},
					{Id: 2, OpType: 1, Description: 'NotEqual'},

					// number(decimal/int) operation
					// datetime operation
					// optype = 2^2(decimal)+2^3(int)+2^5(datetime)
					{Id: 3, OpType: 44, Description: 'IsGreater'},
					{Id: 4, OpType: 44, Description: 'IsGreaterEqual'},
					{Id: 5, OpType: 44, Description: 'IsLess'},
					{Id: 6, OpType: 44, Description: 'IsLessEqual'},

					// string operation
					// optype = 2^1
					{Id: 7, OpType: 2, Description: 'Contains'},
					{Id: 8, OpType: 2, Description: 'StartWith'},
					{Id: 9, OpType: 2, Description: 'EndWith'},
					{Id: 10, OpType: 2, Description: 'NotContains'}
				]
			};


			// //////////////////////////////////////////////////////////////////////////////////////////////////////////////
			function getList(settings, scope) {
				var deferred = $q.defer();
				var result = lookupData.operations;
				if (settings.filter && angular.isFunction(settings.filter) && scope.entity) {
					result = _.filter(result, function (item) {
						return settings.filter(scope.entity, item);
					});
				}
				deferred.resolve(result);
				return deferred.promise;
			}

			function getItemByKey(id) {
				var defer = $q.defer();
				defer.resolve(_.find(lookupData.operations, {Id: id}));
				return defer.promise;
			}

			return service;
		}
	]);
})(angular);