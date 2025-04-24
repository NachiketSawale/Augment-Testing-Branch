(function (angular) {
	/* global globals, angular, _ */
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsItemCommonFormDataDataService',
		['$http',
			'platformDataServiceFactory',
			'basicsCommonMandatoryProcessor',
			'basicsLookupdataLookupDescriptorService',
			'basicsLookupdataLookupFilterService',
			'basicsUserformCommonService',
			'ppsItemCommonFormDataProcessor',
			'$q',
			function ($http,
				dataServiceFactory,
				basicsCommonMandatoryProcessor,
				basicsLookupdataLookupDescriptorService,
				basicsLookupdataLookupFilterService,
				basicsUserformCommonService,
				ppsItemCommonFormDataProcessor,
				$q) {

				var services = {};

				function createDataService(parentService, options) {
					var serviceContainer = null,
						tmpServiceInfo = {
							flatLeafItem: {
								entityNameTranslationID: options.title,
								httpRead: {
									route: globals.webApiBaseUrl + (options.route ||  'basics/userform/data/'),
									endRead: options.endRead || 'rubricdatalist',
									initReadData: function initReadData(readData) {
										var parentSelectedId = getContextFk();
										var contextFk = (parentSelectedId === null || parentSelectedId === undefined) ? -1 : parentSelectedId;
										readData.filter = '?rubricId=' + options.rubricId + '&contextFk=' + contextFk;
									}
								},
								httpCreate:{
									route: globals.webApiBaseUrl + 'basics/userform/data/',
									endCreate: 'createFormData'
								},
								//httpUpdate: {route: globals.webApiBaseUrl + 'basics/userform/data/', endUpdate: 'update'},
								httpDelete: {route: globals.webApiBaseUrl + 'basics/userform/data/', endDelete: 'delete'},
								dataProcessor: [ppsItemCommonFormDataProcessor],
								presenter: {
									list: {
										initCreationData: function initCreationData(creationData) {
											var selectedItemId = getContextFk();
											if (selectedItemId === null || selectedItemId === undefined) {
												throw new Error('Please first select a parent entity!');
											}
											creationData.contextFk = selectedItemId;
											creationData.rubricFk = options.rubricId;
										}
									}
								},
								entityRole: {
									leaf: {itemName: 'FormData', parentService: parentService}
								},
								translation: {
									uid: options.uuid,
									title: options.title,
									columns: [{ header: 'cloud.common.entityDescription', field: 'FormDataIntersection.DescriptionInfo' }]
								},
								actions: {
									delete: {},
									create: 'flat',
									canCreateCallBackFunc: function () {
										return setReadonlyor();
									},
									canDeleteCallBackFunc: function () {
										return setReadonlyor();
									}
								}
							}
						};

					if(options.noCreate === true) {
						tmpServiceInfo.flatLeafItem.actions.create = false;
					}
					if(options.noDelete === true) {
						tmpServiceInfo.flatLeafItem.actions.delete = false;
					}

					var setReadonlyor = function () {
						//if parent satus is readonly, then the form data should not be editable
						if(parentService){
							var parentSelectItem = parentService.getSelected();
							if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
								return false;
							}
							else if(parentService.getItemStatus !== undefined) {
								var status = parentService.getItemStatus();
								if(status.IsReadonly){
									return false;
								}
							}
						}
						return true;
					};

					var getContextFk = function() {
						return _.isNil(options.contextFk)? parentService.getSelected().Id : parentService.getSelected()[options.contextFk];
					};

					var filters = [
						{
							key: 'user-form-rubric-filter',
							serverSide: false,
							fn: function (item) {
								return !item.IsReadonly;
							}
						}

					];

					if (!basicsLookupdataLookupFilterService.hasFilter('user-form-rubric-filter')) {
						basicsLookupdataLookupFilterService.registerFilter(filters);
					}

					serviceContainer = dataServiceFactory.createNewComplete(tmpServiceInfo);

					serviceContainer.service.setNewEntityValidator = function (validator) {
						serviceContainer.data.newEntityValidator = validator;
					};

					$http.post(globals.webApiBaseUrl + 'basics/customize/FormDataStatus/list').then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('basics.customize.formdatastatus', response.data);
					});

					var service = serviceContainer.service;

					service.IsReadOnlyByParentAndSelfStatus=function(item){
						var parentEditAble = setReadonlyor();
						if(parentEditAble) {
							var selectedEntity = item ? item : service.getSelected();
							if (selectedEntity) {
								// self
								if (selectedEntity.IsReadonly) {
									return true;
								}
								// self readonly status
								var statusId = selectedEntity.FormDataStatusFk;
								var statusData = basicsLookupdataLookupDescriptorService.getData('basics.customize.formdatastatus');
								var status = _.find(statusData, function (item) {
									return item.Id === statusId;
								});
								return status && status.IsReadOnly;
							}
						}
						return !parentEditAble;
					};

					service.isEntitySelected = function() {
						var selectedEntity = service.getSelected();
						var result = selectedEntity !== null && !_.isEmpty(selectedEntity);
						return result;
					};

					service.showFormData = function(allowEdit, openMethod) {

						var selectedFormData = service.getSelected();
						if (selectedFormData && selectedFormData.Id > 0 && selectedFormData.FormFk !== 0) {
							// since showForm needs a relation to FormData we trigger the update function of the root-service
							// So we avoid the 'Please first save changes' popup.
							// todo: collect form inputs inside the complete dto and save only on demand
							if (selectedFormData.Version === 0) {     // first save new records!
								// get root service
								var rootService = parentService;
								while(rootService.parentService() !== null) {
									rootService = rootService.parentService();
								}
								// force root service to update
								rootService.update().then (function() {
									showForm(selectedFormData.FormFk, selectedFormData.Id, allowEdit, openMethod);
								});
							}
							else {
								showForm(selectedFormData.FormFk, selectedFormData.Id, allowEdit, openMethod);
							}
						}
					};

					var showForm = function(formFk, formDataId, allowEdit, openMethod) {

						var options = { formId: formFk, formDataId: formDataId, editable: allowEdit, setReadonly: false, modal:true, contextId: getContextFk(), openMethod: openMethod };
						basicsUserformCommonService.editData(options);
					};

					var onUpdateRequested = function onUpdateRequested(updateData) {

						if (updateData.EntitiesCount > 0 && !updateData.saveFormDataOngoing) {   // one module can have multiple userform containers!

							var entities = $q.defer();
							updateData.saveFormDataOngoing = true;
							var completeDto = { EntitiesCount: updateData.EntitiesCount, FormDataToSave: [], FormDataToDelete: [], MainItemId: 0 };
							fillCompleteDto(updateData, completeDto);

							$http.post(globals.webApiBaseUrl + 'basics/userform/data/update', completeDto)
								.then(function (data) {
									var updatedItems = data.data.FormDataToSave;
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
									delete updateData.saveFormDataOngoing;
								});

							return entities.promise;
						}
					};

					var rootService = parentService;
					while(rootService.parentService() !== null) {
						rootService = rootService.parentService();
					}
					//rootService.registerUpdateDataExtensionEvent(onUpdateRequested);
					rootService.registerUpdateDone(onUpdateRequested);

					// iterate thru complete dto and collect FormData values
					function fillCompleteDto(obj, dto)
					{
						for (var k in obj) // jshint ignore:line
						{
							if (k === 'FormDataToSave' || k === 'FormDataToDelete') {
								obj[k].map(function (item) {
									dto[k].push(item);
								}); // jshint ignore:line
								if (Object.prototype.hasOwnProperty.call(obj,'MainItemId')) {
									dto.MainItemId = obj.MainItemId;
								}
							}

							if (typeof obj[k] === 'object' && obj[k] !== null) {
								fillCompleteDto(obj[k], dto);
							}
							else	{
								// do noting...
								angular.noop();
							}
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
			}
		]);
})(angular);
