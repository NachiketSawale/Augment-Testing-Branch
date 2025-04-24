/**
 * Created by mov on 02.28.2022.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonDynamicColServiceExtension
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCommonDynamicStandardConfigTranslationService', [
		'_',
		function (_) {
			let service = {};

			angular.extend(service, {
				getTranslationInfo: getTranslationInfo
			});

			return service;

			function getTranslationInfo(baseTranslateService, newDynamicFieldDictionary){
				return {
					// TODO-VICTOR: GET module name and get translations from there or initial only
					getTranslationInformation: function(attName){
						if (Object.hasOwnProperty.call(newDynamicFieldDictionary, attName)) {
							if (Object.hasOwnProperty.call(newDynamicFieldDictionary[attName], 'isStaticForField')) {
								// static
								return baseTranslateService.getTranslationInformation(attName);
							}
							// dynamic
							let module = '';
							let initial = '';
							let splitted = _.split(newDynamicFieldDictionary[attName].name$tr$, '.');
							if (splitted.length > 2){
								module = splitted.slice(0,2).join('.');
								initial = splitted.slice(2).join('.');
							}
							return {
								initial: initial,
								location: module,
								identifier: newDynamicFieldDictionary[attName].name
							};
						}else{
							// static translation
							return {
								initial: attName,
								//  location: moduleName,
								identifier: attName,
								//  param: ''
							};
						}
					}
				};
			}

		}
	]);
})(angular);
