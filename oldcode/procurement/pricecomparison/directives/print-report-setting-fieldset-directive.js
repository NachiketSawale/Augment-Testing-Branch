/**
 * Created by ada on 2018/9/26.
 */

(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc directive
	 * @name printReportSettingFieldsetDirective
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * A directive for 'create print Report Setting Fieldset'.
	 *
	 */
	angular.module(moduleName).directive('printReportSettingFieldsetDirective', [
		'$q',
		'$translate',
		function ($q,
			$translate) {
			return {
				restrict: 'A',
				scope: {
					settings: '=infoReportTemplate',
				},
				templateUrl: globals.appBaseUrl + 'procurement.pricecomparison/templates/print-report-setting-fieldset-template.html',
				controller: ['$scope', function ($scope) {

					function setReportFieldset(type) {
						$scope.$broadcast('print-report-fieldset', type);
					}

					$scope.settings.modalOptions = {
						package: function () {
							setReportFieldset('package');
						},
						structure: function () {
							setReportFieldset('structure');
						},
						requisition: function () {
							setReportFieldset('requisition');
						},
						firstName: function () {
							setReportFieldset('firstName');
						},
						lastName: function () {
							setReportFieldset('lastName');
						},
						clerk: function () {
							setReportFieldset('clerk');
						},
						department: function () {
							setReportFieldset('department');
						},
						project: function projectCode() {
							setReportFieldset('project');
						},
						rfqHeader: function rfqHeader() {
							setReportFieldset('rfqHeader');
						},
						company: function companyCode() {
							setReportFieldset('company');
						},
						formatText: function formatText() {
							setReportFieldset('formatText');
						},
						pageNumber: function pageNumber() {
							setReportFieldset('pageNumber');
						},
						totalPageNumber: function totalPageNumber() {
							setReportFieldset('totalPageNumber');
						},
						insertData: function insertData() {
							setReportFieldset('insertData');
						},
						insertTime: function insertTime() {
							setReportFieldset('insertTime');
						},
						insertPicture: function insertPicture() {
							setReportFieldset('insertPicture');
						}
					};

					$scope.settings.options = {
						items: [
							{Id: -1, Description: $translate.instant('procurement.pricecomparison.printing.selectContext')},
							{Id: 1, Description: $translate.instant('procurement.pricecomparison.printing.company'), click: $scope.settings.modalOptions.company},
							{Id: 2, Description: $translate.instant('procurement.pricecomparison.printing.project'), click: $scope.settings.modalOptions.project},
							{Id: 3, Description: $translate.instant('procurement.pricecomparison.printing.package'), click: $scope.settings.modalOptions.package},
							{Id: 4, Description: $translate.instant('procurement.pricecomparison.printing.packageStructure'), click: $scope.settings.modalOptions.structure},
							{Id: 5, Description: $translate.instant('procurement.pricecomparison.printing.requisition'), click: $scope.settings.modalOptions.requisition},
							{Id: 6, Description: $translate.instant('procurement.pricecomparison.printing.rfq'), click: $scope.settings.modalOptions.rfqHeader},
							{Id: 7, Description: $translate.instant('procurement.pricecomparison.printing.firstName'), click: $scope.settings.modalOptions.firstName},
							{Id: 8, Description: $translate.instant('procurement.pricecomparison.printing.lastName'), click: $scope.settings.modalOptions.lastName},
							{Id: 9, Description: $translate.instant('procurement.pricecomparison.printing.clerk'), click: $scope.settings.modalOptions.clerk},
							{Id: 10, Description: $translate.instant('procurement.pricecomparison.printing.department'), click: $scope.settings.modalOptions.department},
							{Id: 11, Description: $translate.instant('procurement.pricecomparison.printing.formatTextTitle'), click: $scope.settings.modalOptions.formatText}
						],
						valueMember: 'Id',
						displayMember: 'Description',
						selected: -1
					};

					$scope.settings.onChange = function (arg) {
						var currentItem = _.find($scope.settings.options.items, {Id: arg});
						if (currentItem && currentItem.Id !== -1) {
							currentItem.click();
							$scope.settings.options.selected = -1;
						}
					};
				}]
			};
		}
	]);
})(angular);
