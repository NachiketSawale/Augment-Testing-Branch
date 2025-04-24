/**
 * Created by luo on 1/4/2016.
 */
// eslint-disable-next-line no-redeclare
/* global angular,_ */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';
	/** @namespace paramOptions.DefaultGaebExtension */
	/**
	 * @ngdoc controller
	 * @name procurementRfqEmailFaxSettingController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for wizard 'send by email' dialog form group 'email settings'.
	 */
	angular.module(moduleName).controller('procurementRfqEmailFaxSettingController', [
		'$scope', 'procurementRfqEmailFaxWizardService', 'platformTranslateService', 'basicsLookupdataLookupDescriptorService', 'procurementRfqEmailFaxWizardParamService', 'boqMainGaebHelperService',
		function ($scope, dataService, platformTranslateService, lookupDescriptorService, procurementRfqEmailFaxWizardParamService, boqMainGaebHelperService) {

			var paramOptions = procurementRfqEmailFaxWizardParamService.getOptions('RFQ.SENDEMAIL.PARAM');
			var gaebFormatId = null, gaebTypeId = null;
			if (paramOptions && paramOptions.DefaultGaebExtension) {
				gaebFormatId = boqMainGaebHelperService.getGaebFormatId(paramOptions.DefaultGaebExtension);
				gaebTypeId = boqMainGaebHelperService.getGaebTypeId(paramOptions.DefaultGaebExtension);
			}
			$scope.data = {
				rfqReportTemplate: null,
				boqReportTemplate: null,
				gaebFormatId: gaebFormatId || 0,
				gaebTypeId: gaebTypeId || 0,
				itemReportTemplate: null,
				formatTypeId: 1,
				boqFormatTypeId: 1
			};

			$scope.lookupOptions = {
				rfqHeader: {
					showClearButton: true
				},
				boqFormatType: {
					readonly: dataService.existedBoq
				},
				boqReportTemplate: {
					showClearButton: true
				},
				itemReportTemplate: {
					showClearButton: true
				},
				boq: {
					readonly: dataService.existedBoq
				},
				item: {
					readonly: dataService.existedItem
				}
			};

			$scope.changeCreateType = function changeCreateType() {
				if ($scope.data.boqFormatTypeId === 2) { // if selected 'excel'
					$scope.data.gaebFormatId = null;
					$scope.data.gaebTypeId = null;
					$scope.lookupOptions.boqFormatType.readonly = true;
					dataService.existedBoq = true;
				} else {
					$scope.lookupOptions.boqFormatType.readonly = false;
					dataService.existedBoq = false;
					$scope.data.gaebFormatId = 0;  // set default value
					$scope.data.gaebTypeId = 0;
				}
			};

			$scope.$watchGroup(['data.rfqReportTemplate', 'data.boqReportTemplate', 'data.gaebFormatId', 'data.gaebTypeId', 'data.itemReportTemplate', 'data.formatTypeId', 'data.boqFormatTypeId'], function (newValues) {
				dataService.rfqReportTemplateItem = _.find(lookupDescriptorService.getData('RfqEmailFaxRfqReportTemplate'), {Id: newValues[0]});
				dataService.boqReportTemplateItem = _.find(lookupDescriptorService.getData('RfqEmailFaxBoqReportTemplate'), {Id: newValues[1]});
				dataService.gaebFormatExt = boqMainGaebHelperService.getGaebExt(newValues[2], newValues[3]);
				dataService.itemReportTemplateItem = _.find(lookupDescriptorService.getData('RfqEmailFaxItemReportTemplate'), {Id: newValues[4]});
				dataService.formatType = _.find(lookupDescriptorService.getData('rfqemailfaxreportformat'), {Id: newValues[5]}).Description;
				dataService.boqFormatType = _.find(lookupDescriptorService.getData('rfqemailfaxreportboqformat'), {Id: newValues[6]}).Description;
			});

		}
	]);
})(angular);