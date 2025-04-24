/**
 * Created by reimer on 01.09.2016.
 */

(function (angular) {

	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,Platform */
	var moduleName = 'procurement.txinterface';

	/* jshint -W072 */
	angular.module(moduleName).factory('procurementTxInterfaceWizardService',
		['$http',
			'$translate',
			'$timeout',
			'$q',
			'$injector',
			'platformTranslateService',
			'platformModalService',
			'procurementTxInterfaceBoqSelectionService',
			'procurementTxInterfaceBidderService',
			'procurementTxInterfaceDocumentService',
			'procurementTxInterfaceQuoteSelectionService',
			function ($http,
				$translate,
				$timeout,
				$q,
				$injector,
				platformTranslateService,
				platformModalService,
				boqSelectionService,
				bidderService,
				documentService,
				quoteSelectionService) {

				var _data = {};

				var service = {};

				var _loadingStatus = false;

				var translationModules = [moduleName, 'boq.main', 'procurement.package', 'project.main', 'cloud.common'];

				service.loadingStatusChanged = new Platform.Messenger();

				var setLoadingStatus = function (newStatus) {
					if (_loadingStatus !== newStatus) {
						_loadingStatus = newStatus;
						service.loadingStatusChanged.fire(_loadingStatus);
					}
				};

				service.showPublishRfQWizard = function showPublishRfQWizard(rfqEntity) {

					var translation = platformTranslateService.registerModule(translationModules, true);
					var loadData = boqSelectionService.loadData(rfqEntity.Id);
					$q.all([loadData, translation]).then(function () {

						// build data entity
						_data.RfqEntity = rfqEntity;
						_data.BoqRootItems = [];
						var prcHeaderFks = [];
						var reqHeaderFk;
						var errMsg;

						angular.forEach(boqSelectionService.getList(), function (item) {
							item.Checked = false;   // add checkbox
							_data.BoqRootItems.push(item);
							// collect all used prc headers
							if (prcHeaderFks.indexOf(item.PrcHeaderFk) === -1) {
								prcHeaderFks.push(item.PrcHeaderFk);
							}

							// determine reqHeaderFk
							if (!reqHeaderFk) {
								reqHeaderFk = item.ReqHeaderFk;
								_data.PrcPackageCode = item.PrcPackageCode;
								_data.PrcPackageDesc = item.PrcPackageDesc;
								_data.PlannedStart = item.PlannedStart;
								_data.PlannedEnd = item.PlannedEnd;
								_data.DateQuotedeadline = item.DateQuotedeadline;
								_data.TimeQuotedeadline = item.TimeQuotedeadline;
								_data.DateAwarddeadline = item.DateAwarddeadline;

							}

							// all items must have the same reqHeaderFk - the tx paltform does not support multiple packages!
							if (reqHeaderFk !== item.ReqHeaderFk) {
								// throw new Error('Multiple Requisitions are not supported by the tx Platform!');
								errMsg = 'procurement.txinterface.error.RfqMustHaveExactOneRequisition';
							}

						});

						if (!reqHeaderFk) {
							errMsg = 'procurement.txinterface.error.RfqMustHaveExactOneRequisition';
						}

						if (_data.BoqRootItems && _data.BoqRootItems.length === 0) {
							errMsg = 'procurement.txinterface.error.RfqMustHaveAtLeastOneBoQ';
						}

						if (errMsg) {
							platformModalService.showErrorBox(errMsg);
							return;
						}

						var loadBidders = bidderService.loadData(rfqEntity.Id);
						var loadDocuments = documentService.loadData(prcHeaderFks);
						$q.all([loadBidders, loadDocuments]).then(function () {

							_data.BidderIds = bidderService.getIdsWithCommunicationChannel4();

							_data.Documents = [];
							angular.forEach(documentService.getList(), function (item) {
								item.Checked = false;   // add checkbox
								_data.Documents.push(item);
							});

							_data.FormSatzId = 10052;  // default

							var modalOptions = {
								templateUrl: globals.appBaseUrl + 'procurement.txinterface/templates/procurement-txinterface-import-wizard-dialog.html',
								backdrop: false,
								windowClass: 'form-modal-dialog',
								headerTextKey: 'procurement.txinterface.importPopupTitle',
								lazyInit: true,
								width: '800px',
								height: '500px',
								value: {selectedId: -1}  // object that will be returned
							};
							platformModalService.showDialog(modalOptions);

						});
					});
				};

				service.startImport = function startImport(userInput) {

					var parameter = {};
					parameter.RfqId = userInput.RfqEntity.Id;
					parameter.PrcAwardMethodFk = userInput.RfqEntity.PrcAwardMethodFk;
					parameter.ProjectFk = userInput.RfqEntity.ProjectFk;
					parameter.BidderIds = userInput.BidderIds;

					parameter.BodHeaderIds = [];
					angular.forEach(userInput.BoqRootItems, function (item) {
						if (item.Checked) {
							parameter.BodHeaderIds.push(item.Id);
						}
					});

					parameter.FileArchiveDocFks = [];
					angular.forEach(userInput.Documents, function (item) {
						if (item.Checked) {
							parameter.FileArchiveDocFks.push(item.FileArchiveDocFk);
						}
					});

					parameter.FormSatzId = userInput.FormSatzId;
					parameter.PrcPackageCode = userInput.PrcPackageCode;
					parameter.PrcPackageDesc = userInput.PrcPackageDesc;
					parameter.PlannedStart = userInput.PlannedStart;
					parameter.PlannedEnd = userInput.PlannedEnd;
					parameter.DateQuotedeadline = userInput.DateQuotedeadline;
					parameter.TimeQuotedeadline = userInput.TimeQuotedeadline;
					parameter.DateAwarddeadline = userInput.DateAwarddeadline;

					setLoadingStatus(true);
					return $http.post(globals.webApiBaseUrl + 'procurement/txinterface/import', parameter)
						.then(function () {
							return true;
						}, function (/* response */) {           /* jshint ignore:line */
							// error case will be handled by interceptor
							return false;
						}).finally(function () {
							setLoadingStatus(false);
						}
						);

				};

				// region ImportBidderQuotes

				service.showImportBidderQuotesWizard = function showImportBidderQuotesWizard(rfqEntity) {

					var translation = platformTranslateService.registerModule(translationModules, true);
					var loadData = quoteSelectionService.loadData(rfqEntity.Id);
					$q.all([loadData, translation]).then(function () {

						var errMsg;

						if (!quoteSelectionService.getList() || quoteSelectionService.getList().length === 0) {
							errMsg = 'procurement.txinterface.error.NoBidderQuotesAvailable';
							platformModalService.showErrorBox(errMsg);
							return;
						}

						// build data entity
						_data.BidderQuotes = quoteSelectionService.getList();

						var modalOptions = {
							templateUrl: globals.appBaseUrl + 'procurement.txinterface/templates/procurement-txinterface-export-wizard-dialog.html',
							backdrop: false,
							windowClass: 'form-modal-dialog',
							headerTextKey: 'procurement.txinterface.exportPopupTitle',
							lazyInit: true,
							resizeable: true,
							value: {selectedId: -1}  // object that will be returned
						};
						platformModalService.showDialog(modalOptions);
					});

				};

				service.startExport = function startExport(userInput) {

					var parameter = {};

					parameter.BidderQuotes = [];
					angular.forEach(userInput.BidderQuotes, function (item) {
						if (item.Checked) {
							parameter.BidderQuotes.push(item);
						}
					});

					setLoadingStatus(true);
					return $http.post(globals.webApiBaseUrl + 'procurement/txinterface/export', parameter)
						.then(function () {
							return true;
						}, function (/* response */) {           /* jshint ignore:line */
							// error case will be handled by interceptor
							return false;
						}).finally(function () {
							setLoadingStatus(false);
						}
						);
				};

				// endregion

				/**
				 * @ngdoc
				 * @name
				 * @function
				 *
				 * @description
				 *
				 */
				service.getEntity = function () {
					return _data;
				};

				return service;

			}]);
})(angular);