(function (angular) {

	'use strict';
	let moduleName = 'businesspartner.main';

	angular.module(moduleName).factory('businessPartnerRecalculateService', [
		'globals',
		'_',
		'$q',
		'$http',
		function (
			globals,
			_,
			$q,
			$http) {

			let list = [];
			let plahold2PoiList = [];
			let sqlFields = ['SUBSIDIARYFK', 'CONTACT1FK', 'CONTACT2FK', 'PROJECTFK', 'QTNHEADERFK', 'CONHEADERFK', 'INVHEADERFK'];
			let sqlFieldFormal = {
				SUBSIDIARYFK: '@BPDSUBSIDIARYID',
				CONTACT1FK: '@CONTACT1ID',
				CONTACT2FK: '@CONTACT2ID',
				PROJECTFK: '@PROJECTID',
				QTNHEADERFK: '@QUOTEID',
				CONHEADERFK: '@CONTRACTID',
				INVHEADERFK: '@INVOICEID'
			};

			function recalculateResult(groupDataService, validationService, grouplist, fromType) {
				plahold2PoiList = [];
				list = grouplist;
				let selectStrList = [];
				let normalStrList = [];
				let notFormulaList = [];
				_.forEach(grouplist, function (item) {
					if (item.Formula) {
						if (_.startsWith(item.Formula.toUpperCase().trim(), 'SELECT')) {
							selectStrList.push(item);
						} else {
							normalStrList.push(item);
						}
					} else {
						notFormulaList.push(item);
					}
				});
				normalStrList = _.orderBy(normalStrList, ['GroupOrder', 'GroupSorting']);

				getPointBySql(selectStrList, groupDataService).then(function (res) {
					if (res?.data) {
						_.forEach(res.data, function (selectedItem) {
							setNewPointForList(list, selectStrList, selectedItem, validationService);
						});
						_.forEach(normalStrList, function (item) {
							setPoint(item, validationService);
						});
						groupDataService.gridRefresh();
					}
				}).finally(function () {
					if (fromType === 'clickButton') {
						groupDataService.calculationEvaluation(notFormulaList);
					}
				});
			}

			function setNewPointForList(groupList, selectStrList, selectedItem, validationService) {
				let selected = _.find(selectStrList, {Id: selectedItem.Id});
				if (selected) {
					selected.Points = selectedItem.Points;
				}
				let selectedGroup = _.find(groupList, {Id: selectedItem.EvaluationFk});
				if (selectedGroup?.ChildrenItem) {
					let selectedChild = _.find(selectedGroup.ChildrenItem, {Id: selectedItem.Id});
					if (selectedChild) {
						selectedChild.Points = selectedItem.Points;
					}
				}
				setTotalPoints(selected);
				validationService.validatePoints(selected, selected.Points, 'Points', true);
			}

			function setPlahold2PoiList(item, point) {
				let placehold2Point = _.find(plahold2PoiList, {subGroupDataId: item.Id});
				if (placehold2Point) {
					placehold2Point.point = point;
				}
			}

			function setPoint(item, validationService) {
				item.referenceList = [];
				let str = getPoint(item.Formula, item), point = 0;
				try {
					/* jshint -W054 */
					let evalPoint = new Function('return ' + str);
					point = _.round(evalPoint() * 100) / 100;
				} catch (err) {
					point = 0;
				}
				if (!angular.isNumber(point) || isNaN(point)) {
					point = 0;
				}
				validationService.validatePoints(item, point, 'Points', true);
				item.Points = point;
				setTotalPoints(item);
				setPlahold2PoiList(item, point);
				return item;
			}

			function setTotalPoints(item) {
				if (!item.HasChildren) {
					let parentItem = _.find(list, {Id: item.PId});
					let childrenList = _.filter(list, {PId: item.PId});
					if (parentItem) {
						parentItem.Points = _.sumBy(childrenList, 'Points');
					}
				}
			}

			function getPointBySql(selectList, groupDataService) {
				let evaluation = groupDataService.parentService().getSelected();
				return $http.post(globals.webApiBaseUrl + 'businesspartner/main/evaluationgroupdata/recalculatepoint', {
					Evaluation: evaluation,
					Groups: selectList
				});
			}

			function getPoint(formulaStr, item) { // (#1.1 + #2.3)/2
				let strArray = getPlaceholder(formulaStr); // [#1.1, #2.3]
				analysisStr(strArray);
				return replacePlaceholder(formulaStr, item);
			}

			function getPlaceholder(formulaStr) {
				let regStr = /#(\d+\.?)+\d*/g;
				return formulaStr.match(regStr);
			}

			function analysisStr(strArray) {  // [#1.1, #2.3]
				_.forEach(strArray, function (str) { // #1.1
					getPointByLineNum(str);
				});
			}

			function getPointByLineNum(str) {
				let subGroup = _.find(list, {'GroupOrder': str});
				if (subGroup) {
					let placehold2Point = _.find(plahold2PoiList, {subGroupDataId: subGroup.Id});
					if (!placehold2Point) {
						placehold2Point = {};
						placehold2Point.placeholder = str;
						placehold2Point.subGroupDataId = subGroup.Id;
						placehold2Point.point = 0;
						plahold2PoiList.push(placehold2Point);
					}
					placehold2Point.placeholder = str;
					placehold2Point.subGroupDataId = subGroup.Id || -1;
					placehold2Point.point = subGroup.Points || 0;
				} else {
					let point = {};
					point.placeholder = str;
					point.subGroupDataId = null;
					point.point = 0;
					plahold2PoiList.push(point);
				}
				return subGroup ? subGroup.Points : 0;
			}

			function replacePlaceholder(formulaStr, groupItem) {
				let resStr = formulaStr;
				plahold2PoiList = _.orderBy(plahold2PoiList, ['placeholder'], ['desc']);
				_.forEach(plahold2PoiList, function (item) {
					if (resStr.indexOf(item.placeholder) >= 0) {
						groupItem.referenceList.push(item.subGroupDataId);
					}
					let reg = new RegExp(item.placeholder, 'g');
					resStr = _.replace(resStr, reg, item.point);
				});
				return resStr;
			}

			function getRecalFormulaSQL(groupDataService, validationService, groupList, field) {
				field = field.toUpperCase();
				if (_.includes(sqlFields, field)) {
					let queryField = sqlFieldFormal[field];
					let resultList = _.filter(groupList, function (item) {
						return !!item.Formula && _.startsWith(item.Formula.toUpperCase().trim(), 'SELECT') && item.Formula.toUpperCase().indexOf(queryField) >= 0;
					});
					getPointBySql(resultList, groupDataService).then(function (res) {
						if (res?.data) {
							_.forEach(res.data, function (selectedItem) {
								setNewPointForList(groupList, resultList, selectedItem, validationService);
								recalculateData(validationService, list, selectedItem);
							});
						}
					});
				}
			}

			function recalculateData(validationService, list, item) {
				_.forEach(list, function (entity) {
					if (item.Id !== entity.Id && entity.referenceList &&
						(_.includes(entity.referenceList, item.Id) || _.includes(entity.referenceList, item.PId))) {
						if (entity.Formula) {
							setPoint(entity, validationService);
						}
						recalculateData(validationService, list, entity);
					}
				});
			}

			return {
				recalculateData: recalculateData,
				getRecalFormulaSQL: getRecalFormulaSQL,
				setPlaceHolderPoint: setPlahold2PoiList,
				recalculateResult: recalculateResult
			};
		}]);
})(angular);