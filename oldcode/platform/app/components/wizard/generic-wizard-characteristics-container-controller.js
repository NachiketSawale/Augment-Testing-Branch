(function (angular) {

	'use strict';

	angular.module('platform').controller('genericWizardCharacteristicsContainerController', ['$scope', '$element', 'genericWizardContainerLayoutService', '$injector', 'platformGridAPI', '$timeout', '$rootScope', 'platformCreateUuid', function ($scope, $element, layoutService, $injector, platformGridAPI, $timeout, $rootScope, platformCreateUuid) {
		$scope.docId = $element[0].attributes['data-doc-id'].nodeValue;
		$scope.moduleFk = $element[0].attributes['data-module-fk'].nodeValue;
		$scope.ctnId = $element[0].attributes['data-ctn-id'].nodeValue;
		$scope.loading = false;
	}
	]);
})(angular);
