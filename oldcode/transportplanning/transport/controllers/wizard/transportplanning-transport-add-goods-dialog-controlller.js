/**
 * Created by lav on 10/29/2018.
 */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('transportplanningTransportAddGoodsDialogController', Controller);
	Controller.$inject = [
		'$scope',
		'$options',
		'platformTranslateService',
		'$http',
		'transportplanningTransportMainService',
		'transportplanningTransportGoodsTabService',
		'basicsLookupdataConfigGenerator',
		'platformDataValidationService',
		'platformRuntimeDataService'];

	function Controller($scope,
						$options,
						platformTranslateService,
						$http,
						transportMainService,
						transportGoodsTabService,
						basicsLookupdataConfigGenerator,
						platformDataValidationService,
						platformRuntimeDataService) {

		_.extend($scope, $options);

		$scope.modalOptions = {
			headerText: $options.title,
			cancel: close
		};

		function close() {
			$scope.$close(false);
		}

		var formConfig = {
			fid: 'transportplanning.transport.addGoods2TrsRouteModal',
			showGrouping: false,
			addValidationAutomatically: true,
			groups: [
				{
					gid: 'baseGroup'
				}
			],
			rows: [
				{
					gid: 'baseGroup',
					rid: 'id',
					label$tr$: 'transportplanning.transport.entityRoute',
					model: 'Id',
					required: true,
					sortOrder: 1,
					readonly: true,
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupDirective: 'transportplanning-transport-route-lookup',
						descriptionMember: 'DescriptionInfo.Description'
					}
				},
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'transportplanningTransportWaypointLookupDataService',
					filter: function (entity) {
						return entity.Id;
					}
				}, {
					gid: 'baseGroup',
					rid: 'srcwpfk',
					model: 'SrcWPFk',
					required: true,
					sortOrder: 2,
					label$tr$: 'transportplanning.package.entityTrsWaypointSrcFk',
					validator: function (entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, null, transportGoodsTabService);
					}
				}),
				basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
					dataServiceName: 'transportplanningTransportWaypointLookupDataService',
					filter: function (entity) {
						return entity.Id;
					}
				}, {
					gid: 'baseGroup',
					rid: 'dstwpfk',
					model: 'DstWPFk',
					required: true,
					sortOrder: 3,
					label$tr$: 'transportplanning.package.entityTrsWaypointDstFk',
					validator: function (entity, value, model) {
						return platformDataValidationService.validateMandatory(entity, value, model, null, transportGoodsTabService);
					}
				})
			]
		};
		$scope.formOptions = {configure: platformTranslateService.translateFormConfig(formConfig)};

		$scope.isOKDisabled = function () {
			return $scope.isBusy || !transportGoodsTabService.isValid() || !transportGoodsTabService.isAnyGoodsSelected();
		};

		$scope.isShowOKCopyRoute = function () {
			return true;
		};

		$scope.handleOK = function () {
			_.forEach(formConfig.rows, function (row) {
				if (row.validator) {
					var result = row.validator($scope.entity, $scope.entity[row.model], row.model);
					platformRuntimeDataService.applyValidationResult(result, $scope.entity, row.model);
				}
			});
			transportGoodsTabService.endEdit();
			if ($scope.isOKDisabled()) {
				return;
			}
			$scope.isBusy = true;
			var postData = {
				'Route': $scope.entity,
				'SrcWPFk': $scope.entity.SrcWPFk,
				'DstWPFk': $scope.entity.DstWPFk
			};
			_.extend(postData, transportGoodsTabService.getResult());

			$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/addGoods', postData).then(function () {
				$scope.$close(true);
			}, function () {
				$scope.isBusy = false;
			});
		};

		$scope.handleOKCopyRoute = function () {
			$scope.handleOK();
			transportMainService.copy();
			transportMainService.triggerAddGoodsWizard = true;
		};

		getPreselectionSite();

		function getPreselectionSite() {
			$scope.isBusy = true;
			$http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getCurrentClientStockSite').then(function (response) {
				if (response && response.data) {
					$scope.entity.preSelectionSite = response.data;
				}
				$scope.isBusy = false;
			});
		}

		transportGoodsTabService.initialize($scope);

		$scope.$on('$destroy', function () {
			transportGoodsTabService.destroy();
		});
	}
})(angular);