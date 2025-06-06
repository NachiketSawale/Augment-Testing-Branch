/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var controllingStructureModule = angular.module('controlling.structure');

	/**
	 * @ngdoc service
	 * @name controllingStructureNumberGenerationServiceProvider
	 * @function
	 *
	 * @description
	 * controllingStructureGenerateService capsulates generation (of controlling units) functionality
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	controllingStructureModule.factory('controllingStructureNumberGenerationServiceProvider', ['globals', '_', '$injector', '$q', '$http',
		function (globals, _, $injector, $q, $http) {

			var service = {};

			var dataItem = {
				hasToCreate: true
			};

			let dataItemList = [];

			function isAutoGenerated(prjFk) {
				let existedDataItem = _.find(dataItemList, (item) => { return item.ProjectFk === prjFk; })
				if(existedDataItem){
					return;
				}

				var rubricCategoryControllingUnitFk = 0;

				// get number sequence list by rubric
				var postData = {
					RubricId: 50 // Rubric: Controlling Units
				};

				// get project details by prj fk
				$http.get(globals.webApiBaseUrl + 'project/main/' + 'byid?id=' + prjFk).then(function (response) {
					if (response.data !== '') {
						rubricCategoryControllingUnitFk = response.data.RubricCategoryControllingUnitFk;
						// get thegeneration info based on rubric
						if(rubricCategoryControllingUnitFk > 0){
							$http.post(globals.webApiBaseUrl + 'basics/company/number/' + 'GenerationInfo', postData).then(function (response) {
								if (response.data !== '') {
									var filterData = _.find(response.data, { RubricCatID: rubricCategoryControllingUnitFk });
									if(filterData){
										dataItem.hasToCreate = filterData.HasToCreate;
									}
								}
							});
						}
					}
				});
			}

			service.canCreateCode = function canCreateCode(prjFk) {
				isAutoGenerated(prjFk);
				return dataItem;
			};

			function checkIsUnique(code, prjFk) {
				return $http.get(globals.webApiBaseUrl + 'controlling/structure/' + 'isuniquecodeprjcontext?code=' + code + '&projectId=' + prjFk);
			}

			service.asyncCheckUniqueCode = function asyncCheckUniqueCode(code, prjFk) {
				return checkIsUnique(code, prjFk);
			};

			service.generateNewCode = function generateNewCode(code) {
				var stepIncrement = 10;
				var maxLength = 6;
				var curItem = parseInt(code);
				var newCode = _.isNumber(curItem) ? (curItem + stepIncrement) : code;
				// ensure pattern '000000'
				newCode = String(newCode).padStart(maxLength, '0');
				return newCode;
			};

			service.checkCode = function checkCode(entity) {
				var canCreate = service.canCreateCode(entity.ProjectFk).hasToCreate;
				if (!canCreate) {
					var allLeaf = $injector.get('controllingStructureMainService').getList();
					// filter childs code with numbers only
					var newArr = [];
					_.each(allLeaf, function (item) {
						var code = parseInt(item.Code);
						if (!isNaN(code) && item.Id !== entity.Id && item.ControllingunitFk !== null) {
							newArr.push(item);
						}
					});
					// check if entity code is already exist in array
					var findEntity = _.filter(newArr, { Code: entity.Code });
					if (findEntity.length > 0) {
						var itemWithMax = _.maxBy(newArr, 'Code');
						entity.Code = service.generateNewCode(itemWithMax.Code);
					}
				}
				return entity.Code;
			};

			return service;

		}]);
})();