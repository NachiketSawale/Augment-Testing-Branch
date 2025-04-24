/**
 * Created by anl on 1/22/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).directive('transportResourceLookupDialog', ['LookupFilterDialogDefinition',
		'basicsLookupdataConfigGenerator',
		'resourceMasterResourceFilterLookupDataService',
		'$http',
		'cloudCommonGridService',
		'basicsLookupdataLookupFilterService',
		'$injector',
		'BasicsLookupdataLookupDirectiveDefinition',
		'lookupFilterDialogControllerService',
		'transportplanningTransportMainService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupDataService',

		function (LookupFilterDialogDefinition,
				  basicsLookupdataConfigGenerator,
				  resourceMasterResourceFilterLookupDataService,
				  $http,
				  cloudCommonGridService,
				  basicsLookupdataLookupFilterService,
				  $injector,
				  BasicsLookupdataLookupDirectiveDefinition,
				  lookupFilterDialogControllerService,
				  transportMainService,
				  basicsLookupdataLookupDescriptorService,
				  basicsLookupdataLookupDataService) {

			var activeField = null;

			var filters = [{
				key: 'route-resource-type-filter',
				fn: function (item) {
					if (activeField === 'Truck') {
						return item.IsTruck;
					}
					else if (activeField === 'Driver') {
						return item.IsDriver;
					}
					else if (activeField === 'Crane') {
						return item.IsCrane;
					}
				}
			}];
			basicsLookupdataLookupFilterService.registerFilter(filters);

			// var resourceTypes = {};
			var truckTypes = {};
			var craneTypes = {};
			var driverTypes = {};

			(function getResourceTypes() {
				$http.get(globals.webApiBaseUrl + 'resource/type/tree').then(function (response) {
					if (response.data) {
						var resTypes = [];
						cloudCommonGridService.flatten(response.data, resTypes, 'SubResources');
						truckTypes = _.filter(resTypes, function (resType) {
							return resType.IsTruck;
						});
						driverTypes = _.filter(resTypes, function (resType) {
							return resType.IsDriver;
						});
						craneTypes = _.filter(resTypes, function (resType) {
							return resType.IsCrane;
						});
					}
				});
			})();

			var formSettings = {
				fid: 'resource.master.selectionfilter',
				version: '1.0.0',
				showGrouping: false,
				groups: [
					{
						gid: 'selectionfilter',
						isOpen: true,
						visible: true,
						sortOrder: 1
					}
				],
				rows: [{
					gid: 'selectionfilter',
					rid: 'site',
					label: 'Site',
					label$tr$: 'resource.master.SiteFk',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupOptions: {showClearButton: true},
						lookupDirective: 'basics-site-site-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					model: 'siteFk',
					sortOrder: 1
				},
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'resourceTypeLookupDataService',
							filterKey: 'route-resource-type-filter',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: true
						},
						{
							gid: 'selectionfilter',
							rid: 'type',
							label: 'Type',
							label$tr$: 'resource.master.TypeFk',
							type: 'integer',
							model: 'typeFk',
							sortOrder: 4
						}),
					{
						gid: 'selectionfilter',
						rid: 'parentIncluded',
						model: 'isParentIncluded',
						label: '*Include Parent Site',
						type: 'boolean',
						label$tr$: 'transportplanning.transport.parentIncluded',
						sortOrder: 5
					}]
			};
			var gridSettings = {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						formatter: 'code'
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						readonly: true,
						width: 270
					},
					{
						id: 'site',
						field: 'SiteFk',
						name: 'Site',
						name$tr$: 'resource.master.SiteFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'SiteNew',
							displayMember: 'DescriptionInfo.Translated',
							version: 3
						}
					},
					{
						id: 'type',
						field: 'TypeFk',
						name: 'Type',
						name$tr$: 'resource.master.TypeFk',
						readonly: true,
						formatter: 'lookup',
						formatterOptions: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
							dataServiceName: 'resourceTypeLookupDataService'
						}).formatterOptions
					}
				]
			};

			function getDefaultFilter(request, type) {
				request.siteFk = transportMainService.getSelected().SiteFk;
				if (type === 'Truck') {
					request.typeFk = findRootNode(truckTypes);
				}
				else if (type === 'Driver') {
					request.typeFk = findRootNode(driverTypes);

				}
				else if (type === 'Crane') {
					request.typeFk = findRootNode(craneTypes);
				}
				request.isParentIncluded = transportMainService.isParentIncluded ? transportMainService.isParentIncluded : false;
				return request;
			}

			function findRootNode(types) {
				if (types.length > 0) {
					var type = _.find(types, function (type) {
						return type.HasChildren && type.ResourceTypeFk === null;
					});
					return type ? type.Id : types[0].Id;
				}
				else {
					return null;
				}
			}

			function dialogController($scope, $modalInstance) {

				$scope.options.defaultFilter = function (req) {
					var selectedRoute = transportMainService.getSelected();
					var request = getDefaultFilter(req, activeField);
					var resource;
					if (activeField === 'Truck') {
						request.typeFk = selectedRoute.TruckTypeFk ? selectedRoute.TruckTypeFk : request.typeFk;
					}
					else if (activeField === 'Driver') {
						if (selectedRoute.DriverFk) {
							resource = basicsLookupdataLookupDescriptorService.getLookupItem('ResourceMasterResource', selectedRoute.DriverFk);
							request.typeFk = resource.TypeFk;
						}
					}
					else if (activeField === 'Crane') {
						if ($scope.options.dataView.scope.displayItem) {
							request.typeFk = $scope.options.dataView.scope.displayItem.TypeFk;
						}
					}
					return request;
				};

				if ($scope.options.resourceType === 'Truck') {
					activeField = 'Truck';
				}
				else if ($scope.options.resourceType === 'Driver') {
					activeField = 'Driver';
				}
				else if ($scope.options.resourceType === 'Crane') {
					activeField = 'Crane';
				}

				$scope.options.processData = function (data) {
					var itemList = data;

					if (activeField === 'Truck') {
						itemList = _.filter(itemList, function (resource) {
							return _.find(truckTypes, {Id: resource.TypeFk});
						});
					}
					else if (activeField === 'Driver') {
						itemList = _.filter(itemList, function (resource) {
							return _.find(driverTypes, {Id: resource.TypeFk});
						});
					}
					else if (activeField === 'Crane') {
						itemList = _.filter(itemList, function (resource) {
							return _.find(craneTypes, {Id: resource.TypeFk});
						});
					}
					return itemList;
				};
				var basicController = lookupFilterDialogControllerService.initFilterDialogController($scope, $modalInstance);
				var parentRow = _.find($scope.options.detailConfig.rows, {model: 'isParentIncluded'});
				parentRow.change = function (model) {
					transportMainService.isParentIncluded = model.isParentIncluded;
				};
				return basicController;
			}


			var dataService = $injector.get('resourceMasterResourceFilterLookupDataService');

			gridSettings.inputSearchMembers = gridSettings.inputSearchMembers || ['SearchPattern'];

			var defaults = {
				lookupType: 'ResourceMasterResource',
				valueMember: 'Id',
				displayMember: 'Code',
				disableDataCaching: false,
				detailConfig: formSettings,
				dataService: dataService,
				version: 3,
				title: 'resource.master.lookupAssignResource',
				uuid: '2684bb555b3c4ab1a2b3fba6d79933cb',
				filterOptions: {
					serverSide: true,
					serverKey: 'resource-master-filter',
					fn: function (item) {
						return resourceMasterResourceFilterLookupDataService.getFilterParams(item);
					}
				},
				resizeable: true,
				// disablePopupOnSearch: true,
				// isTextEditable: false,
				// autoSearch: false,
				dialogOptions: {
					templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
					controller: ['$scope', '$modalInstance', 'lookupFilterDialogControllerService', dialogController]
				}
			};

			defaults = _.merge(defaults, gridSettings);

			function setRequest(filters) {
				var request = {};
				if(filters.siteFk){
					request.siteFk = filters.siteFk;
				}
				if(filters.typeFk){
					request.typeFk = filters.typeFk;
				}
				request.isParentIncluded = filters.isParentIncluded ? filters.isParentIncluded : false;
				return request;
			}

			var dataProvider = basicsLookupdataLookupDataService.registerDataProviderByType(defaults.lookupType);
			var getSearchList1 = function () {
				var searchString = arguments[0].SearchText;
				var filters = getDefaultFilter({}, arguments[1].resourceType);
				var addtionParams = _.isEmpty(arguments[0].AdditionalParameters) ? setRequest(filters) : arguments[0].AdditionalParameters;
				addtionParams.isParentIncluded = filters.isParentIncluded;
				var request = {
					'SearchFields': ['SearchPattern'],
					'SearchText': searchString,
					'FilterKey': 'resource-master-filter',
					'AdditionalParameters': addtionParams,
					'TreeState':{'StartId':null,'Depth':null},
					'PageState':{'PageNumber':0,'PageSize':100},
					'RequirePaging': true
				};

				var url = 'basics/lookupdata/masternew/getsearchlist?lookup=resourcemasterresource';
				return this.sendHttp('post', url, {
					data: JSON.stringify(request),
					map: function (data) {
						if (data === null) {
							return {};
						}
						return {
							items: data.SearchList,
							itemsFound: data.RecordsFound,
							itemsRetrieved: data.RecordsRetrieved
						};
					}
				});
			};

			// return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults);
			return new BasicsLookupdataLookupDirectiveDefinition('input-base', defaults, {
				dataProvider: _.merge(dataProvider, {
					getSearchList: getSearchList1,
					getList: getSearchList1
				})
			});
		}
	]);
})(angular);