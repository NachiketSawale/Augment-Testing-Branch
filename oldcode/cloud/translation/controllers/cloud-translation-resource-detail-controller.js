/**
 * Created by baf on 30.05.2016.
 */
(function (angular) {
	'use strict';
	const moduleName = 'cloud.translation';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('cloudTranslationResourceDetailController', CloudTranslationResourceDetailController);

	CloudTranslationResourceDetailController.$inject = ['$scope', '$rootScope', 'platformContainerControllerService', 'platformRuntimeDataService'];

	function CloudTranslationResourceDetailController($scope, $rootScope, platformContainerControllerService, platformRuntimeDataService) {

		platformContainerControllerService.initController($scope, moduleName, '3475cdad8acb4432a2bae7dbba8af912', 'cloudTranslationTranslationService');
		$scope.formOptions.isDynamicReadonlyConfig = true;
		angular.extend($scope.formOptions, {
			onResourceTermChanged: function (entity) {
				entity.Ischanged = true;
				platformRuntimeDataService.readonly(entity, [{field: 'Ischanged', readonly: false}]);
				$rootScope.$emit('translation.entityChangedFromDetails', entity);
			}
		});

	}
})(angular);