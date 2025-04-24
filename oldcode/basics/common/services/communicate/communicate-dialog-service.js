(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).value('basicsCommonCommunicateTypes', {
		email: {
			name: 'email',
			headerText: 'basics.common.email.headerText',
			recipientText: 'basics.common.email.recipientText',
			successText: 'basics.common.email.success',
			failText: 'basics.common.email.fail'
		},
		fax: {
			name: 'fax',
			headerText: 'basics.common.fax.headerText',
			recipientText: 'basics.common.fax.recipientText',
			successText: 'basics.common.fax.success',
			failText: 'basics.common.fax.fail'
		}
	});

	/**
	 * @ngdoc service
	 * @name basicsCommonCommunicateDialogService
	 * @function
	 * @requires $q
	 *
	 * @description
	 * #
	 * data service for communicate dialog for sending email/fax.
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('basicsCommonCommunicateDialogService', [
		'$q', '$translate', 'platformModalService', 'basicsCommonCommunicateTypes', 'platformTranslateService', 'globals', '$',
		function ($q, $translate, platformModalService, communicateTypes, platformTranslateService, globals, $) {
			const service = {};

			platformTranslateService.registerModule('basics.common');

			service.showCommunicateDialog = function showCommunicateDialog(customOptions) {
				const defer = $q.defer();

				const defaultOptions = {
					headerText: $translate.instant(communicateTypes[customOptions.communicateType].headerText),
					recipientText: $translate.instant(communicateTypes[customOptions.communicateType].recipientText),
					sendSuccessText: $translate.instant(communicateTypes[customOptions.communicateType].successText),
					sendFailText: $translate.instant(communicateTypes[customOptions.communicateType].failText),
					templateUrl: globals.appBaseUrl + 'basics.common/partials/communicate-dialog.html',
					url: null,
					backdrop: false,
					width: 'max',
					maxWidth: '1000px',
					showBtnPreview: false
				};

				customOptions = $.extend({}, defaultOptions, customOptions);

				platformModalService.showDialog(customOptions).then(function (result) {
					defer.resolve(result);
				});

				return defer.promise;
			};

			return service;
		}
	]);
})(angular);