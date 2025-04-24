/**
 * Created by reimer on 10.08.2016.
 */

(function () {

	'use strict';

	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonContentViewerDialogService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('basicsCommonContentViewerDialogService', [
		'$q',
		'$http',
		'$timeout',
		'platformModalService',
		'platformTranslateService',
		'globals',
		function (
			$q,
			$http,
			$timeout,
			platformModalService,
			translateService,
			globals) {

			const service = {};

			// local buffers

			let _content = {};

			service.getContent = function () {
				return _content;
			};

			service.showContentDialog = function (content, options) {

				translateService.registerModule(moduleName);
				_content = content;

				const modalOptions = {
					templateUrl: globals.appBaseUrl + 'basics.common/templates/content-viewer-dialog.html',
					backdrop: false,
					windowClass: 'form-modal-dialog',
					headerTextKey: 'basics.common.dialog.showContent'
					// resizeable: true
				};

				angular.extend(modalOptions, options);

				platformModalService.showDialog(modalOptions).then(function () {
					angular.noop();
				});

			};

			return service;

		}
	]);
})(angular);
