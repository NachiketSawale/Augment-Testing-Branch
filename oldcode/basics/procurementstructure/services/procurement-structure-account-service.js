(function (angular) {
	'use strict';
	var moduleName = 'basics.procurementstructure';


	angular.module(moduleName)
		.factory('basicsProcurementStructureAccountService',
			['platformDataServiceFactory', 'basicsProcurementStructureService', 'basicsLookupdataLookupDescriptorService','basicsCommonMandatoryProcessor',
				function (dataServiceFactory, parentService, basicsLookupdataLookupDescriptorService,basicsCommonMandatoryProcessor) {

					var serviceOption = {
						flatLeafItem: {
							module: angular.module(moduleName),
							httpCreate: { route: globals.webApiBaseUrl + 'basics/procurementstructure/account/' },
							httpRead: {route: globals.webApiBaseUrl + 'basics/procurementstructure/account/'},
							presenter: {
								list: {
									incorporateDataRead: incorporateDataRead,
									initCreationData: initCreationData
								}
							},
							entityRole: {
								leaf: {
									itemName: 'PrcStructureaccount',
									parentService: parentService
								}
							}
						}
					};

					var serviceContainer = dataServiceFactory.createNewComplete(serviceOption);

					function incorporateDataRead(readData, data) {
						basicsLookupdataLookupDescriptorService.attachData(readData);
						setAccountDes(readData.Main);
						return serviceContainer.data.handleReadSucceeded(readData.Main, data);
					}

					var data=serviceContainer.data;
					// data.newEntityValidator = newEntityValidator();
					//
					// function newEntityValidator() {
					// 	return {
					// 		validate: function validate(entity) {
					// 			var validateService = $injector.get('basicsCostCodesPriceVersionValidationService');
					// 			validateService.validateAccount(entity, value, model,apply) ;
					// 		}
					// 	};
					// }
					// ADD Check Operate  2017-7-20
					data.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'PrcStructureAccountDto',
						moduleSubModule: 'Basics.ProcurementStructure',
						validationService: 'basicsProcurementStructureAccountValidationService',
						mustValidateFields: ['Account', 'OffsetAccount']
					});

					function setAccountDes(datas) {
						var accounts = basicsLookupdataLookupDescriptorService.getData('BasAccount');
						datas.forEach(function(data) {
							var ac;

							if (data.BasAccountFk !== null && typeof data.BasAccountFk === 'number') {
								ac = _.find(accounts, {Id: data.BasAccountFk});
								if (ac !== undefined) {
									data.BasAccountDescription = ac.DescriptionInfo.Translated;
								}
							}
							if (data.BasAccountOffsetFk !== null && typeof data.BasAccountOffsetFk === 'number') {
								ac = _.find(accounts, {Id: data.BasAccountOffsetFk});
								if (ac !== undefined) {
									data.BasAccountOffsetDescription = ac.DescriptionInfo.Translated;
								}
							}
						});
					}

					basicsLookupdataLookupDescriptorService.loadData('BasAccount');

					return serviceContainer.service;

					function initCreationData(creationData) {
						creationData.PKey1 = parentService.getSelected().Id;
					}
				}]);
})(angular);