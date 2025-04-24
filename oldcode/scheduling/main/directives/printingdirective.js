/* global d3: false, globals */
/**
 * Created by sprotte on 21.05.2015.
 */
/**
 * @ngdoc directive
 * @name scheduling.main.directive:schedulingMainPrintingDirective
 * @element
 * @restrict A
 * @priority
 * @scope
 * @description
 * # PrintingDirective
 * The PrintingDirective composes a print request to the PDF generation web service via a
 * hidden form. It is triggered by the PrintingProviderService.
 */

/* jshint -W072 */ // many parameters because of dependency injection
angular.module('scheduling.main').directive('schedulingMainPrintingDirective', ['schedulingMainPrintingProviderService', function (printing) {
	'use strict';

	return {
		link: link,
		restrict: 'A',
		scope: true
	};

	function link(scope, element) {
		var root, form;
		// Cleanup event handlers upon destruction of scope
		scope.$on('$destroy', function cleanupHandlers() {
			printing.triggerPrintRequest.unregister(prepareForm);
		});

		root = d3.select(element[0]);
		form = root.append('form').attrs({
			'action': globals.webApiBaseUrl + 'scheduling/main/reporting/createpdf',
			/* 'enctype': 'multipart/form-data', */
			'method': 'post',
			'target': '_blank'
		});

		printing.triggerPrintRequest.register(prepareForm);

		function prepareForm() {
			var innerform;
			var json = JSON.stringify(printing.data);
			var length = json.length;
			var halfmeg = 524288;
			var parts = Math.ceil(length / halfmeg);
			var i = 0;
			// fill form with data
			form.selectAll('input').remove();
			form.append('input').attr('name', 'options').attr('hidden', '').attr('value', JSON.stringify(printing.data.settings));
			form.append('input').attr('name', 'filename').attr('hidden', '').attr('value', printing.filename);
			for (i = 0; i < parts; i++) {
				form.append('input').attr('name', 'data' + (i + 1)).attr('hidden', '').attr('value', json.substr(i * halfmeg, halfmeg));
			}
			form.append('input').attr('name', 'header').attr('hidden', '').attr('value', printing.header);
			form.append('input').attr('name', 'footer').attr('hidden', '').attr('value', printing.footer);
			form.append('input').attr('name', 'charttype').attr('hidden', '').attr('value', printing.charttype);
			form.append('input').attr('name', 'headerreport').attr('hidden', '').attr('value', printing.headerreport);
			form.append('input').attr('name', 'footerreport').attr('hidden', '').attr('value', printing.footerreport);
			form.append('input').attr('name', 'logo').attr('hidden', '').attr('value', printing.logo);

			// send form
			innerform = form.node(); // access actual dom element wrapped in d3 element
			innerform.submit();
		}
	}
}]);