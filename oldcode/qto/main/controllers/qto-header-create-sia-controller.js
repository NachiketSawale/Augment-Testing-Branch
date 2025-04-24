(function (angular) {
	/* global  globals, _ */
	'use strict';

	// jshint -W072
	angular.module('qto.main').controller('qtoMainHeaderCreateSiaController',
		['$scope', '$injector', '$http', '$translate', 'qtoMainSiaService', 'basicsCostGroupAssignmentService',
			function ($scope, $injector, $http, $translate, qtoMainSiaService, basicsCostGroupAssignmentService) {

				var formConfig = qtoMainSiaService.getConfigForm();

				if (!$scope.dataItem) {
					$scope.dataItem = formConfig.dataItem;
				}

				$scope.formOptions = {
					configure: formConfig
				};

				$scope.formContainerOptions = {
					formOptions: $scope.formOptions
				};

				$scope.onOK = function () {

					var basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

					var ReportValue = qtoMainSiaService.getReportValue();

					_.forEach(formConfig.rows, function (row) {
						if (_.hasIn(row, 'visible') && row.visible) {
							let param = _.find(ReportValue.parameter, function (p) {
								return row.model === p.parameterName.replaceAll(' ', '');
							});
							if (param) {
								let value = Object.getOwnPropertyDescriptor($scope.dataItem, row.model).value;
								switch (row.type) {
									case 'directive':
										if (_.hasIn(row, 'options.lookupOptions.lookupType')) {
											param.value = GetLookupValue(row.options.lookupOptions.lookupType, value);
										} else if (_.hasIn(row, 'options.lookupType')) {
											param.value = GetLookupValue(row.options.lookupType, value);
										}
										break;
									case 'dateutc':
										param.value = value ? value.format('YYYY-MM-DD') : '';
										break;
									default:
										param.value = value;
										break;
								}
								param.modelValue = value;
							}
						}
					});

					function GetLookupValue(lookuptype, value) {
						let item = basicsLookupdataLookupDescriptorService.getLookupItem(lookuptype, value);
						return item && item.Code ? item.Code : value;
					}

					Cancel(true);
				};

				$scope.onCancel = function () {
					Cancel(false);
				};

				$scope.modalOptions.cancel = function () {
					Cancel(false);
				};

				function Cancel(isok) {
					$scope.$close({ok: isok});
					$scope.$parent.$broadcast('form-config-updated', {});
				}

				asyncCostGroupCats();

				function asyncCostGroupCats() {
					var qtoMainHeaderSelecte = $injector.get('qtoMainHeaderDataService').getSelected();
					var request = {
						ConfigModuleType: 'Project',
						ConfigModuleName: 'quantitytakeoff',
						ProjectId: qtoMainHeaderSelecte ? qtoMainHeaderSelecte.ProjectFk : -1
					};
					return $http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listbyconfig', request).then(function (response) {
						if (response.status === 200) {
							let costGroupCats = basicsCostGroupAssignmentService.getCostGroupColumnsForDetail(response.data, $scope.formOptions, 'costgroup', true);
							let ismapping = qtoMainSiaService.costGroupCatalogMapping();

							let tempCostGroupCats = [];
							if(!ismapping) {
								tempCostGroupCats = _.sortBy(_.concat(response.data.LicCostGroupCats ? response.data.LicCostGroupCats : [],
									response.data.PrjCostGroupCats ? response.data.PrjCostGroupCats : []));
								tempCostGroupCats = _.sortBy(tempCostGroupCats, ['Sorting', 'PRJCostGrpCatAssignId']);
							}

							$scope.formOptions.configure.rows.forEach(function (r) {
								if (Object.hasOwnProperty.call(r, 'costGroupCatCode')) {
									var groupinfo = _.find($scope.formOptions.configure.groups, {gid: r.gid});
									if (ismapping) {
										var catinfo = _.find(costGroupCats, {costGroupCatCode: r.costGroupCatCode}) || _.find(costGroupCats, {costGroupCatCode: r.costGroupCatCode.toUpperCase()});
										if (catinfo) {
											r.visible = true;
											r.options.lookupOptions = catinfo.options.lookupOptions;
											r.costGroupCatId = catinfo.costGroupCatId;
											if (!groupinfo.visible) {
												groupinfo.visible = true;
											}
										}
									} else if (!ismapping) {
										let index = parseInt(r.rid.match(/\d+/g));
										if (index > 0 && index <= tempCostGroupCats.length) {
											let cgc = tempCostGroupCats[index - 1];
											if (cgc) {
												let catinfo = _.find(costGroupCats, {costGroupCatCode: cgc.Code});
												if (catinfo) {
													r.visible = true;
													r.options.lookupOptions = catinfo.options.lookupOptions;
													r.costGroupCatId = catinfo.costGroupCatId;
													r.costGroupCatCode = catinfo.costGroupCatCode;
													r.label = r.model + '(' + catinfo.costGroupCatCode + ')';
													if (!groupinfo.visible) {
														groupinfo.visible = true;
													}
												}
											}
										}
									}
								}
							});
							$scope.$parent.$broadcast('form-config-updated', {});
						}
					});
				}

				$scope.$on('$destroy', function () {

				});
			}
		]
	);
})(angular);
