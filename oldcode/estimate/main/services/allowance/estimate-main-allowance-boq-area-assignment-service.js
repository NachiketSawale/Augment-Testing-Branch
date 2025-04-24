(function (angular) {
	/* global globals */
	'use strict';
	let module = angular.module('estimate.main');
	module.factory('estimateMainAllowanceBoqAreaAssigmentService', ['_', '$injector', 'platformDataServiceFactory', 'platformDataServiceDataProcessorExtension',
		'estimateMainAllowanceAreaService',
		function (_, $injector, platformDataServiceFactory, platformDataServiceDataProcessorExtension, estimateMainAllowanceAreaService) {
			let options = {
				flatLeafItem: {
					module: module,
					httpCreate: {route: globals.webApiBaseUrl + 'estimate/main/boqareaassignment/', endRead: 'create'},
					httpRead: {route: globals.webApiBaseUrl + 'estimate/main/boqareaassignment/', endRead: 'list'},
					actions: {
						delete: true,
						create: 'flat',
						canCreateCallBackFunc: canCreateBoqAreaAssignment,
					},
					entityRole: {
						leaf:
                            { itemName: 'BoqAreaAssigment',parentService: estimateMainAllowanceAreaService }
					},
					entitySelection: {supportsMultiSelection: false},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								creationData.MainItemId = estimateMainAllowanceAreaService.getSelected().Id;
								creationData.EstAllowanceFk = estimateMainAllowanceAreaService.getSelected().EstAllowanceFk;
							},
							incorporateDataRead: function (itemList, data) {
								return container.data.handleReadSucceeded(itemList, data);
							}
						}
					},
					useItemFilter: true
				}
			};

			function canCreateBoqAreaAssignment(){
				let areaEntity = estimateMainAllowanceAreaService.getSelected();
				if(!areaEntity){
					return false;
				}
				return [1,3].indexOf(areaEntity.AreaType) > -1;
			}

			let container = platformDataServiceFactory.createNewComplete(options);

			container.data.newEntityValidator = $injector.get('estimateMainBoqAreaAssignmentValidationService'); 

			let service = container.service;

			function generateUpdateDoneFunc(container){
				let dataService = container.data;
				return function handleUpdateDone(updateData){
					if(updateData){
						angular.forEach(updateData, function (item) {
							if(item){
								let oldItem = _.find(dataService.itemList, {Id: item.Id});

								if (oldItem) {
									dataService.mergeItemAfterSuccessfullUpdate(oldItem, item, true, dataService);
									platformDataServiceDataProcessorExtension.doProcessItem(oldItem, dataService);
								}
							}
						});
					}
				};
			}

			service.handleUpdateDone = generateUpdateDoneFunc(container);

			service.clearData = function clearData() {
				let data = container.data;
				if(data.itemList.length === 0){
					return;
				}
				service.setList([]);
				if (data.listLoaded) {
					data.listLoaded.fire();
				}
			};

			service.clearDataFromFavorites = function () {
				let estimateMainStandardAllowancesDataService = $injector.get('estimateMainStandardAllowancesDataService');
				if(estimateMainStandardAllowancesDataService.getIsClearMarkupContainer()){
					service.clearData();
					estimateMainStandardAllowancesDataService.setHeader(-1);
				}
			}

			return service;
		}]);
})(angular);