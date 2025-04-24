(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportCopyRouteDialogController', CopyRouteDialogController);
	CopyRouteDialogController.$inject = [
		'$scope',
		'$http',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'transportplanningTransportMainService'];

	function CopyRouteDialogController($scope,
									   $http,
									   platformModalService,
									   $translate,
									   platformTranslateService,
									   transportService) {


		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig(createInputRows())
		};
		$scope.formOptions.entity = {CopyNumber: 2};
		$scope.handleOK = handleOK;

		$scope.modalOptions = {
			headerText: $translate.instant('transportplanning.transport.copyRoute.title'),
			cancel: close
		};

		function close() {
			return $scope.$close(false);
		}

		$scope.isOKDisabled = function () {
			return $scope.formOptions.entity.CopyNumber <= 0 || $scope.formOptions.entity.CopyNumber === null;
		};

		function createInputRows() {
			return {
				fid: 'transportplanning.transport.request',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'request',
					isOpen: true,
					visible: true,
					sortOrder: 1
				}],
				rows: [
					{
						gid: 'request',
						rid: 'copyNumber',
						type: 'integer',
						label: '*Copy Number',
						label$tr$: 'transportplanning.transport.copyRoute.copyNumber',
						model: 'CopyNumber',
						sortOrder: 1
					}]
			};
		}

		function handleOK() {
			$scope.isBusy = true;
			transportService.copyMultiple($scope.formOptions.entity, $scope);
		}
	}
})(angular);