/* global Platform, globals */
/**
 * Created by sprotte on 21.05.2015.
 */
angular.module('scheduling.main').factory('schedulingMainPrintingProviderService', ['$http',
	function ($http) {
		'use strict';
		var service = this;
		service.generatePDF = generatePDF;
		service.downloadPDF = downloadPDF;
		service.triggerPrintRequest = new Platform.Messenger();

		Object.defineProperties(service, {
			'options': {
				value: {
					landscape: true,
					pagesize: 'A4'
				},
				writable: true,
				enumerable: true
			},
			'filename': {
				value: 'export.pdf',
				writable: true,
				enumerable: true
			},
			'data': {
				value: {},
				writable: true,
				enumerable: true
			},
			'header': {
				value: '',
				writable: true,
				enumerable: true
			},
			'footer': {
				value: '',
				writable: true,
				enumerable: true
			},
			'charttype': {
				value: 'gantt',
				writable: true,
				enumerable: true
			},
			'logo': {
				value: '',
				writable: true,
				enumerable: true
			},
			'headerreport': {
				value: '',
				writable: true,
				enumerable: true
			},
			'footerreport': {
				value: '',
				writable: true,
				enumerable: true
			}
		});

		return service;

		function downloadPDF() {
			var returnobject = {
				options: JSON.stringify(service.data.settings),
				filename: service.filename,
				header: service.header,
				footer: service.footer,
				charttype: service.charttype,
				headerreport: service.headerreport,
				footerreport: service.footerreport,
				logo: service.logo,
				data: JSON.stringify(service.data)
			};
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/reporting/downloadpdf', returnobject);
		}

		function generatePDF() {
			// send the execute post message
			service.triggerPrintRequest.fire();
		}
	}
]);
