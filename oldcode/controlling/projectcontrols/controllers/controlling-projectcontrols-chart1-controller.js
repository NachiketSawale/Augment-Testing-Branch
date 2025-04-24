(function () {
	/* global globals */
	'use strict';
	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectControlsChart1Controller',
		['$scope','$translate','basicsCommonChartContainerFactoryService', '$http','controllingProjectControlsChartControllerService',
			function ($scope, $translate, basicsCommonChartContainerFactoryService, $http, controllingProjectControlsChartControllerService) {

				$scope.guid = 'A914C83846236459E89CA8DAA6CDEDF0D';

				let chartControllerService = controllingProjectControlsChartControllerService.createNewInstance($scope);

				$http.get(globals.webApiBaseUrl + 'controlling/configuration/contrchart/getdefaultchart1config?mdcContrConfigHeaderFk=1').then(function (response){
					if(response && response.data && response.data.MdcContrChartDto){

						if(response.data.MdcContrChartDto.ChartOptionConfig && response.data.MdcContrChartSeriesDtos && response.data.MdcContrChartSeriesDtos.length > 0){
							$scope.chartClickFun = chartControllerService.chartClickFun;

							basicsCommonChartContainerFactoryService.initController($scope, response.data);

							chartControllerService.initController();
						}else{
							$scope.chartEntity = response.data.MdcContrChartDto;
							$scope.chartEntity.containerTitle = $scope.chartEntity.Description.Translated || $scope.chartEntity.Description.Description;
							$scope.configErr = $translate.instant('controlling.projectcontrols.noConfigData');
						}

					}else{
						$scope.configErr = $translate.instant('controlling.projectcontrols.noConfigData');
					}
				});
			}
		]);
})();