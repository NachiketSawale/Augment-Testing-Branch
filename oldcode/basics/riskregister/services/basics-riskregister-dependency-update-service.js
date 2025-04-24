(function (angular) {
	/*global angular,_*/
	'use strict';
	var moduleName = 'basics.riskregister';
	angular.module(moduleName).service('basicsRiskRegisterDependencyUpdateService', [
		'$injector',
		function ($injector) {
			var service = {};
			var dependencyToSave = [],
				dependencyToDelete = [];

			var isModified = false;

			var dependencyObj = {
				Id: 0,
				ImpactFk:null,
				RiskEventFk: null
			};

			service.getIsModified = function getIsModified(){
				return isModified;
			};

			service.setIsModified = function setIsModified(value){
				isModified = value;
			};

			service.setDepenItem = function setDepenItem(item, destItem, serviceName, itemName, action) {
				service.setIsModified(true);
				var updateObj = angular.copy(dependencyObj);
				updateObj.ImpactFk = destItem.Id;
				updateObj.RiskEventFk = item.Id;
				updateObj.Action = action;
				updateObj.ItemName = destItem ? 'RiskEvents' : itemName;
				dependencyToSave.push(updateObj);

			};

			service.setDepenToSave = function setDepenToSave(dependencies, destItem, serviceName, itemName) {

				if (_.isArray(dependencies)) {

					angular.forEach(dependencies, function (depen) {
						if (depen) {
							if (destItem && _.isArray(destItem.RiskDependencies) && destItem.RiskDependencies.indexOf(depen.Id) !== -1) {
								return;
							}

							service.setDepenItem(depen, destItem, serviceName, itemName, 'ToSave');
						}
					});
				}
			};

			service.getDepenToSave = function getDepenToSave() {
				return _.filter(dependencyToSave, {Action:'ToSave'});
			};

			service.getDepenToDelete = function getDepenToDelete() {
				return dependencyToDelete;
			};

			service.updateDepenToSave = function updateDepenToSave(updateData) {
				/*if(!service.getIsModified()){
					return;
				}*/
				angular.forEach(dependencyToSave, function (item) {

					if (item) {
						if (!_.isArray(updateData[item.ItemName + 'Dependency' + item.Action])) {
							updateData[item.ItemName + 'Dependency' + item.Action] = [];
						}

						var data = updateData[item.ItemName + 'Dependency' + item.Action];
						if (!data.length || data.indexOf(item) === -1) {
							updateData[item.ItemName + 'Dependency' + item.Action].push(item);
						}
						updateData.EntitiesCount += 1;
					}

					//handle the old parameter whose code is '...'
					if (item.Action === 'ToDelete') {
						if (!_.isArray(updateData[item.ItemName + 'Dependency' + item.Action])) {
							updateData[item.ItemName + 'Dependency' + item.Action] = [];
						}

						var data2 = updateData[item.ItemName + 'Dependency' + item.Action];
						if (!data2.length || data2.indexOf(item) === -1) {
							updateData[item.ItemName + 'Dependency' + item.Action].push(item);
						}
						updateData.EntitiesCount += 1;
					}

				});
				return updateData;
			};

			service.setDepenToDelete = function setDepenToDelete(params, destItem, serviceName, itemName) {
				if (_.isArray(params)) {
					angular.forEach(params, function (param) {
						if (param) {
							if (param.Version > 0) {
								service.setDepenItem(param, destItem, serviceName, itemName, 'ToDelete');
								dependencyToDelete.push(param);
							} else {
								//clear the destItem's param value
								//fix defect, delete the undeleted item with the same code
								var sameDepens = _.filter(destItem.Depen, function (pa) {
									return pa === param.Code;
								});
								if (sameDepens.length > 1) {
									sameDepens.pop();

									destItem.Depen = _.filter(destItem.Depen, function (pa) {
										return pa !== param.Code;
									});
									destItem.Depen = destItem.Depen.concat(sameDepens);
								} else {
									destItem.Depen = _.filter(destItem.Depen, function (pa) {
										return pa !== param.Code;
									});
								}


								dependencyToSave = _.filter(dependencyToSave, function (item) {
									return item.Id !== param.Id;
								});
							}
						}

					});
				}
			};

			service.markParamAsModified = function markParamAsModified(dependency, destItem, serviceName, itemName, list) {
				if(dependency){
					var item = _.find(list, {MainId : dependency.MainId});
					if(item){

						//support multiple type
						var dependencyExistedInToSave = _.find(dependencyToSave,function(LSItemParameter){
							return dependency.Id === LSItemParameter.Id &&
								LSItemParameter.ItemName === (destItem ? 'RiskEvents' : itemName) &&
								LSItemParameter.Action === 'ToSave';
						});

						if(!item.__rt$data.errors || !item.__rt$data.errors.Code){
							if(dependencyExistedInToSave){
								dependencyExistedInToSave = dependency;
							}
							else{

								service.setDepenToSave([item], destItem, serviceName, itemName);
							}
						}
						else{

							if(dependencyExistedInToSave){
								dependencyToSave = _.filter(dependencyToSave, function(item){
									return item.Id !== dependency.Id &&
									item.ItemName !== destItem ? 'RiskEvents' : itemName &&
										item.Action !== 'ToSave';
								});


								if(destItem && _.isArray(destItem.Depen) && destItem.Depen.indexOf(dependency.Id) !== -1){return;}
							}
						}

					}
				}
			};

			service.clear = function clear() {
				dependencyToSave = [];
				dependencyToDelete = [];

			};

			return service;
		}
	]);
})(angular);
