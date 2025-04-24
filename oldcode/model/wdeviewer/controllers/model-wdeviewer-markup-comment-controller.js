(function (angular) {
	/* global globals,_ */
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerMarkupCommentController', ['$scope', '$http', '$state', '$injector', '$window', '$translate',
		'cloudDesktopSidebarService', 'modelWdeViewerMarkupService', 'modelWdeViewerCommentMoudleName', 'platformContextService', 'procurementContextService',
		function ($scope, $http, $state, $injector, $window, $translate,
			cloudDesktopSidebarService, modelWdeViewerMarkupService, modelWdeViewerCommentMoudleName, platformContextService, moduleContext) {
			$scope.commentItems = modelWdeViewerMarkupService.getCommentMarkups();
			$scope.isAllSelect = modelWdeViewerMarkupService.isAllSelect;
			$scope.isRFI = modelWdeViewerMarkupService.isShowRfi;
			$scope.isDefect = modelWdeViewerMarkupService.isShowDefect;
			$scope.isLoading = false;

			$scope.showAllMarkup = function showAllMarkup(isAllSelect) {
				modelWdeViewerMarkupService.showAnnotationChange.fire({value: isAllSelect, isAll: true});
				$scope.isAllSelect = !isAllSelect;
				var showMarkups = [];
				var removeMarkups = [];
				var isIge = false;
				if (modelWdeViewerMarkupService.igeCtrl) {
					isIge = true;
				}
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
								showMarkups.push(item.originMarker ? item.originMarker : item.Marker);
							}
						}
					} else if (isAllSelect === false && item.IsShow === true) {
						item.isSelect = false;
						item.IsShow = false;
						if (isIge === false) {
							modelWdeViewerMarkupService.deleteMarkupOnView(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), item);
						}
						removeMarkups.push(item.MarkerId);
					}
				});
				if (isIge) {
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
			$scope.isDeleteDisabled = function isDeleteDisabled() {
				return modelWdeViewerMarkupService.isDeleteDisabled;
			};
			$scope.isAllMarkerSelect = function isAllMarkerSelect() {
				return modelWdeViewerMarkupService.isAllSelect;
			};

			$scope.showAllMarker = function showAllMarker() {
				$scope.showAllMarkup($scope.isAllSelect === false);
			};
			$scope.hasRFI = function hasRFI() {
				var item = _.find(modelWdeViewerMarkupService.commentMarkups, function (e) {
					if (e.InfoRequestFk > 0) {
						return e;
					}
				});
				return !item;
			};
			$scope.hasDefect = function hasDefect() {
				var item = _.find(modelWdeViewerMarkupService.commentMarkups, function (e) {
					if (e.DefectFk > 0) {
						return e;
					}
				});
				return !item;
			};

			$scope.showRFI = function showRFI() {
				modelWdeViewerMarkupService.showAnnoMarkerByInfoRequest(!$scope.isRFI);
				modelWdeViewerMarkupService.showAnnotationChange.fire({value: !$scope.isRFI, isRfi: true});
				$scope.isRFI = !$scope.isRFI;
			};
			$scope.showDefect = function showDefect() {
				modelWdeViewerMarkupService.showAnnoMarkerByDefect(!$scope.isDefect);
				modelWdeViewerMarkupService.showAnnotationChange.fire({value: !$scope.isDefect, isDefect: true});
				$scope.isDefect = !$scope.isDefect;
			};

			function showAnnotationChange(args) {
				// modelWdeViewerMarkupService.isShowCheckList = args.value;
				if (args.isAll) {
					modelWdeViewerMarkupService.isAllSelect = args.value;
					$scope.isAllSelect = modelWdeViewerMarkupService.isAllSelect;
				}
				if (args.isRfi || args.isAll) {
					modelWdeViewerMarkupService.isShowRfi = args.value;
					$scope.isRFI = modelWdeViewerMarkupService.isShowRfi;
				}
				if (args.isDefect || args.isAll) {
					modelWdeViewerMarkupService.isShowDefect = args.value;
					$scope.isDefect = modelWdeViewerMarkupService.isShowDefect;
				}
			}

			modelWdeViewerMarkupService.showAnnotationChange.register(showAnnotationChange);

			$scope.gotoModule = function gotoModule() {
				var findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				if (findItem) {
					var gotoKey = 0;
					var gotoModule = '';
					var annotationService = $injector.get('modelWdeViewerAnnotationService');
					if (findItem.DefectFk > 0) {
						gotoKey = findItem.DefectFk;
						gotoModule = 'defectmain';
					} else if (findItem.InfoRequestFk > 0) {
						gotoKey = findItem.InfoRequestFk;
						gotoModule = 'projectinforequest';
					} else if (findItem.HsqChecklistFk > 0) {
						gotoKey = findItem.HsqChecklistFk;
						gotoModule = 'hsqechecklist';
					} else {
						// gotoKey = findItem.AnnotationFk;
						gotoModule = 'modelannotation';
						if (annotationService) {
							var modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
							if (!annotationService.modelId) {
								if (modelWdeViewerMarkupService.modelPart && modelWdeViewerMarkupService.modelPart.config && modelWdeViewerMarkupService.modelPart.config.ModelFk) {
									annotationService.modelId = modelWdeViewerMarkupService.modelPart.config.ModelFk;
								} else if (!annotationService.modelId && modelViewerModelSelectionService && modelViewerModelSelectionService.getSelectedModelId()) {
									annotationService.modelId = modelViewerModelSelectionService.getSelectedModelId();
								}
							}
							let modelAnnotationDataService = $injector.get('modelAnnotationDataService');
							if (modelAnnotationDataService && annotationService.modelId) {
								annotationService.getAnnotations(annotationService.modelId).then(function (res) {
									var data = res.data ? res.data : res;
									modelAnnotationDataService.setList(data);
									annotationService.gotoSelectItem = findItem;
								});
							}
						}
					}
					/*
										if ($scope.viewerOptions.documentData) {
											// goto in new tab page
											var companyCode = platformContextService.getApplicationValue('desktop-headerInfo').companyName.split(' ')[0];
											var roleId = platformContextService.getContext().permissionRoleId;
											var fragment = '#/gotoview?company=' + companyCode + '&roleid=' + roleId + '&key=' + gotoKey + '&modulename=' + gotoModule;
											var goUrl = $window.location.origin + globals.appBaseUrl + fragment;
											window.open(goUrl);
										} else { */
					// goto in current page
					var url = globals.defaultState + '.' + gotoModule;
					$state.go(url).then(function () {
						if (gotoKey > 0) {
							cloudDesktopSidebarService.filterSearchFromPKeys([gotoKey]);
						}
						$injector.get('$timeout')(function () {
							$injector.get('modelWdeViewerSelectionService').previewDocument(annotationService.modelId);
						}, 1000);
					});
					// }
				}
			};

			$scope.gotoName = function () {
				var findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				if (findItem) {
					if (findItem.DefectFk > 0) {
						return $translate.instant('model.annotation.defect');
					} else if (findItem.InfoRequestFk > 0) {
						return $translate.instant('model.annotation.rfi');
					} else if (findItem.HsqChecklistFk > 0) {
						return $translate.instant('model.annotation.hsqeChecklist');
					} else {
						return $translate.instant('model.annotation.modelAnnotationEntityName');
					}
				}
				return '';
			};

			$scope.gotoShow = function gotoShow(){
				return !modelWdeViewerMarkupService.isDocumentDefaultMode;
			};

			$scope.gotoDisabled = function gotoDisabled() {
				var findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				if (findItem) {
					modelWdeViewerMarkupService.isDeleteDisabled = false;
					var gotoName = '';
					if ($scope.$root.currentModule) {
						gotoName = $scope.$root.currentModule;
					} else {
						var mainService = moduleContext.getMainService();
						if (mainService) {
							gotoName = mainService.name;
							if (!gotoName) {
								var mainModule = mainService.getModule();
								gotoName = mainModule.name;
							}
						}
					}
					if (gotoName !== '') {
						modelWdeViewerMarkupService.currentWorkingModule = gotoName;
					}
					if (gotoName === 'defect.main' && findItem.DefectFk > 0) {
						return true;
					} else if (gotoName === 'project.inforequest' && findItem.InfoRequestFk > 0) {
						return true;
					} else if (gotoName === 'hsqe.checklist' && findItem.HsqChecklistFk > 0) {
						return true;
					} else if (gotoName === 'model.annotation' && !(findItem.DefectFk > 0 || findItem.InfoRequestFk > 0 || findItem.HsqChecklistFk > 0)) {
						return true;
					}
				} else {
					modelWdeViewerMarkupService.isDeleteDisabled = true;
				}
				return modelWdeViewerMarkupService.isDeleteDisabled;
			};

			$scope.select = function select(commentItem) {
				if (modelWdeViewerMarkupService.igeCtrl) {
					modelWdeViewerMarkupService.selectMarkup(modelWdeViewerMarkupService.igeCtrl, commentItem);
				} else {
					modelWdeViewerMarkupService.selectMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
				}
				var findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				modelWdeViewerMarkupService.isDeleteDisabled = !findItem;
				/* var annotationService = $injector.get('modelWdeViewerAnnotationService');
				if (annotationService) {
					annotationService.selectAnnotation();
				} */
				modelWdeViewerMarkupService.selectMarkupChange.fire(commentItem);
			};

			$scope.markupShowEvent = function markupShowEvent(commentItem) {
				if (modelWdeViewerMarkupService.igeCtrl) {
					modelWdeViewerMarkupService.showMarkupInIge(modelWdeViewerMarkupService.igeCtrl, commentItem);
				} else {
					modelWdeViewerMarkupService.showMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
				}
			};

			$scope.deleteMarkup = function deleteMarkup(commentItem) {
				if (modelWdeViewerMarkupService.igeCtrl) {
					modelWdeViewerMarkupService.deleteMarkup(modelWdeViewerMarkupService.igeCtrl, commentItem);
				} else {
					modelWdeViewerMarkupService.deleteMarkup(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), commentItem);
					modelWdeViewerMarkupService.commentMarkups.shift(modelWdeViewerMarkupService.commentMarkups.indexOf(commentItem) + 1);
				}
			};

			$scope.deleteSelMarker = function deleteSelMarker() {
				var findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				if (findItem) {
					$scope.deleteMarkup(findItem);
				}
				modelWdeViewerMarkupService.isDeleteDisabled = true;
			};

			$scope.deleteAllMarker = function deleteAllMarker() {
				$injector.get('platformDialogService').showYesNoDialog('model.wdeviewer.deleteAnnotationBody', 'model.wdeviewer.deleteAnnotationTitle', 'yes')
					.then(function (result) {
						if (result.yes) {
							var markupList = angular.copy(modelWdeViewerMarkupService.commentMarkups);
							angular.forEach(markupList, function (item) {
								$scope.deleteMarkup(item);
							});
						}
					});
			};

			$scope.closeView = function closeView() {
				if ($scope.viewerOptions) {
					$scope.viewerOptions.showCommentView = !$scope.viewerOptions.showCommentView;
				} else if ($scope.$parent.viewerOptions) {
					$scope.$parent.viewerOptions.showCommentView = !$scope.$parent.viewerOptions.showCommentView;
				} else {
					$scope.$close(true);
				}
			};

			$scope.gotoMarkupModule = function gotoMarkupModule(commentItem) {
				if (commentItem.ModuleName === null) {
					window.console.log(commentItem);
					return;
				}
				var commentModule = modelWdeViewerCommentMoudleName.getModuleUrlAndKey(commentItem.ModuleName, $scope.viewerOptions.documentData);
				if ($scope.$parent.$parent && $scope.$parent.$parent.$close) {
					$scope.$parent.$parent.$close(true);
				}

				if ($scope.viewerOptions.documentData) {
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

			$scope.commentStyle = function commentStyle(commentItem) {
				if (commentItem.isSelect) {
					return 'width:300px;';
				}
				return '';
			};

			$scope.commentBlur = function commentBlur(commentItem) {
				const annotationService = $injector.get('modelWdeViewerAnnotationService');
				if (annotationService && annotationService.modelId && commentItem.AnnoMarkerFk) {
					const findMarker = _.find(annotationService.annoMarkerItems, {Id: commentItem.AnnoMarkerFk, AnnotationFk: commentItem.AnnotationFk});
					if (findMarker.DescriptionInfo.Translated !== commentItem.Content) {
						annotationService.updateMarkerDescription(commentItem.AnnoMarkerFk, commentItem.AnnotationFk, commentItem.Content);
					}
				}
			};

			function annoItemModified(skip, item) {
				var annotationService = $injector.get('modelWdeViewerAnnotationService');
				var annoItem = _.find(annotationService.annotationItems, {Id: item.Id});
				if (annoItem && annoItem.Color !== item.Color) {
					var hexColot = $injector.get('basicsCommonDrawingUtilitiesService').decToHexColor(item.Color);
					annotationService.updateAnnoColor(item.Id, item.Color, hexColot);
				}
				if (annoItem && annoItem.DescriptionInfo.Translated !== item.DescriptionInfo.Translated) {
					annoItem.DescriptionInfo.Translated = item.DescriptionInfo.Translated;
				}
			}

			function markupCommentLoading(isLoading){
				$scope.isLoading = isLoading;
			}
			$injector.get('modelAnnotationDataService').registerItemModified(annoItemModified);
			modelWdeViewerMarkupService.commentLoading.register(markupCommentLoading);
			$scope.$on('$destroy', function link() {
				$injector.get('modelAnnotationDataService').unregisterItemModified(annoItemModified);
				modelWdeViewerMarkupService.showAnnotationChange.unregister(showAnnotationChange);
				modelWdeViewerMarkupService.commentLoading.unregister(markupCommentLoading);
			});
		}
	]);

})(angular);