/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateMainEstColumnConfigDetailProcessService
	 * @function
	 * @requires platformRuntimeDataService
	 *
	 * @description
	 * estimateMainEstColumnConfigDetailProcessService is the service to set config details readonly or editable.
	 *
	 */
	angular.module('estimate.main').factory('estimateMainEstColumnConfigDetailProcessService',
		['_', 'platformRuntimeDataService',
			function (_, platformRuntimeDataService) {

				let service = {};

				angular.extend(service, {
					processItem: processItem,
					setFieldReadOnly: setFieldReadOnly
				});

				return service;

				function processItem(item) {
					if (item && item.ColumnId !== 0){

						if (item.ColumnId){
							// if Code is selected then LineType and CostCode are readonly
							if (item.ColumnId === 1){
								setFieldReadOnly(item, 'LineType', true);
								setFieldReadOnly(item, 'MdcCostCodeFk', true);
							}else{
								setFieldReadOnly(item, 'LineType', false);
							}

							if (item.LineType){
								if (item.LineType === 1){ // CostCodes
									setFieldReadOnly(item, 'MdcCostCodeFk', false);
									setFieldReadOnly(item, 'MaterialLineId', true);
								}
								else if (item.LineType === 2){ // Material
									setFieldReadOnly(item, 'MaterialLineId', false);
									setFieldReadOnly(item, 'MdcCostCodeFk', true);
								}

								setFieldReadOnly(item, 'DescriptionInfo', false);
							}else{
								setFieldReadOnly(item, 'DescriptionInfo', true);
							}
						}

					}else{
						setNewFields(item);
					}
				}

				function setFieldReadOnly(item, column, readonly) {
					let fields = [{field: column, readonly: readonly}];
					platformRuntimeDataService.readonly(item, fields);
				}

				function setNewFields(item){
					let fields = [];

					_.forOwn(item, function (value, key) {
						let field = {field: key, readonly: true};
						if (key === 'ColumnId'){
							field.readonly = false;
						}
						fields.push(field);
					});

					platformRuntimeDataService.readonly(item, fields);
				}
			}]);
})(angular);
