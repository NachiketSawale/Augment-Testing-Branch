/**
 * Created by ada on 2018/9/26.
 */

(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc directive
	 * @name printReportSettingFieldsetContainerDirective
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * A directive for 'create print Report Setting Fieldset'.
	 *
	 */
	angular.module(moduleName).directive('printReportSettingFieldsetContainerDirective', [
		'$q',
		'$translate',
		'platformModalService',
		'basicsCommonUtilities',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		function (
			$q,
			$translate,
			platformModalService,
			basicsCommonUtilities,
			printConstants,
			printSettingService
		) {
			return {
				restrict: 'A',
				scope: {
					infoProperty: '@',
					part: '@infoPart',
					settings: '=',
					ngModel: '='
				},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/print-report-setting-fieldset-container-template.html',
				controller: ['$scope', function ($scope) {

					var text = '';
					$scope.textFocus = 'left';
					$scope.textChange = function (e) {
						$scope.textFocus = e;
						$scope.ngModel.part = $scope.part;
					};

					var modalOptions = {
						package: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.package'));
							setReportTemplate(text);
							clickChange();
						},
						structure: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.packageStructure'));
							setReportTemplate(text);
							clickChange();
						},
						requisition: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.requisition'));
							setReportTemplate(text);
							clickChange();
						},
						firstName: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.firstName'));
							setReportTemplate(text);
							clickChange();
						},
						lastName: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.lastName'));
							setReportTemplate(text);
							clickChange();
						},
						clerk: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.clerk'));
							setReportTemplate(text);
							clickChange();
						},
						department: function () {
							text = formatText($translate.instant('procurement.pricecomparison.printing.department'));
							setReportTemplate(text);
							clickChange();
						},
						project: function projectCode() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.project'));
							setReportTemplate(text);
							clickChange();
						},
						rfqHeader: function rfqHeader() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.rfq'));
							setReportTemplate(text);
							clickChange();
						},
						company: function companyCode() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.company'));
							setReportTemplate(text);
							clickChange();
						},
						formatText: function formatText() {

							platformModalService.showDialog({
								templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/partials/printing/print-report-font-format-config.html',
								backdrop: false,
								width: '640px',
								resizeable: true,
								value: setReportTemplate('')
								// scope: formatterDialogScope
							}).then(function (result) {
								if (result.isOK) {
									var text = result.value.replace(/&amp;/g, '&');
									setReportTemplate(text, true);
									clickChange();
								}
							});
						},
						pageNumber: function pageNumber() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.page'));
							setReportTemplate(text);
							clickChange();
						},
						totalPageNumber: function totalPageNumber() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.pages'));
							setReportTemplate(text);
							clickChange();
						},
						insertData: function insertData() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.date'));
							setReportTemplate(text);
							clickChange();
						},
						insertTime: function insertTime() {
							text = formatText($translate.instant('procurement.pricecomparison.printing.time'));
							setReportTemplate(text);
							clickChange();
						},
						insertPicture: function insertPicture() {
							var currencySectionString = getFocusSection();
							var index = currencySectionString.indexOf('&[Picture]');
							if (index >= 0) {
								platformModalService.showYesNoDialog(
									$translate.instant('procurement.pricecomparison.printing.insertPictureMeg'),
									$translate.instant('procurement.pricecomparison.printing.insertPictureWaring')
								).then(function (result) {
									if (result.yes) {
										openImageFileDialog().then(function (data) {
											$scope.settings.report[$scope.textFocus + 'Picture'] = basicsCommonUtilities.toBlob(data);
											clickChange();
										});
									}
								});
							} else {
								openImageFileDialog().then(function (data) {
									text = formatText($translate.instant('procurement.pricecomparison.printing.picture'));
									setReportTemplate(text);
									$scope.settings.report[$scope.textFocus + 'Picture'] = basicsCommonUtilities.toBlob(data);
									clickChange();
								});
							}
						}
					};

					function setReportTemplate(text, isReplace) {
						var allText = '';
						if ($scope.textFocus === 'left') {
							if (isReplace) {
								$scope.settings.report.leftTemplate = text;
								return $scope.settings.report.leftTemplate;
							}
							allText = $scope.settings.report.leftTemplate += text;
						} else if ($scope.textFocus === 'middle') {
							if (isReplace) {
								$scope.settings.report.middleTemplate = text;
								return $scope.settings.report.middleTemplate;
							}
							allText = $scope.settings.report.middleTemplate += text;
						} else if ($scope.textFocus === 'right') {
							if (isReplace) {
								$scope.settings.report.rightTemplate = text;
								return $scope.settings.report.rightTemplate;
							}
							allText = $scope.settings.report.rightTemplate += text;
						}
						return allText;
					}

					$scope.$on('print-report-fieldset', function (evt, type) {
						if ($scope.ngModel.part === $scope.part) {
							modalOptions[type]();
						}
					});

					function openImageFileDialog() {
						var deferred = $q.defer();
						var fileElement = angular.element('<input type="file" accept="image/*" />');
						fileElement.bind('change', addImage);
						fileElement.click();
						return deferred.promise;

						function addImage(e) {
							if (e.target.files.length > 0) {
								var reader = new FileReader();
								reader.onload = function () {
									deferred.resolve(reader.result);
								};
								reader.readAsDataURL(e.target.files[0]);
							}
							fileElement.unbind('change', addImage);
						}
					}

					function formatText(text) {
						return '&[' + text + ']';
					}

					function getFocusSection() {
						return $scope.settings.report[$scope.textFocus + 'Template'];
					}

					function clickChange() {
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.genericClickChange
						});
					}
				}]
			};
		}
	]);
})(angular);
