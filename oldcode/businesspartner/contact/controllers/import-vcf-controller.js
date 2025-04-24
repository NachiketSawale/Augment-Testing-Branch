// noinspection SpellCheckingInspection

+/**
+ * Created by Young on 01/18/2022.
+ */

(function (angular) {
	'use strict';

	let moduleName = 'businesspartner.contact';

	angular.module(moduleName).controller('businessPartnerContactImportVCFController', ['$scope', 'platformModalService',
		function ($scope, platformModalService) {
			$scope.options = $scope.$parent.modalOptions;
			$scope.file = null;
			$scope.currentItem = {businessPartnerId: null};

			if ($scope.options.data) {
				$scope.currentItem.businessPartnerId = $scope.options.data.Id;
			}
			$scope.close = function (isOK) {

				if (isOK && !$scope.currentItem.businessPartnerId) {
					return platformModalService.showMsgBox('businesspartner.contact.selectABusinesspartner', 'cloud.common.informationDialogHeader', 'ico-info');
				}
				$scope.$close({
					isOK: isOK,
					file: $scope.file,
					businessPartnerId: $scope.currentItem.businessPartnerId
				});
			};

			$scope.chooseFile = function () {
				let fileElement = angular.element('<input type="file" />');
				let fileFilter = '.vcf';

				fileElement.attr('accept', fileFilter);
				fileElement.bind('change', onFileChange);
				fileElement.click();
			};

			function onFileChange(e) {
				if (e.target.files.length) {
					$scope.$apply(function () {
						$scope.file = e.target.files[0];
					});
				}
			}
		}
	]);

})(angular);