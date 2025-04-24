(angular => {
	'use strict';
	/* global globals, _ */
	const moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateTransportRouteDialogProductService', service);

	service.$inject = [
		'platformModalService', 'PlatformMessenger', 'platformGridAPI',
		'packageTypes', 'transportplanningTransportCreateTransportRouteDialogServiceFactory',
		'transportplanningBundleTrsProjectConfigService',
		'$injector'
	];

	function service(
		platformModalService, PlatformMessenger, platformGridAPI,
		packageTypes, dialogServiceFactory, trsProjectConfigService,
		$injector) {

		const dialogGridId = 'd53f9f0e3af348f49e085576ded49eed';
		const serviceOption = {
			pkgType: packageTypes.Product,
			resultName: 'Products',
		};
		const service = dialogServiceFactory.createInstance(serviceOption);

		service.createItem = function (entity) {
			const checkedProducts = new Map();
			service.getList().forEach(item => {
				checkedProducts.set(item.Id, item);
			});

			const dialogConfig = {
				width: '60%',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
				controller: 'productionplanningCommonProductLookupNew2Controller',
				resolve: {
					'$options': dialogOption
				},
			};
			platformModalService.showDialog(dialogConfig);

			function dialogOption() {
				return {
					beforeInit: function (lookupOptions) {
						// add checked column
						const columns = _.clone(lookupOptions.gridSettings.columns);
						columns.unshift({
							id: 'currentlocationjobfk',
							editor: 'lookup',
							field: 'CurrentLocationJobFk',
							name: '*Current Location Job',
							name$tr$: 'transportplanning.bundle.entityJobFromHistory',
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'logisticJobEx',
								displayMember: 'Code',
								version: 3
							},
							sortable: true,
							readonly: true
						});

						columns.unshift({
							editor: 'boolean',
							field: 'Checked',
							formatter: 'boolean',
							id: 'checked',
							width: 80,
							pinned: true,
							sortable: true,
							headerChkbox: false,
							name$tr$: 'cloud.common.entitySelected'
						});
						lookupOptions.gridSettings.columns = columns;

						// set additional default filters
						const originalDefaultFilterFn = lookupOptions.defaultFilter;
						lookupOptions.defaultFilter = function (request) {
							originalDefaultFilterFn(request);
							request.JobId = Object.prototype.hasOwnProperty.call(entity,'DstWPFk') || entity.createWaypointForEachBundle? entity.JobDefFk : entity.ClientJobFk;
							request.JobIdFromHistory = trsProjectConfigService.initJobFilter(entity.SiteFk);
							request.BoolFilter = {
								HideDeliveredBool: true,
								onlyBeforeDelivery: true
							};
							request.plannedDeliveryTime = entity.PlannedDeliveryTime;

							let preSelectedJob = $injector.get('logisticJobDialogLookupPagingExtensionDataService').getSelected();
							request.ProjectId = preSelectedJob !== null ? preSelectedJob.ProjectFk : entity.ProjectDefFk;

							return request;
						};

						lookupOptions.processData = function (data) {
							data.forEach(item => item.Checked = checkedProducts.has(item.Id));
							return data;
						};
					},
					afterInit: function (scope) {
						scope.canSelect = null;
						scope.onSelectedItemsChanged = new PlatformMessenger();

						scope.options.selectableCallback = function () {
							return checkedProducts.size > 0;
						};

						// events
						scope.onSelectedItemsChanged.register(applySelection);
						platformGridAPI.events.register(dialogGridId, 'onCellChange', checkItem);
						platformGridAPI.events.register(dialogGridId, 'onRowsChanged', updateOkButtonState);

						function applySelection() {
							service.createReferences([...checkedProducts.values()]);
							// unregister events
							scope.onSelectedItemsChanged.unregister(applySelection);
							platformGridAPI.events.unregister(dialogGridId, 'onCellChange', checkItem);
							platformGridAPI.events.unregister(dialogGridId, 'onRowsChanged', updateOkButtonState);
							scope.close();
						}

						function checkItem(e, args) {
							const field = args.grid.getColumns()[args.cell].field;
							if (field === 'Checked') {
								if (args.item.Checked) {
									checkedProducts.set(args.item.Id, args.item);
								} else {
									checkedProducts.delete(args.item.Id);
								}
							}
							updateOkButtonState();
						}

						function updateOkButtonState() {
							scope.disableOkButton = checkedProducts.size === 0;
							if (scope.$root) {
								scope.$root.safeApply();
							} else {
								scope.$apply();
							}
						}
					}
				};
			}
		};

		service.getResult = function () {
			const property = packageTypes.properties[serviceOption.pkgType];
			const result = [];
			_.forEach(service.getList(), function (item) {
				result.push({
					Id: item.Id,
					PkgType: serviceOption.pkgType,
					Quantity: item.PQuantity,
					UomFk: item.PUomFk,
					Weight: _.get(item, property.weightPropertyName),
					UoMLengthFk: _.get(item, property.lengthUomPropertyName),
					UomWidthFk: _.get(item, property.widthUomPropertyName),
					UomHeightFk: _.get(item, property.heightUomPropertyName),
					UoMWeightFk: _.get(item, property.weightUomPropertyName),
					Description: item.freeDescription,
					UserDefined1: item.PrefillUserdefined1,
					UserDefined2: item.PrefillUserdefined2,
					UserDefined3: item.PrefillUserdefined3,
					UserDefined4: item.PrefillUserdefined4,
					UserDefined5: item.PrefillUserdefined5,
					JobDefFk: item.JobDefFk || item.LgmJobFk
				});
			});
			return {
				[serviceOption.resultName]: result
			};
		};

		service.onAddNewItem = function (item) {
			item.PQuantity = 1;
		};

		return service;
	}
})(angular);
