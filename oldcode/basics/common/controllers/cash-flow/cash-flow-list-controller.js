/**
 * Created by wui on 11/23/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonCashFlowListController', [
		'$scope',
		'$injector',
		'platformGridControllerService',
		'basicsCommonCashFlowContainerServiceFactory',
		'PlatformMessenger',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonUpdateCashFlowProjectionService',
		'_',
		'moment',
		function (
			$scope,
			$injector,
			gridControllerService,
			basicsCommonCashFlowContainerServiceFactory,
			PlatformMessenger,
			basicsLookupdataLookupDescriptorService,
			basicsCommonUpdateCashFlowProjectionService,
			_,
			moment
		) {
			// get environment variable from the module-container.json file
			const identifier = $scope.getContentValue('uuid');
			const parentServiceName = $scope.getContentValue('parentService');
			const translationServiceName = $scope.getContentValue('translationService');

			if (!parentServiceName) {
				throw new Error('Cash flow forecast container misses [parentService] configuration!');
			}

			if (!translationServiceName) {
				throw new Error('Cash flow forecast container misses [translationService] configuration!');
			}

			const parentService = $injector.get(parentServiceName);
			const translationService = $injector.get(translationServiceName);
			const containerService = basicsCommonCashFlowContainerServiceFactory.get(identifier, parentService, translationService);
			const myGridConfig = {initCalled: false, columns: []};
			// defect:133574 Temporarily hide two columns actperiodcost&actperiodcash
			if(parentService.getServiceName()==='procurementPackageDataService'){
				for (let i = containerService.ui.getStandardConfigForListView().columns.length-1; i >= 0; i--) {
					if(containerService.ui.getStandardConfigForListView().columns[i].id==='actperiodcost' ||
						containerService.ui.getStandardConfigForListView().columns[i].id==='actperiodcash'){
						containerService.ui.getStandardConfigForListView().columns.remove(i);
					}
				}
			}

			gridControllerService.initListController($scope, containerService.ui, containerService.data, containerService.validation, myGridConfig);

			$scope.chartTitle = 'Cash Flow Projection';// todo:translate
			$scope.chartType = 'line';
			$scope.triggerUpdateEvent = new PlatformMessenger();

			const removeItems = ['create'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			containerService.data.registerListLoaded(doUpdateChartDate);
			parentService.registerSelectionChanged(doUpdateChartDate);
			containerService.data.onDataRefresh.register(doUpdateChartDate);

			function doUpdateChartDate() {
				clearChart();
				updateChartData();
			}

			function updateChartData() {
				const list = angular.copy(containerService.data.getList());
				const labels = [];
				const cumCostValueList = [];
				const periodCostValueList = [];
				const periodCashOutList = [];

				if (list === null || angular.isUndefined(list) || list.length === 0) {
					return;
				}
				if (containerService.data.prevPeriod) {
					list.unshift({
						EndDate: containerService.data.prevPeriod.EndDate,
						CumCost: null,
						PeriodCost: null,
						PeriodCash: null
					});
				}

				angular.forEach(list, function (item) {

					labels.push(moment.utc(item.EndDate).format('YYYY-MM-DD'));
					const cumCostValueItem = CreateItem(item, 'CumCost');
					cumCostValueList.push(cumCostValueItem);

					const periodCostItem = CreateItem(item, 'PeriodCost');
					periodCostValueList.push(periodCostItem);

					const periodCashItem = CreateItem(item, 'PeriodCash');
					periodCashOutList.push(periodCashItem);

					function CreateItem(item, model) {
						return item[model];
					}
				});

				const dataSource = {
					datasets: [
						{
							lineTension: isLinearAdjustment(),
							label: 'Period Cash',// todo:lta move to translation
							data: periodCashOutList,
							borderColor: 'rgba(100,120,200,0.7)',
							pointBorderColor: 'rgba(75,192,192,1)',
							backgroundColor: 'rgba(0, 0, 0, 0)',
							fill: false,
							cubicInterpolationMode: 'monotone'
						},
						{
							lineTension: isLinearAdjustment(),
							label: 'Cum Cost',
							data: cumCostValueList,
							borderColor: 'rgba(150,100,250,0.7)',
							pointBorderColor: 'rgba(75,192,192,1)',
							backgroundColor: 'rgba(0, 0, 0, 0)',
							fill: false,
							cubicInterpolationMode: 'monotone'
						},
						{
							lineTension: isLinearAdjustment(),
							label: 'Period Cost',
							data: periodCostValueList,
							borderColor: 'rgba(80,210,120,0.7)',
							pointBorderColor: 'rgba(75,192,192,1)',
							backgroundColor: 'rgba(0, 0, 0, 0)',
							fill: false,
							cubicInterpolationMode: 'monotone'
						}]
				};
				dataSource.datasets.yValueDomain = {name: 'money'};
				$scope.chartDataSource = {
					legends: dataSource.datasets.map(getLegend),
					labels: labels,
					datasets: dataSource.datasets
				};
			}

			function clearChart() {
				// clear the chart
				$scope.data = [];
				$scope.chartTitle = '';
				$scope.chartDataSource = {
					legends: [],
					labels: [],
					datasets: []
				};
				if ($scope.$root) {
					$scope.$root.safeApply(); // refresh the chart
				}

			}

			function getLegend(item) {
				return {name: item.label};
			}

			$scope.$on('splitter.ResizeChanged', function () {
				$scope.triggerUpdateEvent.fire();
			});

			function isLinearAdjustment() {
				const isLinear = basicsCommonUpdateCashFlowProjectionService.isLinearAdjustment();
				// 0 is straight line,larger than 0 is bezier curve
				return Number(!isLinear);
			}

			function initContainer() {
				basicsLookupdataLookupDescriptorService.loadData('Scurve');
				doUpdateChartDate();
			}

			initContainer();
		}
	]);

})(angular);