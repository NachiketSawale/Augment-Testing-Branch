
(function (angular) {
	/* global globals, _, Module */
	'use strict';

	let moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerAnnotationService', ['$http', '$q', '$injector', 'modelAnnotationDataService',
		'basicsLookupdataLookupDescriptorService', '$timeout', 'PlatformMessenger', 'modelAnnotationMarkerDataService','basicsLookupdataLookupDataService',
		function ($http, $q, $injector, modelAnnotationDataService,
			basicsLookupdataLookupDescriptorService, $timeout, PlatformMessenger, annoMarkerService, basicsLookupdataLookupDataService) {
			let service = {
				isCreateMultipleMarkers: false,
				annotationId: null,
				modelId: null,
				annotationItems: [],
				annoMarkerItems: [],
				rawTypeDescriptions: []
			};
			service.isCreateMultipleMarkersChanged = new PlatformMessenger();
			let modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
			service.createViewerAnnotation = function createViewerAnnotation(layoutId, markup) {
				if (service.modelId === null && modelViewerModelSelectionService && modelViewerModelSelectionService.getSelectedModelId()) {
					service.modelId = modelViewerModelSelectionService.getSelectedModelId();
				}
				if (service.modelId === null && service.modelId > 0) {
					return;
				}
				if (service.isCreateMultipleMarkers === true && _.find(service.annotationItems, {Id: service.annotationId}) && $injector.get('modelWdeViewerSelectionService').isTakeOffEnabled()) {
					service.createMarker(service.annotationId, layoutId, markup);
					return;
				}
				service.createMdlAnnotation(layoutId, markup);
			};

			// Record a status indicating that the model is working
			service.previewTimes = service.previewTimes || {};
			service.setPreviewWorkState = function (modelFk, isWorking) {
				if (!modelFk) {
					return;
				}
				service.previewTimes[modelFk] = service.previewTimes[modelFk] || { id: modelFk };
				if (isWorking) {
					service.clearPreviewWorkState();
				}
				service.previewTimes[modelFk].isWorking = isWorking;
			};

			service.clearPreviewWorkState = function () {
				Object.keys(service.previewTimes).forEach(function (key) {
					service.previewTimes[key].isWorking = false;
				});
			};

			service.getPreviewWorkState = function (modelFk) {
				if (!modelFk || !modelViewerModelSelectionService.getSelectedModelId()) {
					return false;
				}
				return service.previewTimes[modelFk] ? service.previewTimes[modelFk].isWorking : false;
			};

			service.copyMarkupDataToAnnotation = function copyMarkupDataToAnnotation(markups) {
				if (!service.modelId && modelViewerModelSelectionService && modelViewerModelSelectionService.getSelectedModelId()) {
					service.modelId = modelViewerModelSelectionService.getSelectedModelId();
				}
				if (!service.modelId) {
					return markups;
				}
				angular.forEach(markups, function mapMarkups(item) {
					$http.post(globals.webApiBaseUrl + 'model/annotation/create', {PKey1: service.modelId}).then(function (res) {
						let annotationItem = res.data ? res.data : res;
						annotationItem.ClerkFk = item.BasClerkFk;
						annotationItem.InsertedAt = new Date(item.InsertedAt);
						service.updateAnnotation(annotationItem).then(function (response) {
							let annotationDto = response.data ? response.data : response;
							if (annotationDto.Id) {
								service.annotationItems.push(annotationDto);
								service.createMarkerByMarkupData(annotationDto.Id, item);
								service.annotationId = annotationDto.Id;
							}
						});
					});
				});
				return [];
			};

			service.getCameras = function (annotationId) {
				return $http.get(globals.webApiBaseUrl + 'model/annotation/camera/list?annotationId=' + annotationId);
			};

			function IsInModule(name) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let currentName = $injector.get('mainViewService').getCurrentModuleName();
				let mainService = $injector.get('procurementContextService').getMainService();
				if (mainService && !currentName) {
					currentName = mainService.name;
					if (!currentName) {
						let moduleItem = mainService.getModule();
						currentName = (moduleItem && moduleItem.name) ? moduleItem.name : '';
					}
				}
				if (!currentName) {
					currentName = modelWdeViewerMarkupService.currentWorkingModule;
				}
				if (currentName === name) {
					return true;
				}
				return (modelWdeViewerMarkupService.currentModule && modelWdeViewerMarkupService.currentModule.name === name);
			}

			function loadAnnotationCustomize() {
				let annoCategories = basicsLookupdataLookupDescriptorService.getData('basics.customize.modelannotationcategories');
				if (!annoCategories) {
					$http.post(globals.webApiBaseUrl + 'basics/customize/modelannotationcategories/list').then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('basics.customize.modelannotationcategories', response.data);
					});
				}
				let annoStatus = basicsLookupdataLookupDescriptorService.getData('basics.customize.modelannotationstatus');
				if (!annoStatus) {
					$http.post(globals.webApiBaseUrl + 'basics/customize/modelannotationstatus/list').then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('basics.customize.modelannotationstatus', response.data);
					});
				}
				let annoPriorities = basicsLookupdataLookupDescriptorService.getData('basics.customize.priority');
				if (!annoPriorities) {
					$http.post(globals.webApiBaseUrl + 'basics/customize/modelannotationpriority/list').then(function (response) {
						basicsLookupdataLookupDescriptorService.updateData('basics.customize.priority', response.data);
					});
				}
			}

			function newMdlAnnotation(modelId) {
				const deffered = $q.defer();

				function generateGuid() {
					let guid = '';
					let count = 32;
					while (count--) {
						guid += Math.floor(Math.random() * 16.0).toString(16);
					}
					return guid;
				}

				let dto = {
					Uuid: generateGuid(),
					ModelFk: modelId,
					RawType: 0
				};
				annotationType(dto);
				if (dto.RawType === 0) {
					let annoCategories = basicsLookupdataLookupDescriptorService.getData('basics.customize.modelannotationcategories');
					let annoCategory = _.find(annoCategories, {IsDefault: true});
					if (annoCategory) {
						dto.CategoryFk = annoCategory.Id;
						dto.EffectiveCategoryFk = dto.CategoryFk;
					}
				}
				let annoStatus = basicsLookupdataLookupDescriptorService.getData('basics.customize.modelannotationstatus');
				let annoStatu = _.find(annoStatus, {IsDefault: true});
				if (annoStatu) {
					dto.StatusFk = annoStatu.Id;
				}
				let annoPriorities = basicsLookupdataLookupDescriptorService.getData('basics.customize.priority');
				let annoPriority = _.find(annoPriorities, {IsDefault: true});
				if (annoPriority) {
					dto.PriorityFk = annoPriority.Id;
				} else {
					annoPriority = _.find(annoPriorities, {isDefault: true});
					if (annoPriority) {
						dto.PriorityFk = annoPriority.Id;
					}
				}
				$injector.get('modelWdeViewerMarkupService').isCreateing = true;
				$http.get(globals.webApiBaseUrl + 'model/docmarker/newannotationid').then(function (response) {
					dto.Id = (response && response.data) ? response.data : response;
					deffered.resolve(dto);
				});
				return deffered.promise;
			}

			function currentRawType() {
				if (IsInModule('defect.main')) {
					return 2;
				}
				if (IsInModule('project.inforequest')) {
					return 1;
				}
				if (IsInModule('hsqe.checklist')) {
					return 3;
				}
				if (IsInModule('model.viewpoint')) {
					return 4;
				}
				return 0;
			}
			service.currentRawType = currentRawType;
			function annotationType(annotationDto) {
				service.currentTempDescription = null;
				if ($injector.get('modelWdeViewerSelectionService').isTakeOffEnabled()) {
					annotationDto.RawType = currentRawType();
				}
				if (modelAnnotationDataService && modelAnnotationDataService.getSelected() && service.isCreateMultipleMarkers) {
					service.annotationId = modelAnnotationDataService.getSelected().Id;
				}
				function fnv(dto, fnvService, fk, rawTypeId, lookupName) {
					if (fnvService && fnvService.getSelected()) {
						let dtoItem = fnvService.getSelected();
						if (dto[fk] === 0 || dto[fk] === null || dto[fk] === undefined) {
							dto[fk] = dtoItem.Id;
							service.currentTempDescription = dtoItem.Description;
							if (dtoItem.DescriptionInfo) {
								service.currentTempDescription = dtoItem.DescriptionInfo.Translated || dtoItem.DescriptionInfo.Description;
							}
						} else {
							let findDto = _.find(service.rawTypeDescriptions, {type: rawTypeId, id: dto[fk]});
							if (!findDto) {
								let parentList = fnvService.getList();
								findDto = _.find(parentList, {Id: dto[fk]});
								if (findDto) {
									service.rawTypeDescriptions.push({type: rawTypeId, id: dto[fk], dto: findDto});
								} else {
									basicsLookupdataLookupDataService.getItemByKey(lookupName, dto[fk]).then(function (res) {
										let resData = res.data ? res.data : res;
										service.rawTypeDescriptions.push({
											type: rawTypeId,
											id: resData.Id,
											dto: resData
										});
										service.currentTempDescription = resData.Description;
										if (resData.DescriptionInfo) {
											service.currentTempDescription = resData.DescriptionInfo.Translated || resData.DescriptionInfo.Description;
										}
									});
								}
							}
							if (findDto && findDto.dto) {
								service.currentTempDescription = findDto.dto.Description;
								if (findDto.dto.DescriptionInfo) {
									service.currentTempDescription = findDto.dto.DescriptionInfo.Translated || findDto.dto.DescriptionInfo.Description;
								}
							}
						}
						setCreateMultipleMarkerAnnotationId(fnvService, fk);
					} else {
						dto.RawType = 0;
					}
				}

				if (IsInModule('defect.main')) {
					let defectMainHeaderDataService = $injector.get('defectMainHeaderDataService');
					fnv(annotationDto, defectMainHeaderDataService, 'DefectFk', 2, 'DfmDefect');
				}
				if (IsInModule('project.inforequest')) {
					let projectInfoRequestDataService = $injector.get('projectInfoRequestDataService');
					fnv(annotationDto, projectInfoRequestDataService, 'InfoRequestFk', 1, 'ProjectInfoRequest');
				}
				if (IsInModule('hsqe.checklist')) {
					let hsqeCheckListDataService = $injector.get('hsqeCheckListDataService');
					fnv(annotationDto, hsqeCheckListDataService, 'HsqChecklistFk', 3, 'CheckList');
				}
				if (IsInModule('model.viewpoint')) {
					let modelViewpointDataService = $injector.get('modelViewpointDataService');
					if (modelViewpointDataService && modelViewpointDataService.getSelected()) {
						let viewpointItem = modelViewpointDataService.getSelected();
						annotationDto.ViewpointFk = viewpointItem.Id;
						service.currentTempDescription = viewpointItem.Description;
						setCreateMultipleMarkerAnnotationId(modelViewpointDataService, 'ViewpointFk');
					} else {
						annotationDto.RawType = 0;
					}
				}
				if (service.currentTempDescription) {
					if (!annotationDto.DescriptionInfo) {
						annotationDto.DescriptionInfo = {};
					}
					annotationDto.DescriptionInfo.Description = service.currentTempDescription;
					annotationDto.DescriptionInfo.Translated = service.currentTempDescription;
					annotationDto.DescriptionInfo.Modified = true;
				}
				let annoItem = _.find(service.annotationItems, {Id: annotationDto.Id});
				if (annoItem) {
					let findDto = {};
					if (annoItem.InfoRequestFk > 0) {
						findDto = _.find(service.rawTypeDescriptions, {type: 1, id: annoItem.InfoRequestFk});
					}
					if (annoItem.DefectFk > 0) {
						findDto = _.find(service.rawTypeDescriptions, {type: 2, id: annoItem.DefectFk});
					}
					if (annoItem.HsqChecklistFk > 0) {
						findDto = _.find(service.rawTypeDescriptions, {type: 3, id: annoItem.HsqChecklistFk});
					}
					if (findDto && findDto.dto) {
						service.currentTempDescription = findDto.dto.Description;
						if (findDto.dto.DescriptionInfo) {
							service.currentTempDescription = findDto.dto.DescriptionInfo.Translated || findDto.dto.DescriptionInfo.Description;
						}
					}
				}
			}
			service.currentAnnotationType = annotationType;

			function setCreateMultipleMarkerAnnotationId(fnvService, fk) {
				let annoItems = _.orderBy(service.annotationItems, ['Id'], ['desc']);
				let selItem = fnvService.getSelected();
				let findAnno = _.find(annoItems, function (item) {
					if (item[fk] === selItem.Id) {
						return item;
					}
				});
				if (service.isCreateMultipleMarkers && findAnno && findAnno[fk] > 0) {
					service.annotationId = findAnno.Id;
				} else if (service.isCreateMultipleMarkers && !findAnno && service.annotationId) {
					service.annotationId = null;
				}
				service.isSameParentRelate = (findAnno && findAnno[fk] > 0 && findAnno[fk] === selItem.Id);
			}
			function getAnnotationRawTypeDescription() {
				function lookupSearch(fk, lookupName, rawTypeId) {
					var ids = _.map(service.annotationItems, fk);
					let params = '';
					_.forEach(ids, function (item) {
						if (item > 0) {
							if (params.length > 0 && params.indexOf(item) === -1) {
								params = params + ' or id=' + item;
							} else {
								params = 'id=' + item;
							}
						}
					});
					if (params.length > 0) {
						basicsLookupdataLookupDataService.getSearchList(lookupName, params).then(function (res) {
							let resData = res.data ? res.data : res;
							if (resData.items && resData.items.length > 0) {
								_.forEach(resData.items, function (item) {
									service.rawTypeDescriptions.push({type: rawTypeId, id: item.Id, dto: item});
								});
							} else {
								_.forEach(resData, function (item) {
									service.rawTypeDescriptions.push({type: rawTypeId, id: item.Id, dto: item});
								});
							}
						});
					}
				}

				lookupSearch('HsqChecklistFk', 'CheckList', 3);
				lookupSearch('DefectFk', 'DfmDefect', 2);
				lookupSearch('InfoRequestFk', 'ProjectInfoRequest', 1);
			}
			// it will update parent version when the rawType > 0
			function resetParentVersion(){
				if (IsInModule('defect.main')) {
					let defectMainHeaderDataService = $injector.get('defectMainHeaderDataService');
					if (defectMainHeaderDataService && defectMainHeaderDataService.getSelected()) {
						let defectItem = defectMainHeaderDataService.getSelected();
						if (defectItem) {
							$http.get(globals.webApiBaseUrl + 'defect/main/header/getitembyId?id=' + defectItem.Id).then(function (response) {
								var item = response.data ? response.data : response;
								defectItem = defectMainHeaderDataService.getSelected();
								defectItem.Version = item.Version;
							});
						}
					}
				}
				if (IsInModule('project.inforequest')) {
					let projectInfoRequestDataService = $injector.get('projectInfoRequestDataService');
					if (projectInfoRequestDataService && projectInfoRequestDataService.getSelected()) {
						let rfiItem = projectInfoRequestDataService.getSelected();
						if (rfiItem) {
							basicsLookupdataLookupDataService.getItemByKey('ProjectInfoRequest', rfiItem.Id).then(function (item) {
								rfiItem = projectInfoRequestDataService.getSelected();
								rfiItem.Version = item.Version;
							});
						}
					}
				}
				if (IsInModule('hsqe.checklist')) {
					let hsqeCheckListDataService = $injector.get('hsqeCheckListDataService');
					if (hsqeCheckListDataService && hsqeCheckListDataService.getSelected()) {
						let checkListItem = hsqeCheckListDataService.getSelected();
						if (checkListItem) {
							basicsLookupdataLookupDataService.getItemByKey('CheckList', checkListItem.Id).then(function (item) {
								checkListItem = hsqeCheckListDataService.getSelected();
								checkListItem.Version = item.Version;
							});
						}
					}
				}
			}
			function modelAnnotationLoad(annotationFk) {
				if (!IsInModule('model.annotation')) {
					return;
				}
				let hasSelectItem = !!modelAnnotationDataService.getSelected();
				try {
					service.isAnnoLoad = true;
					modelAnnotationDataService.load().then(function () {
						let annoList = modelAnnotationDataService.getList();
						let annoSelect = _.find(annoList, {Id: annotationFk});
						if (annoSelect) {
							annotationResponseVersion(annoSelect, hasSelectItem);
						}
					});

				} catch (e) {
					window.console.log(e);
				}
			}
			service.createMdlAnnotation = function createMdlAnnotation(layoutId, markup) {
				// $http.post(globals.webApiBaseUrl + 'model/annotation/create', {PKey1: service.modelId}) // bug:projectFk must not null
				newMdlAnnotation(service.modelId).then(function (res) {
					let annotationItem = res.data ? res.data : res;
					let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
					if (!annotationItem.ClerkFk) {
						annotationItem.ClerkFk = modelWdeViewerMarkupService.currentClerk.Id;
					}
					annotationType(annotationItem);
					annotationItem.Color = hexColorToInt(markup.style.colour);

					service.updateAnnotation(annotationItem).then(function (response) {
						let annotationDto = response.data ? response.data : response;
						if (annotationDto.Id) {
							modelAnnotationLoad(annotationDto.Id);
							// service.createCamera(annotationDto.Id).then(function (cameras) {
							// addInAnnotationService(annotationDto, [cameras]);
							// });
							service.createMarker(annotationDto.Id, layoutId, markup);
							service.annotationId = annotationDto.Id;
						}
					});
				});
			};

			function hexColorToInt(colour) {
				let color = 0;
				if (_.isNumber(colour)) {
					color = colour;
				} else if (colour.length > 7) {
					let colStr = colour.substr(1, 6);
					color = parseInt(colStr, 16);
				} else {
					color = parseInt(colour.slice(1), 16);
				}
				return color;
			}

			service.createCamera = function (annotationId) {
				let deffered = $q.defer();
				$http.post(globals.webApiBaseUrl + 'model/annotation/camera/create', {PKey1: annotationId}).then(function (res) {
					$http.post(globals.webApiBaseUrl + 'model/annotation/camera/save', res.data).then(function (response) {
						let cameraItem = response.data ? response.data : response;

						let cameraService = $injector.get('modelAnnotationCameraDataService');
						if (cameraService && modelAnnotationDataService.getList().length > 0) {
							let list = cameraService.getList();
							list.push(cameraItem);
							cameraService.gridRefresh();
							cameraService.setSelected(cameraItem);
						}
						deffered.resolve(cameraItem);
					});
				});
				return deffered.promise;
			};

			function convertMarkupItem(markerItem, clerkId, isShow, markup, isSelect) {
				let clerkName = '...';
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let user = _.find(modelWdeViewerMarkupService.Clerks, {Id: clerkId});
				if (user && user.Id !== 0 && user.Id !== null && user.Id !== undefined) {
					clerkName = user.Name;
				} else {
					$http.get(globals.webApiBaseUrl + 'basics/clerk/userNameByClerk?clerkId=' + clerkId).then(function callback(response) {
						user = {Id: clerkId, Name: response.data};
						modelWdeViewerMarkupService.Clerks.push(user);
						_.forEach(modelWdeViewerMarkupService.commentMarkups, function (item) {
							if (item.ClerkFk) {
								let findItem = _.find(modelWdeViewerMarkupService.Clerks, {Id: item.ClerkFk});
								if (findItem) {
									item.Clerk = findItem.Name;
									modelWdeViewerMarkupService.commentMarkupsChanged.fire(modelWdeViewerMarkupService.commentMarkups);
								}
							}
						});
					});
				}
				let marupData = markerItem.MarkupJson;
				let marupId = JSON.parse(markerItem.MarkupJson).id;
				let color = JSON.parse(markerItem.MarkupJson).colour;
				let text = JSON.parse(markerItem.MarkupJson).text;
				if (markup && markup.serialize) {
					marupId = markup.id;
					marupData = markup.serialize();
					color = markup.style.colour;
					text = markup.text;
				}
				let annotationItem = _.find(service.annotationItems, {Id: markerItem.AnnotationFk});
				return {
					Id: markerItem.Id,
					MarkerId: marupId,
					Marker: marupData,
					LayoutId: markerItem.LayoutId,
					ClerkFk: clerkId,
					Clerk: clerkName,
					UpdateTime: new Date(markerItem.InsertedAt).toDateString().substr(4),
					isSelect: !!isSelect,
					isDisableGoto: false,
					IsShow: isShow,
					Color: color,
					Description: text,
					Content: markerItem.DescriptionInfo.Translated || markerItem.DescriptionInfo.Description,
					ModuleName: '',
					AnnotationFk: markerItem.AnnotationFk,
					AnnoMarkerFk: markerItem.Id,
					InfoRequestFk: annotationItem.InfoRequestFk,
					HsqChecklistFk: annotationItem.HsqChecklistFk,
					DefectFk: annotationItem.DefectFk,
					originMarker: marupData
				};
			}

			function convertMarkerRecord(annotationMarkerDto) {
				annotationMarkerDto.ContextModelId = service.modelId;
				annotationMarkerDto.OwnerModelFk = service.modelId;
				annotationMarkerDto.globalId = annotationMarkerDto.AnnotationFk + '/' + annotationMarkerDto.Id;
				return annotationMarkerDto;
			}

			service.updateAnnoColor = function updateAnnoColor(annotationId, color, hexColor, markerId, description) {
				let annotationItem = _.find(service.annotationItems, {Id: annotationId});
				annotationItem.Color = color;
				if (description) {
					if (!annotationItem.DescriptionInfo){
						annotationItem.DescriptionInfo = {};
					}
					annotationItem.DescriptionInfo.Translated = description;
					annotationItem.DescriptionInfo.Modified = true;
				}
				service.updateAnnotation(annotationItem).then(function () {
					let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
					_.forEach(modelWdeViewerMarkupService.commentMarkups, function (markerItem) {
						if (markerItem.AnnotationFk === annotationId && markerItem.MarkerId !== markerId) {
							let markupData = modelWdeViewerMarkupService.igeCtrl.getMarkup(markerItem.MarkerId);
							if (markupData) {
								let type = angular.copy(markupData.style);
								if (markupData.style.endPointStyle.value === 1) {
									type.endPointStyle = Module.MarkupPointStyle.Arrow;
								}
								type.colour = hexColor;
								modelWdeViewerMarkupService.igeCtrl.updateMarkupStyle(markerItem.MarkerId, type);
							}
						}
					});
				});
			};

			service.createMarker = function (annotationId, layoutId, markup) {
				const deffered = $q.defer();
				let markupData = angular.copy(markup);
				if (markupData.serialize) {
					markupData = markup.serialize();
				}
				$http.post(globals.webApiBaseUrl + 'model/annotation/marker/create', {PKey1: annotationId}).then(function (res) {
					let markerEntity = res.data ? res.data : res;
					markerEntity.LayoutId = layoutId;
					markerEntity.MarkupJson = markupData;
					$http.post(globals.webApiBaseUrl + 'model/annotation/marker/save', markerEntity).then(function (response) {
						let markerItem = response.data ? response.data : response;
						service.annoMarkerItems.push(markerItem);
						let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
						let findMarkupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {AnnoMarkerFk: markerItem.Id, AnnotationFk: markerItem.AnnotationFk});
						let annotationItem = _.find(service.annotationItems, {Id: markerItem.AnnotationFk});
						if (findMarkupItem) {
							findMarkupItem = convertMarkupItem(markerItem, annotationItem.ClerkFk, true, markup, false);
						} else {
							modelWdeViewerMarkupService.commentMarkups.push(convertMarkupItem(markerItem, annotationItem.ClerkFk, true, markup, false));
							// modelWdeViewerMarkupService.selectMarkupById(markup.id);
							modelWdeViewerMarkupService.isDeleteDisabled = false;
						}
						modelWdeViewerMarkupService.commentMarkupsChanged.fire(modelWdeViewerMarkupService.commentMarkups);

						if (annoMarkerService && modelAnnotationDataService.getList().length > 0) {
							let list = annoMarkerService.getList();
							list.push(convertMarkerRecord(markerItem));
							annoMarkerService.gridRefresh();
							annoMarkerService.setSelected(markerItem);
						}
						deffered.resolve(markerItem);
					}, function () {
						deffered.resolve(null);
					});
				});
				return deffered.promise;
			};
			service.createMarkerByMarkupData = function (annotationId, markupItem) {
				$http.post(globals.webApiBaseUrl + 'model/annotation/marker/create', {PKey1: annotationId}).then(function (res) {
					let markerEntity = res.data ? res.data : res;
					markerEntity.LayoutId = markupItem.LayoutId;
					markerEntity.MarkupJson = markupItem.Marker;
					markerEntity.InsertedAt = new Date(markupItem.InsertedAt);
					$http.post(globals.webApiBaseUrl + 'model/annotation/marker/save', markerEntity).then(function (response) {
						let markerItem = response.data ? response.data : response;
						service.annoMarkerItems.push(markerItem);
						let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
						let findMarkupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {AnnoMarkerFk: markerItem.Id, AnnotationFk: markerItem.AnnotationFk});
						let annotationItem = _.find(service.annotationItems, {Id: markerItem.AnnotationFk});
						if (findMarkupItem) {
							findMarkupItem = convertMarkupItem(markerItem, annotationItem.ClerkFk, true);
						} else {
							modelWdeViewerMarkupService.commentMarkups.push(convertMarkupItem(markerItem, annotationItem.ClerkFk, true));
							modelWdeViewerMarkupService.isDeleteDisabled = false;
						}
						modelWdeViewerMarkupService.commentMarkupsChanged.fire(modelWdeViewerMarkupService.commentMarkups);
					});
				});
			};

			function annotationVersion(annotationItem) {
				if (annotationItem) {
					let findItem = _.find(service.annotationItems, {Id: annotationItem.Id});
					if (findItem && findItem.Version > annotationItem.Version) {
						annotationItem.Version = findItem.Version;
					}
				}
			}
			function annotationResponseVersion(res, hasSelectItem) {
				let resData = res.data ? res.data : res;
				let findItem = _.find(service.annotationItems, {Id: resData.Id});
				if (findItem) {
					findItem.DescriptionInfo = resData.DescriptionInfo;
					findItem.Version = resData.Version;
					findItem.RawType = resData.RawType;
					findItem.Color = resData.Color;
				} else {
					service.annotationItems.push(resData);
				}
				if (IsInModule('model.annotation') && modelAnnotationDataService) {
					let annoList = modelAnnotationDataService.getList();
					let annoSelect = _.find(annoList, {Id: resData.Id});
					if (annoSelect) {
						annoSelect.DescriptionInfo = resData.DescriptionInfo;
						annoSelect.Version = resData.Version;
						annoSelect.RawType = resData.RawType;
						annoSelect.Color = resData.Color;
						modelAnnotationDataService.setSelected(annoSelect);
						modelAnnotationDataService.gridRefresh();
					} else if (hasSelectItem){
						modelAnnotationDataService.setSelected(resData);
					}
				}
			}
			service.waitAnnoUpdate = [];
			service.updateAnnotation = function updateAnnotation(annotationItem) {
				const deffered = $q.defer();
				annotationVersion(annotationItem);
				if (service.AnnotationRawType) {
					annotationType(annotationItem);
				}
				if (service.UseAnnoRawType && !service.AnnotationRawType) {
					annotationItem.RawType = 0;
				}
				if (annotationItem.RawType === 0 && (annotationItem.CategoryFk === undefined || annotationItem.CategoryFk === null || annotationItem.CategoryFk === 0)) {
					let annoCategories = basicsLookupdataLookupDescriptorService.getData('basics.customize.modelannotationcategories');
					let annoCategory = _.find(annoCategories, {IsDefault: true});
					if (annoCategory) {
						annotationItem.CategoryFk = annoCategory.Id;
						annotationItem.EffectiveCategoryFk = annotationItem.CategoryFk;
					}
				}
				if (!annotationItem && service.waitAnnoUpdate.length > 0) {
					annotationItem = service.waitAnnoUpdate[0];
				} else if (annotationItem) {
					service.waitAnnoUpdate.push(annotationItem);
				}
				if (annotationItem && service.currentUpdateAnnotationId !== annotationItem.Id) {
					service.currentUpdateAnnotationId = annotationItem.Id;
					$http.post(globals.webApiBaseUrl + 'model/annotation/save', annotationItem).then(function (res) {
						service.waitAnnoUpdate.splice(service.waitAnnoUpdate.indexOf(annotationItem), 1);
						$injector.get('modelWdeViewerMarkupService').isCreateing = false;
						service.currentUpdateAnnotationId = null;
						let resData = res.data ? res.data : res;
						annotationResponseVersion(res);
						if (resData.RawType > 0) {
							resetParentVersion();
						}
						if (service.waitAnnoUpdate.length > 0) {
							service.updateAnnotation().then(function (r) {
								deffered.resolve(r);
							});
						} else {
							deffered.resolve(resData);
						}
					});
				} else if (service.waitAnnoUpdate.length > 0) {
					$timeout(function () {
						service.updateAnnotation().then(function (r) {
							deffered.resolve(r);
						});
					}, 500);
					console.log('updateAnnotation:' + annotationItem.Id + new Date().toString());
				} else {
					deffered.resolve(annotationItem);
				}
				return deffered.promise;
			};

			service.updateMarker = function updateMarker(markerItem) {
				if(service.currentUpdateMarkupJson !== markerItem.MarkupJson) {
					service.currentUpdateMarkupJson = markerItem.MarkupJson;
					$http.post(globals.webApiBaseUrl + 'model/annotation/marker/save', markerItem).then(function (res) {
						service.currentUpdateMarkupJson = null;
						let markerDto = res.Id ? res : res.data;
						let findMarker = _.find(service.annoMarkerItems, {Id: markerItem.Id, AnnotationFk: markerItem.AnnotationFk});
						findMarker.Version = markerDto.Version;

						if (annoMarkerService && modelAnnotationDataService.getList().length > 0) {
							let annoMarkerItem = annoMarkerService.getSelected();
							if (annoMarkerItem && markerDto.Id === annoMarkerItem.Id && markerDto.AnnotationFk === annoMarkerItem.AnnotationFk) {
								annoMarkerItem.DescriptionInfo = markerDto.DescriptionInfo;
								annoMarkerItem.Version = markerDto.Version;
								annoMarkerService.gridRefresh();
							} else {
								let list = annoMarkerService.getList();
								let findItem = _.find(list, {Id: markerDto.Id, AnnotationFk: markerDto.AnnotationFk});
								if (findItem) {
									findItem.DescriptionInfo = markerDto.DescriptionInfo;
									findItem.Version = markerDto.Version;
									annoMarkerService.gridRefresh();
								}
							}
						}
					});
				}
			};

			service.updateAnnotationDescription = function updateAnnotationDescription(markerId, description) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markerId});
				let annoId = (findMarkerItem && findMarkerItem.AnnotationFk) ? findMarkerItem.AnnotationFk : service.annotationId;
				let findItem = _.find(service.annotationItems, {Id: annoId});
				if (!findItem) {
					return;
				}
				if (!findItem.DescriptionInfo) {findItem.DescriptionInfo = {};}
				findItem.DescriptionInfo.Translated = description;
				findItem.DescriptionInfo.Modified = true;
				let annoList = modelAnnotationDataService.getList();
				let annotationItem = _.find(annoList, {Id: annoId});
				if (!annotationItem) {
					annotationItem = findItem;
				}
				if (!_.isNumber(annotationItem.EffectiveCategoryFk)) {
					annotationItem.EffectiveCategoryFk = findItem.EffectiveCategoryFk;
				}
				if (!annotationItem.DescriptionInfo){
					annotationItem.DescriptionInfo = {};
				}
				annotationItem.DescriptionInfo.Translated = description;
				annotationItem.DescriptionInfo.Modified = true;
				service.updateAnnotation(annotationItem);
			};

			service.updateAnnoMarkerDescription = function updateAnnoMarkerDescription(id, comment) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let findMarkupItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: id});
				if (findMarkupItem) {
					findMarkupItem.Description = comment;
					let findMarker = _.find(service.annoMarkerItems, {Id: id, AnnotationFk: findMarkupItem.AnnotationFk});
					if (findMarker) {
						findMarker.DescriptionInfo.Translated = comment;
						findMarker.DescriptionInfo.Modified = true;
					}
				}
			};

			service.updateMarkerDescription = function (id, annotationId, comment) {
				let findMarker = _.find(service.annoMarkerItems, {Id: id, AnnotationFk: annotationId});
				if (findMarker) {
					findMarker.DescriptionInfo.Translated = comment;
					findMarker.DescriptionInfo.Modified = true;
					service.updateMarker(findMarker);
				}
			};

			service.updateMarkerMarkupJson = function (id, annotationId, markup) {
				let findMarker = _.find(service.annoMarkerItems, {Id: id, AnnotationFk: annotationId});
				if (findMarker && markup.serialize) {
					findMarker.MarkupJson = markup.serialize();
					if (findMarker.DescriptionInfo && findMarker.DescriptionInfo.Translated !== markup.text) {
						findMarker.DescriptionInfo.Translated = markup.text;
						findMarker.DescriptionInfo.Modified = true;
					}
					service.updateMarker(findMarker);
				}
			};

			function annoMarkerDescriptionChange(args, model) {
				if (model && service.annoMarkerItems) {
					let annoMarkerItem = _.find(service.annoMarkerItems, {Id: model.Id, AnnotationFk: model.AnnotationFk});
					if (annoMarkerItem && annoMarkerItem.DescriptionInfo && annoMarkerItem.DescriptionInfo.Translated !== model.DescriptionInfo.Translated) {
						let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
						let markerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {AnnoMarkerFk: model.Id, AnnotationFk: model.AnnotationFk});
						let markupData = modelWdeViewerMarkupService.igeCtrl.getMarkup(markerItem.MarkerId);
						modelWdeViewerMarkupService.igeCtrl.updateMarkupText(markerItem.MarkerId, model.DescriptionInfo.Translated, markupData.fontHeight);
					}
				}
			}

			function annotationColorChage(args, model) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let drawingUtil = $injector.get('basicsCommonDrawingUtilitiesService');
				_.forEach(modelWdeViewerMarkupService.commentMarkups, function (markerItem) {
					if (markerItem.AnnotationFk === model.AnnotationFk) {
						let markupData = modelWdeViewerMarkupService.igeCtrl.getMarkup(markerItem.MarkerId);
						if (markupData) {
							let type = angular.copy(markupData.style);
							if (markupData.style.endPointStyle.value === 1) {
								type.endPointStyle = Module.MarkupPointStyle.Arrow;
							}
							type.colour = drawingUtil.decToHexColor(model.Color);
							modelWdeViewerMarkupService.igeCtrl.updateMarkupStyle(markerItem.MarkerId, type);
						}
					}
				});
			}

			annoMarkerService.registerItemModified(annoMarkerDescriptionChange);
			modelAnnotationDataService.registerItemModified(annotationColorChage);

			service.selectAnnotation = function () {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				let findItem = _.find(modelWdeViewerMarkupService.commentMarkups, {isSelect: true});
				if (findItem && service.isCreateMultipleMarkers === true) {
					service.annotationId = findItem.AnnotationFk;
				}
				if (modelAnnotationDataService && modelAnnotationDataService.getList().length > 0 && findItem) {
					let annoList = modelAnnotationDataService.getList();
					let findAnno = _.find(annoList, {Id: findItem.AnnotationFk});
					if (findAnno) {
						modelAnnotationDataService.setSelected(findAnno);
					} else {
						if (modelWdeViewerMarkupService.modelPart && modelWdeViewerMarkupService.modelPart.config && modelWdeViewerMarkupService.modelPart.config.ModelFk) {
							service.modelId = modelWdeViewerMarkupService.modelPart.config.ModelFk;
						} else if (!service.modelId && modelViewerModelSelectionService && modelViewerModelSelectionService.getSelectedModelId()) {
							service.modelId = modelViewerModelSelectionService.getSelectedModelId();
						}
						service.getAnnotations(service.modelId).then(function (res) {
							let resData = res.data ? res.data : res;
							if (_.difference(resData, annoList).length > 0) {
								_.forEach(resData, function (item) {
									if (!_.find(annoList, {Id: item.Id})) {
										annoList.push(item);
									}
								});
								modelAnnotationDataService.setList(annoList);
								findAnno = _.find(annoList, {Id: findItem.AnnotationFk});
								if (findAnno) {
									modelAnnotationDataService.setSelected(findAnno);
								}
							}
						});
					}
					if (annoMarkerService) {
						let markerList = annoMarkerService.getList();
						let findMarker = _.find(markerList, {
							Id: findItem.AnnoMarkerFk,
							AnnotationFk: findItem.AnnotationFk
						});
						if (findMarker) {
							annoMarkerService.setSelected(findMarker);
						} else {
							$timeout(function () {
								let markerList = annoMarkerService.getList();
								let findMarker = _.find(markerList, {
									Id: findItem.AnnoMarkerFk,
									AnnotationFk: findItem.AnnotationFk
								});
								if (findMarker) {
									annoMarkerService.setSelected(findMarker);
								}
							}, 2000);
						}
					}
				} else if (IsInModule('model.annotation') && modelAnnotationDataService) {
					service.isAnnoLoad = true;
					try {
						modelAnnotationDataService.load();
					} catch (e) {
						window.console.log(e);
					}
				}
			};

			service.getAnnotations = function getAnnotations(modelId) {
				return $http.get(globals.webApiBaseUrl + 'model/annotation/byModel?modelId=' + modelId);
			};

			service.getAnnotationMarker = function getAnnotationMarker(modelId) {
				return $http.get(globals.webApiBaseUrl + 'model/annotation/marker/listbymodel?modelId=' + modelId);
			};

			function modelAnnoSelectionChanged(e, item) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				if (modelWdeViewerMarkupService.isSelectByComment || !item) {
					modelWdeViewerMarkupService.isSelectByComment = false;
					return;
				}
				try {
					if (service.isAnnoLoad) {
						service.isAnnoLoad = false;
						return;
					}
					_.forEach(modelWdeViewerMarkupService.commentMarkups, function (annoItem) {
						annoItem.isSelect = false;
						if (annoItem.AnnotationFk === item.Id) {
							if (annoItem.IsShow === false) {
								modelWdeViewerMarkupService.loadIgeMarkups(modelWdeViewerMarkupService.igeCtrl, [annoItem.originMarker]);
								annoItem.IsShow = true;
								annoItem.isSelect = true;
							} else {
								annoItem.isSelect = true;
							}
						}
					});
				}
				catch (e){
					console.log(e);
				}
			}
			function modelAnnoMarkerSelectionChanged(e, item) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				if (modelWdeViewerMarkupService.isSelectByComment || !item) {
					modelWdeViewerMarkupService.isSelectByComment = false;
					return;
				}
				if (_.filter(modelWdeViewerMarkupService.commentMarkups, {AnnotationFk: item.AnnotationFk}).length > 1) {
					_.forEach(modelWdeViewerMarkupService.commentMarkups, function (annoItem) {
						annoItem.isSelect = false;
						if (annoItem.AnnotationFk === item.AnnotationFk && annoItem.AnnoMarkerFk === item.Id) {
							if (annoItem.IsShow === false) {
								modelWdeViewerMarkupService.loadIgeMarkups(modelWdeViewerMarkupService.igeCtrl, [annoItem.originMarker]);
								annoItem.IsShow = true;
								annoItem.isSelect = true;
							} else {
								annoItem.isSelect = true;
							}
						}
					});
				}
			}
			function getPreviewModel(docId) {
				if (docId) {
					$http.get(globals.webApiBaseUrl + 'documents/projectdocument/getjobstatusbyfilearchivedocfk?fileArchiveDocFk=' + docId).then(function (res) {
						let resData = res.data ? res.data : res;
						if (resData.ModelFk) {
							service.modelId = resData.ModelFk;
							service.loadAnnoMarker();
						}
					});
				}
			}
			service.loadAnnoMarker = function loadAnnoMarker() {
				const deffered = $q.defer();
				if (IsInModule('model.annotation')) {
					modelAnnotationDataService.unregisterSelectionChanged(modelAnnoSelectionChanged);
					modelAnnotationDataService.registerSelectionChanged(modelAnnoSelectionChanged);
				}
				annoMarkerService.unregisterSelectionChanged(modelAnnoMarkerSelectionChanged);
				annoMarkerService.registerSelectionChanged(modelAnnoMarkerSelectionChanged);
				loadAnnotationCustomize();
				service.annoMarkerItems = [];
				service.annotationItems = [];
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				modelWdeViewerMarkupService.commentLoading.fire(true);
				if (modelViewerModelSelectionService && modelViewerModelSelectionService.getSelectedModelId()) {
					service.modelId = modelViewerModelSelectionService.getSelectedModelId();
				}
				if (service.modelId !== modelWdeViewerMarkupService.docId && modelWdeViewerMarkupService.docId !== null && modelWdeViewerMarkupService.scopeOptions.dataMode !== 'document') {
					service.modelId = modelWdeViewerMarkupService.docId;
				}
				if (!service.modelId) {
					getPreviewModel(modelWdeViewerMarkupService.scopeOptions.fileDocId);
					deffered.resolve(null);
					return deffered.promise;
				}
				service.getAnnotations(service.modelId).then(function (response) {
					service.annotationItems = response.data ? response.data : response;
					if (modelAnnotationDataService) {
						let annoList = modelAnnotationDataService.getList();
						let isChange = false;
						_.forEach(service.annotationItems, function (item) {
							let findItem = _.find(annoList, {Id: item.Id});
							if (!findItem) {
								annoList.push(item);
								isChange = true;
							}
						});
						if (isChange) {
							modelAnnotationDataService.setList(annoList);
						}
						if (service.gotoSelectItem) {
							let findItem = _.find(annoList, {Id: service.gotoSelectItem.AnnotationFk});
							modelAnnotationDataService.setSelected(findItem);
						}
					}
					service.getAnnotationMarker(service.modelId).then(function (response) {
						modelWdeViewerMarkupService.commentLoading.fire(false);
						if (response && response.data) {
							service.annoMarkerItems = response.data;
							getAnnotationRawTypeDescription();
							let layoutId = null;
							if (modelWdeViewerMarkupService.modelPart && modelWdeViewerMarkupService.modelPart.settings) {
								layoutId = modelWdeViewerMarkupService.modelPart.settings.layout;
							}
							if (!layoutId) {
								layoutId = modelWdeViewerMarkupService.scopeOptions.currentViewLayout.id;
							}
							_.forEach(service.annoMarkerItems, function (item) {
								if (item.LayoutId === layoutId) {
									let markerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {
										AnnoMarkerFk: item.Id,
										AnnotationFk: item.AnnotationFk
									});
									let annotationItem = _.find(service.annotationItems, {Id: item.AnnotationFk});
									if (!markerItem && item.MarkupJson !== null && annotationItem) {
										modelWdeViewerMarkupService.commentMarkups.push(convertMarkupItem(item, annotationItem.ClerkFk, false, null));
									}
								}
							});
							if (service.gotoSelectItem) {
								let markerList = annoMarkerService.getList();
								let findItem = _.find(markerList, {
									Id: service.gotoSelectItem.AnnoMarkerFk,
									AnnotationFk: service.gotoSelectItem.AnnotationFk
								});
								annoMarkerService.setSelected(findItem);
								let markups = [];
								markups.push(service.gotoSelectItem.originMarker);
								$timeout(function () {
									if (service.gotoSelectItem && service.gotoSelectItem.MarkerId && markups.length > 0) {
										let igeMarkupItem = modelWdeViewerMarkupService.igeCtrl.getMarkup(service.gotoSelectItem.MarkerId);
										if (!igeMarkupItem) {
											modelWdeViewerMarkupService.loadIgeMarkups(modelWdeViewerMarkupService.igeCtrl, markups);
										}
										service.gotoSelectItem = null;
									}
								}, 2000);
							}
							modelWdeViewerMarkupService.checkAnnoMarkerShow();
							deffered.resolve(service.annoMarkerItems);
						} else {
							deffered.resolve(null);
						}
					});
				});
				return deffered.promise;
			};

			service.deleteAnnotation = function deleteAnnotation(annotationDto) {
				// service.annotationId = null;
				return $http.post(globals.webApiBaseUrl + 'model/annotation/delete', annotationDto);
			};

			service.deleteAnnoMarker = function deleteAnnoMarker(annoMarkerDto) {
				return $http.post(globals.webApiBaseUrl + 'model/annotation/marker/delete', annoMarkerDto);
			};

			service.deleteItem = function deleteItem(id, annotationId) {
				if (_.filter(service.annoMarkerItems, {AnnotationFk: annotationId}).length === 1) {
					let delAnnotation = _.find(service.annotationItems, {Id: annotationId});
					if (delAnnotation) {
						service.deleteAnnotation(delAnnotation).then(function () {
							if (IsInModule('model.annotation') && modelAnnotationDataService && modelAnnotationDataService.getList().length > 0) {
								service.isAnnoLoad = true;
								try {
									modelAnnotationDataService.load();
								} catch (e) {
									window.console.log(e);
								}
							}
							service.annotationItems = _.filter(service.annotationItems, function (item) {
								return item.Id !== annotationId;
							});
						});
					}
				} else {
					let delAnnoMarker = _.find(service.annoMarkerItems, {Id: id, AnnotationFk: annotationId});
					if (delAnnoMarker) {
						service.deleteAnnoMarker(delAnnoMarker).then(function () {
							service.annoMarkerItems = _.filter(service.annoMarkerItems, function (item) {
								return !(item.Id === id && item.AnnotationFk === annotationId);
							});
							if (IsInModule('model.annotation') && annoMarkerService && modelAnnotationDataService.getList().length > 0) {
								annoMarkerService.load();
							}
						});
					}
				}
			};

			service.savePdfWithAnnMarker = function (modelId) {
				let platformDialogService = $injector.get('platformDialogService');
				try {
					service.getAnnotationMarker(modelId).then(function (response) {
						let resData = response.data ? response.data : response;
						let layoutsConfigJson = [];
						let layoutMap = [];
						_.forEach(resData, function (item) {
							let layout = _.find(layoutMap, {id: item.LayoutId});
							if (layout) {
								layout.markupData.markups.push(JSON.parse(item.MarkupJson));
							} else {
								layoutMap.push({
									id: item.LayoutId,
									markupData: {markups: [JSON.parse(item.MarkupJson)]}
								});
							}
						});
						_.forEach(layoutMap, function (item) {
							layoutsConfigJson.push({
								layoutId: item.id,
								calibrationAngle: 0.0,
								calibrationX: 1.0,
								calibrationY: 1.0,
								markupData: JSON.stringify(JSON.stringify(item.markupData)),
								options: 0
							});
						});
						let layoutsConfigString = layoutsConfigJson.length > 0 ? JSON.stringify(layoutsConfigJson) : '';
						let result = 0;
						let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
						if (modelWdeViewerMarkupService.currentPreviewDataService && modelWdeViewerMarkupService.currentPreviewDataService.getSelected()) {
							let fileName = modelWdeViewerMarkupService.currentPreviewDataService.getSelected().OriginFileName;
							if (!service.saveDrawingFileName || fileName !== service.saveDrawingFileName) {
								service.saveDrawingFileName = fileName;
							}
						} else if ($injector.get('modelWdeViewerSelectionService').isTakeOffEnabled()) {
							$http.get(globals.webApiBaseUrl + 'model/project/modelfile/list?mainItemId=' + modelId).then(function (response) {
								let modelFileItem = response.data[0];
								service.saveDrawingFileName = modelFileItem.OriginFileName;
								if (modelWdeViewerMarkupService.igeCtrl && modelWdeViewerMarkupService.igeCtrl.savePDFDrawing) {
									result = modelWdeViewerMarkupService.igeCtrl.savePDFDrawing(layoutsConfigString);
								}
								if (result !== 0)
									console.log(`Save Markup to PDF called with result: ${result}`);
							});
							console.log('[Model] Save Markup to PDF ok');
							return;
						}
						if (modelWdeViewerMarkupService.igeCtrl && modelWdeViewerMarkupService.igeCtrl.savePDFDrawing) {
							result = modelWdeViewerMarkupService.igeCtrl.savePDFDrawing(layoutsConfigString);
						} else {
							platformDialogService.showInfoBox('model.wdeviewer.reOpenPreview');
						}
						if (result !== 0)
							console.log(`Save Markup to PDF called with result: ${result}`);
						else
							console.log('Save Markup to PDF ok');
					});
				} catch (e) {
					console.log(e);
					platformDialogService.showInfoBox('model.wdeviewer.reOpenPreview');
				}
			};

			service.addInMarkupComment = function (annotations) {
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				_.forEach(annotations, function(annotation) {
					let annotationItem = _.find(service.annotationItems, { Id: annotation.Id });
					if (!annotationItem) {
						service.annotationItems.push(annotation);
					}
					let clerkFk = annotation.ClerkFk;
					_.forEach(annotation.Markers, function(annoMarker) {
						let markerItem = _.find(service.annoMarkerItems, { Id: annotation.Id });
						if (!markerItem) {
							service.annoMarkerItems.push(annoMarker);
						}
						modelWdeViewerMarkupService.commentMarkups.push(convertMarkupItem(annoMarker, clerkFk, true, null, false));
					});
				});
				modelWdeViewerMarkupService.commentMarkupsChanged.fire(modelWdeViewerMarkupService.commentMarkups);
			};

			service.saveMultipleMarkup = function(modelId, layoutId, annoDescription, markupDescriptions, color, markupJsons) {
				const deffered = $q.defer();
				if (!modelId || !layoutId || !markupJsons || markupJsons.length < 1) {
					deffered.resolve(null);
					return deffered.promise;
				}
				let currentClerkId = null;
				let modelWdeViewerMarkupService = $injector.get('modelWdeViewerMarkupService');
				if (modelWdeViewerMarkupService && modelWdeViewerMarkupService.currentClerk) {
					currentClerkId = modelWdeViewerMarkupService.currentClerk.Id;
				}
				let annoDtos = [];
				let i = 0;
				_.forEach(markupJsons, function(markupJson) {
					let initDto = {
						ModelFk: modelId,
						RawType: 0
					};
					annotationType(initDto);
					if (color) {
						initDto.Color = color;
					}
					initDto.ClerkFk = currentClerkId;

					if (annoDescription) {
						if (!initDto.DescriptionInfo) {
							initDto.DescriptionInfo = {
								Translated: annoDescription,
								Description: annoDescription,
								Modified: true
							};
						} else {
							initDto.DescriptionInfo.Description = annoDescription;
							initDto.DescriptionInfo.Translated = annoDescription;
							initDto.DescriptionInfo.Modified = true;
						}
					}
					let markerDto = {
						LayoutId: layoutId,
						MarkupJson: markupJson,
						DescriptionInfo: {
							Description: markupDescriptions[i],
							Translated: markupDescriptions[i],
							Modified: true
						},
						Version: 0
					};
					initDto.MarkerEntities = [];
					initDto.MarkerEntities.push(markerDto);
					initDto.Version = 0;
					annoDtos.push(initDto);
					i++;
				});
				service.batchSave(annoDtos).then(function(res) {
					deffered.resolve(res);
				});
				return deffered.promise;
			};

			service.batchSave = function(annotations) {
				return $http.post(globals.webApiBaseUrl + 'model/docmarker/saveannotations', annotations);
			};
			service.getAllAnnotation = function(modelId) {
				return $http.get(globals.webApiBaseUrl + 'model/docmarker/getannotations?modelId=' + modelId);
			};

			service.clearActionMarker = function(){
				service.activeMarker = null;
			}
			return service;
		}
	]);

})(angular);