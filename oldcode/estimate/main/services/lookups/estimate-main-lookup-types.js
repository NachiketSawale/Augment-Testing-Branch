/**
 * Created by joshi on 16.01.2015.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * The constant contains lookup types which can be used in lookup directive.
	 */
	angular.module(moduleName).value('estimateMainLookupTypes', {
		'resourcetype': 'estimate/main/lookup/resourcetype',
		'estcostcodes':'basics/costcodes/tree',
		'estcostrisk':'estimate/main/lookup/costrisk',
		'estcontrolunit':'controlling/structure/tree',
		'estassemblies':'estimate/assemblies/list',
		'estconfigtype' : 'estimate/main/configtype/list',
		'estcolconfigtype' : 'basics/customize/EstColumnConfigType/list',
		'esttotalsconfigtype' : 'basics/customize/esttotalsconfigtype/list',
		'eststructconfigtype' : 'basics/customize/eststructuretype/list'
	});
})(angular);
