(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	var moduleName = 'qto.main';
	angular.module(moduleName).controller('qtoMainDetailFormController',
		['$scope', '$rootScope', '$timeout', '$injector', 'qtoMainUIStandardService', 'qtoMainDetailService', 'platformDetailControllerService',
			'platformTranslateService', 'qtoMainDetailGridValidationService',
			function ($scope, $rootScope, $timeout, $injector, formConfiguration, dataService, detailControllerService, translateService, validationService) {

				formConfiguration.isDynamicReadonlyConfig = true;
				detailControllerService.initDetailController($scope, dataService, validationService, formConfiguration, translateService);

				$scope.$watch(function () {
					if (dataService.getSelected()) {
						return dataService.getSelected().Result;
					}
				}, function (newVal, oldVal) {
					if (newVal !== oldVal) {
						validationService.validateResult(dataService.getSelected());
					}
				});

				$scope.formOptions.onPropertyChanged =  function onPropertyChanged(entity,field){
					if (field === 'QtoLineTypeCode') {
						entity.IsCalculate = true;
						dataService.updateCalculation();
						if (entity.QtoLineTypeFk === 2) {
							var readOnlyColumns = ['Value1', 'Value2', 'Value3', 'Value4', 'Value5',
								'Operator1', 'Operator2', 'Operator3', 'Operator4', 'Operator5', 'Value1Detail', 'Value2Detail', 'Value3Detail', 'Value4Detail', 'Value5Detail'];
							dataService.updateReadOnly(entity, readOnlyColumns, true);
							dataService.gridRefresh();
						}
					}
				};

				function costGroupLoaded(costGroupCatalogs) {
					$injector.get('basicsCostGroupAssignmentService').refreshDetailForm(costGroupCatalogs, {
						scope: $scope,
						dataService: dataService,
						validationService: validationService,
						formConfiguration: formConfiguration,
						costGroupName: 'basicData'
					});
				}
				dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

				if(dataService.costGroupCatalogs){
					costGroupLoaded(dataService.costGroupCatalogs);
				}

				$scope.$on('$destroy', function () {
					dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
				});

			}]);
})(angular);