(function (angular) {
	'use strict';
	/**
	 * @ngdoc controller
	 * @name basicsAssetMasterRemarkController
	 * @require $scope, basicsAssetMasterService
	 * @description controller for contract header's form view
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('basics.assetmaster').controller('basicsAssetMasterRemarkController',
		['$scope', 'basicsAssetMasterService',
			function ($scope, parentService) {
				$scope.rejectionremark='';
				function parentSelectionChange(e, parentItem) {
					$scope.rejectionremark=parentItem.Remark;
				}
				parentService.registerSelectionChanged(parentSelectionChange);
				$scope.$watch('rejectionremark', function (newValue) {
					let parentParm =  parentService.getSelected();
					if (parentParm) {
						if (parentParm.Remark !== newValue) {
							parentParm.Remark = newValue;
							parentService.markItemAsModified(parentParm);
						}
					}else{
						$scope.rj_disabled = true;
					}
				});
			}
		]);

})(angular);