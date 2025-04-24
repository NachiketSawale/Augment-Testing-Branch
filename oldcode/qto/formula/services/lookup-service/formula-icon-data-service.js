/**
 * Created by wui on 6/23/2015.
 */

(function(angular){
	'use strict';

	angular.module('qto.formula').factory('qtoFormulaIconDataService', ['_', '$q', 'qtoFormulaIcons',
		function(_, $q, qtoFormulaIcons){
			return {
				getList: getIcons,
				getDefault: function () {
					let deferred = $q.defer();
					deferred.resolve({Id: 1, Icon: 1, Description: ''});
					return deferred.promise;
				},
				getItemByKey: function (value) {
					let deferred = $q.defer();
					deferred.resolve({Id: value, Icon: value, Description: ''});
					return deferred.promise;
				},
				getSearchList: getIcons
			};

			function getIcons() {
				let deferred = $q.defer();
				let items = [];
				_.each(qtoFormulaIcons, function (item) {
					items.push({ Id: item.id, Icon: item.id, Description: '', res: item.res });
				});
				deferred.resolve(items);
				return deferred.promise;
			}
		}
	]);

})(angular);