
(function(angular) {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainGenerateBudgetController', ['$scope','$sce','$injector','$translate','$timeout', '$http', 'platformGridAPI', 'platformTranslateService', 'platformSidebarWizardConfigService', 'estimateMainScopeSelectionService','platformFormConfigService',
		function ($scope, $sce,$injector, $translate,$timeout, $http, platformGridAPI, platformTranslateService, platformSidebarWizardConfigService, estimateMainScopeSelectionService,platformFormConfigService) {

			$scope.modalOptions.headerText = $translate.instant('estimate.main.generateBudget');

			$scope.IsWithStandardAllowanceBtn = $scope.options.dataItem.isAtciveStandardAllowance;

			$scope.options.dataItem.StandardAllowanceOption =[
				{
					Description:$translate.instant('estimate.main.GC'),
					Id:1,
					value :'GC',
					checked:true
				},{
					Description:$translate.instant('estimate.main.AM'),
					Id:2,
					value :'AM',
					checked:true
				},
				{
					Description:$translate.instant('estimate.main.ga'),
					Id:3,
					value :'GA',
					checked:true
				},
				{
					Description:$translate.instant('estimate.main.rp'),
					Id:4,
					value :'RP',
					checked:true
				}];

			$scope.dataItem = $scope.options.dataItem;


			function dealTheAllowance(entity,from) {
				let generateBudgetConfig = $scope.formContainerOptions.formOptions.configure.rows[6];// get the  allowanceGroup;
				generateBudgetConfig.visible = from ==='button';

				$scope.IsWithStandardAllowanceBtn = entity.budgetFrm ===1 && $scope.options.dataItem.isAtciveStandardAllowance;

				platformFormConfigService.initialize($scope.formContainerOptions.formOptions, $scope.formContainerOptions.formOptions.configure);
				$scope.$broadcast('form-config-updated', {});
			}

			function getFormConfiguration(){
				// let showStandardAllowanceOption = $scope.IsWithStandardAllowanceBtn && $scope.dataItem.budgetFrm ===1;// && $scope.options.dataItem.budgetFrm === 1;

				let generateBudgetConfig = {
					fid: 'estimate.main.generateBudget',
					version: '0.1.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['selecteditem']
						}
					],
					'overloads': {},
					rows: [
						{
							gid: 'baseGroup',
							rid: 'budgetFrm',
							label: 'Budget From',
							label$tr$: 'estimate.main.budgetFrm',
							type: 'radio',
							model: 'budgetFrm',
							sortOrder: 2,
							change: function(entity){
								dealTheAllowance(entity);
							},
							options: {
								labelMember: 'Description',
								valueMember: 'Value',
								groupName: 'GenerateEstBudgetFrom',
								items: [
									{
										Id: 1,
										Description: $translate.instant ('estimate.main.grandTotal'),
										Value: 1
									},
									{
										Id: 2,
										Description: $translate.instant ('estimate.main.revenue'),
										Value: 2
									},
									{
										Id: 3,
										Description: $translate.instant ('estimate.main.baseCostTotal'),
										Value: 3
									},
									{
										Id: 4,
										Description: $translate.instant ('estimate.main.costTotal'),
										Value: 4
									}
								]
							}
						},
						{
							gid: 'baseGroup',
							rid: 'skipFixedBudgetItems',
							label$tr$: 'estimate.main.skipFixBudgetItems',
							type: 'boolean',
							model: 'skipFixedBudgetItems',
							sortOrder: 3
						},
						{
							rid: 'xfactor',
							gid: 'baseGroup',
							label: 'x factor',
							label$tr$: 'estimate.main.xFactor',
							type: 'factor',
							model: 'factor',
							sortOrder: 4,
							options: {
								decimalPlaces: $injector.get('estimateMainRoundingService').getUiRoundingDigits('CostFactor1','CostFactor1')
							}
						}
					]
				};

				let selectlineItemscopeRow = estimateMainScopeSelectionService.getHighlightScopeFormRow();
				if (selectlineItemscopeRow) {
					selectlineItemscopeRow.gid = 'baseGroup';
					selectlineItemscopeRow.sortOrder = 1;
				}
				generateBudgetConfig.rows.push(selectlineItemscopeRow);

				let resultSetScopeRow = estimateMainScopeSelectionService.getResultSetScopeFormRow();
				if (resultSetScopeRow) {
					resultSetScopeRow.gid = 'baseGroup';
					resultSetScopeRow.sortOrder = 1;
				}
				generateBudgetConfig.rows.push(resultSetScopeRow);

				let allEstimateScopeRow = estimateMainScopeSelectionService.getAllEstimateScopeFormRow();

				if (allEstimateScopeRow) {
					allEstimateScopeRow.gid = 'baseGroup';
					allEstimateScopeRow.sortOrder = 1;
				}
				generateBudgetConfig.rows.push(allEstimateScopeRow);
				generateBudgetConfig.rows.push({
					gid: 'baseGroup',
					rid: 'StandardAllowanceOption',
					label: '',
					label$tr$: '',
					type: 'directive',
					visible: false,
					directive: 'estimate-main-generate-budget-option',
					model: 'StandardAllowanceOption',
					sortOrder: 4
				});

				platformTranslateService.translateFormConfig(generateBudgetConfig);
				generateBudgetConfig.scope = platformSidebarWizardConfigService.getCurrentScope();
				return generateBudgetConfig;
			}


			$scope.formOptions = {
				configure: getFormConfiguration()
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.showStandardAllowanceOption = function (){
				dealTheAllowance($scope.dataItem,'button');
			};

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close({});
			};

			$scope.modalOptions.cancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.$close(false);
			};

			dealTheAllowance($scope.dataItem);
			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);
