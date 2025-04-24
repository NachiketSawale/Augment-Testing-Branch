/**
 * Created by joj on 2017/5/3.
 */
(function(angular){
	'use strict';

	angular.module('qto.main').factory('qtoTargetTypeDataService', ['_', '$q', '$translate', 'platformTranslateService',
		function(_, $q, $translate, platformTranslateService){
			let items = [
				{Id: 1, Description: $translate.instant('qto.main.ProcurementBoQ')},
				{Id: 2, Description: $translate.instant('qto.main.SaleWIP')},
				{Id: 3, Description: $translate.instant('qto.main.PrcWqAq')},
				{Id: 4, Description: $translate.instant('qto.main.SalesWqAq')}
			];

			// reloading translation tables
			platformTranslateService.translationChanged.register(function() {
				platformTranslateService.translateObject(items);
			});

			return {
				getList: function () {
					let deferred = $q.defer();
					deferred.resolve(items);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					let item = _.find(items, {Id: value});
					let deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);