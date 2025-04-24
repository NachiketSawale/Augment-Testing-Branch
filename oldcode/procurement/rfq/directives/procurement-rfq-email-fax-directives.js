/**
 * Created by luo on 1/4/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */
	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxSettingDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for procurement rfq wizard 'email' dialog group 'Email Settings'
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxSettingDirective', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/procurement-rfq-email-fax-setting.html',
				controller: 'procurementRfqEmailFaxSettingController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailRecipientDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for procurement rfq wizard 'email' dialog group 'Email Recipients'
	 */
	angular.module(moduleName).directive('procurementRfqEmailRecipientDirective', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/procurement-rfq-email-fax-recipient.html',
				controller: 'procurementRfqEmailRecipientController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqFaxRecipientDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for procurement rfq wizard 'fax' dialog group 'fax Recipients'
	 */
	angular.module(moduleName).directive('procurementRfqFaxRecipientDirective', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/procurement-rfq-email-fax-recipient.html',
				controller: 'procurementRfqFaxRecipientController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailSenderDirective
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a directive for procurement rfq wizard send email dialog sender group
	 */
	angular.module(moduleName).directive('procurementRfqEmailSenderDirective', [
		function () {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'procurement.rfq/partials/procurement-rfq-email-sender.html',
				controller: 'procurementRfqEmailSenderController'
			};
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxRfqReportTemplateCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox directive for procurement rfq wizard 'email' group 'Email Settings's rfq report template.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxRfqReportTemplateCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDescriptorService',
		function (LookupDirectiveDefinition, lookupDescriptorService) {
			var defaults = {
				lookupType: 'RfqEmailFaxRfqReportTemplate',
				valueMember: 'id',
				displayMember: 'name'
			};

			var customOptions = {
				url: {getList: 'basics/reporting/sidebar/load?module=procurement.rfq'},
				processData: function (data) {
					var reports = [];
					angular.forEach(data, function (item) {
						_.map(item.reports, function (report) {
							// report id is lowercase, but lookup descriptor service store dictionary key a uppercase 'Id'. so need add a 'Id'.
							report.Id = report.id;
							reports.push(report);
						});
					});

					reports = _.uniq(reports, 'Id'); // remove repeated item
					lookupDescriptorService.attachData({RfqEmailFaxRfqReportTemplate: reports}); // store it into lookup descriptor service

					return reports;
				}
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxBoqReportTemplateCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox directive for procurement rfq wizard 'email' group 'Email Settings's requisition boq report template.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxBoqReportTemplateCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDescriptorService',
		function (LookupDirectiveDefinition, lookupDescriptorService) {
			var defaults = {
				lookupType: 'RfqEmailFaxBoqReportTemplate',
				valueMember: 'id',
				displayMember: 'name'
			};

			var customOptions = {
				url: {getList: 'basics/reporting/sidebar/load?module=boq.main'},
				processData: function (data) {
					var reports = [];
					angular.forEach(data, function (item) {
						_.map(item.reports, function (report) {
							// report id is lowercase, but lookup descriptor service store dictionary key a uppercase 'Id'. so need add a 'Id'.
							report.Id = report.id;
							reports.push(report);
						});
					});

					reports = _.uniq(reports, 'Id'); // remove repeated item
					lookupDescriptorService.attachData({RfqEmailFaxBoqReportTemplate: reports}); // store it into lookup descriptor service

					return reports;
				}
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailReportTemplateCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox lookup directive for procurement rfq wizard 'email' group 'Email Settings's gaeb format.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxGaebFormatCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (LookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'RfqEmailFaxGaebFormat',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			var customOptions = {
				dataProvider: 'procurementRfqEmailFaxGaebFormatService'
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxReportFormatCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox lookup directive for procurement rfq wizard 'email' group 'Email Settings's gaeb format.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxReportFormatCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (LookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'rfqemailfaxreportformat',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			var customOptions = {
				dataProvider: 'procurementRfqEmailFaxReportFormatService'
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxReportBoqFormatCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox lookup directive for procurement rfq wizard 'email' group 'Email Settings's gaeb format.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxReportBoqFormatCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (LookupDirectiveDefinition) {
			var defaults = {
				lookupType: 'rfqemailfaxreportboqformat',
				valueMember: 'Id',
				displayMember: 'Description'
			};
			var customOptions = {
				dataProvider: 'procurementRfqEmailFaxReportBoqFormatService'
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

	/**
	 * @ngdoc directive
	 * @name procurementRfqEmailFaxItemReportTemplateCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * #
	 * a combobox directive for procurement rfq wizard 'email' group 'Email Settings's requisition boq report template.
	 */
	angular.module(moduleName).directive('procurementRfqEmailFaxItemReportTemplateCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition', 'basicsLookupdataLookupDescriptorService',
		function (LookupDirectiveDefinition, lookupDescriptorService) {
			var defaults = {
				lookupType: 'rfqemailfaxitemreporttemplate',
				valueMember: 'id',
				displayMember: 'name'
			};

			var customOptions = {
				url: {getList: 'basics/reporting/sidebar/load?module=basics.material'},
				processData: function (data) {
					var reports = [];
					angular.forEach(data, function (item) {
						_.map(item.reports, function (report) {
							// report id is lowercase, but lookup descriptor service store dictionary key a uppercase 'Id'. so need add a 'Id'.
							report.Id = report.id;
							reports.push(report);
						});
					});

					reports = _.uniq(reports, 'Id'); // remove repeated item
					lookupDescriptorService.attachData({rfqemailfaxitemreporttemplate: reports}); // store it into lookup descriptor service

					return reports;
				}
			};

			return new LookupDirectiveDefinition('combobox-edit', defaults, customOptions);
		}
	]);

})(angular);