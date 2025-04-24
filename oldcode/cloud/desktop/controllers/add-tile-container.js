(() => {
	'use strict';

	function cloudDesktopAddTileContainer($scope, cloudDesktopModuleTypes, platformDialogService, $translate) {
		$scope.urlConfig = {
			model: '',
			field: 'url',
			change: function () {
				$scope.dialog.modalOptions.value.url = $scope.urlConfig.model;
			}
		};

		$scope.selectTileTyp = {
			displayMember: 'description',
			valueMember: 'id',
			items: [{
				id: cloudDesktopModuleTypes.web,
				description: $translate.instant('cloud.desktop.design.desktop.typWeb')
			}, {
				id: cloudDesktopModuleTypes.quickstart,
				description: $translate.instant('cloud.desktop.design.desktop.typQuickstart')
			}]
		};
	}

	cloudDesktopAddTileContainer.$inject = ['$scope', 'cloudDesktopModuleTypes', 'platformDialogService', '$translate'];
	angular.module('cloud.desktop').controller('cloudDesktopAddTileContainer', cloudDesktopAddTileContainer);
})();
