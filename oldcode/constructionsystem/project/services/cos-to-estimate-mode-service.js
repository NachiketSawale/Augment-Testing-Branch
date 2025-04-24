/**
 * Created by wui on 5/17/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).constant('constructionSystemProjectEstimateMode', {
		original: 0,
		incremental: 1
	});

	angular.module(moduleName).factory('constructionSystemProjectEstimateModeService', [
		'$q',
		'platformTranslateService',
		'constructionSystemProjectEstimateMode',
		function ($q, platformTranslateService, mode) {
			var items = [
				{Id: mode.original, Code: 'Original', Code$tr$: 'constructionsystem.project.estimateMode.original' },
				{Id: mode.incremental, Code: 'Incremental', Code$tr$: 'constructionsystem.project.estimateMode.incremental'}
			];

			platformTranslateService.translateObject(items);

			return {
				getList: function () {
					return items;
				}
			};
		}
	]);

})(angular);