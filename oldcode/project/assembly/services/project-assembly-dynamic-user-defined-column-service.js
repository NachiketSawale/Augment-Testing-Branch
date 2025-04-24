/**
 * Created by myh on 09/24/2021.
 */


(function (angular) {
	'use strict';
	var moduleName = 'project.assembly';
	/**
     * @ngdoc service
     * @name projectAssemblyDynamicUserDefinedColumnService
     * @function
     *
     * @description
     * projectAssemblyDynamicUserDefinedColumnService is the config service for project assembly dynamic user defined column
     */
	angular.module(moduleName).factory('projectAssemblyDynamicUserDefinedColumnService', ['estimateAssembliesDynamicUserDefinedColumnServiceFactory', '$injector',
		function (estimateAssembliesDynamicUserDefinedColumnServiceFactory, $injector) {
			let isPrjAssembly = true,
				options = {
					moduleName : 'ProjectAssembly'
				};

			let service = estimateAssembliesDynamicUserDefinedColumnServiceFactory.initService(isPrjAssembly, options);

			let origanlHandleUpdateDone = service.handleUpdateDone;

			service.handleUpdateDone = function(prjAssemblyUpdatedUDPValue, prjAssemblyItemToSave){
				let userDefinedcolsOfLineItemModified = [];

				if(prjAssemblyItemToSave && prjAssemblyItemToSave.length > 0){
					if(!prjAssemblyUpdatedUDPValue){
						prjAssemblyUpdatedUDPValue = {
							UserDefinedColumnValueToUpdate : []
						};
					}else if(!prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate) {
						prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate = [];
					}

					_.forEach(prjAssemblyItemToSave,function(prjAssemblyToSave){
						if(!prjAssemblyToSave || !prjAssemblyToSave.PrjEstLineItem || !prjAssemblyToSave.PrjEstLineItem.UserDefinedPriceColVal) {return;}
						let existedUDPValue = _.find(prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate, function(value){
							return value.TableId === prjAssemblyToSave.PrjEstLineItem.UserDefinedPriceColVal.TableId && value.Pk1 === prjAssemblyToSave.PrjEstLineItem.UserDefinedPriceColVal.Pk1 && value.Pk2 === prjAssemblyToSave.PrjEstLineItem.UserDefinedPriceColVal.Pk2;
						});

						if(!existedUDPValue){
							let updatedUDPValue = angular.copy(prjAssemblyToSave.PrjEstLineItem.UserDefinedPriceColVal);
							prjAssemblyUpdatedUDPValue.UserDefinedColumnValueToUpdate.push(updatedUDPValue);
							userDefinedcolsOfLineItemModified.push(updatedUDPValue);
						}
					});
				}

				let dataService = $injector.get('projectAssemblyMainService');
				let projectAssemblies = dataService.getList();

				if(angular.isArray(userDefinedcolsOfLineItemModified) && userDefinedcolsOfLineItemModified.length > 0){
					service.attachUpdatedValueToColumn(projectAssemblies, userDefinedcolsOfLineItemModified, true);
					dataService.gridRefresh();
				}

				origanlHandleUpdateDone(prjAssemblyUpdatedUDPValue);
			};

			return service;
		}
	]);
})(angular);
