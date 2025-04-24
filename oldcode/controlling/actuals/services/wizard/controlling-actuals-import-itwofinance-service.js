(function () {
	'use strict';

	var angularModule = angular.module('controlling.actuals');

	angularModule.factory('controllingActualsImportItwoFinanceService', ['$translate', 'platformDialogService',
		function ($translate, platformDialogService) {
			var service = {};

			service.import = function() {
				var modalOptions =
				{
					headerText:      $translate.instant('controlling.actuals.synchronizeActualsFromFinance'),
					/* eslint-disable indent */
					bodyTemplate:    ['<section class="modal-body">',
												'<div data-ng-controller="controllingActualsImportItwoFinanceController">',
													'<div class="fullheight">',
													'<div data-platform-form data-form-options="formOptions" entity="formEntity"/>',
													'</div>',
												'</div>',
											'</section>'].join(''),
					/* eslint-enable indent */
					showOkButton:     true,
					showCancelButton: true,
					resizeable:       true,
					height:           '220px',
					minWidth:         '300px',
					width:            '400px'
				};
				platformDialogService.showDialog(modalOptions);
			};

			return service;
		}
	]);

	angularModule.controller('controllingActualsImportItwoFinanceController', ['globals', '$scope', '$http', '$translate', '$injector', 'platformLongTextDialogService',
		function(globals, $scope, $http, $translate, $injector, platformLongTextDialogService) {
			var okButton = $scope.dialog.getButtonById('ok');
			$scope.formEntity  = {};
			$scope.formOptions = { configure:
			{
				showGrouping: false,
				groups: [{}],
				rows: [
					{ label: $translate.instant('basics.common.changeStatus.from'),                                  type:  'date',    model: 'StartDate' },
					{ label: $translate.instant('basics.common.changeStatus.to'),                                    type:  'date',    model: 'EndDate' },
					{ label: $translate.instant('controlling.actuals.synchronizeActualsFromFinanceOnlyUnreadItems'), type:  'boolean', model: 'OnlyUnreadItems' }
				]
			}};

			okButton.disabled = function() {
				return !($scope.formEntity.StartDate && $scope.formEntity.EndDate) || $scope.formEntity.StartDate>$scope.formEntity.EndDate;
			};

			okButton.fn = function () {
				const baseUrl = globals.webApiBaseUrl + 'controlling/actuals/costheader/importfromfinance';
				$http.post(baseUrl + '?startDate='+$scope.formEntity.StartDate.toJSON() + '&endDate='+$scope.formEntity.EndDate.toJSON() + '&onlyUnreadItems='+($scope.formEntity.OnlyUnreadItems===true))
					.then(function (response) {
						if (response.data.ResultCode === 200) {
							$injector.get('controllingActualsCostHeaderListService').refresh();
							$scope.$close({ok: true});
						}

						platformLongTextDialogService.showDialog({
							headerText$tr$: 'controlling.actuals.synchronizeActualsFromFinance',
							topDescription: response.data.ResultCode === 200 ?
								{text: $translate.instant('cloud.common.infoBoxHeader'), iconClass: 'tlb-icons ico-info'}
								: {text: $translate.instant('cloud.common.errorDialogTitle'), iconClass: 'tlb-icons ico-error'},
							codeMode: true,
							hidePager: true,
							// TODO: FIXME: please check following lines (new function ()...)
							dataSource: new function () {
								platformLongTextDialogService.LongTextDataSource.call(this);
								this.current = response.data.ResultMessage.join('\n');
							}
						});
					});
			};
		}
	]);
})();
