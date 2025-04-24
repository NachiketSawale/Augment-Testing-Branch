/**
 * Created by zos on 5/21/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'businesspartner.certificate';

	angular.module(moduleName).value('ReminderCreateFormConfig', {

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
				'rid': 'batchId',
				'gid': 'CertificateInfo',
				'label$tr$': 'businesspartner.certificate.reminder.label.batch',
				'model': 'BatchId',
				'type': 'description'
			},
			{
				'rid': 'batchDate',
				'gid': 'CertificateInfo',
				'label$tr$': 'businesspartner.certificate.reminder.label.batchDate',
				'model': 'BatchDate',
				'type': 'date'
			},
			{
				'rid': 'email',
				'gid': 'CertificateInfo',
				'label$tr$': 'businesspartner.certificate.reminder.label.useEmail',
				'model': 'Email',
				'type': 'boolean'
			},
			{
				'rid': 'telefax',
				'gid': 'CertificateInfo',
				'label$tr$': 'businesspartner.certificate.reminder.label.useTelefax',
				'model': 'Telefax',
				'type': 'boolean'
			}
		]
	});
	// jshint -W072
	// jshint +W098
	angular.module(moduleName).controller('BusinessPartnerCertificateReminderCreateController', [
		'$scope', '$rootScope', '$timeout', '$translate', 'platformTranslateService', 'ReminderCreateFormConfig', 'moment',
		function ($scope, $rootScope, $timeout, $translate, platformTranslateService, formConfig, moment) {
			$scope.options = $scope.$parent.modalOptions;

			var day = new Date();
			var yearStr = day.getFullYear();
			var monthStr = (day.getMonth() + 1) >= 10 ? day.getMonth() + 1 : '0' + (day.getMonth() + 1);
			var dayStr = day.getDate() >= 10 ? day.getDate() : ('0' + day.getDate());

			// init current item.
			$scope.currentItem = {
				dataItem: $scope.options.currentItem,
				BatchId: '' + yearStr + monthStr + dayStr,
				BatchDate: moment.utc(day),
				Email: false,
				Telefax: false
			};

			// get basic row setting from options
			$scope.options.formRows = $scope.options.formRows || [];

			// translate form config.
			platformTranslateService.translateFormConfig(formConfig);
			$scope.formContainerOptions = {
				formOptions: {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				},
				statusInfo: function () {
				}
			};

			$scope.setTools = function (tools) {
				$scope.tools = tools;
			};

			$scope.modalOptions = {
				closeButtonText: 'Cancel',
				actionButtonText: 'OK',
				headerText: $translate.instant('businesspartner.certificate.wizard.certificateWizard.wizardCaption')
			};

			$scope.modalOptions.ok = function onOK() {
				$scope.$close({
					BatchId: $scope.currentItem.BatchId,
					BatchDate: $scope.currentItem.BatchDate,
					Email: $scope.currentItem.Email,
					Telefax: $scope.currentItem.Telefax
				});
			};

			$scope.modalOptions.close = function onCancel() {
				$scope.$close(false);
			};

			// /**
			// * @name apply
			// * @description if '$apply' is running, delay to next digest cycle
			// */
			// function apply(fn) {
			// var phase=$rootScope.$$phase;
			// if (phase === '$apply' || phase === '$digest') {
			//     $timeout(fn);
			// } else {
			//   fn();
			// }
			// }
		}]);
})(angular);

