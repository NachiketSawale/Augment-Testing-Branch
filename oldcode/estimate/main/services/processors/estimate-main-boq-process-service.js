/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global _ */

(function() {
	'use strict';
	let moduleName = 'estimate.main';
	/**
	 * @ngdoc service
	 * @name estimateMainBoqProcessService
	 * @function
	 * @requires
	 *
	 * @description
	 * estimateMainBoqProcessService is the service to set boqs dynamically readonly or editable.
	 *
	 */
	angular.module(moduleName).service('estimateMainBoqProcessService',
		['$injector', function ($injector) {

            let service = {};

			service.setFields = function setFields(item, ret, isAllReadOnly = true) {
				let fields = [
					{ field: 'BriefInfo', readonly: isAllReadOnly || !ret.BriefInfo },
					{ field: 'Quantity', readonly: isAllReadOnly || !ret.Quantity },
					{ field: 'QuantityAdj', readonly: isAllReadOnly || !ret.QuantityAdj },
					{ field: 'BasUomFk', readonly: isAllReadOnly || !ret.BasUomFk },
				];

				$injector.get('platformRuntimeDataService').readonly(item, fields);
			};

			service.processItem = function processItem(item) {
				let isEditable = $injector.get('estimateMainBoqService').getButtonEditValue();
				let fields = [
					{ field: 'BriefInfo', readonly: !isEditable },
					{ field: 'Quantity', readonly: !isEditable },
					{ field: 'QuantityAdj', readonly: !isEditable },
					{ field: 'BasUomFk', readonly: !isEditable }
				];

				$injector.get('platformRuntimeDataService').readonly(item, fields);
			};

            return service;

        }]);
})();