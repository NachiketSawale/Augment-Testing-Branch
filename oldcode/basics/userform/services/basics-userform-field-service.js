(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserformFieldService
	 * @function
	 *
	 * @description
	 * data service for all FormField related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsUserformFieldService', [
		'globals',
		'$http',
		'$q',
		'basicsUserformMainService',
		'platformDataServiceFactory',

		function (
			globals,
			$http,
			$q,
			basicsUserformMainService,
			platformDataServiceFactory) {

			var serviceFactoryOptions = {
				flatLeafItem: {
					serviceName: 'basicsUserformFieldService',
					httpCRUD: {route: globals.webApiBaseUrl + 'basics/userform/field/'},
					entityRole: {leaf: {itemName: 'FormFields', parentService: basicsUserformMainService}},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.mainItemId = basicsUserformMainService.getSelected().Id;
							}
						}
					}
					// translation:{uid: 'basicsUserformMainService', title: 'Translation', colHeader: ['Description'], descriptors: ['DescriptionInfo']}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceFactoryOptions);

			/**
			 * @ngdoc function
			 * @name parseHtmlTemplate
			 * @function
			 * @description parses the html template content of the selected form and returns a field dto list proposal
			 */
			serviceContainer.service.parseHtmlTemplate = function () {
				return basicsUserformMainService.getHtmlTemplate().then(function (template) {
					if (template !== null) {
						var selectedForm = basicsUserformMainService.getSelected();
						// btoa does not really work on unicode strings?
						// var base64EncodedString = window.btoa(template);
						var base64EncodedString = Base64.encode(template);
						return $http.post(globals.webApiBaseUrl + 'basics/userform/parsehtml?formId=' + selectedForm.Id, '"' + base64EncodedString + '"').then(function (response) {
							return response.data;
						});
					} else {
						return $q.when(null);
					}
				});
			};

			// region base64 helper

			// see http://jsfiddle.net/gabrieleromanato/qAGHT/
			var Base64 = {
				_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
				encode: function (input) {
					var output = '';
					var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
					var i = 0;

					input = Base64._utf8_encode(input); // jshint ignore:line

					while (i < input.length) {

						chr1 = input.charCodeAt(i++);
						chr2 = input.charCodeAt(i++);
						chr3 = input.charCodeAt(i++);

						enc1 = chr1 >> 2;
						enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
						enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
						enc4 = chr3 & 63;

						if (isNaN(chr2)) {
							enc3 = enc4 = 64;
						} else if (isNaN(chr3)) {
							enc4 = 64;
						}

						output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

					}

					return output;
				},
				_utf8_encode: function (string) {
					string = string.replace(/\r\n/g, '\n');
					var utftext = '';

					for (var n = 0; n < string.length; n++) {

						var c = string.charCodeAt(n);

						if (c < 128) {
							utftext += String.fromCharCode(c);
						} else if ((c > 127) && (c < 2048)) {
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
						} else {
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
						}

					}

					return utftext;
				}

			};

			// end region

			return serviceContainer.service;

		}]);
})(angular);
