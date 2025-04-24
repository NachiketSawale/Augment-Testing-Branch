(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	angular.module('procurement.invoice').value('procurementInvoiceHeaderReferenceGridColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'dateReceived',
						field: 'DateReceived',
						name: 'DateReceived',
						name$tr$: 'procurement.invoice.header.dateReceived',
						formatter: 'dateutc',
						width: 125
					},
					{
						id: 'dateInvoiced',
						field: 'DateInvoiced',
						name: 'DateInvoiced',
						name$tr$: 'procurement.invoice.header.dateInvoiced',
						formatter: 'dateutc',
						width: 125
					},
					{
						id: 'code',
						field: 'Code',
						formatter: 'code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						width: 125
					},
					{
						id: 'desc',
						field: 'Description',
						formatter: 'description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 125
					},
					{
						id: 'amountGross',
						field: 'AmountGross',
						formatter: 'money',
						name: 'Amount',
						name$tr$: 'procurement.invoice.header.amountGross',
						width: 125
					}
				]
			};
		}
	});
	angular.module('procurement.invoice').controller('procurementInvoiceHeaderReferenceDialogController',
		['$scope', 'procurementInvoiceHeaderReferenceGridColumns',
			'procurementInvoiceReferenceDialogService',
			'platformTranslateService', '$timeout', '$state', '$translate',
			'platformGridControllerService', 'platformGridAPI',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, gridColumns,
				dataService,
				platformTranslateService, $timeout, $state, $translate,
				gridControllerService, platformGridAPI) {

				// error function
				var showError = function (isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				};

				// slick.grid2 setting begin
				var gridConfig = {
					initCalled: false,
					columns: []

				};
				$scope.data = [];

				$scope.getContainerUUID = function () {
					return '8A5318771E444A818EB1F0EC8BCDF352';
				};

				$scope.onContentResized = function () {
				};

				$scope.setTools = function () {
				};

				var init = function () {
					// grid setting
					if (platformGridAPI.grids.exist($scope.getContainerUUID())) {
						platformGridAPI.grids.unregister($scope.getContainerUUID());
					}
					gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

					dataService.refreshGrid();

					// use timeout to do after the grid instance is finished
					$timeout(function () {
						platformGridAPI.grids.resize($scope.getContainerUUID());
					});

					showError(true, dataService.getErrorMessage(), 0);
				};

				$scope.onOK = function () {
					$scope.$close({isOK: true});
				};

				init();

			}]);
})(angular);