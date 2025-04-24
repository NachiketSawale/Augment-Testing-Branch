/**
 * Created by lnb on 5/14/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).value('BusinessPartnerCertificateRequiredCreateFormConfig', {

		'fid': 'contract.wizard.setReportingDate',  // contract header form identifier
		'version': '1.1.0',     // if same version setting can be reused, otherwise discard settings
		showGrouping: false,
		title$tr$: '',

		'groups': [
			{
				'gid': 'CertificateInfo',
				'header$tr$': 'businesspartner.certificate.wizard.certificateWizard.CertificatesGroup',
				'isOpen': true,
				'visible': true,
				'sortOrder': 1
			}
		],
		'rows': [
			{
				'rid': 'CertificateStatusFk',
				'gid': 'CertificateInfo',
				'label$tr$': 'businesspartner.certificate.wizard.certificateWizard.CertificateStatus',
				'type': 'directive',
				'model': 'StatusFk',
				'directive': 'businesspartner-certificate-status-combobox',
				'options': {
					'filterKey': 'requests-wizard-businesspartner-certificate-status-filter'
				}
			}
		]
	});
	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('BusinessPartnerCertificateRequiredCreateController', [
		'$scope', '$rootScope', '$timeout', '$translate', 'platformTranslateService', 'basicsLookupdataLookupDataService', 'basicsLookupdataLookupDescriptorService', 'BusinessPartnerCertificateRequiredCreateFormConfig', 'basicsLookupdataLookupFilterService',
		function ($scope, $rootScope, $timeout, $translate, platformTranslateService, lookupDataService, basicsLookupdataLookupDescriptorService, formConfig, basicsLookupdataLookupFilterService) {
			$scope.options = $scope.$parent.modalOptions;

			// init current item.
			$scope.currentItem = {
				dataItem: $scope.options.currentItem
			};

			lookupDataService.getSearchList('CertificateStatus', 'IsDefault=true And IsRequest=true').then(
				function (data) {
					if (data && data.items&&data.items.length>0) {
						basicsLookupdataLookupDescriptorService.attachData({CertificateStatus: data.items});
						apply(function () {
							data.items[0].IsDefault = true;
							$scope.currentItem.StatusFk = data.items[0].Id;
						});
					}
				}
			);

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];
			var index = 0;
			formConfig = angular.copy(formConfig);
			angular.forEach($scope.options.formRows, function (row) {
				row.rid = row.rid || 'formrowid' + index++;
				row.gid = 'CertificateInfo';
				formConfig.rows.unshift(row);
			});

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);
			$scope.formContainerOptions = {
				statusInfo: function () {
				}
			};
			$scope.formContainerOptions.formOptions = {
				configure: formConfig,
				showButtons: [],
				validationMethod: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant('businesspartner.certificate.wizard.certificateWizard.caption')
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.isLoading = true;
				var promise = $scope.options.dataProcessor.call(this, {
					StatusFk: $scope.currentItem.StatusFk,
					DataFk: $scope.currentItem.dataItem.Id,
					DataItem: $scope.currentItem.dataItem
				});

				promise.then(function (res) {
					$scope.isLoading = false;
					$scope.isSuccessed = true;

					formConfig.groups[0].isOpen = false; // close form tabs
					$scope.updateDetail = res.data;      // display update feedback
					$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.close'); // set cancel btn display 'close'

				}, function (/* error */) {
					$scope.isLoading = false;
					$scope.isFailed = true;

					formConfig.groups[0].isOpen = false; // close form tabs
					$scope.failedDetail = 'Create Failed!'; // display update feedback
					$scope.modalOptions.closeButtonText = $translate.instant('cloud.common.close'); // set cancel btn display 'close'
				});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			$scope.modalOptions.cancel = $scope.modalOptions.close;

			var filters = [
				{
					key: 'requests-wizard-businesspartner-certificate-status-filter',
					serverSide: true,
					serverKey: 'businesspartner.certificate.certificatestatus.filterkey',
					fn: function () {
						return {IsRequest: true};
					}
				}
			];

			/**
			 * @name apply
			 * @description if '$apply' is running, delay to next digest cycle
			 */
			function apply(fn) {
				var phase = $scope.$$phase;
				if (phase === '$apply' || phase === '$digest') {
					fn();
					$timeout(function () {
						$scope.$digest();
					});
				} else {
					fn();
					$scope.$digest();
				}
			}

			basicsLookupdataLookupFilterService.registerFilter(filters);
			$scope.$on('$destroy', function () {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			});
		}]);
})(angular);

