/**
 * Created by zwz on 01/06/2022.
 */

(function (angular) {
	'use strict';
	/* global */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).controller('productionplanningActualTimeRecordingWizardController', Controller);
	Controller.$inject = ['$scope', '$options',  '$translate',
		'platformGridAPI',
		'platformTranslateService',
		'productionplanningActualTimeRecordingWizardService'];

	function Controller($scope, $options, $translate,
		platformGridAPI,
		platformTranslateService,
		wizardService) {

		wizardService.initial($scope, $options);

		$scope.$on('$destroy', function () {

		});
	}
})(angular);