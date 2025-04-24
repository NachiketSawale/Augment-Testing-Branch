(function (angular) {
	'use strict';

	let angularModule = angular.module('businesspartner.main');

	/**
	 * @ngdoc businessPartnerDunsExternalService
	 * @name businessPartnerDunsExternalService
	 * @function
	 * @description
	 */
	angularModule.factory('businessPartnerDunsExternalService', [
		'$http',
		'$translate',
		'globals',
		'platformDialogService',
		function ($http,
			$translate,
			globals,
			platformDialogService) {
			let service = {};
			service.start = function () {
				let modalOptions =
					{
						headerText$tr$: 'businesspartner.main.dunsUrl.urlConfigHelp',
						bodyTemplate: ['<section class="modal-body">',
							'<dl>',
							'<dt>' + $translate.instant('businesspartner.main.dunsUrl.basicsPart') + ':</dt>',
							'<dd>https://www.bisnode.de/upik/</dd></br>',
							'<dt>' + $translate.instant('businesspartner.main.dunsUrl.placeholders') + ':</dt>',
							'<dd>[businesspartnername]: ' + $translate.instant('businesspartner.main.name1') + ', ' + $translate.instant('businesspartner.main.name2') + ', ' + $translate.instant('businesspartner.main.name3') + ', ' + $translate.instant('businesspartner.main.name4') + '</dd>',
							'<dd>[addressdto_countryiso]: ' + $translate.instant('businesspartner.main.dunsUrl.countryISO') + ' </dd>',
							'<dd>[addressdto_street]: ' + $translate.instant('businesspartner.main.dunsUrl.addressStreet') + '</dd>',
							'<dd>[addressdto_city]: ' + $translate.instant('businesspartner.main.dunsUrl.addressCity') + '</dd></br>',
							'<dt>' + $translate.instant('businesspartner.main.dunsUrl.variablePart') + ':</dt>',
							'<dd>search = [businesspartnername]</dd>',
							'<dd>comid = [comid]</dd>',
							'<dd>country = [addressdto_countryiso]</dd>',
							'<dd>address = [addressdto_street]</dd>',
							'<dd>city = [addressdto_city]</dd></br>',
							'<dt>' + $translate.instant('businesspartner.evaluationschema.sampleText') + ':</dt>',
							'<dd>https://www.bisnode.de/uipik/?search=[businesspartnername]&country=[addressdto_countryiso]&address=[addressdto_street]&city=[addressdto_city]</dd>',
							'</dl>',
							'</section>'].join(''),
						resizeable: true,
						minHeight: '400px',
						minWidth: '400px',
					};
				platformDialogService.showDialog(modalOptions);
			};

			return service;
		}
	]);

})(angular);
