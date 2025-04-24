/**
 * Created by joshi on 21.09.2015.
 */

/* global _ */

(function () {
	'use strict';
	let moduleName = 'estimate.main';
	let estimateMainModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateMainSubItemCodeGenerator
	 * @function
	 *
	 * @description
	 * estimateMainSubItemCodeGenerator is the data service to generate code of sub item.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	estimateMainModule.factory('estimateMainSubItemCodeGenerator', ['cloudCommonGridService', 'estimateMainResourceType',
		function (cloudCommonGridService, estimateMainResourceType) {

			let service = {};

			let getNewCode = function getNewCode(lastCode, subItem, resList){
				let isValid = false;
				while (!isValid)
				{
					let newCode = service.incrementCode(lastCode);
					if (newCode){
						lastCode = newCode;
						isValid = isUniqCode(lastCode, subItem, resList) ? true: false;
					}
				}
				return lastCode;
			};

			function isUniqCode(code, subItem, resList){
				let result = _.filter(resList, function(item){
					return item.Id !== subItem.Id && item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.Code === code.toString();});
				return !result.length;
			}

			service.getSubItemCode = function getSubItemCode(subItem, resList){
				let inc = 1,
					newCode = '';
				let result = subItem.EstResourceFk > 0 ? _.filter(resList, function(item){
					return item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.EstResourceFk === subItem.EstResourceFk;
				}): _.filter(resList, function(item){
					return item.EstResourceTypeFk === estimateMainResourceType.SubItem && item.EstResourceFk === null;
				});

				if(result && result.length > 0){
					if(result.length === 1){
						newCode =  subItem.EstResourceFk === null ? inc
							: _.find(resList, {Id:subItem.EstResourceFk}) &&  _.find(resList, {Id:subItem.EstResourceFk}).Code ?
								_.find(resList, {Id:subItem.EstResourceFk}).Code + inc.toString() : inc;

					} else if(result.length > 1 && subItem.EstResourceFk !== null){ // #141740 Logic of the subitem code - Follow
						let filterEstAssembly = _.filter(result,e => {return e.EstAssemblyFk === null;});
						let lastItem = result[result.length - 1].Id === subItem.Id ? result[result.length - 2]:result[result.length - 1];
						if(filterEstAssembly && filterEstAssembly.length > 1){
							lastItem = filterEstAssembly[filterEstAssembly.length - 1].Id === subItem.Id ? filterEstAssembly[filterEstAssembly.length - 2]:filterEstAssembly[filterEstAssembly.length - 1];
						}
						let isValid = false;
						let valueCode = null;
						while (!isValid){
							if(lastItem && lastItem.Code) {
								let parentCode = lastItem.Code.length === 1 ? lastItem.Code : lastItem.Code.substring(0, lastItem.Code.length - 1);
								parentCode = _.find(resList, {Id:subItem.EstResourceFk}).Code;
								valueCode = valueCode ? valueCode : lastItem.Code.length === 1 ? 0 : lastItem.Code.substring(parentCode.length, lastItem.Code.length);
								valueCode = valueCode ? service.incrementCode(valueCode) : '1';
								newCode = parentCode + valueCode;
								if(filterEstAssembly && filterEstAssembly.length === 1 && lastItem && lastItem.EstAssemblyFk !== null){
									newCode = _.find(resList, {Id:subItem.EstResourceFk}).Code ?
										_.find(resList, {Id:subItem.EstResourceFk}).Code + inc.toString() : inc;
								}
								if (newCode){
									let lastCode = newCode;
									isValid = isUniqCode(lastCode, subItem, resList) ? true: false;
									inc++;
								}
							}
						}
					}
					else{
						cloudCommonGridService.sortList(result, 'Sorting');
						let filterEstAssembly = _.filter(result,e => {return e.EstAssemblyFk === null;});
						let lastItem = filterEstAssembly[filterEstAssembly.length - 1].Id === subItem.Id ? filterEstAssembly[filterEstAssembly.length - 2]:filterEstAssembly[filterEstAssembly.length - 1];
						if (lastItem && lastItem.Code) {
							newCode =  lastItem && lastItem.Code  ? service.incrementCode(lastItem.Code) : subItem.EstResourceFk === null ? inc
								: _.find(resList, {Id:subItem.EstResourceFk}) &&  _.find(resList, {Id:subItem.EstResourceFk}).Code ?
									_.find(resList, {Id:subItem.EstResourceFk}).Code + inc.toString() : inc;
						}else{
							newCode = 1;
						}
					}
					if(newCode){
						if(!isUniqCode(newCode, subItem, resList)){
							newCode = getNewCode(newCode, subItem, resList);
						}
					}
				}
				subItem.Code = newCode.toString();
			};
			service.incrementCode = function incrementCode(inputString, isSelfCall = false) {
				inputString = inputString.toString();
				if (inputString.length === 0) {
					if(isSelfCall){
						return 'A';
					}
					else{
						return '1';
					}
				}
				let lastChar = inputString.slice(-1);
				let restChars = inputString.slice(0, -1);
				restChars = lastChar === 'z' ? incrementCode(restChars,true) : restChars;
				let newLastChar = lastChar === '9' || lastChar === 'z' ? 'a' : String.fromCharCode(lastChar.charCodeAt(0) + 1);
				return restChars + newLastChar;
			};

			return service;
		}]);
})();
