
(function () {

	'use strict';

	angular.module('qto.main').directive('qtoMainWipWizardSalesContractGrid', ['globals',
		function (globals) {

			let controller = ['_', '$translate', '$injector', '$scope', 'platformGridAPI', 'platformRuntimeDataService', 'salesContractConfigurationService', 'salesCommonUtilsService','qtoMainCreateWipDialogService',
				function (_, $translate, $injector, $scope, platformGridAPI, platformRuntimeDataService, salesContractConfigurationService, salesCommonUtilsService,qtoMainCreateWipDialogService) {

					// interface info to get related contracts
					let getListName = _.get($scope, 'options.getListName');
					let platformCreateUuid = $injector.get('platformCreateUuid');
					$scope.gridId = platformCreateUuid();
					qtoMainCreateWipDialogService.setContractGridId($scope.gridId);

					function getColumns() {
						let iconColumn =[
							{
								id: 'Icon',
								field: 'Icon',
								name: '',
								formatter: 'code',
								width:50,
								name$tr$: ''
							}
						];

						let billToColumn =[
							{
								id: 'billtofk',
								field: 'BillToFk',
								name: 'BillToFk',
								toolTip: 'BillToFk',
								editor:'lookup',
								maxLength:240,
								readOnly:true,
								directive: 'qto-detail-bill-to-lookup',
								name$tr$:  'project.main.billToEntity',

								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'projectBillTo',
									displayMember: 'Code',
									dataServiceName: 'qtoDetailBillToLookupDataService'
								},
								width: 100
							}
						];

						let columns = salesContractConfigurationService.getStandardConfigForListView().columns;

						let columns1 = salesCommonUtilsService.getReadonlyColumnsSubset(columns, [
							'rubriccategoryfk'
						]);

						let columns2 = salesCommonUtilsService.getReadonlyColumnsSubset(columns, [
							'code'
						]);

						let column3 = salesCommonUtilsService.getReadonlyColumnsSubset(columns, [
							'ordstatusfk', 'businesspartnerfk','customerfk','subsidiaryfk', 'descriptioninfo'
						]);

						columns1 = columns1.concat(iconColumn);
						columns1 = columns1.concat(columns2);
						columns1 = columns1.concat(billToColumn);
						columns1 = columns1.concat(column3);

						let code = _.find(columns1,{'id':'code'});
						code.navigator = null;

						columns1.push(salesCommonUtilsService.createMarkerColumn('qtoMainCreateWipDialogService', getListName, true));
						return columns1;
					}

					$scope.loadData = function loadData() {
						qtoMainCreateWipDialogService.loadSalesContracts.fire();
					};

					$scope.gridId = salesCommonUtilsService.createGrid($scope, getColumns(), []);

					// marker change event
					// workaround to make the marker column readonly
					salesCommonUtilsService.addOnCellChangeEvent($scope, $scope.gridId, 'IsMarked', function (value, item) {
						if ($scope.options.readonly) {
							item.IsMarked = !value;
						} else if (item.IsKeepMarked) {
							item.IsMarked = true;
						}
						qtoMainCreateWipDialogService.salesContractIsMarkedChanged.fire(item);
						$scope.$emit('qtoMainWipWizardSalesContractGrid:IsMarkedChanged');
					});

					$scope.loadData();

				}];

			return {
				restrict: 'A',

				scope: {
					ngModel: '=',
					options: '='
				},
				controller: controller,
				templateUrl: globals.appBaseUrl + '/sales.common/templates/sales-common-grid-select-entity.html',
				link: function (scope) {
					scope.$on('reloadGrid', function () {
					});
				}
			};
		}]
	);
})();
