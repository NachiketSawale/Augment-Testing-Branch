(function (angular) {
	'use strict';
	var modName = 'basics.pricecondition';

	angular.module(modName).factory('basicsPriceConditionParamDataService',
		['$http','$q',
			'platformDataServiceFactory',
			'platformRuntimeDataService',
			function ($http, $q,
				dataServiceFactory,
				platformRuntimeDataService) {

				var services = {};

				function createDataService(parentService, options) {
					var serviceContainer = null,
						tmpServiceInfo = {
							flatLeafItem: {
								httpCRUD: {
									route: globals.webApiBaseUrl + 'basics/pricecondition/headerpparam/',
									endRead: 'getlist',
									initReadData: function initReadData(readData) {
										var parentSelectedId = getContextFk();
										var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
										readData.filter = '?type=' + options.paramTypeId + '&contextFk=' + contextFk;
									}
								},
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											var selectedItemId = getContextFk();
											if (selectedItemId === null || selectedItemId === undefined) {
												throw new Error('Please first select a parent entity!');
											}
											creationData.ContextFk = selectedItemId;
											creationData.Type = options.paramTypeId;
										}
									}
								},
								entityRole: {
									leaf: {itemName: 'HeaderPparam', parentService: parentService}
								},
								actions: {
									delete: {},
									create: 'flat',
									canCreateCallBackFunc: function () {
										return SetReadonlyor();
									},
									canDeleteCallBackFunc: function () {
										return SetReadonlyor();
									}
								},
								dataProcessor: [{
									processItem: function (item) {
										let readonlyResult = SetReadonlyor();
										if (!readonlyResult) {
											platformRuntimeDataService.readonly(item, true);
										} else {
											platformRuntimeDataService.readonly(item, false);
										}
									}
								}]
							}
						};

					var SetReadonlyor = function () {
						//if parent satus is readonly, then the form data should not be editable
						if(parentService){
							var parentSelectItem = parentService.getSelected();
							if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
								return false;
							}
						}
						var name = parentService.getModule().name;
						if (_.startsWith(name, 'procurement')) {
							var getModuleStatusFn = parentService.getItemStatus || parentService.getModuleState;
							if (getModuleStatusFn) {
								var status = getModuleStatusFn();
								return !(status.IsReadOnly || status.IsReadonly);
							}
							return false;
						}
						return true;
					};

					var getContextFk = function() {
						return parentService.getSelected().Id;
					};

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);

					var service = serviceContainer.service;

					var onUpdateRequested = function onUpdateRequested(updateData) {

						if (updateData.EntitiesCount > 0 && !updateData.saveHeaderPparamOngoing) {   // one module can have multiple userform containers!

							var entities = $q.defer();
							updateData.saveHeaderPparamOngoing = true;
							var completeDto = {HeaderPparamToSave: [], HeaderPparamToDelete: [], Type: options.paramTypeId };

							if(updateData.HeaderPparamToSave){
								var toSave = _.filter(updateData.HeaderPparamToSave, function (item) {
									return !!item.PriceConditionTypeFk && (!!item.Value|| item.Value - 0 === 0);
								});
								completeDto.HeaderPparamToSave = toSave || [];
							}
							if(updateData.HeaderPparamToDelete){
								completeDto.HeaderPparamToDelete = updateData.HeaderPparamToDelete;
							}

							$http.post(globals.webApiBaseUrl + 'basics/pricecondition/headerpparam/update', completeDto)
								.then(function (data) {
									var updatedItems = data.HeaderPparamToSave;
									var oldItems = serviceContainer.data.itemList;
									angular.forEach(oldItems, function (item) {
										var newItem = _.find(updatedItems, {Id: item.Id});
										if (newItem) {
											var oldItem = _.find(oldItems, {Id: item.Id});
											serviceContainer.data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, serviceContainer.data);
										}
									});
									entities.resolve();
								}).finally(function(){
									delete updateData.saveHeaderPparamOngoing;
								});

							return entities.promise;
						}
					};

					var onUpdateDone=function(){
						service.load();
					};

					var rootService = parentService;
					while(rootService.parentService() !== null) {
						rootService = rootService.parentService();
					}
					rootService.registerUpdateDataExtensionEvent(onUpdateRequested);

					//reload price condition param when rootService update
					var rootModuleName=rootService.getModule().name;
					if (_.startsWith(rootModuleName, 'procurement')) {
						if(rootService.onUpdateSucceeded) {//pes module
							rootService.onUpdateSucceeded.register(onUpdateDone);
						}
						else{
							rootService.registerUpdateDone(onUpdateDone);
						}
					}


					return service;
				}

				return {
					getService: function (parentService, options) {
						if (!services[options.uuid]) {
							services[options.uuid] = createDataService(parentService, options);
						}
						return services[options.uuid];
					}
				};

			}]);
})(angular);