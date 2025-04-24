/**
 * Created by reimer on 28.11.2018.
 */

(function () {
	/* global globals, _ */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainSplitUrbService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainSplitUrbService', [
		'$q',
		'$http',
		'$timeout',
		'platformModalService',
		'platformTranslateService',
		'platformSchemaService',
		'platformRuntimeDataService',
		'$log',
		function ($q,
			$http,
			$timeout,
			platformModalService,
			platformTranslateService,
			platformSchemaService,
			platformRuntimeDataService,
			$log) {

			var service = {};

			// local buffers

			service.showDialog = function (params) {

				if (!Object.prototype.hasOwnProperty.call(params, 'boqHeaderService') || params.boqHeaderService === null) {
					$log.warn('Must pass boqHeaderService as params property!');
					return;
				}

				if (!Object.prototype.hasOwnProperty.call(params, 'boqStructureService') || params.boqStructureService === null) {
					$log.warn('Must pass boqStructureService as params property!');
					return;
				}

				var entity = params.boqHeaderService.getSelected();
				if (_.isEmpty(entity)) {
					showWarning('boq.main.gaebImportBoqMissing');
					return;
				}

				if (Object.prototype.hasOwnProperty.call(params.boqStructureService, 'getReadOnly') && params.boqStructureService.getReadOnly()) {
					$log.warn('BoQ is read only!');
					return;
				}

				params.BoqHeaderFk = entity.BoqHeaderFk;

				// Check for unique first letter in URB names
				// This functionality currently only works if the first letter of each included URB is unique
				// for this first letter is used as Index for the reference number of the positions to be created.
				var boqStructure = params.boqStructureService.getBoqStructure();
				var urbNameProperty = 'NameUrb';
				var urbName = null;
				var firstLetter = '';
				var firstLetters = [];
				if (_.isObject(boqStructure)) {
					for (var i = 1; i <= 6; i++) {
						urbName = boqStructure[urbNameProperty + i];
						if (!_.isEmpty(urbName)) {
							firstLetter = urbName.length > 1 ? urbName.charAt(0) : urbName;

							if (!_.includes(firstLetters, firstLetter)) {
								firstLetters.push(firstLetter);
							} else {
								// Error case -> second urb name with same first letter found
								// -> exit here
								showWarning('boq.main.splitUrbSameFirstLetter');
								return;
							}
						}
					}
				} else {
					$log.warn('BoQ Structure definition not yet loaded!');
					return;
				}

				var modalOptions = {
					templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-main-split-urb-dialog.html',
					windowClass: 'form-modal-dialog',
					headerTextKey: 'boq.main.splitUrbPopupTitle',
					options: params
				};

				platformModalService.showDialog(modalOptions).then(function (result) {
					if (result) {
						// doExport(options);   --> called inside the controller
						angular.noop();
					}
				});

			};

			service.splitUrbItems = function (params) {

				return $http.post(globals.webApiBaseUrl + 'boq/main/spliturbitems', params)
					.then(function () {
						params.boqHeaderService.load();  // re-load boq
						return true;
					}, function () {           /* jshint ignore:line */
						// error case will be handled by interceptor
					}).finally(function () {
						// setBusyStatus(false);
						angular.noop();
					}
					);
			};

			function showWarning(message) {
				var modalOptions = {
					headerTextKey: 'boq.main.warning',
					bodyTextKey: message,
					showOkButton: true,
					iconClass: 'ico-warning'
				};
				platformModalService.showDialog(modalOptions);
			}

			return service;

		}
	]);
})(angular);
