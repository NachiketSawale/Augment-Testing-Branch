/**
 * Created by lnb on 5/14/2015.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	var moduleName = 'businesspartner.certificate';
	angular.module(moduleName).factory('businessPartnerCertificateRequiredCreateService',
		['$http',
			function ($http) {
				return {
					updateCertificatesByContract: function (param) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/createrequired/contract';
						const relevantDate = (param.DataItem.RelevantDate && moment.isMoment(param.DataItem.RelevantDate)) ?
							param.DataItem.RelevantDate.format('YYYY-MM-DDTHH:mm:ss') :
							param.DataItem.RelevantDate;
						return $http({
							method: 'get',
							url: url,
							params: {StatusFk: param.StatusFk, ConHeaderFk: param.DataFk, RelevantDate: relevantDate}
						});
					},
					updateCertificatesByQuote: function (param) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/createrequired/quote';
						return $http({
							method: 'get',
							url: url,
							params: {StatusFk: param.StatusFk, QuoteHeaderFk: param.DataFk, PrcHeaderFk: param.DataItem.PrcHeaderId}
						});
					},
					updateCertificatesByCompany: function (param) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/createrequired/company';
						return $http({
							method: 'get',
							url: url,
							params: {StatusFk: param.StatusFk, CompanyId: param.DataFk}
						});
					},
					updateCertificatesByInvoice: function (param) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/createrequired/invoice';
						return $http({
							method: 'get',
							url: url,
							params: {StatusFk: param.StatusFk, InvoiceId: param.DataFk}
						});
					},
					updateCertificatesByBusinessPartner: function (param) {
						var url = globals.webApiBaseUrl + 'businesspartner/certificate/createrequired/businesspartner';
						return $http({
							method: 'get',
							url: url,
							params: {StatusFk: param.StatusFk, BusinessPartnerId: param.DataFk}
						});
					}
				};
			}]);
})(angular);
