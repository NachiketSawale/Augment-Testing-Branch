/**
 * Created by xia on 3/5/2018.
 */

(function (angular) {
	/* global _ */ 
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqDivisionTypeAssignmentFormatterService
	 * @function
	 *
	 * @description
	 * boqDivisionTypeAssignmentFormatterService provides list of lookup data for boq item
	 */
	angular.module(moduleName).factory('boqDivisionTypeAssignmentFormatterService', [/* '$http', '$q', */
		function (/* $http, $q */) {
			var service = {},
				lookupData = {
					boqItem2boqDivisionTypes: [],
					boqDivisionTypes: []
				};

			var setDivisionTypeAssignmentToBoqItems = function (boqItems, boq2DivisionTypes) {
				angular.forEach(boqItems, function (boqItem) {
					var boq2DivisionTypeOfBoqItem = _.filter(boq2DivisionTypes, function (boq2DivisionTypeItem) {
						return boq2DivisionTypeItem.BoqHeaderFk === boqItem.BoqHeaderFk && boq2DivisionTypeItem.BoqItemFk === boqItem.Id;
					});

					if (boq2DivisionTypeOfBoqItem && boq2DivisionTypeOfBoqItem.length) {
						boqItem.DivisionTypeAssignment = boq2DivisionTypeOfBoqItem;
					} else {
						boqItem.DivisionTypeAssignment = [];
					}

					var childBoqItems = boqItem.BoqItems;
					if (childBoqItems && childBoqItems.length) {
						setDivisionTypeAssignmentToBoqItems(childBoqItems, boq2DivisionTypes);
					}
				});
			};

			service.attachDivisionTypeAssignmentToBoqItem = function attachDivisionTypeAssignmentToBoqItem(boqTreeItems, boq2DivisionTypes, divisionTypes) {
				lookupData.boqDivisionTypes = divisionTypes ? divisionTypes : [];
				if (boq2DivisionTypes && boq2DivisionTypes.length && divisionTypes && divisionTypes.length && boqTreeItems && boqTreeItems.length) {
					lookupData.boqItem2boqDivisionTypes = boq2DivisionTypes;
					// as the boqTreeItems has a hirachical structure, so a recursion function here to handler it
					setDivisionTypeAssignmentToBoqItems(boqTreeItems, boq2DivisionTypes);
				}
			};

			service.setDivisionTypeAssignmentToBoqItems = setDivisionTypeAssignmentToBoqItems;

			service.getDivisionTypes = function getDivisionTypes() {
				return lookupData.boqDivisionTypes;
			};

			service.getItemById = function getItemById(/* value, formatterOptions */) {
				// var a = value;
			};

			return service;
		}]);
})(angular);

