/**
 * Created by baf on 22.03.2021
 */

(function (angular) {
	'use strict';
	var cardModule = angular.module('logistic.card');

	cardModule.service('logisticActivityReadOnlyProcessor', LogisticActivityReadOnlyProcessor);

	LogisticActivityReadOnlyProcessor.$inject = ['platformRuntimeDataService','$injector'];

	function LogisticActivityReadOnlyProcessor(platformRuntimeDataService,$injector) {
		this.processItem = function processActivityEntity(activity) {
			platformRuntimeDataService.readonly(activity, [
				{ field: 'ProjectFk', readonly: true },
				{ field: 'ControllingUnitFk', readonly: activity.ProjectFk === null }
			]);

			$injector.get('logisticCardDataService').setEntityToReadonlyIfRootEntityIs(activity);
		};
	}
})(angular);

