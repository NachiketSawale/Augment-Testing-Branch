(function () {
	/* global globals, _ */
	'use strict';

	const angularModule = angular.module('boq.main');

	angularModule.factory('boqMainOenOnlvService', ['$http', '$translate', 'platformDialogService', 'platformLongTextDialogService', 
		function($http, $translate, platformDialogService, platformLongTextDialogService) {
			var service = {};

			service.importOenOnlv = function(boqMainService) {
				var fileElement;
				var rootBoqItem;

				rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}
				else if (boqMainService.isWicBoq()) {
					platformDialogService.showInfoBox('boq.main.wicDisabledFunc');
					return;
				}

				fileElement = angular.element('<input type="file"/>');
				fileElement.attr('accept', '.onlv');
				fileElement.change(function() {
					importOnlv(this.files[0]);
				});
				fileElement.click();

				function importOnlv(selectedFile) {
					var fileReader;
					fileReader = new FileReader();
					fileReader.readAsDataURL(selectedFile);
					fileReader.onload = function(e) {
						const request = {
							BoqHeaderId: rootBoqItem.BoqHeaderFk,
							FileName:    selectedFile.name,
							FileContent: {Content: e.target.result.split(',')[1]}
						};

						$http.post(globals.webApiBaseUrl + 'boq/main/oen/importonlv', request).then(function(response) {
							if (response.data) {
								if (response.data.ErrorDescription) {
									platformLongTextDialogService.showDialog({
										headerText$tr$: 'boq.main.oen.onlvImport',
										topDescription: { text: $translate.instant('boq.main.importFailed'), iconClass: 'tlb-icons ico-info' },
										codeMode: true,
										hidePager: true,
										dataSource: new function() {
											platformLongTextDialogService.LongTextDataSource.call(this);
											this.current = response.data.ErrorDescription;
										}
									});
								}
								else {
									boqMainService.refreshBoqData();

									if (_.some(response.data.Warnings)) {
										platformLongTextDialogService.showDialog({
											headerText$tr$: 'boq.main.oen.onlvImport',
											topDescription: { text: $translate.instant('boq.main.importSucceeded'), iconClass: 'tlb-icons ico-info' },
											codeMode: true,
											hidePager: true,
											dataSource: new function() {
												platformLongTextDialogService.LongTextDataSource.call(this);
												this.current = response.data.Warnings.join('\n');
											}
										});
									}
									else {
										platformDialogService.showInfoBox('boq.main.importSucceeded');
									}
								}
							}
						});
					};
				}
			};

			service.exportOenOnlv = function(boqMainService) {
				var rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}
				else if (boqMainService.isWicBoq()) {
					platformDialogService.showInfoBox('boq.main.wicDisabledFunc');
					return;
				}

				function openDialog() {
					let bodyTemplate = [];
					bodyTemplate +=    '<div data-ng-controller="boqMainOenExportController">';
					bodyTemplate +=       '<div class="platform-form-group offset-1">';
					bodyTemplate +=         '<div class="platform-form-col">';
					bodyTemplate +=             '<simpleradio-control options="oenSchemas" ng-model="oenSchema"></simpleradio-control>';
					bodyTemplate +=          '</div>';
					bodyTemplate +=          '<hr>';
					bodyTemplate +=          '<div class="platform-form-col">';
					bodyTemplate +=              '<simpleradio-control options="oenLvTypes" ng-model="oenLvType"></simpleradio-control>';
					bodyTemplate +=          '</div>';
					bodyTemplate +=      '</div>';
					bodyTemplate +=    '</div>';

					var modalOptions = {
						headerText$tr$: 'boq.main.oen.onlvExport',
						bodyTemplate: bodyTemplate,
						showOkButton: true,
						showCancelButton: true,
						resizeable: false,
						minHeight: '400px',
						minWidth: '400px',
						currentBoqHeaderId: rootBoqItem.BoqHeaderFk,
					};
					return platformDialogService.showDialog(modalOptions);
				}

				openDialog().then(function(result) {
					if (result) {
						var request = {
							BoqHeaderId: result.settings.BoqHeaderId,
							OenSchema:   result.settings.OenSchema,
							OenLvType:   result.settings.OenLvType
						};

						$http.post(globals.webApiBaseUrl + 'boq/main/oen/' + 'exportonlv', request).then(function(response) {
							if (_.isEmpty(response.data.ErrorText)) {
								var link = angular.element(document.querySelectorAll('#downloadLink'));
								link[0].href     = response.data.Uri;
								link[0].download = response.data.FileName;
								link[0].type     = 'application/octet-stream';
								link[0].click();

								platformDialogService.showInfoBox('boq.main.exportSucceeded');
							}
							else {
								platformLongTextDialogService.showDialog({
									headerText$tr$: 'boq.main.oen.onlvExport',
									topDescription: {text: $translate.instant('boq.main.exportFailed'), iconClass: 'tlb-icons ico-info'},
									codeMode: true,
									hidePager: true,
									dataSource: new function() {
										platformLongTextDialogService.LongTextDataSource.call(this);
										this.current = response.data.ErrorText;
									}
								});
							}
						});
					}
				});
			};

			service.exportOenOnlb = function(boqMainService) {
				var rootBoqItem = boqMainService.getRootBoqItem();
				if (!rootBoqItem) {
					platformDialogService.showInfoBox('boq.main.gaebImportBoqMissing');
					return;
				}
				else if (!boqMainService.isWicBoq()) {
					platformDialogService.showInfoBox('boq.main.wicExclisiveFunc');
					return;
				}

				$http.post(globals.webApiBaseUrl + 'boq/main/oen/' + 'exportonlb' + '?boqHeaderId='+boqMainService.getSelected().BoqHeaderFk).then(function(response) {
					if (_.isEmpty(response.data.ErrorText)) {
						var link = angular.element(document.querySelectorAll('#downloadLink'));
						link[0].href     = response.data.Uri;
						link[0].download = response.data.FileName;
						link[0].type     = 'application/octet-stream';
						link[0].click();

						platformDialogService.showInfoBox('boq.main.exportSucceeded');
					}
					else {
						platformLongTextDialogService.showDialog({
							headerText$tr$: 'boq.main.oen.onlbExport',
							topDescription: {text: $translate.instant('boq.main.exportFailed'), iconClass: 'tlb-icons ico-info'},
							codeMode: true,
							hidePager: true,
							dataSource: new function() {
								platformLongTextDialogService.LongTextDataSource.call(this);
								this.current = response.data.ErrorText;
							}
						});
					}
				});
			};

			return service;
		}
	]);

	angularModule.controller('boqMainOenExportController', ['$scope', '$translate',
		function($scope, $translate) {
			$scope.oenSchemas = {
				'valueList': [
					{ 'value':3, 'title':$translate.instant('boq.main.oen.version.2021') }
					// Currently not supported { 'value':2, 'title':$translate.instant('boq.main.oen.version.2015') }
				],
				'required': true
			};
			$scope.oenLvTypes = {
				'valueList': [
					{ 'value':1, 'title':$translate.instant('boq.main.oen.lvTypes.Draft') },
					{ 'value':2, 'title':$translate.instant('boq.main.oen.lvTypes.CostEstimate') },
					{ 'value':3, 'title':$translate.instant('boq.main.oen.lvTypes.Tender') },
					{ 'value':4, 'title':$translate.instant('boq.main.oen.lvTypes.Bid') },
					{ 'value':5, 'title':$translate.instant('boq.main.oen.lvTypes.AlternativeBid') },
					{ 'value':6, 'title':$translate.instant('boq.main.oen.lvTypes.ModifiedBid') },
					{ 'value':7, 'title':$translate.instant('boq.main.oen.lvTypes.Contract') },
					{ 'value':8, 'title':$translate.instant('boq.main.oen.lvTypes.Invoice') },
					{ 'value':9, 'title':$translate.instant('boq.main.oen.lvTypes.AdditionalBid') },
					{ 'value':10,'title':$translate.instant('boq.main.oen.lvTypes.AdjustedContract') }
				],
				'required': true
			};

			$scope.oenSchema = 3;
			$scope.oenLvType = 1;

			// Starts the export
			$scope.dialog.getButtonById('ok').fn = function() {
				$scope.$close({
					ok: true,
					settings: {
						BoqHeaderId: $scope.dialog.modalOptions.currentBoqHeaderId,
						OenSchema:   $scope.oenSchema,
						OenLvType:   $scope.oenLvType}
				});
			};
		}
	]);
})();
