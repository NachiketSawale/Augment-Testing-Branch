/**
 * Created by mov on 4/19/2017.
 */
(function () {
	/* global globals */ 
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainWic2AssemblyListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the Assembly assignments
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('boqMainWic2AssemblyListController',
		['$scope', '$injector', '$http', 'platformControllerExtendService', 'boqMainWic2AssemblyService', 'boqMainWic2AssemblyStandardConfigurationService', 'boqMainWic2AssemblyValidationService',
			function ($scope, $injector, $http, platformControllerExtendService, boqMainWic2AssemblyService, boqMainWic2AssemblyStandardConfigurationService, boqMainWic2AssemblyValidationService) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function cellChangeCallBack(arg) {
						var item = arg.item, col = arg.grid.getColumns()[arg.cell].field;
						if (col === 'EstLineItemFk') {
							$injector.get('boqMainWic2AssemblyProcessorService').processItem(item);
							copyAssemblyToWicAssembly(item);
						}
					},
					costGroupService: 'boqMainWic2AssemblyCostGroupService'
				};

				platformControllerExtendService.initListController($scope, boqMainWic2AssemblyStandardConfigurationService, boqMainWic2AssemblyService, boqMainWic2AssemblyValidationService, myGridConfig);

				$injector.get('boqMainOenService').tryDisableContainer($scope, boqMainWic2AssemblyService.parentService(), true);

				function onBoqItemLineTypeChanged(boqItem) {
					angular.forEach($scope.tools.items, function (item) {
						if (item.id === 'create' || item.id === 'delete') {
							item.disabled = !(item.id === 'create' && boqMainWic2AssemblyService.canCreateDelete());
						}
					});

					boqMainWic2AssemblyService.setListByLineType(boqItem);
					$scope.tools.update();
				}

				boqMainWic2AssemblyService.onBoqItemLineTypeChanged.register(onBoqItemLineTypeChanged);
				boqMainWic2AssemblyService.registerFilters();

				function copyAssemblyToWicAssembly(item) {
					var assembly = $injector.get('estimateMainCommonService').getSelectedLookupItem();
					if (assembly) {
						item.Quantity = assembly.Quantity;
						item.QuantityDetail = assembly.QuantityDetail;
						item.QuantityFactor1 = assembly.QuantityFactor1;
						item.QuantityFactor2 = assembly.QuantityFactor2;
						item.QuantityFactor3 = assembly.QuantityFactor3;
						item.QuantityFactor4 = assembly.QuantityFactor4;
						item.QuantityTotal = assembly.QuantityTotal;
						item.CostTotal = assembly.CostTotal;
						item.QuantityUnitTarget = assembly.QuantityUnitTarget;
						item.CostUnit = assembly.CostUnit;
						item.CostUnitTarget = assembly.CostUnitTarget;
						item.HoursTotal = assembly.HoursTotal;
						item.HoursUnit = assembly.HoursUnit;
						item.HoursUnitTarget = assembly.HoursUnitTarget;
						item.QuantityFactorDetail1 = assembly.QuantityFactorDetail1;
						item.QuantityFactorDetail2 = assembly.QuantityFactorDetail2;
						item.ProductivityFactor = assembly.ProductivityFactor;
						item.CostFactorDetail1 = assembly.CostFactorDetail1;
						item.CostFactorDetail2 = assembly.CostFactorDetail2;
						item.CostFactor1 = assembly.CostFactor1;
						item.CostFactor2 = assembly.CostFactor2;
						item.EstCostRiskFk = assembly.EstCostRiskFk;
						item.LicCostGroup1Fk = assembly.LicCostGroup1Fk;
						item.LicCostGroup2Fk = assembly.LicCostGroup2Fk;
						item.LicCostGroup3Fk = assembly.LicCostGroup3Fk;
						item.LicCostGroup4Fk = assembly.LicCostGroup4Fk;
						item.LicCostGroup5Fk = assembly.LicCostGroup5Fk;
						item.CommentText = assembly.CommentText;
						item.IsLumpsum = assembly.IsLumpsum;
						item.IsDisabled = assembly.IsDisabled;
						item.EstHeaderFk = assembly.EstHeaderFk;
						item.BasUomFk = assembly.BasUomFk;

						$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getcostgroupassigment?lineItemId=' + assembly.Id + '&estHeaderId=' + assembly.EstHeaderFk).then(function (response) {
							$injector.get('basicsCostGroupAssignmentService').attachCostGroupValueToEntity([item], response.data, function identityGetter(entity) {
								return {
									EstHeaderFk: entity.RootItemId,
									EstLineItemFk: entity.MainItemId
								};
							},
							'WicAssembly2CostGroups');
							boqMainWic2AssemblyService.fireItemModified(item);
						});
					}
				}

				$scope.$on('$destroy', function () {
					boqMainWic2AssemblyService.unregisterFilters();
					boqMainWic2AssemblyService.onBoqItemLineTypeChanged.unregister(onBoqItemLineTypeChanged);
				});
			}
		]);
})();
