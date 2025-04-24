/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName='estimate.main';
	angular.module(moduleName).constant('estimateMainDragDropAssemblyTypeConstant',{
		BoQRelatedAssembly:1,
		WICBoQRelatedAssembly : 2,
		Assembly : 3,
		AssemblyLookUp : 4
	});
})(angular);
