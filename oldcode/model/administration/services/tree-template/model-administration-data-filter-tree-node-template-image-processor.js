/*
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';
	angular.module('model.administration').factory('modelAdministrationDataFilterTreeNodeTemplateImageProcessor', function () {

		var service = {};

		service.processItem = function processItem(item) {
			if (item.Nodetype === 'AttributeFilter') {
				item.image = 'ico-model-attribute-filter';
			}
			else if (item.Nodetype === 'FixedNode') {
				item.image = 'ico-model-fixednode';
			}
			else if (item.Nodetype === 'ObjectSetList') {
				item.image = 'ico-model-objectset-list';
			}
		};

		return service;
	});
})(angular);
