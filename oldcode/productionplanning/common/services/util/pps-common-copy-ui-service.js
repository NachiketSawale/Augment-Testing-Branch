/**
 * Created by zov on 10/1/2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name copyStandardUIService
	 * @function
	 * @requires
	 *
	 * @description service to copy UI stanrdard service
	 * #
	 *
	 */
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).value('ppsCopyStandardUIService', {
		copyUISrv: function (uiStandardSrv) {
			var detailConfig = _.cloneDeep(uiStandardSrv.getStandardConfigForDetailView());
			var listConfig = _.cloneDeep(uiStandardSrv.getStandardConfigForListView());
			var dtoScheme = _.cloneDeep(uiStandardSrv.getDtoScheme());
			return {
				getStandardConfigForDetailView: function () {
					return detailConfig;
				},
				getStandardConfigForListView: function () {
					return listConfig;
				},
				getDtoScheme: function () {
					return dtoScheme;
				}
			};
		}
	});

})(angular);