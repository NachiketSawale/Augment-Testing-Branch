/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global globals */

	var moduleName = 'sales.common';

	/**
	 * @ngdoc module
	 * @name sales.common
	 * @description
	 * Module definition of the sales common module
	 **/
	angular.module(moduleName, ['ui.router', 'platform']);
	globals.modules.push(moduleName);

})();
