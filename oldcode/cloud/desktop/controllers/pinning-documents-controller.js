(() => {
	'use strict';

	angular.module('cloud.desktop').controller('cloudDesktopPinningDocumentsController', cloudDesktopPinningDocumentsController);

	cloudDesktopPinningDocumentsController.$inject= ['$scope', 'platformContextService'];

	function cloudDesktopPinningDocumentsController($scope, platformContextService) {
		let cacheKey = 'pinningDocumentCache';

		$scope.selectInformation = {
			displayMember: 'description',
			valueMember: 'id',
			items: getUserPages()
		};

		let okButton = $scope.dialog.getButtonById('ok');
		okButton.disabled = function (dialogObject) {
			return !dialogObject.modalOptions.value.entityInfos.userPage;
		};

		setSelectedItems();

		function setSelectedItems() {
			$scope.dialog.modalOptions.value.entityInfos.userPage = platformContextService.getApplicationValue(cacheKey) || $scope.selectInformation.items[0].id;
		}

		$scope.processSelectedItem = function() {
			platformContextService.setApplicationValueWithSave(cacheKey, $scope.dialog.modalOptions.value.entityInfos.userPage);
		};

		function getUserPages() {
			const _toReturn = [];
			angular.forEach($scope.dialog.modalOptions.value.userSettings.items.desktopSettings.user.content, function(page) {
				_toReturn.push({
					id: page.id,
					description: page.pageName
				});
			});
			return _toReturn;
		}
	}
})();