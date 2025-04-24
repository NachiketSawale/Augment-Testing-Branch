(function () {

	/* global */
	'use strict';

	var modulename = 'boq.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modulename).controller('boqMainOenBoqItemFormController', ['boqMainOenBoqItemFormControllerService', '$scope', 'boqMainService',
		function boqMainOenBoqItemFormControllerFunction(boqMainOenBoqItemFormControllerService, $scope, boqMainService) {
			boqMainOenBoqItemFormControllerService.createDetailController($scope, boqMainService);
		}
	]);
})();