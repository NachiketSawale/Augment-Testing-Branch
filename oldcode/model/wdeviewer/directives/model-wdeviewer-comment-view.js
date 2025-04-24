/**
 * Created by yew on 12/27/2019.
 */

(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'model.wdeviewer';
	angular.module(moduleName).directive('modelWdeViewerIgeCommentView', ['$http', '$state', '$injector',
		function ($http, $state, $injector) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/markup-comment.html',
				link: function () {}
			};
		}
	]);

	angular.module(moduleName).directive('modelWdeViewerCommentView', ['$http', '$state', '$injector', '$window',
		'cloudDesktopSidebarService', 'modelWdeViewerMarkupService', 'modelWdeViewerCommentMoudleName', 'platformContextService',
		function ($http, $state, $injector, $window,
			cloudDesktopSidebarService, modelWdeViewerMarkupService, modelWdeViewerCommentMoudleName, platformContextService) {
			return {
				restrict: 'A',
				templateUrl: globals.appBaseUrl + 'model.wdeviewer/templates/markup-comment-view.html',
				link: function (scope) {
					// var wdeCtrl = scope.ctrl;

					scope.commentItems = modelWdeViewerMarkupService.getCommentMarkups();

					scope.isAllSelect = false;
					modelWdeViewerMarkupService.isAllSelect = scope.isAllSelect;
					scope.showAllMarkup = function showAllMarkup(isAllSelect) {
						var showMarkups = [];
						var removeMarkups = [];
						var isIge = false;
						if(modelWdeViewerMarkupService.igeCtrl){ isIge = true; }
						angular.forEach(modelWdeViewerMarkupService.commentMarkups, function callback(item) {
							if (isAllSelect === true && item.IsShow === false) {
								item.IsShow = true;
								if (item.Marker.colour) {
									item.Marker.colour.colour = item.Color;
								}
								if (isIge === false) {
									modelWdeViewerMarkupService.showMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), item);
								}
								if (isIge && modelWdeViewerMarkupService.igeCtrl.getMarkup) {
									var igeMarkupItem = modelWdeViewerMarkupService.igeCtrl.getMarkup(item.MarkerId);
									if (!igeMarkupItem) {
										showMarkups.push(item.Marker);
									}
								}
							} else if (isAllSelect === false && item.IsShow === true) {
								item.isSelect = false;
								item.IsShow = false;
								if (isIge === false)  {
									modelWdeViewerMarkupService.deleteMarkupOnView(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), item);
								}
								removeMarkups.push(item.MarkerId);
							}
						});
						if(isIge){
							modelWdeViewerMarkupService.loadIgeMarkups(modelWdeViewerMarkupService.igeCtrl, showMarkups);
							modelWdeViewerMarkupService.igeCtrl.unloadMarkups(removeMarkups);
						}
						if (modelWdeViewerMarkupService.modelPart.settings === null) {
							modelWdeViewerMarkupService.modelPart.settings = {};
						}
						modelWdeViewerMarkupService.modelPart.settings.isShowMarkup = isAllSelect;
						modelWdeViewerMarkupService.isAllSelect = isAllSelect;
						if (modelWdeViewerMarkupService.modelPart.config === null) {
							modelWdeViewerMarkupService.modelPart.config = {};
						}
						modelWdeViewerMarkupService.modelPart.config.Config = JSON.stringify(modelWdeViewerMarkupService.modelPart.settings);
						var object2DWebApiBaseUrl = globals.webApiBaseUrl + 'model/main/object2d/';
						$http.post(object2DWebApiBaseUrl + 'savemodelconfig', modelWdeViewerMarkupService.modelPart.config).then(function (res) {
							modelWdeViewerMarkupService.modelPart.config = res.data;
							$injector.get('modelWdeViewerWdeService').models[modelWdeViewerMarkupService.docId] = modelWdeViewerMarkupService.modelPart;
							$injector.get('modelWdeViewerIgeService').models[modelWdeViewerMarkupService.docId] = modelWdeViewerMarkupService.modelPart;
						});
					};

					scope.select = function select(commentItem) {
						if (modelWdeViewerMarkupService.igeCtrl) {
							modelWdeViewerMarkupService.selectMarkup(modelWdeViewerMarkupService.igeCtrl, commentItem);
						} else {
							modelWdeViewerMarkupService.selectMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
						}
					};

					scope.markupShowEvent = function markupShowEvent(commentItem) {
						if (modelWdeViewerMarkupService.igeCtrl) {
							modelWdeViewerMarkupService.showMarkupInIge(modelWdeViewerMarkupService.igeCtrl, commentItem);
						} else {
							modelWdeViewerMarkupService.showMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
						}
					};

					scope.deleteMarkup = function deleteMarkup(commentItem) {
						if (modelWdeViewerMarkupService.igeCtrl) {
							modelWdeViewerMarkupService.deleteMarkup(modelWdeViewerMarkupService.igeCtrl, commentItem);
						} else {
							modelWdeViewerMarkupService.deleteMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
							modelWdeViewerMarkupService.commentMarkups.shift(modelWdeViewerMarkupService.commentMarkups.indexOf(commentItem) + 1);
						}
					};

					scope.gotoMarkupModule = function gotoMarkupModule(commentItem) {
						if (commentItem.ModuleName === null) {
							window.console.log(commentItem);
							return;
						}
						var commentModule = modelWdeViewerCommentMoudleName.getModuleUrlAndKey(commentItem.ModuleName, scope.viewerOptions.documentData);
						if (scope.$parent.$parent && scope.$parent.$parent.$close) {
							scope.$parent.$parent.$close(true);
						}

						if (scope.viewerOptions.documentData) {
							// goto in new tab page
							var companyCode = platformContextService.signedInClientCode;
							var roleId = platformContextService.getContext().permissionRoleId;
							var fragment = '#/gotoview?company=' + companyCode + '&roleid=' + roleId + '&key=' + commentModule.key + '&modulename=' + commentModule.url;
							var goUrl = $window.location.origin + globals.appBaseUrl + fragment;
							window.open(goUrl);
						} else {
							// goto in current page
							var url = globals.defaultState + '.' + commentModule.url;
							$state.go(url).then(function () {
								if (commentModule.key !== null) {
									cloudDesktopSidebarService.filterSearchFromPKeys([commentModule.key]);
								}
							});
						}

					};

					scope.commentBlur = function commentBlur(commentItem) {
						const annotationService = $injector.get('modelWdeViewerAnnotationService');
						if (annotationService && annotationService.modelId && commentItem.AnnoMarkerFk) {
							const findMarker = _.find(annotationService.annoMarkerItems, {Id: commentItem.AnnoMarkerFk, AnnotationFk: commentItem.AnnotationFk});
							if (findMarker.DescriptionInfo.Translated !== commentItem.Content) {
								annotationService.updateMarkerDescription(commentItem.AnnoMarkerFk, commentItem.AnnotationFk, commentItem.Content);
							}
						}
					};
				}
			};
		}
	]);

	angular.module(moduleName).factory('modelWdeViewerCommentMoudleName', ['$http',
		function modelWdeViewerCommentMoudleName($http) {
			var service = {};

			service.commentModuleUrlList = [
				{key: 'PrcPackageFk', short: 'Package', name: 'procurement.package', url: 'procurementpackage'},
				{key: 'ReqHeaderFk', short: 'Requisition', name: 'procurement.requisition', url: 'procurementrequisition'},
				{key: 'RfqHeaderFk', short: 'Rfq', name: 'procurement.rfq', url: 'procurementrfq'},
				{key: 'QtoHeaderFk', short: 'Quote', name: 'procurement.quote', url: 'procurementquote'},
				{key: 'ConHeaderFk', short: 'Contract', name: 'procurement.contract', url: 'procurementcontract'},
				{key: 'PesHeaderFk', short: 'Pes', name: 'procurement.pes', url: 'procurementpes'},
				{key: 'InvHeaderFk', short: 'Invoice', name: 'procurement.invoice', url: 'procurementinvoice'},
				{key: 'PrcStructureFk', short: 'Procurement Structure', name: 'basics.procurementstructure', url: 'basicsprocurementstructure'},
				{key: 'MdcMaterialCatalogFk', short: 'Material Catalog', name: 'basics.materialcatalog', url: 'basicsmaterialcatalog'},
				{key: 'MdcControllingUnitFk', short: 'Masterdata', name: 'basics.masterdata', url: 'basicsmasterdata'},
				{key: 'RubricCategoryFk', short: 'Procurement Configuration', name: 'basics.procurementconfiguration', url: 'basicsprocurementconfiguration'},
				{key: 'BpdBusinessPartnerFk', short: 'Business Partner', name: 'businesspartner.main', url: 'businesspartnermain'},
				{key: 'BpdCertificateFk', short: 'Certificate', name: 'businesspartner.certificate', url: 'businesspartnercertificate'},
				{key: 'LgmDispatchHeaderFk', short: 'Dispatching', name: 'logistic.dispatching', url: 'logisticdispatching'},
				{key: 'ProjectInfoRequestFk', short: 'InfoRequest', name: 'project.inforequest', url: 'projectinforequest'},
				{key: 'PrjProjectFk', short: 'Project', name: 'project.main', url: 'projectmain'},
				{key: 'Scheduling', short: 'Scheduling', name: 'scheduling.main', url: 'schedulingmain'},
				{key: 'PrjChangeFk', short: 'Change', name: 'change.main', url: 'changemain'},
				{key: 'PrjDocumentFk', short: 'Documents Project', name: 'documents.project', url: 'documentsproject'},
				{key: 'PrjDocumentCategoryFk', short: 'Document Category', name: 'documents.project.documentCategory', url: 'documentsprojectdocumentCategory'}
			];

			service.getModuleUrlAndKey = function getModuleUrlAndKey(itemModuleName, docEntity) {
				var commentModule = commentModuleItem(itemModuleName);
				if (commentModule === null || angular.isUndefined(commentModule)) {
					return {key: null, url: itemModuleName.replace('.', '')};
				}
				if (docEntity === null || angular.isUndefined(docEntity)) {
					return {key: null, url: commentModule.url.replace('.', '')};
				}
				return {
					key: docEntity[commentModule.key],
					url: commentModule.url.replace('.', '')
				};
			};

			service.getCommentModuleShortName = function getCommentModuleShortName(itemModuleName) {
				var commentModule = commentModuleItem(itemModuleName);
				if (commentModule === null || angular.isUndefined(commentModule)) {
					return itemModuleName.replace('.', '');
				}
				return commentModule.short;
			};

			service.commentModules = [];
			if (service.commentModules.length < 1) {
				$http.get(globals.webApiBaseUrl + 'basics/config/listAll').then(function then(result) {
					angular.forEach(result.data, function mapList(item) {
						service.commentModules.push(item);
					});
				});
			}
			service.getModuleShortNameById = function getModuleShortNameById(moduleId) {
				var moduleItem = _.find(service.commentModules, {Id: moduleId});
				if(moduleItem){
					return service.getCommentModuleShortName(moduleItem.InternalName);
				}
				return null;
			};

			function commentModuleItem(itemModuleName) {
				var commentModule = _.find(service.commentModuleUrlList, {short: itemModuleName});
				if (commentModule === null || angular.isUndefined(commentModule)) {
					commentModule = _.find(service.commentModuleUrlList, {name: itemModuleName});
				}
				if (commentModule === null || angular.isUndefined(commentModule)) {
					if (itemModuleName !== null && !angular.isUndefined(itemModuleName)) {
						commentModule = _.find(service.commentModuleUrlList, {url: itemModuleName.toLowerCase().replace('.', '')});
					}
				}
				return commentModule;
			}

			return service;
		}
	]);
})(angular);