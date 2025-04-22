/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {


	'use strict';
	var moduleName = 'sales.common';
	var salesCommonModule = angular.module(moduleName);

	salesCommonModule.factory('SalesCommonHeaderTextProcessor', ['$translate', function ($translate) {
		return function (salesService, getId2prop, blobProperties) {
			var self = this;

			self.processItem = function processItem(item) {
				var id2prop = getId2prop(blobProperties, salesService.getSelected());
				if (!item.TextType) {
					item.TextType = id2prop[item.Id];
				}
				if (angular.isDefined(item.TextType)) {
					item.TextType = $translate.instant('sales.common.entity' + item.TextType);
				}
			};
		};
	}]);

})();
