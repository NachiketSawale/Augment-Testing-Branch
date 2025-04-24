/**
 * Created by reimer on 03.07.2017
 */

(function () {
	/* global globals, _, Platform */
	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 *
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('boqMainGaebExportService', [
		'$q',
		'$http',
		'$timeout',
		'$translate',
		'platformModalService',
		'platformTranslateService',
		'boqMainElementValidationService',
		function ($q,
			$http,
			$timeout,
			$translate,
			platformModalService,
			translateService,
			boqValidationService) {

			// local buffers
			var _busyStatus = false;

			var service = {};

			service.busyStatusChanged = new Platform.Messenger();

			var setBusyStatus = function (newStatus) {
				if (_busyStatus !== newStatus) {
					_busyStatus = newStatus;
					service.busyStatusChanged.fire(_busyStatus);
				}
			};

			// endregion

			/**
			 * @ngdoc
			 * @name
			 * @function
			 * @description
			 */
			service.showDialog = function (options) {

				var entity = options.boqMainService.getRootBoqItem();
				if (_.isEmpty(entity)) {
					showWarning('boq.main.gaebImportBoqMissing');
					// $log.warn('GAEB import not possible - reason: No BoQ is selected!');
					return;
				}

				if (!Object.prototype.hasOwnProperty.call(options, 'wizardParameter')) {
					options.wizardParameter = {};
				}

				var translation = translateService.registerModule([moduleName, 'basics.common'], true);
				$q.all([translation]).then(function () {

					var modalOptions = {
						templateUrl: globals.appBaseUrl + 'boq.main/templates/boq-gaeb-export.html',
						windowClass: 'form-modal-dialog',
						headerTextKey: 'boq.main.gaebExport',
						options: options
					};

					platformModalService.showDialog(modalOptions).then(function (result) {
						if (result) {
							// doExport(options);   --> called inside the controller
							angular.noop();
						}
					});
				});

			};

			service.doExport = function (options) {

				return boqValidationService.scanBoqBeforeExport2Gaeb(options.boqMainService.getRootBoqItem(), options.selectedExt).then(function (result) {
					if (result) {
						var link = angular.element(document.querySelectorAll('#downloadLink'));
						var boqService = options.boqMainService;
						setBusyStatus(true);
						var projectId = angular.isDefined(boqService.getSelectedProjectId()) && boqService.getSelectedProjectId() !== null ? boqService.getSelectedProjectId() : 0; // Map to 0 if no project id is given to follow expected data type in following http request.

						var params = {};
						params.BoqHeaderId = boqService.getSelectedBoqHeader();
						params.ProjectId = projectId;
						params.GaebExt = options.selectedExt;
						params.Check = options.showProtocol;
						params.ProjectChangeFk = options.ProjectChangeFk || null;
						params.DeviantBidderInfo = options.DeviantBidderInfo || null;
						params.SelectionType = options.selectionType;
						if(params.SelectionType === 1){
							params.From = options.from;
							params.To = options.to;
						}
						params.Specification = options.specification;
						params.QuantityAdj = options.quantityAdj;
						params.Price = options.price;
						params.IsUrb = options.isUrb;

						// return $http.get(globals.webApiBaseUrl + 'boq/main/exportgaeb?boqHeaderId=' + boqService.getSelectedBoqHeader() + '&projectId=' + projectId + '&gaebExt=' + options.selectedExt).then(
						return $http.post(globals.webApiBaseUrl + 'boq/main/exportgaeb', params).then(
							function (response) {
								// var fileName = response.headers('Content-Disposition').slice(21);
								// link[0].href = response.data;
								var fileName = response.data.OriginalFileName;
								link[0].href = response.data.LocalFileName;
								link[0].download = fileName;
								link[0].type = 'application/octet-stream';
								link[0].click();
							}, function () {           /* jshint ignore:line */
								// error case will be handled by interceptor
							}).finally(function () {
							setBusyStatus(false);
						}
						);
					}
				});

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

			service.appendBidderInfo = function (options, headerService) {

				var header = headerService.getSelected();
				if (header && header.BusinessPartner) {
					options.DeviantBidderInfo = {};
					options.DeviantBidderInfo.Name1 = header.BusinessPartner.BusinessPartnerName1;
					options.DeviantBidderInfo.Street = header.BusinessPartner.Street;
					options.DeviantBidderInfo.PCode = header.BusinessPartner.ZipCode;
					options.DeviantBidderInfo.City = header.BusinessPartner.City;
				}
				return options;
			};

			return service;

		}
	]);
})(angular);
