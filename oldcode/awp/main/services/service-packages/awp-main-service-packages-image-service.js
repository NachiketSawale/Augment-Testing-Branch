/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (){
	'use strict'
	const moduleName = 'awp.main';

	angular.module(moduleName).factory('awpMainServicePackagesImageService', [
		'boqMainImageProcessor',
		function (boqMainImageProcessor){
			let service = {};

			service.processItem = function (item){
				if (!item) {
					return;
				}

				if(item.TypeFk && item.TypeFk >= 0){
					item.BoqLineTypeFk = item.TypeFk;
					boqMainImageProcessor.processItem(item);
				}else{
					item.image = item.TypeFk === -1 ? 'ico-folder-estimate' : 'ico-folder-doc';
				}
			}

			return service;
		}
	]);
})();