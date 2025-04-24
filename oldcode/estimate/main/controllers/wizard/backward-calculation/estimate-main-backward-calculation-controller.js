(function () {

	'use strict';

	let moduleName = 'estimate.main';
	angular.module(moduleName).value('estimateMainBackwardCalculationController',
		function ($scope, $injector, $translate, estimateMainBackwardCalculationUIService) {
			$scope.entity = {
				FixedPriceLineItems: true,
				LineItemsAllowance: true,
				LineItemsMarkup: true,
				KeepFixedPrice: true,
				ActStandardAllowanceFk: null,
				ActStandardAllowance:null
			};

			let isExecute = false;

			$scope.formOptionsSettings = {
				configure: estimateMainBackwardCalculationUIService.getOptionConfig()
			};
			$scope.modalOptions = {
				cancel: function cancel() {
					$scope.close();
				},
				headerText: 'Backward Calculation'
			};
			$scope.execute = function execute() {
				if (!isExecute) {
					isExecute = true;
					$scope.close();
					let estimateMainBackwardCalculationService = $injector.get('estimateMainBackwardCalculationService');
					estimateMainBackwardCalculationService.execute($scope.entity).then(function (result) {
						if (result) {
							$injector.get('estimateMainService').load().then(function () {
								$injector.get('estStandardAllowancesCostCodeDetailDataService').load();
							});
						}
					}, function () {
						isExecute = false;
					});
				}
			};
			$scope.close = function close() {
				$scope.$close(false);
			};



			$scope.isDisabled = function() {
				return !(($scope.entity.FixedPriceLineItems || $scope.entity.LineItemsAllowance || $scope.entity.LineItemsMarkup)&&!isExecute);
			};

			function setDefaultActiveAllowance() {
				let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				let actAllowance = estimateMainStandardAllowancesDataService.getActiveAllowance();
				if(actAllowance) {
					$scope.entity.ActStandardAllowanceFk = actAllowance.Id;
					$scope.entity.ActStandardAllowance = actAllowance;
				}
			}

			function init() {
				setDefaultActiveAllowance();
			}

			init();
			$scope.$on('$destroy', function () {

			});
		});
})();
