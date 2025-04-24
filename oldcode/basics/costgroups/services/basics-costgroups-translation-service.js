
(function (angular) {
	'use strict';

	var moduleName = 'basics.costgroups';
	/**
	 * @ngdoc service
	 * @name schedulingMainTranslationService
	 * @description provides validation methods for schedules
	 */
	angular.module(moduleName).factory('basicsCostgroupsTranslationService', ['$q','platformUIBaseTranslationService','basicsCostGroupsUIConfigurationService',

		function ($q,PlatformUIBaseTranslationService,costGroupLayout) {

			function CostGroupTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
				//for container information service use
				this.loadTranslations = function () {
					return $q.when(false);
				};
			}

			CostGroupTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			CostGroupTranslationService.prototype.constructor = CostGroupTranslationService;

			return new CostGroupTranslationService([costGroupLayout]);

		}

	]);

})(angular);
