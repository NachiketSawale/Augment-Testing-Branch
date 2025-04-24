(function (angualar) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonExportMaterialWizardController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'export material(D94)' dialog in pricecomparison.
	 */
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	angualar.module(moduleName).controller('procurementPriceComparisonExportMaterialWizardController', [
		'$scope', '$translate', '$http', '$state', '$timeout', 'cloudDesktopSidebarService', '$document',
		'procurementPriceComparisonExportMaterialWizardGridService', 'basicsCommonFileDownloadService',
		function ($scope, $translate, $http, $state, $timeout, cloudDesktopSidebarService, $document,
			exportMaterialWizardGridService, basicsCommonFileDownloadService) {
			var translatePrefix = 'procurement.pricecomparison.wizard';
			var formOptions = {
				fid: 'procurement.pricecomparison.export.material.wizard',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						gid: 'export.material.wizard',
						header: $translate.instant(translatePrefix + '.exportMaterialGrid.choose.quote'),
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [
					{
						gid: 'export.material.wizard',
						label: '',
						rid: '1',
						type: 'directive',
						directive: 'procurement-price-comparison-export-material-wizard-grid-directive'
					}
				]
			};
			// the form view
			$scope.containerOptions = {
				formOptions: {
					configure: formOptions
				}
			};

			$scope.modalOptions = {
				headerText: $translate.instant(translatePrefix + '.exportMaterial'),
				btnOkText: $translate.instant('cloud.common.ok'),
				btnCancelText: $translate.instant('cloud.common.cancel'),
				isBtnOkDisabled: true,
				dialogLoading: false,
				loadingInfo: '',
				ok: onOK,
				close: function () {
					$scope.$close(false);
				},
				cancel: function () {
					$scope.$close(false);
				}
			};
			exportMaterialWizardGridService.registerSelectionChanged(onCurrentItemChanged);
			$scope.$on('$destroy', function () {
				exportMaterialWizardGridService.unregisterSelectionChanged(onCurrentItemChanged);
			});

			function onCurrentItemChanged() {
				$scope.modalOptions.isBtnOkDisabled = false;
				hideInfo();
			}

			function onOK() {
				var headerItem = exportMaterialWizardGridService.getSelected();
				if (!headerItem) {
					return;
				}
				var _moduleName = 'procurement.quote';
				$http.get(globals.webApiBaseUrl + 'procurement/common/wizard/exportmaterial?objectFk=' + headerItem.QuoteHeaderId + '&ProjectFk=' + headerItem.ProjectId + '&CurrencyFk=' + headerItem.CurrencyId + '&moduleName=' + _moduleName + '&subObjectFk=' + 0).then(
					function (response) {
						if (response.data && response.data.FileName) {
							basicsCommonFileDownloadService.download(null, {
								FileName: response.data.FileName,
								Path: response.data.path
							});
						}
					}
				);
				$scope.$close(false);
			}

			function hideInfo() {
				$scope.error = {
					show: false,
					messageCol: 1,
					message: '',
					type: 0
				};
			}
		}
	]);
})(angular);
