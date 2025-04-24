(function (angular) {

	'use strict';

	angular.module('businesspartner.contact').controller('businessPartnerAssignmentActivationListController',
		['$scope', '$translate', 'platformGridAPI', 'businessPartnerAssignmentActivationService', 'platformTranslateService',

			function ($scope, $translate, platformGridAPI, businessPartnerAssignmentActivationService, platformTranslateService) {

				let settings = businessPartnerAssignmentActivationService.getGridConfiguration();

				let translatePrefix = 'businesspartner.contact.';

				$scope.modalTitle = $translate.instant(translatePrefix + 'businessPartnerAssignment.grid');
				$scope.gridId = settings.uuid;

				if (!settings.isTranslated) {
					platformTranslateService.translateGridConfig(settings.columns);
					settings.isTranslated = true;
				}

				if (!platformGridAPI.grids.exist($scope.gridId)) {
					let tempColumns = angular.copy(settings.columns);

					let dataList = [];
					businessPartnerAssignmentActivationService.getDataItems().then(function (items) {
						dataList = items;
						platformGridAPI.items.data($scope.gridId, dataList);
					});

					let grid = {
						columns: tempColumns,
						data: [],
						id: $scope.gridId,
						lazyInit: true,
						options: {
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};

					platformGridAPI.grids.config(grid);
				}

				$scope.gridData = {
					state: $scope.gridId
				};

				$scope.onOK = function () {
					$scope.$close({isOK: true});
				};

				$scope.onCancel = function () {
					$scope.$close({isOK: false});
				};

				// eslint-disable-next-line no-unused-vars
				function showError(isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				}

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister(settings.uuid);
				});
			}
		]);
})(angular);