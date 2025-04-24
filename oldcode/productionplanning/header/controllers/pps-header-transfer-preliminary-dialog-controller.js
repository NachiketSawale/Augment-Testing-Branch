(function (angular) {
	'use strict';
	/* global globals, _ */
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).controller('ppsHeaderTransferPreliminaryDialogController', Controller);
	Controller.$inject = [
		'$scope',
		'$options',
		'$http',
		'moment',
		'productionplanningHeaderStatusLookupService',
		'platformModalService',
		'$translate',
		'platformTranslateService',
		'basicsLookupdataConfigGenerator',
		'platformRuntimeDataService'];

	function Controller($scope,
		$options,
		$http,
		moment,
		productionplanningHeaderStatusLookupService,
		platformModalService,
		$translate,
		platformTranslateService,
		basicsLookupdataConfigGenerator,
		platformRuntimeDataService) {

		$scope.formOptions = {
			configure: platformTranslateService.translateFormConfig({
				fid: 'productionplanning.header.preliminary',
				version: '1.0.0',
				showGrouping: false,
				groups: [{
					gid: 'basic',
				}],
				rows: [{
					'gid': 'basic',
					'rid': 'headerId',
					'label': 'Header',
					'type': 'directive',
					'model': 'Id',
					'sortOrder': 0,
					'readonly': true,
					'label$tr$': 'productionplanning.item.headerFk',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupDirective': 'productionplanning-Header-Dialog-Lookup',
					},
					'visible': true
				}]
			})
		};
		$scope.currentRadio = {
			RadioType: '0'
		};
		$scope.headerEntity = $options.selectedItem;
		$scope.handleOK = handleOK;
		$scope.isOKDisabled = false;
		$scope.title = $options.title;
		$scope.dialog = {
			modalOptions: {
				headerText: $translate.instant($options.title),
				showCloseButton: false,
				cancel: close
			}
		};

		$scope.formOptionsForOrdHeader = {
			configure: platformTranslateService.translateFormConfig({
				fid: 'productionplanning.header.preliminary',
				showGrouping: false,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'OrdHeaderFk',
						model: 'OrdHeaderFk',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'salesCommonContractLookupDataService',
							moduleQualifier: 'salesCommonContractLookupDataService',
							desMember: 'Code',
							additionalColumns: true,
							addGridColumns: [{
								id: 'ordHeaderDescription',
								field: 'DescriptionInfo.Translated',
								name: 'Order Header Description',
								width: 200,
								formatter: 'description',
								name$tr$: 'cloud.common.entityDescription'
							}],
							filter: function (item) {
								return item && item.PrjProjectFk ? item.PrjProjectFk : -1;
							},
							navigator: {
								moduleName: 'sales.contract'
							},
						}).detail.options
					}
				]
			})
		};

		$scope.radioOptionChanged = function radioOptionChanged() {
			platformRuntimeDataService.readonly($scope.headerEntity, [{field: 'OrdHeaderFk', readonly: $scope.currentRadio.RadioType === '1' || $scope.isOKDisabled}]);
		};

		function close() {
			return $scope.$close(false);
		}

		const originalOrdHeaderFk = $scope.headerEntity.OrdHeaderFk;

		function handleOK() {
			$scope.isOKDisabled = true;
			$scope.requirement = true;
			platformRuntimeDataService.readonly($scope.headerEntity, [{field: 'OrdHeaderFk', readonly: true}]);
			const isSigned = $scope.currentRadio.RadioType === '0';
			if (!isSigned) {
				$scope.headerEntity.OrdHeaderFk = originalOrdHeaderFk;
			} else {
				$scope.headerEntity.HeaderTypeFk = $options.targetType.Id;
			}
			$http.post(globals.webApiBaseUrl + `productionplanning/header/transferpreliminary?signed=${isSigned}`,
				$scope.headerEntity).then(function (response) {
				if (response) {
					if (response.data) {
						$options.dataService.refreshSelectedEntities().then(() => {
							$scope.$close(false);
						});
					}
				} else {
					$scope.$close(false);
				}
			}, function () {
				$scope.$close(false);
			});
		}
	}
})(angular);