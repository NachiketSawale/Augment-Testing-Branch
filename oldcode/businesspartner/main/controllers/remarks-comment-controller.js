(function (angular) {
	'use strict';
	let moduleName = 'businesspartner.main';
	angular.module(moduleName).controller('businesspartnerMainMarketingController', BusinesspartnerMainMarketingController);
	BusinesspartnerMainMarketingController.$inject = ['$scope', 'platformSingleRemarkControllerService', 'businesspartnerMainHeaderDataService', 'businesspartnerMainHeaderValidationService'];

	function BusinesspartnerMainMarketingController($scope, platformSingleRemarkControllerService, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService) {
		let layout = {
			version: '1.0.0',
			fid: 'businesspartner.main.remarkMarketing',
			addValidationAutomatically: true,
			remark: 'remarkMarketing',
			model: 'RemarkMarketing'
		};
		platformSingleRemarkControllerService.initController($scope, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService, layout);
	}

	angular.module(moduleName).controller('businesspartnerMainRemark1Controller', BusinesspartnerMainRemark1Controller);
	BusinesspartnerMainRemark1Controller.$inject = ['$scope', 'platformSingleRemarkControllerService', 'businesspartnerMainHeaderDataService', 'businesspartnerMainHeaderValidationService'];

	function BusinesspartnerMainRemark1Controller($scope, platformSingleRemarkControllerService, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService) {
		let layout = {
			version: '1.0.0',
			fid: 'businesspartner.main.remark1',
			addValidationAutomatically: true,
			remark: 'remark1',
			model: 'Remark1'
		};
		platformSingleRemarkControllerService.initController($scope, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService, layout);
	}

	angular.module(moduleName).controller('businesspartnerMainRemark2Controller', BusinesspartnerMainRemark2Controller);
	BusinesspartnerMainRemark2Controller.$inject = ['$scope', 'platformSingleRemarkControllerService', 'businesspartnerMainHeaderDataService', 'businesspartnerMainHeaderValidationService'];

	function BusinesspartnerMainRemark2Controller($scope, platformSingleRemarkControllerService, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService) {
		let layout = {
			version: '1.0.0',
			fid: 'businesspartner.main.remark2',
			addValidationAutomatically: true,
			remark: 'remark2',
			model: 'Remark2'
		};
		platformSingleRemarkControllerService.initController($scope, businesspartnerMainHeaderDataService, businesspartnerMainHeaderValidationService, layout);
	}

	/* angular.module('businesspartner.main').controller('businesspartnerMainMarketingController',
		['$scope','businesspartnerMainHeaderDataService', 'platformModuleStateService',
			function($scope,businesspartnerMainHeaderDataService, platformModuleStateService){
			commentControllerBase($scope,businesspartnerMainHeaderDataService,'RemarkMarketing', platformModuleStateService);
		}]);

	 angular.module('businesspartner.main').controller('businesspartnerMainRemark1Controller',
		['$scope','businesspartnerMainHeaderDataService', 'platformModuleStateService',
			function($scope,businesspartnerMainHeaderDataService, platformModuleStateService){
			commentControllerBase($scope,businesspartnerMainHeaderDataService,'Remark1', platformModuleStateService);
		}]);

	angular.module('businesspartner.main').controller('businesspartnerMainRemark2Controller',
		['$scope','businesspartnerMainHeaderDataService', 'platformModuleStateService',
			function($scope,businesspartnerMainHeaderDataService, platformModuleStateService){
			commentControllerBase($scope,businesspartnerMainHeaderDataService,'Remark2', platformModuleStateService);
		}]); */

	/**
	 * @ngdoc function
	 * @name commentControllerBase
	 * @function
	 * @methodOf
	 * @description commentController Base
	 */
	// eslint-disable-next-line no-unused-vars
	function commentControllerBase($scope, dataService, field, platformModuleStateService) {

		let validationService = {
			validateModel: function () {
			}
		};

		$scope.validKeys = {able: true, out: ''};

		$scope.field = field;

		$scope.entity = dataService.getSelected();

		$scope.entityChange = true;

		// noinspection JSUnusedLocalSymbols
		function onCurrentItemChanged(arg, currItem) {
			$scope.entity = currItem;
			$scope.entityChange = true;
		}

		dataService.registerSelectionChanged(onCurrentItemChanged);
		$scope.$on('$destroy', function () {
			dataService.registerSelectionChanged(onCurrentItemChanged);
		});

		$scope.showError = function ser(message) {
			let isShow = !!message;
			$scope.error = {
				show: isShow,
				messageCol: 1,
				message: message,
				type: isShow ? 3 : 0
			};
		};

		$scope.keyPress = function (e) {
			let inChar = String.fromCharCode(e.keyCode || e.which);
			let validKeys = $scope.validKeys;

			$scope.ngModel = $scope.entity[$scope.field];

			if (validKeys?.able) {
				if (validKeys.in?.indexOf(inChar) === -1) {// out validKeys.in
					e.preventDefault();
				}
				if (validKeys.out?.indexOf(inChar) !== -1) {// in validKeys.out
					e.preventDefault();
				}
				if (validKeys.fun && !validKeys.fun($scope.ngModel, inChar)) {// fun fail
					e.preventDefault();
				}
				if (validKeys.regular && !validKeys.regular.test(($scope.ngModel || '') + inChar)) {// regular fail
					e.preventDefault();
				}
			}
		};

		$scope.$watch('entity.' + $scope.field, function () {
			if ($scope.entityChange) {
				$scope.entityChange = false;
			} else {
				if ($scope.entity && dataService.getItemById($scope.entity.Id)) {
					let modState = platformModuleStateService.state(dataService.getModule());
					let elemState = dataService.assertPath(modState.modifications, false, $scope.entity);
					dataService.addEntityToModified(elemState, $scope.entity, modState.modifications);
				}
				validationService.validateModel($scope.entity, $scope.field, $scope.entity[$scope.field]);
				if ($scope.entity.errors?.[$scope.field]) {
					$scope.showError(JSON.stringify($scope.entity.errors[$scope.field]));
				} else {
					$scope.showError();
				}
			}
		});

		$scope.setReadonly = function () {
			return parentStatusIsReadonly();
		};

		function parentStatusIsReadonly() {
			// if parent satus is readonly, then the form data should not be editable
			let parentService = dataService;
			if (parentService) {
				let parentSelectItem = parentService.getSelected();
				if (!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined) {
					return parentSelectItem.IsReadonlyStatus;
				} else if (parentService.getItemStatus !== undefined) {
					let status = parentService.getItemStatus();
					return status.IsReadonly;
				}
			}
			return false;
		}
	}

})(angular);