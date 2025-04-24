/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (){
	'use strict'
	const moduleName = 'awp.main';

	angular.module(moduleName).value('servicePackageItemType', {
		Package: -1,
		SubPackage: -2,
		BoqHeader: 103
	});
})();