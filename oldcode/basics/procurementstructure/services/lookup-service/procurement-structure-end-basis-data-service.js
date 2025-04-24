/**
 * Created by xhe on 2015-10-12.
 */
(function (angular) {
	'use strict';

	angular.module('basics.procurementstructure').factory('basicsProcurementEndBasisDataService', ['$q', 'platformTranslateService',
		function ($q, platformTranslateService) {
			var items = [
				{
					Id: 1,
					Description: 'No end date',
					Description$tr$: 'basics.procurementstructure.noEndDate'},
				{
					Id: 2,
					Description: 'After event start',
					Description$tr$: 'basics.procurementstructure.afterEventStart'
				},
				{
					Id: 3,
					Description: 'Before system event',
					Description$tr$: 'basics.procurementstructure.beforeSystemEvent'
				},
				{
					Id: 4,
					Description: 'After system event',
					Description$tr$: 'basics.procurementstructure.afterSystemEvent'
				},
				{
					Id: 5,
					Description: 'Before custom event start',
					Description$tr$: 'basics.procurementstructure.beforeCustomEventStart'
				},
				{
					Id: 6,
					Description: 'Before custom event end',
					Description$tr$: 'basics.procurementstructure.beforeCustomEventEnd'
				},
				{
					Id: 7,
					Description: 'After custom event start',
					Description$tr$: 'basics.procurementstructure.afterCustomEventStart'
				},
				{
					Id: 8,
					Description: 'After custom event end',
					Description$tr$: 'basics.procurementstructure.afterCustomEventEnd'
				}
			];
			// reloading translation tables
			platformTranslateService.translationChanged.register(function () {
				platformTranslateService.translateObject(items);
			});

			return {
				getList: function () {
					var deferred = $q.defer();
					deferred.resolve(items);
					return deferred.promise;
				},
				getItemByKey: function (value) {
					var item = _.find(items, {Id: value});
					var deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				}
			};
		}
	]);

})(angular);
