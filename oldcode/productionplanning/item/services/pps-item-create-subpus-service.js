(function (angular) {
	'use strict';
	/*global globals, angular, _*/
	var moduleName = 'productionplanning.item';

	angular.module(moduleName).factory('ppsItemCreateSubPUsService', PpsItemCreateSubPUsService);

	PpsItemCreateSubPUsService.$inject = [
		'$injector', '$interval',
		'$http', '$q',
		'$translate',
		'platformTranslateService',
		'platformGridAPI',
		'platformModalService',
		'basicsCommonCreateDialogConfigService',
		'productionplanningItemDataService',
		'basicsLookupdataLookupFilterService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'productionplanningItemSubItemDataService',
		'platformDataValidationService'];

	function PpsItemCreateSubPUsService(
	  $injector, $interval,
	  $http, $q,
	  $translate,
	  platformTranslateService,
	  platformGridAPI,
	  platformModalService,
	  createDialogConfigService,
	  itemDataService,
	  basicsLookupdataLookupFilterService,
	  platformRuntimeDataService,
	  basicsLookupdataLookupDescriptorService,
	  subItemDataService,
	  platformDataValidationService) {

		var service = {};
		var scope = {};
		service.eventTypesFrom = [];
		service.eventTypesTo = [];
		service.eventTypes = [];
		let parentItem = {};

		var filters = [
			{
				key: 'pps-itemsplit-eventtype-from-filter',
				fn: function (eventType) {
					return _.find(service.eventTypesFrom, {Id: eventType.Id});
				}
			},
			{
				key: 'pps-itemsplit-eventtype-to-filter',
				fn: function (eventType) {
					return _.find(service.eventTypesTo, {Id: eventType.Id});
				}
			},
			{
				key: 'pps-mdc-productdesc-by-material-filter',
				fn: function (entity) {
					return entity.MaterialFk === parentItem.MdcMaterialFk && entity.IsLive;
				}
			}];

		service.registerFilters = function () {
			basicsLookupdataLookupFilterService.registerFilter(filters);
		};

		service.unregisterFilters = function () {
			basicsLookupdataLookupFilterService.unregisterFilter(filters);
		};

		function getCreateSubPUsForm(isSharedDrawing) {
			return {
				fid: 'productionplanning.item.split.configForm',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'createSubPUsConfig',
						header: 'productionplanning.common.product',
						isOpen: true,
						attributes: ['ProductDescriptionFk', 'PpsProductTemplateCode', 'SplitFrom', 'SplitTo', 'Quantity']
					}
				],
				rows: [
					{
						gid: 'createSubPUsConfig',
						rid: 'drawing',
						label: '*Drawing',
						label$tr$: 'productionplanning.drawing.entityDrawing',
						model: 'EngDrawingFk',
						required: true,
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'productionplanning-drawing-dialog-lookup',
							displayMember: 'Code',
							lookupOptions: {
								showClearButton: true,
								showAddButton: true,
								createOptions: $injector.get('ppsItemDrawingCreateOption'),
								defaultFilter: {projectId: 'ProjectFk', drawingTypeId: 'DrawingTypeFk'}
							}
						},
						readonly: isSharedDrawing,
						sortOrder: 1,
						validator: (item, value, field) => {;
							item.EngDrawingFk = value;
							service.validateProductTemplateCode(item, item.PpsProductTemplateCode,'PpsProductTemplateCode');
							return service.validateEngDrawingFk(item, value, field);
						}
					},
					{
						gid: 'createSubPUsConfig',
						rid: 'mdcProductDescriptionFk',
						label: '*Product Description',
						label$tr$: 'productionplanning.item.productDescription',
						model: 'ProductDescriptionFk',
						type: 'directive',
						directive: 'material-product-description-lookup',
						options: {
							lookupDirective: 'material-product-description-lookup',
							displayMember: 'Code',
							filterKey: 'pps-mdc-productdesc-by-material-filter',
							lookupOptions: {
								filterKey: 'pps-mdc-productdesc-by-material-filter'
							}
						},
						sortOrder: 2,
						required: true,
						change: (entity, field) => {
							service.setCode();
						}
					},
					{
						gid: 'createSubPUsConfig',
						rid: 'PpsProductTemplateCode',
						label: '*Product Template Code',
						label$tr$: 'productionplanning.item.ppsProductTemplateCode',
						model: 'PpsProductTemplateCode',
						type: 'code',
						maxLength: 255,
						sortOrder: 3,
						required: true,
						validator: (item, value, field) => {
							return service.validateCode(item, value, field);
						},
						asyncValidator: (item, value, field) => {
							return service.asyncValidateCode(item, value, field);
						},
					},
					{
						gid: 'createSubPUsConfig',
						rid: 'quantity',
						label: '*Quantity',
						label$tr$: 'basics.common.Quantity',
						model: 'OpenQuantity',
						sortOrder: 4,
						type: 'decimal',
						change: (entity, field) => {
							service.validateQuantity(entity, field);
						}
					},
				]
			};
		}

		function updateFromTo(entity, field) {
			var pushEventType = false;
			switch (field) {
				case 'SplitFrom':
					var spilitTos = [];

					_.forEach(service.eventTypes, function (eventType) {
						if (eventType.Id === entity.SplitFrom) {
							pushEventType = true;
							spilitTos.push(eventType);
						}
						if (pushEventType) {
							spilitTos.push(eventType);
						}
					});
					service.eventTypesTo = spilitTos;
					break;

				case 'SplitTo':
					var spilitFroms = [];
					pushEventType = true;

					_.forEach(service.eventTypes, function (eventType) {
						if (eventType.Id === entity.SplitTo) {
							spilitFroms.push(eventType);
							pushEventType = false;
						}
						if (pushEventType) {
							spilitFroms.push(eventType);
						}
					});
					service.eventTypesFrom = spilitFroms;
					break;
				default:
					return;
			}
		}

		service.showDialog = function (selected) {
			let promises = [];
			if (selected) {
				var itemId = selected.Id;
				promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/item/geteventtypes?ItemId=' + itemId + '&Default=1'));
				promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcproductdescription/getdefaultorfirstbymaterial?materialFk=' + selected.MdcMaterialFk));
				promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/drawingtype/getdefaulttype?materialGroupId=' + selected.MaterialGroupFk));
				$q.all(promises).then(function (response) {
					let modalCreateConfig = {
						width: '900px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-create-subpus-dialog.html',
						controller: 'ppsItemCreateSubPUsController',
						resolve: {
							'$options': function () {
								return {
									parentItem: selected,
									MdcProductDescriptionFk: response[1].data.Main ? response[1].data.Main.Id : -1,
									eventTypes: response[0].data.SelectedItemEventTypes,
									fromTo: response[0].data.DefaultEventTypes,
									defaultDrawingTypeFk: response[2].data
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				});
			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.moreItemsWarn',
				  'productionplanning.item.upstreamItemSplit.dialogTitle', 'warning');
			}
		};

		service.initial = function ($scope, $options) {
			_.extend($scope, $options);
			scope = $scope;
			service.eventTypes = service.eventTypesFrom = service.eventTypesTo = scope.eventTypes;
			parentItem = $options.parentItem;

			const engEntities = _.filter(parentItem.EventTypeEntities, {PpsEntityFk: 5});// 5 For Eng
			const sharedEvents = _.filter(parentItem.EventEntities, (event) => {
				return event.ItemFk !== parentItem.Id;
			});
			const sharedEngEvents = _.filter(sharedEvents, (event) => {
				return _.some(engEntities, {Id: event.EventTypeFk});
			});

			const isSharedDrawing = sharedEngEvents.length > 0;
			scope.formOptions = {configure: platformTranslateService.translateFormConfig(getCreateSubPUsForm(isSharedDrawing))};

			if (isSharedDrawing) {
				scope.alerts = [{
					title: $translate.instant('productionplanning.item.creation.alertTitle'),
					message: $translate.instant('productionplanning.item.sharedDrawingDisableSelect'),
					css: 'alert-info'
				}];
			}

			scope.entity = {
				ProductDescriptionFk: $options.MdcProductDescriptionFk,
				EngDrawingFk: parentItem.EngDrawingDefFk,
				ProjectFk: parentItem.ProjectFk,
				DrawingTypeFk: $options.defaultDrawingTypeFk,
				SplitFactor: 1,
				ChildItem: true,
				SplitFrom: scope.fromTo ? scope.fromTo.SplitFrom : null,
				SplitTo: scope.fromTo ? scope.fromTo.SplitTo : null,
				IntervalDay: 0,
				Quantity: 0,
				__rt$data: {
					errors: {}
				}
			};

			$scope.isOKDisabled = function () {
				return !(scope.entity.SplitFrom && scope.entity.SplitTo && scope.entity.ProductDescriptionFk > 0 && scope.entity.EngDrawingFk > 0 && _.isEmpty(scope.entity.__rt$data.errors));
			};
			$scope.handleOK = function () {

				let postData = {
					ParentItem: $scope.parentItem,
					EngDrawingFk: scope.entity.EngDrawingFk,
					MdcProductDescriptionFk: scope.entity.ProductDescriptionFk,
					PpsProductTemplateCode: scope.entity.PpsProductTemplateCode,
					Config: scope.entity,
					ProductCreationNumber: scope.entity.Quantity,
					OpenQuantity: scope.entity.OpenQuantity
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/createSubPUs', postData).then(function (response) {
					const returnItems = response.data;
					service.syncItemsAfterCreation(parentItem, returnItems);
					subItemDataService.setParentItemFilter(parentItem);
					// subItemDataService.loadSubItems();
				});
				$scope.$close(true);
			};

			$scope.modalOptions = {
				headerText: $translate.instant('productionplanning.item.createSubPUDialog'),
				cancel: function () {
					$scope.$close(false);
				}
			};

			$interval(service.setData, 300, 1);
		};

		service.syncItemsAfterCreation = function (parent, returnItems) {
			const childProp = 'ChildItems';
			const itemList = itemDataService.getUnfilteredList();
			const parentPresented = !!_.find(itemDataService.getList(), {Id: parent.Id});

			const updatedParent = _.find(returnItems, function (item) {
				return item.Id === parent.Id;
			});
			if (parent && updatedParent && updatedParent.Id === parent.Id) {
				angular.extend(parent, updatedParent);
			} else {
				parent[childProp].push(...returnItems);
			}

			platformRuntimeDataService.readonly(parent, [{
				field: 'MdcMaterialFk',
				readonly: true
			}, {field: 'ProductDescriptionFk', readonly: true}]);

			const newItems = [];
			$injector.get('cloudCommonGridService').flatten([parent], newItems, childProp);
			$injector.get('platformDataServiceDataProcessorExtension').doProcessData(newItems, itemDataService.getContainerData());

			_.forEach(newItems, function (item) {
				item._visibility = ['standard', 'byJob', 'treeByJob'];

				const oldItem = _.find(itemList, {Id: item.Id});
				if (oldItem) {
					// replace the old item
					const index = itemList.indexOf(oldItem);
					itemList.splice(index, 1, item);
				} else {
					itemList.push(item);
					if (parentPresented) {
						AddToGrids(item);
						itemDataService.syncDynamicColumns(item.Id);
					}
				}
			});
		};

		function AddToGrids(item) {
			const gridId = {
				tree: '5907fffe0f9b44588254c79a70ba3af1',
				list: '3598514b62bc409ab6d05626f7ce304b',
				treeByJob: '475a5d3fec674e2dbe4675e0f935c20e',
				listByJob: '0df56a341a8e48808dd929dc8c2ed88f',
				subPU: '4ddf9e9220f44a22b29c97ecd41c7ab2',
			};

			for (const key in gridId) {
				platformGridAPI.rows.add({gridId: gridId[key], item: item});
			}
		}

		service.setData = () => {
			service.setCode();
			service.setOpenQuantity();
			service.validateEngDrawingFk(scope.entity, scope.entity.EngDrawingFk, 'EngDrawingFk');
		};

		service.setCode = () => {
			basicsLookupdataLookupDescriptorService.loadItemByKey({
				ngModel: scope.entity.ProductDescriptionFk,
				options: {lookupType: 'MDCProductDescriptionTiny', version: 3}
			}).then((mdcProductTemplate) => {
				scope.entity.PpsProductTemplateCode = mdcProductTemplate !== null ? mdcProductTemplate.Code : '';
				service.validateProductTemplateCode(scope.entity, scope.entity.PpsProductTemplateCode,'PpsProductTemplateCode');
			});
		};

		service.setOpenQuantity = () => {
			let subItemList = subItemDataService.getList();
			let sumQty = _.sum(_.map(subItemList, 'Quantity'));
			scope.entity.OpenQuantity = parentItem.Quantity - sumQty;
			service.validateQuantity(scope.entity, 'OpenQuantity');
		};

		service.validateProductTemplateCode = (item, value, field) => {
			const result = service.validateCode(item, value,field);
			if(!result.valid){
				platformRuntimeDataService.applyValidationResult(result, item, field);
			}
			else{
				service.asyncValidateCode(item, value, field).then(function(result){
					platformRuntimeDataService.applyValidationResult(result, item, field);
				});
			}
		};

		service.validateCode =  (item, value, field) => {
			let list = subItemDataService.getList();
			let result = {apply: true, valid: true, error: ''};
			if (value === '') {
				result.valid = false;
				result.apply = true;
				result.error = 'The PpsProductTemplateCode is Mandatory';
				result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
				result.error$tr$param$ = {fieldName: field};
			}
			else {
				delete scope.entity.__rt$data.errors.PpsProductTemplateCode;
			}
			return result;
		};

		service.asyncValidateCode = (item, value, field) => {
			const defer = $q.defer();
			let result = {apply: true, valid: true, error: ''};
			const engDrawingFk = _.get(item, 'EngDrawingFk');

			if (engDrawingFk) {
				const url = globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/isuniquecode?id=0' +
				  '&&parentid=' + engDrawingFk + '&&code=' + value;
				$http.get(url).then(function (response) {
					if (!response.data) {
						result.valid = false;
						result.apply = true;
						result.error = '...';
						result.error$tr$ = 'productionplanning.producttemplate.errors.uniqProductDescriptionCode';
					}
					defer.resolve(result);
				});
			} else {
				defer.resolve(result);
			}
			return defer.promise;
		};

		service.validateQuantity = (entity, field) => {
			let result = {apply: true, valid: true, error: ''};
			if (entity[field] < 0) {
				result.valid = false;
				result.apply = true;
				result.error = 'The Quantity should not be Negative';
				result.error$tr$ = 'productionplanning.item.noNegativeQuantity';
			} else {
				delete scope.entity.__rt$data.errors.OpenQuantity;
			}
			platformRuntimeDataService.applyValidationResult(result, entity, field);
		};

		service.validateEngDrawingFk = (item, value, field) => {
			let result = {apply: true, valid: true, error: ''};
			if (value === null) {
				result.valid = false;
				result.apply = true;
				result.error = 'The Drawing is Mandatory';
				result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
				result.error$tr$param$ = {fieldName: $translate.instant('productionplanning.drawing.entityDrawing')};
			} else {
				delete scope.entity.__rt$data.errors.EngDrawingFk;
			}
			platformRuntimeDataService.applyValidationResult(result, item, field);
			return result;
		};

		return service;
	}
})(angular);