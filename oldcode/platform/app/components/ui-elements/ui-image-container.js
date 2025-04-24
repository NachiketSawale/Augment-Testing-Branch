(function (angular) {
	'use strict';

	function PlatformUiImageContainerController($scope, $element /* , $attrs */) {
		// var ctrl = this;

		// to add standard css class for ui components
		$element[0].classList.add('ui-element');
	}

	var imageContainerConfig = {
		bindings: {
			options: '<',
			url: '<'
		},
		template: '<div class="img-container" data-ng-class="$ctrl.options.cssClass"><img src="$ctrl.url"></div>',
		controller: PlatformUiImageContainerController
	};

	angular.module('platform').component('platformUiImageContainer', imageContainerConfig);

})(window.angular);