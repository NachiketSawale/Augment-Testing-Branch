/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';
	angular.module(moduleName).service('estimateMainRiskCalculatorProcessService', [
		'platformRuntimeDataService', 'PlatformMessenger',
		function (platformRuntimeDataService, PlatformMessenger) {

			let service = {
				processItem: processItem,
				onRefreshImpactDetail: new PlatformMessenger()
			};

			function processItem(item,rows){
				let fields = [];
				let temp = _.filter(rows,function (row) {
					return (row.rid !== 'customizeBtn' && row.gid === 'impactConfig');
				});
				// eslint-disable-next-line no-prototype-builtins
				if(item.hasOwnProperty('CustomizeImpact') && item.CustomizeImpact === false){
					angular.forEach(temp,function (row) {
						let readOnly = true;
						if(row.rid === 'customizeBtn'){
							setImpactDetailReadOnly(item,rows);
						}
						fields.push({field: row.model, readonly: readOnly, disabled: readOnly});
					});
				}else{
					angular.forEach(temp,function (row) {
						let readOnly = false;
						if(row.rid === 'customizeBtn'){
							setImpactDetailReadOnly(item,rows);
						}
						fields.push({field: row.model, readonly: readOnly, disabled: readOnly});
					});
				}
				platformRuntimeDataService.readonly(item, fields);
			}

			// set all items readonly or editable
			function setReadOnly(items, isReadOnly) {
				let fields = [],
					item = _.isArray(items) ? items[0] : null;

				_.forOwn(item, function (value, key) {
					let field = {field: key, readonly: isReadOnly};
					fields.push(field);
				});

				angular.forEach(items, function (item) {
					if (item) {
						platformRuntimeDataService.readonly(item, fields);
					}
				});

			}

			function setImpactDetailReadOnly(item /* , rows */){
				// eslint-disable-next-line no-console
				console.log(item);
				// console.log(rows);

				// eslint-disable-next-line no-console
				console.table('Impact Config',item);
				setReadOnly(item,true);
				service.onRefreshImpactDetail.fire();
			}


			return service;
		}
	]);
})(angular);
