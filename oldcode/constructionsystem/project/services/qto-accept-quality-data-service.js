/**
 * Created by wui on 9/7/2017.
 */

(function (angular) {
	'use strict';

	var modulename = 'constructionsystem.project';

	angular.module(modulename).factory('cosProjectQtoAcceptQualityDataService', ['$q', '_', 'platformTranslateService',
		function ($q, _, platformTranslateService) {
			var data = [
				{
					Id: 1,
					Description: 'Correct',
					Description$tr$: 'constructionsystem.project.entityCorrect'
				},
				{
					Id: 2,
					Description: 'Warning',
					Description$tr$: 'constructionsystem.project.entityWarning'
				},
				{
					Id: 3,
					Description: 'Error',
					Description$tr$: 'constructionsystem.project.entityError'
				},
				{
					Id: 4,
					Description: 'Fatal Error',
					Description$tr$: 'constructionsystem.project.entityFatalError'
				}
			];

			function getList() {
				return $q.when(data);
			}

			function getItemByKey(id) {
				return $q.when(_.find(data, {Id: id}));
			}

			function getItemById(id) {
				return _.find(data, {Id: id});
			}

			platformTranslateService.translateObject(data);

			platformTranslateService.translationChanged.register(function () {
				platformTranslateService.translateObject(data);
			});

			return {
				getList: getList,
				getItemByKey: getItemByKey,
				getItemById: getItemById
			};
		}
	]);

})(angular);