/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (){
	'use strict';

	angular.module('awp.main').factory('awpMainServicePackagesUiService', [
		'platformUIStandardConfigService', 'awpMainTranslationService',
		function (platformUIStandardConfigService, awpMainTranslationService){
			const layout = {
				fid: 'awp.main.servicePackages',
				version: '1.0.0',
				showGrouping: true,
				'groups': [
					{
						'gid': 'baseGroup',
						'attributes': ['reference', 'briefinfo']
					}
				],
				'overloads': {

				}
			};

			let attributeDomains = {
				'Reference': {
					'domain' : 'text'
				},
				'BriefInfo': {
					'domain' : 'translation'
				}
			};

			let BaseService = platformUIStandardConfigService;

			function ServicePackagesUiService(layout, scheme, translateService){
				BaseService.call(this, layout, scheme, translateService);
			}

			ServicePackagesUiService.prototype = Object.create(BaseService.prototype);
			ServicePackagesUiService.prototype.constructor = ServicePackagesUiService;

			return new BaseService(layout, attributeDomains, awpMainTranslationService);
		}
	]);
})();