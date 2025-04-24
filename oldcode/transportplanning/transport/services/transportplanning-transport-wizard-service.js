(function (angular) {
	/* global globals, angular, _ */
	/*jshint sub:true*/
	'use strict';

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('transportplanningTransportRouteWizardService', wizardService);

	wizardService.$inject = ['platformSidebarWizardConfigService',
		'platformSidebarWizardCommonTasksService', 'basicsCommonChangeStatusService',
		'transportplanningTransportMainService',
		'productionplanningCommonResReservationDataServiceFactory',
		'productionplanningCommonResRequisitionDataServiceFactory',
		'$translate',
		'platformModalService',
		'platformSidebarWizardCommonTasksService',
		'$http',
		'$injector',
		'transportplanningTransportReadOnlyProcessor',
		'transportplanningTransportUtilService',
		'$q','documentProjectDocumentsStatusChangeService',
		'platformTranslateService',
		'platformModalFormConfigService'];

	function wizardService(platformSidebarWizardConfigService,
		platformSidebarWizardCommonTasksService, basicsCommonChangeStatusService,
		mainService,
		commonResReservationDataServiceFactory,
		commonResRequisitionDataServiceFactory,
		$translate,
		platformModalService,
		sidebarWizardCommonTasksService,
		$http,
		$injector,
		transportReadOnlyProcessor,
		trsUtil,
		$q,documentProjectDocumentsStatusChangeService,
		platformTranslateService,
		platformModalFormConfigService) {

		var service = {};
		var wizardID = 'transportplanningTransportSidebarWizards';

		function changeTransportRouteStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					mainService: mainService,
					statusField: 'TrsRteStatusFk',
					title: 'transportplanning.transport.wizard.changeRouteStatusTitle',
					statusName: 'transportRoute',
					updateUrl: 'transportplanning/transport/route/wizard/changeroutestatus',
					id: 11,
					supportMultiChange: true,
					HookExtensionOperation: function (options, dataItems) {
						var schemaOption = {typeName: 'TrsRouteDto', moduleSubModule: 'TransportPlanning.Transport'};
						var translationSrv = $injector.get('transportplanningTransportTranslationService');
						return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
					}
				}
			);
		}

		service.changeTransportRouteStatus = changeTransportRouteStatus().fn;

		function changeResRequisitionStatus(getDataService) {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 15,
					mainService: mainService,
					refreshMainService: false,
					statusField: 'RequisitionStatusFk',
					title: 'basics.customize.resrequisitionstatus',
					statusName: 'resrequisitionstatus',
					updateUrl: 'resource/requisition/changestatus',
					getDataService: function () {
						var resRequisitionDataService = getDataService();
						return {
							getSelected: function () {
								return resRequisitionDataService ? resRequisitionDataService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return resRequisitionDataService ? resRequisitionDataService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								resRequisitionDataService.gridRefresh();
							},
							processData: function (entities) {
								processDataByService(entities, resRequisitionDataService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeResRequisitionStatus = changeResRequisitionStatus(function () {
			return commonResRequisitionDataServiceFactory.getServiceByName('transportplanningTransportResRequisitionDataService');
		}).fn;

		service.changeResRequisitionStatus_SourceContainer = changeResRequisitionStatus(function () { // jshint ignore:line
				return $injector.get('trsTransportSourceWindowDataServiceFactory').getDataService('transportplanningTransportResRequisitionDtoSourceDataService');
			}
		).fn;

		function changeResReservationStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					id: 16,
					mainService: mainService,
					refreshMainService: false,
					statusField: 'ReservationStatusFk',
					title: 'basics.customize.resreservationstatus',
					statusName: 'resreservationstatus',
					updateUrl: 'resource/reservation/changestatus',
					getDataService: function () {
						var resReservationService = commonResReservationDataServiceFactory.getServiceByName('transportplanningTransportResReservationDataService');
						return {
							getSelected: function () {
								return resReservationService ? resReservationService.getSelected() : null;
							},
							getSelectedEntities: function () {
								return resReservationService ? resReservationService.getSelectedEntities() : null;
							},
							gridRefresh: function () {
								resReservationService.gridRefresh();
							},
							processData: function (entities) {
								processDataByService(entities, resReservationService);
							}
						};
					},
					supportMultiChange: true
				}
			);
		}

		service.changeResReservationStatus = changeResReservationStatus().fn;

		function str2IntArray(str, splitter) {
			var result = [];
			if(str){
				var arr = str.split(splitter);
				arr.forEach(function (item) {
					result[result.length] = Number(item);
				});
			}
			return result;
		}


		service.createDispatchingNote = function (wizParams) {

			let selectedEntities = _.clone(mainService.getSelectedEntities()); //selectedEntities is just a reference, we need to persis during this wizard

			let modalOptions = {
				headerText: $translate.instant('transportplanning.transport.wizard.createDispatchingNoteTitle'),
				bodyText: '',
				iconClass: 'ico-warning'
			};

			var getMessageText = sidebarWizardCommonTasksService.prepareMessageText;
			if (selectedEntities && selectedEntities.length > 0) {

				var routeIds = selectedEntities.map(r => r.Id);
				var routesIdCode = selectedEntities.map(({ Id, Code }) => ({Id, Code}));
				$http.post(globals.webApiBaseUrl + 'transportplanning/package/getWithDstWaypointsByRouteIds', routeIds).then(function(response){

					var errorMessages = [];
					var includedWaypoints = [];
					_.forEach(response.data, function(item){

						if(!item.TrsWaypointDst.PlannedTime){
							_.forEach(routesIdCode, function(route){
								if(route.Id === item.TrsWaypointDst.TrsRouteFk && !includedWaypoints.includes(item.TrsWaypointDst.Id)){
									includedWaypoints.push(item.TrsWaypointDst.Id);
									errorMessages.push('(Route:' + route.Code + '|WP:' + item.TrsWaypointDst.Code + ')');
								}
							});

						}
					});

					if(errorMessages.length > 0){
						var bodyText = $translate.instant('transportplanning.transport.wizard.createDispatchingNoteMissingPlannedTime');
						modalOptions.bodyText = bodyText + errorMessages.join(',');
						platformModalService.showDialog(modalOptions);
						return false;
					}

					// check wiazrd parameters
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/checkWizardParams4DispatchNote', wizParams).then(function (response) {
						if (response.data) {
							modalOptions.bodyText = response.data;
							platformModalService.showDialog(modalOptions);
						} else {
							// check status
							var forbidRteCodes = [];
							var allowedStatus = str2IntArray(wizParams['allowed status'], ',');
							var forSettlement = wizParams['ForSettlement'];
							var notSetAllowedStatus = allowedStatus.length === 1 && allowedStatus[0] === 0;
							var checkStatusPromise = $q.when(true);
							if (!notSetAllowedStatus) {
								var filterReq = {
									pkeys: selectedEntities.map(function (e) {
										return {id: e.Id};
									})
								};
								checkStatusPromise = $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/filtered', filterReq).then(function (response) {
									response.data.dtos.forEach(function (rte) {
										// get route status from server side
										if (allowedStatus.indexOf(rte.TrsRteStatusFk) === -1) {
											forbidRteCodes.push(rte.Code);
										}
									});
								});
							}
							checkStatusPromise.then(function () {
								if (forbidRteCodes.length > 0) {
									// notify forbid to create dispatching note
									modalOptions.bodyText = $translate.instant('transportplanning.transport.wizard.notifyForbid2CreateDispNote') + _.join(forbidRteCodes, ', ');
									platformModalService.showDialog(modalOptions);
								} else {
									if (!forSettlement) {
										modalOptions.bodyText = getMessageText('transportplanning.transport.wizard.questionCreateDispNote', selectedEntities, 'Code', 'sel');
										return platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes')
											.then(function (result) {
												if (result.yes) {
													mainService.updateAndExecute(function () {
														mainService.createDispatchingNote(wizParams, selectedEntities)
															.then(function (response) {
																var result = response.data;
																var promises = [];
																var dialogMessages = [];
																if (result.errorMsg) {
																	modalOptions.iconClass = 'ico-warning';
																	dialogMessages.push(result.errorMsg);
																}
																if (!_.isEmpty(result.succeedRtes)) {
																	var successfulRoutes = _.filter(selectedEntities, function (rte) {
																		return _.includes(result.succeedRtes, rte.Id);
																	});
																	var statusChange = changeRouteStatusAfterDispatch(successfulRoutes, Number(wizParams['RouteStatus2Set'])).then(function (statusMsg) {
																		if (statusMsg !== '') {
																			dialogMessages.push(statusMsg);
																		}
																	});
																	promises.push(statusChange);

																	// refresh containers
																	refreshDispHeaderIfNeeded();
																	refreshPackagesIfNeeded();
																}
																$q.all(promises).then(function () {
																	if(dialogMessages.length > 0) {
																		modalOptions.bodyText = _.join(dialogMessages, '<br><br><hr><br>');
																		platformModalService.showDialog(modalOptions);
																	}
																});
															});
													});
												}
											});
									} else {
										mainService.updateAndExecute(function () {
											let forSettlementService = $injector.get('trsRouteCreateDispatchNoteForSettlementService');
											forSettlementService.createDispatchingNoteForSettlement(wizParams, selectedEntities)
												.then((result) => {
													let promises = [];
													let dialogMessages = [];
													if (result.errorMsg) {
														modalOptions.iconClass = 'ico-warning';
														dialogMessages.push(result.errorMsg);
													}
													if (!_.isEmpty(result.succeedRtes)) {
														let successfulRoutes = _.filter(selectedEntities, function (rte) {
															return _.includes(result.succeedRtes, rte.Id);
														});
														let statusChange = changeRouteStatusAfterDispatch(successfulRoutes, Number(wizParams['RouteStatus2Set'])).then(function (statusMsg) {
															if (statusMsg !== '') {
																dialogMessages.push(statusMsg);
															}
														});
														promises.push(statusChange);

														// refresh containers
														refreshDispHeaderIfNeeded();
														if (result.need2Refresh === true) {
															refreshPackagesIfNeeded();
														}
													}
													$q.all(promises).then(function () {
														if(dialogMessages.length > 0) {
															modalOptions.bodyText = _.join(dialogMessages, '<br><br><hr><br>');
															platformModalService.showDialog(modalOptions);
														}
													});
												});
										});
									}
								}
							});
						}
					});
				});
			} else {
				modalOptions.bodyText = $translate.instant('transportplanning.transport.wizard.notify2SelectRoute');
				return platformModalService.showDialog(modalOptions);
			}
		};

		function strToBool(value) {
			return value.toLowerCase() === 'true' || false;
		}

		function expect(param, expected) {
			return expected.includes(param);
		}

		service.createTransportRoute = function (wizParam) {
			// Default to true if empty or undefined.
			if (!wizParam.createWaypointForEachBundle) {
				wizParam.createWaypointForEachBundle = 'true';
			}

			if (!expect(wizParam.createWaypointForEachBundle.toLowerCase(), ['true', 'false'])) {
				platformModalService.showErrorBox(
					'transportplanning.transport.wizard.createWaypointForEachBundleWizardParameterIsInvalid', 'cloud.common.errorDialogTitle');
				return;
			}

			const modalCreateConfig = {
				width: '1000px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-create-route-dialog.html',
				controller: 'transportplanningTransportCreateRouteDialogController',
				resolve: {
					$options: () => {
						return {
							createWaypointForEachBundle: strToBool(wizParam.createWaypointForEachBundle),
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		};

		service.addGoods2TransportRoute = function () {
			var selected = mainService.getSelected();
			var title = $translate.instant('transportplanning.requisition.wizard.addGoods2TrsRoute');
			if (!validateSelectedRoute(selected, title, true)) {
				return;
			}

			mainService.updateAndExecute(function () {
				if ($injector.get('transportplanningRequisitionValidationService').hasErrors()) {
					return;//stop when still has errors
				}
				selected = _.clone(mainService.getSelected());//get the latest entity in case version change
				var wpService = $injector.get('transportplanningTransportWaypointLookupDataService');
				wpService.setFilter(selected.Id);
				wpService.getList({
					disableDataCaching: true
				}).then(function (result) {
					var defaultSrc = _.find(result, function (item) {
						return item.IsDefaultSrc;
					});
					selected.SrcWPFk = defaultSrc ? defaultSrc.Id : null;

					var defaultDst = _.find(result, function (item) {
						return item.IsDefaultDst;
					});
					selected.DstWPFk = defaultDst ? defaultDst.Id : null;

					var modalCreateConfig = {
						width: '1000px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-create-route-dialog.html',
						controller: 'transportplanningTransportAddGoodsDialogController',
						resolve: {
							'$options': function () {
								return {
									title: title,
									entity: selected
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig).then(function (response){
						if(response === true) {
							mainService.refreshSelected(selected); // reload trs_route to update Packages' Bundle Info + Total Packages Weight
						}
					});
				});
			});
		};

		service.createReturnResources = function (wizParams,service) {
			var finishFn = function (selected) {
				var modalCreateConfig = {
					width: '960px',
					resizeable: true,
					templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-return-resources-dialog.html',
					controller: 'transportplanningTransportReturnResourcesDialogController',
					resolve: {
						'$options': function () {
							return {
								entity: selected,
								statusIds: str2IntArray(wizParams['StatusIDs'], '.'),
								service: service || 'transportplanningTransportReturnResourcesDialogService'
							};
						}
					}
				};
				platformModalService.showDialog(modalCreateConfig);
			};
			commitWhenRunWizard(finishFn);
		};

		service.createReturnPlants = function (wizParams) {
			service.createReturnResources(wizParams, 'transportplanningTransportReturnPlantsDialogService');
		};

		service.handleUnplannedReturnResources = function (wizParams) {
			var modalCreateConfig = {
				width: '960px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-return-resources-dialog.html',
				controller: 'transportplanningTransportUnplannedReturnResourcesDialogController',
				resolve: {
					'$options': function () {
						return {
							statusIds : str2IntArray(wizParams['StatusIDs'], '.')
						};
					}
				}
			};
			platformModalService.showDialog(modalCreateConfig);
		};

		function validateSelectedRoute(selected, title,careStatus) {
			if (!platformSidebarWizardCommonTasksService.assertSelection(selected, title)) {
				return false;
			}
			//no need to restrict this for any wizard
			if (careStatus) {
				var statusList = $injector.get('transportplanningTransportRouteStatusLookupService').getList();
				var status = _.find(statusList, {Id: selected.TrsRteStatusFk});
				if (status && status.IsInTransport) {
					platformModalService.showDialog({
						headerTextKey: title,
						bodyTextKey: status.Code + $translate.instant('transportplanning.transport.wizard.errorStatus'),
						iconClass: 'ico-error'
					});
					return false;
				}
			}
			return true;
		}

		function commitWhenRunWizard(fn){
			var selected = _.clone(mainService.getSelected());
			mainService.updateAndExecute(function () {
				if ($injector.get('transportplanningRequisitionValidationService').hasErrors()) {
					return;//stop when still has errors
				}
				fn(selected);
			});
		}

		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'transportplanning.transport.wizard.transportWizardGroupName',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					changeTransportRouteStatus()
				]
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
		};

		service.createDispatching4Crane = function (wizParam) {
			// eslint-disable-next-line no-console
			console.log(wizParam);
			mainService.updateAndExecute(function () {
				var modalOptions = {
					headerText: $translate.instant('transportplanning.transport.wizard.createDispatching4CraneTitle'),
					bodyText: '',
					iconClass: 'ico-info'
				};
				var requestParam = [];
				var checkResReqService = $injector.get('trsTransportSourceWindowDataServiceFactory').getDataService('transportplanningTransportResRequisitionDtoSourceDataService');
				var selectedResReq = checkResReqService ? checkResReqService.getSelected() : null;
				var modelB = trsUtil.hasShowContainer('transportplanning.transport.checkResourceRequisition') && !!selectedResReq;//if selected. mean model B(new logic)
				validateDispatching4Crane(modelB, requestParam, selectedResReq, wizParam).then(function (errMsg) {
					if (!_.isNil(errMsg)) {
						modalOptions.bodyText = errMsg;
						return platformModalService.showDialog(modalOptions);
					}

					// confirm and save before execution
					modalOptions.bodyText = sidebarWizardCommonTasksService.prepareMessageText('transportplanning.transport.wizard.questionCreateCraneDispNote', requestParam, 'routeCode', 'route');
					platformModalService.showYesNoDialog(modalOptions.bodyText, modalOptions.headerText, 'yes').then(function (result) {
						if (result.yes) {
							if (modelB && wizParam && wizParam['workflow id'] > 0) {
								var context = {
									TrsRouteId: requestParam[0].routeId,
									ResRequsitionId: selectedResReq.Id,
									receivingJobFk: requestParam[0].receivingJobFk,
									WizardParas:wizParam
								};
								$injector.get('basicsWorkflowInstanceService').startWorkflow(wizParam['workflow id'], context.TrsRouteId, angular.toJson(context)).then(function (result) {
									var errorMessage = result.errorMessage;
									if (!errorMessage) {
										var context = JSON.parse(result.Context);
										if (context && context.Exception && context.Exception.ErrorMessage) {
											errorMessage = context.Exception.ErrorMessage;
										}
										else{
											refreshCheckResReservationIfNeeded();
										}
									}
									if (errorMessage) {
										modalOptions.iconClass = 'error';
										modalOptions.bodyText = errorMessage;
										platformModalService.showDialog(modalOptions);
									}
								});
							}else {
								// show dialog for configuration
								let selectedRoute = mainService.getSelected();
								showDialog4DispatchCraneReservation(requestParam, selectedResReq, wizParam, selectedRoute).then(function (result) {
									if (result === false) { //canceled
										return;
									}
									if (result.errMsg !== '') { // has errors
										modalOptions.bodyText = result.errMsg;
										return platformModalService.showDialog(modalOptions);
									} else {// notify succeed
										// change route status
										getSelectedRoutes(selectedResReq).then(function (routes) {
											changeRouteStatusAfterDispatch(routes, Number(wizParam['RouteStatus2Set'])).then(function (errMsg) {
												var succeedMsg = $translate.instant('transportplanning.transport.wizard.notifySucceed2CreateCraneDispNote') + _.join(result.dispHeaderCodes, ', ');
												var errorMsg = errMsg === '' ? '' : '<br>' + errMsg;
												modalOptions.bodyText = succeedMsg + errorMsg;
												platformModalService.showDialog(modalOptions);
											});
										});

										// refresh containers
										refreshDispHeaderIfNeeded();
										if (requestParam[0].need2CreateCraneRsv === true) {
											refreshResReservationIfNeeded();
										}
									}
								});
							}
						}
					});
				});
			});
		};

		service.shiftTransportTime = function () {
			var selected = _.clone(mainService.getSelected());
			var title = $translate.instant('transportplanning.transport.wizard.shiftTransportTime');
			if (!validateSelectedRoute(selected, title)) {
				return;
			}
			platformModalService.showDialog({
				width: '606px',
				templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-shift-transport-time-dialog.html',
				title: '*Shift transport time',
				controller: 'transportplanningTransportShiftTransportTimeDialogController',
				resizeable: true,
				resolve: {
					'$options': function () {
						return {
							title: title,
							dataService: mainService
						};
					}
				}
			});
		};

		/**
		 * @ngdoc function
		 * @name validateDispatching4Crane
		 * @function
		 * @methodOf wizardService.validateDispatching4Crane
		 * @description validate preconditions to create crane dispatching
		 * @param {Object} requestObj The request to generate
		 * @param {int} resRequisition
		 * @param {Object} wizard parameters
		 * @returns {String} Return error message if fail
		 */
		function validateDispatching4Crane(modelB, requestObj, resRequisition, para) {
			var defer = $q.defer();
			var hasError = false;
			// check if selected route
			getSelectedRoutes(resRequisition).then(function (routes) {
				if (routes.length === 0) {
					hasError = true;
					defer.resolve($translate.instant('transportplanning.transport.wizard.notify2SelectRoute'));
				} else {
					// must belong to the same company, because we will show characteristic group by company
					var g = _.groupBy(routes, function (r) {
						return r.CompanyId;
					});
					if (Object.keys(g).length > 1) { // means more then one company
						var arr = [];
						Object.keys(g).forEach(function (key) {
							arr.push(format2ShowArray(_.map(g[key], 'Code')));
						});
						hasError = true;
						var msg = $translate.instant('transportplanning.transport.wizard.notifyRoutesMustBelong2SameCompany', {errText: _.join(arr, ', ')});
						defer.resolve(msg);
					}
				}

				if (hasError === false) {
					// check wizard parameters value
					var parameterRequest=[];
					if (para) {
						Object.keys(para).forEach(function (prop) {
							parameterRequest.push(
								{
									Code: prop,
									Value: para[prop]
								}
							);
						});
					}
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/checkWizardParams4CraneOrder',parameterRequest).then(function (response) {
						if (response.data) {
							defer.resolve(response.data);
						} else if (modelB && routes.length === 1) {
							// modelB is start by workflow, it can create/re-create crane-order
							if (_.isNil(routes[0].JobDefFk)) {
								defer.resolve(sidebarWizardCommonTasksService.prepareMessageText('transportplanning.transport.wizard.notify2SetDefClientJob', routes, 'Code', 'route'));
							} else {
								requestObj.push({
									routeCode: routes[0].Code,
									routeId: routes[0].Id,
									receivingJobFk: routes[0].JobDefFk
								});
								defer.resolve(null);
							}
						}
						else {
							// check if there are crane reservation
							var postData = {
								PpseventIds: routes.map(function (r) {
									return r.PpsEventFk;
								}),
								companyId: routes[0].CompanyId,
								ResRequisition: resRequisition ? resRequisition.Id : null
							};
							$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/isNeed2CreateCraneReservation', postData).then(function (response) {
								if (response.data.result === false && routes.length > 1) { //if select one route, we need create new crane reservation in wiazrd dialog
									defer.resolve($translate.instant('transportplanning.transport.wizard.notifyNoCraneReservation'));
								} else {
									// validate receiving job
									if (routes.length === 1) {
										// get selected waypoint job as higher priority
										var receivingJobFk;
										var selectedRoute = $injector.get('transportplanningTransportMainService').getSelected();
										var waypoint = selectedRoute && selectedRoute.Id !== routes[0].Id ? null : getSelectedWaypoint();
										if (!_.isNil(waypoint)) {
											receivingJobFk = waypoint.LgmJobFk;
										} else if (!_.isNil(routes[0].JobDefFk)) {
											receivingJobFk = routes[0].JobDefFk;
										}

										if (_.isNil(receivingJobFk)) {
											defer.resolve($translate.instant('transportplanning.transport.wizard.notify2SelectReceivingJob', {route: routes[0].Code}));
										} else {
											requestObj.push({
												need2CreateCraneRsv: response.data.result === false,
												routeCode: routes[0].Code,
												routeId: routes[0].Id,
												companyId: routes[0].CompanyId,
												ppsEventFk: routes[0].PpsEventFk,
												performingJobFk: routes[0].LgmJobFk,
												receivingJobFk: receivingJobFk
											});
										}
									} else {
										// ensure every route has default client job
										var lst = routes.filter(function (r) {
											return _.isNil(r.JobDefFk);
										});
										if (lst.length >= 0) {
											defer.resolve(sidebarWizardCommonTasksService.prepareMessageText('transportplanning.transport.wizard.notify2SetDefClientJob', lst, 'Code', 'route'));
										} else {
											routes.forEach(function (r) {
												requestObj.push({
													routeCode: r.Code,
													routeId: r.Id,
													ppsEventFk: r.PpsEventFk,
													performingJobFk: r.LgmJobFk,
													receivingJobFk: r.JobDefFk
												});
											});
										}
									}
									defer.resolve(null);
								}
							});
						}
					});
				}
			});
			return defer.promise;
		}

		function format2ShowArray(array) {
			var result = '';
			if(Array.isArray(array)){
				result = '[' + _.join(array, ', ') + ']';
			}

			return result;
		}

		function refreshPackagesIfNeeded() {
			if (trsUtil.hasShowContainer('transportplanning.transport.package.list', true) ||
				trsUtil.hasShowContainer('transportplanning.transport.package.detail', true)) { // ensure container opened
				$injector.get('transportplanningTransportPackageDataService').load();
			}
		}

		function refreshDispHeaderIfNeeded() {
			if (trsUtil.hasShowContainer('transportplanning.transport.dispatchingHeader')) { // ensure container opened
				$injector.get('trsTransportDispatchingHeaderService').load();
			}
		}

		function refreshResReservationIfNeeded() {
			if (trsUtil.hasShowContainer('transportplanning.transport.resReservation.list')) { // ensure container opened
				// get environment variable from the module-container.json file
				var serviceOptions = {
					entityNameTranslationID: 'transportplanning.transport.resReservationListTitle',
					serviceName: 'transportplanningTransportResReservationDataService',
					parentServiceName: 'transportplanningTransportMainService',
					dataProcessorName: 'transportplanningTransportResReservationReadOnlyProcessor'
				};
				var dataService = $injector.get('productionplanningCommonResReservationDataServiceFactory').getOrCreateService(serviceOptions);
				dataService.load();
			}
		}

		function refreshCheckResReservationIfNeeded() {
			if (trsUtil.hasShowContainer('transportplanning.transport.checkResourceRequisition')) { // ensure container opened
				var dataService = $injector.get('transportplanningTransportContainerInformationService')
					.getContainerInfoByGuid('b7773a4867a34c5ebe4d2ee1cb53b613').dataServiceName;//if there were
				// any other container reusing the same controller in this module, it might get more uuid hard-coded here and
				// more conditional statements.
				dataService.load();
			}
		}

		function changeRouteStatusAfterDispatch(routes, statusId) {
			var defer = $q.defer();
			if (statusId !== 0) {
				var config = {
					headerText: $translate.instant('transportplanning.transport.wizard.changeRouteStatusTitle'),
					imageSelector: 'platformStatusIconService',
					isMultipleSelected: false,
					mainService: mainService,
					refreshMainService: true,
					statusField: 'TrsRteStatusFk',
					statusName: 'transportRoute',
					supportMultiChange: true,
					title: 'transportplanning.transport.wizard.changeRouteStatusTitle',
					updateUrl: 'transportplanning/transport/route/wizard/changeroutestatus'
				};
				var promises = [];
				routes.forEach(function (route) {
					// if (route.TrsRteStatusFk !== statusId) {
					var options = _.clone(config);
					_.extend(options, {
						id: route.Id,
						entity: route,
						entities: [route],
						fromStatusId: route.TrsRteStatusFk,
						toStatusId: statusId !== -1 ? statusId : route.TrsRteStatusFk,
						checkAccessRight: false
					});
					promises.push(basicsCommonChangeStatusService.changeStatus(options, ''));
					// }
				});
				$q.all(promises).then(function (results) {
					basicsCommonChangeStatusService.afterDoneAll(config, mainService, results, routes);
					var msgs = [];
					results.forEach(function (r, idx) {
						if (!_.isNil(r.ErrorMsg)) {
							msgs.push($translate.instant('transportplanning.transport.wizard.notifyDispatchSucceedButChangeStatusFail', {entityCode: routes[idx].Code}) + r.ErrorMsg);
						} else {
							msgs.push($translate.instant('transportplanning.transport.wizard.notifyDispatchAndChangeStatusSucceed', {entityCode: routes[idx].Code}));
						}
					});
					defer.resolve(_.join(msgs, '<br>'));
				});
			} else {
				defer.resolve('');
			}
			return defer.promise;
		}

		function showDialog4DispatchCraneReservation(requestParam, selectedResReq, wizParam, selectedRoute) {
			var config = {
				width: '400px',
				height: '700px',
				resizeable: true,
				templateUrl: globals.appBaseUrl + 'transportplanning.transport/templates/transportplanning-transport-create-disp4crane-dialog.html',
				controller: 'trsTransportCreateDisp4CraneDialogController',
				resolve: {
					'params': function () {
						return {
							title: $translate.instant('transportplanning.transport.wizard.craneDispatchingHeaderConfig'),
							dispParam: requestParam,
							selectedResReq: selectedResReq,
							selectedRoute: selectedRoute,
							wizParam: wizParam
						};
					}
				}
			};
			return platformModalService.showDialog(config);
		}

		function getSelectedWaypoint() {
			var waypoint = null;
			if (trsUtil.hasShowContainer('transportplanning.transport.waypoint.list')) { // ensure container opened
				var waypointSrv = $injector.get('transportplanningTransportWaypointDataService');
				waypoint = waypointSrv.getSelected();
			}
			return waypoint;
		}

		function getSelectedRoutes(selectedResReq) {
			var defer = $q.defer();
			if (selectedResReq) {
				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/listbyids', [selectedResReq.TrsRouteFk]).then(function (response) {
					defer.resolve(response.data.Main);
				});
			} else if (trsUtil.hasShowContainer('transportplanning.transport.list')) { // ensure container opened
				var routeSrv = $injector.get('transportplanningTransportMainService');
				defer.resolve(routeSrv.getSelectedEntities());
			}
			else {
				defer.resolve([]);
			}
			return defer.promise;
		}

		function enableRoute() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(mainService, 'Enable Route',
				'transportplanning.transport.wizard.enableRouteTitle', 'Code',
				'transportplanning.transport.wizard.enableDisableRouteDone',
				'transportplanning.transport.wizard.routeAlreadyEnabled',
				'item');
		}

		function disableRoute() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(mainService, 'Disable Route',
				'transportplanning.transport.wizard.disableRouteTitle', 'Code',
				'transportplanning.transport.wizard.enableDisableRouteDone',
				'transportplanning.transport.wizard.routeAlreadyDisabled',
				'item');
		}

		function processDataByService(entities, service) {
			var simpleProcessors = _.filter(service.getDataProcessor(), function(proc) {
				return _.isFunction(proc.processItem) && proc.processItem.length === 1;
			});
			_.forEach(simpleProcessors, function(processor) {
				_.forEach(entities, processor.processItem);
			});
		}

		service.enableRoute = function () {
			enableRoute().fn.apply(service, arguments);
		};

		service.disableRoute = function () {
			disableRoute().fn.apply(service, arguments);
		};

		service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(mainService, 'transportplanning.transport').fn;

		return service;
	}

})(angular);

