
(function (angular) {
	'use strict';
	/* global Module,_ */

	let moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerMarkerEditDialogService', ['$injector', '$translate', 'platformTranslateService', '$timeout',
		'platformModalFormConfigService', 'modelWdeViewerMarkupService','basicsLookupdataPopupService',
		function ($injector, $translate, platformTranslateService, $timeout,
			platformModalFormConfigService, modelWdeViewerMarkupService, basicsLookupdataPopupService) {
			let service = {};
			const pointStyleArray = [Module.MarkupPointStyle.Tick, Module.MarkupPointStyle.Cross];
			service.configDialogOptions = function (markerParam) {
				let isReadOnlyColor = markerParam.isReadOnlyColor;
				let isTakeOffMode = $injector.get('modelWdeViewerSelectionService').isTakeOffEnabled();
				let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
				let currentAnnotationType = {};
				modelWdeViewerAnnotationService.currentAnnotationType(currentAnnotationType);
				let isDefaultAnnoRawType = currentAnnotationType.RawType === 0 || currentAnnotationType.RawType === undefined;
				let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markerParam.id});
				let currentModuleMarker = currentAnnotationType.InfoRequestFk > 0 || currentAnnotationType.DefectFk > 0 ||
					currentAnnotationType.HsqChecklistFk > 0 || currentAnnotationType.ViewpointFk > 0;
				let isSameAnnotation = !!findMarkerItem && _.filter(modelWdeViewerMarkupService.commentMarkups, {AnnotationFk: findMarkerItem.AnnotationFk}).length > 1;
				service.isUseAnnoRawType = isTakeOffMode && !isDefaultAnnoRawType && !isReadOnlyColor && currentModuleMarker && !isSameAnnotation;
				const isNoPoint = (pointStyleArray.indexOf(markerParam.markupStyle.endPointStyle) > -1 ||
					(markerParam.markupStyle.endPointStyle === Module.MarkupPointStyle.None &&
						markerParam.markupStyle.lineOptions === Module.MarkupLineOptions.None.value &&
						markerParam.markupType.value === 0)
				);
				const isHighlighter = markerParam.markupStyle.colour.length === 9 && markerParam.markupStyle.colour.endsWith('80');
				const isTextMarkup = markerParam.markupStyle.endPointStyle === Module.MarkupPointStyle.NotVisible;
				const shapeArray = [Module.MarkupRegionShape.Rectangle.value, Module.MarkupRegionShape.Ellipse.value];
				const needFillColor = shapeArray.indexOf(markerParam.markupStyle.shape) > -1 && markerParam.markupType.value === 2;
				return {
					title: $translate.instant('model.wdeviewer.editMarker'),
					formConfiguration: {
						fid: 'model.wdeviewer.editMarkup',
						showGrouping: false,
						groups: [
							{
								gid: 'color',
								header$tr$: 'model.wdeviewer.marker.setting',
								isOpen: true,
								sortOrder: 100
							}
						],
						rows: [
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.markerColor',
								type: 'color',
								model: 'Color',
								visible: !isTextMarkup,
								sortOrder: 100,
								readonly: isReadOnlyColor
							},
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.annoRawType',
								type: 'boolean',
								model: 'AnnotationRawType',
								visible: isTakeOffMode && !isReadOnlyColor && !isDefaultAnnoRawType && currentModuleMarker,
								sortOrder: 100,
								readonly: isSameAnnotation || !markerParam.isNewMarkup,
								validator: function (entity, value) {
									$injector.get('platformRuntimeDataService').readonly(entity, [{field: 'AnnotationDescription', readonly: value === true}]);
									if (value === true) {
										entity.AnnotationDescription = modelWdeViewerAnnotationService.currentTempDescription;
									}
								}
							},
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.annoDescription',
								type: 'text',
								model: 'AnnotationDescription',
								visible: isTakeOffMode,
								sortOrder: 100,
								readonly: isReadOnlyColor
							},
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.markerComment',
								type: 'text',
								model: 'Comment',
								visible: true,
								sortOrder: 100,
								readonly: false,
								validator: function (entity, value) {
									if (value && value.length > 0 && entity.FontHeight === 0) {
										entity.FontHeight = 20;
									}
								}
							},
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.textFontHeight',
								type: 'integer',
								model: 'FontHeight',
								visible: true,
								sortOrder: 100,
								readonly: false
							},
							{
								gid: 'color',
								label$tr$: 'model.wdeviewer.lineWidth',
								model: 'lineWidth',
								type: 'integer',
								visible: !isNoPoint && !isTextMarkup && !isHighlighter,
								sortOrder: 100,
								readonly: false
							}, {
								gid: 'color',
								label$tr$: 'model.wdeviewer.linePattern',
								model: 'linePattern',
								type: 'select',
								options: {
									items: [
										{id: Module.MarkupPointStyle.Default.value, value: Module.MarkupPointStyle.Default.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.none') },
										{id: Module.MarkupPointStyle.Tick.value, value: Module.MarkupPointStyle.Tick.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.tick') },
										{id: Module.MarkupPointStyle.Cross.value, value: Module.MarkupPointStyle.Cross.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.cross') },
										// {id: Module.MarkupPointStyle.Arrow.value, value: Module.MarkupPointStyle.Arrow.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.arrow') },
										// {id: Module.MarkupPointStyle.Star.value, value: Module.MarkupPointStyle.Star.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.star') },
									],
									valueMember: 'value',
									displayMember: 'caption',
									modelIsObject: false,
								},
								visible: isNoPoint && !isHighlighter,
								sortOrder: 100,
								readonly: false
							},{
								gid: 'color',
								label$tr$: 'model.wdeviewer.markerFillColor',
								type: 'color',
								model: 'FillColor',
								visible: needFillColor && !isHighlighter,
								sortOrder: 101,
								readonly: false,
								options: { showHashCode: true, showClearButton: true, valueMember: 'FillColor' }
							},{
								gid: 'color',
								label$tr$: 'model.wdeviewer.markerRegionShape',
								type: 'select',
								options: {
									items: [
										{id: 1, value: Module.MarkupRegionShape.Rectangle.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.rectangle') },
										{id: 2, value: Module.MarkupRegionShape.Ellipse.value, type: 'item', caption: $translate.instant('model.wdeviewer.markup.ellipse') },
									],
									valueMember: 'value',
									displayMember: 'caption',
									modelIsObject: false,
								},
								model: 'RegionShape',
								visible: needFillColor && !isHighlighter,
								sortOrder: 101,
								readonly: false
							}
						]
					},
					dataItem: markerParam
				};
			};


			service.showDialog = function (markerParam) {
				let options = service.configDialogOptions(markerParam);
				let linePattern = markerParam.markupStyle.linePatternId;
				if (linePattern === 0 && markerParam.markupStyle.endPointStyle.value > 0) {
					linePattern = markerParam.markupStyle.endPointStyle.value;
				}
				let fillColor = markerParam.markupStyle.fillColour === '#00000000'
					? '0' : service.hexColorToInt(markerParam.markupStyle.fillColour);
				options.dataItem.Color = markerParam.color;
				options.dataItem.Comment = markerParam.text;
				options.dataItem.AnnotationRawType = (markerParam.RawType > 0);
				options.dataItem.FontHeight = markerParam.height;
				options.dataItem.linePattern = linePattern;
				options.dataItem.FillColor = fillColor;
				options.dataItem.RegionShape = markerParam.markupStyle.shape;
				if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.additionConfigDialogOption) {
					modelWdeViewerMarkupService.annoExtensionService.additionConfigDialogOption(options);
				}
				options.dialogOptions = {
					disableOkButton: function disableOkButton() {
						return modelWdeViewerMarkupService.isCreateing === true;
					}
				};
				platformTranslateService.translateFormConfig(options.formConfiguration);
				$injector.get('platformRuntimeDataService').readonly(options.dataItem, [{field: 'AnnotationDescription', readonly: (markerParam.RawType > 0)}]);
				return platformModalFormConfigService.showDialog(options);
			};

			function initDialogData(markerParam, engine) {
				let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, {MarkerId: markerParam.id});
				markerParam.color = service.hexColorToInt(markerParam.markupStyle.colour);
				if (markerParam.height === 0 || !markerParam.height || markerParam.isNewMarkup){
					markerParam.height = modelWdeViewerMarkupService.currentSetting.fontHeight;
				}
				if (!markerParam.isNewMarkup) {
					if (!markerParam.markupStyle) {
						markerParam.markupStyle = convertIgeMarkup(markerParam.id, engine).style;
					}
					markerParam.lineWidth = angular.copy(markerParam.markupStyle.lineThickness);
					const color = (findMarkerItem && findMarkerItem.defaultColor) ? findMarkerItem.defaultColor : markerParam.markupStyle.colour;
					markerParam.color = service.hexColorToInt(color);
				}
				markerParam.isReadOnlyColor = false;
				// Annotation color
				let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
				let annoId = (findMarkerItem && findMarkerItem.AnnotationFk) ? findMarkerItem.AnnotationFk : 0;
				let annoItem = _.find(modelWdeViewerAnnotationService.annotationItems, {Id: annoId});
				var currentAnnoDto = {Id: annoId};
				modelWdeViewerAnnotationService.currentAnnotationType(currentAnnoDto);
				if (findMarkerItem && annoItem) {
					markerParam.RawType = annoItem.RawType;
					markerParam.AnnotationDescription = annoItem.DescriptionInfo.Translated ? annoItem.DescriptionInfo.Translated : annoItem.DescriptionInfo.Description;
				}
				let isTakeOffMode = $injector.get('modelWdeViewerSelectionService').isTakeOffEnabled();
				if (modelWdeViewerAnnotationService.isCreateMultipleMarkers === true && markerParam.isNewMarkup === true
					&& annoId === 0 && isTakeOffMode && modelWdeViewerAnnotationService.isSameParentRelate !== false) {
					annoId = modelWdeViewerAnnotationService.annotationId;
					annoItem = _.find(modelWdeViewerAnnotationService.annotationItems, {Id: annoId});
					if (annoItem && annoItem.Color) {
						markerParam.color = annoItem.Color;
						markerParam.isReadOnlyColor = true;
						markerParam.RawType = annoItem.RawType;
						markerParam.AnnotationDescription = annoItem.DescriptionInfo.Translated ? annoItem.DescriptionInfo.Translated : annoItem.DescriptionInfo.Description;
					}
				}
				if (annoItem && annoItem.RawType > 0) {
					markerParam.AnnotationDescription = modelWdeViewerAnnotationService.currentTempDescription;
				} else if (!annoItem) {
					markerParam.RawType = currentAnnoDto.RawType;
					let annoRawType = currentAnnoDto.RawType > 0;
					if (annoRawType) {
						markerParam.AnnotationDescription = modelWdeViewerAnnotationService.currentTempDescription;
					}
				}
				if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.additionParamEditDialog) {
					modelWdeViewerMarkupService.annoExtensionService.additionParamEditDialog(markerParam);
				}
			}

			service.showMarkerEditDialog = function (markerParam, engine) {
				initDialogData(markerParam, engine);
				service.showDialog(markerParam).then(function(result) {
					if (result.ok) {
						let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
						let isAnnoSave = false;
						modelWdeViewerAnnotationService.AnnotationRawType = (result.data.AnnotationRawType === true);
						modelWdeViewerAnnotationService.UseAnnoRawType = service.isUseAnnoRawType;

						let isUpdateMarkup = false;
						let updateMarkup = convertIgeMarkup(markerParam.id, engine).style;
						let drawingUtil = $injector.get('basicsCommonDrawingUtilitiesService');
						const isDefaultColor = (result.data.FillColor === null || result.data.FillColor === 0) && markerParam.markupStyle.fillColour === '#00000000';
						if (markerParam.markupStyle.fillColour !== result.data.FillColor && !isDefaultColor) {
							if (result.data.FillColor && result.data.FillColor > 0) {
								isUpdateMarkup = true;
								updateMarkup.fillColour = drawingUtil.decToHexColor(result.data.FillColor) + '80'; // 80 = transparency
							} else if (result.data.FillColor === 0 || result.data.FillColor === '0' || result.data.FillColor === null){
								isUpdateMarkup = true;
								updateMarkup.fillColour = '#00000000';
							}
						}
						if (result.data.linePattern !== markerParam.markupStyle.linePatternId) {
							updateMarkup.linePatternId = result.data.linePattern;
							let pointStyleValue = getEndPointStyle(result.data.linePattern);
							updateMarkup.endPointStyle = pointStyleValue;
							if (pointStyleArray.indexOf(markerParam.markupStyle.endPointStyle) > -1) {
								updateMarkup.startPointStyle = pointStyleValue;
							}
						}
						if (markerParam.markupStyle.shape !== result.data.RegionShape) {
							updateMarkup.shape = result.data.RegionShape;
						}
						if (result.data.Color !== markerParam.color || markerParam.isReadOnlyColor === true || result.data.lineWidth !== markerParam.lineWidth) {
							isUpdateMarkup = true;
							let hexColor = drawingUtil.decToHexColor(result.data.Color);
							updateMarkup.colour = hexColor;
							updateMarkup.lineThickness = result.data.lineWidth;
							let findMarkerItem = _.find(modelWdeViewerMarkupService.commentMarkups, { MarkerId: markerParam.id });
							if (findMarkerItem && findMarkerItem.AnnotationFk) {
								isAnnoSave = true;
								modelWdeViewerAnnotationService.updateAnnoColor(findMarkerItem.AnnotationFk, result.data.Color, hexColor, markerParam.id, result.data.AnnotationDescription);
							}
						}
						if (markerParam.markupStyle.colour.length === 9 && markerParam.markupStyle.colour.endsWith('80')) {
							if (updateMarkup.colour.length === 7) {
								updateMarkup.colour = updateMarkup.colour + '80'; // 80 = Color transparency
							}
							updateMarkup.fillColour = updateMarkup.colour;
						}
						if (isUpdateMarkup) {
							if (result.data.Comment !== markerParam.text || result.data.FontHeight !== markerParam.height) {
								modelWdeViewerMarkupService.lockMarkupUpdateId = 'notSaveMarkup';
							}
							engine.updateMarkupStyle(markerParam.id, updateMarkup);
						}
						modelWdeViewerMarkupService.lockMarkupUpdateId = null;
						if (result.data.Comment !== markerParam.text || result.data.FontHeight !== markerParam.height) {
							modelWdeViewerAnnotationService.updateAnnoMarkerDescription(markerParam.id, result.data.Comment);
							engine.updateMarkupText(markerParam.id, result.data.Comment, result.data.FontHeight);
						}
						if (result.data.AnnotationDescription !== markerParam.AnnotationDescription && !isAnnoSave) {
							modelWdeViewerAnnotationService.updateAnnotationDescription(markerParam.id, result.data.AnnotationDescription);
						}
						if (modelWdeViewerMarkupService.annoExtensionService && modelWdeViewerMarkupService.annoExtensionService.editDialogCallBack) {
							modelWdeViewerMarkupService.annoExtensionService.editDialogCallBack(markerParam.id, result.data);
						}
					}
				});
			};

			function getEndPointStyle(value){
				switch (value) {
					case Module.MarkupPointStyle.Default.value:
					case Module.MarkupPointStyle.Default:
						return Module.MarkupPointStyle.Default;
					case Module.MarkupPointStyle.Tick.value:
					case Module.MarkupPointStyle.Tick:
						return Module.MarkupPointStyle.Tick;
					case Module.MarkupPointStyle.Cross.value:
					case Module.MarkupPointStyle.Cross:
						return Module.MarkupPointStyle.Cross;
					case Module.MarkupPointStyle.Arrow.value:
					case Module.MarkupPointStyle.Arrow:
						return Module.MarkupPointStyle.Arrow;
					case Module.MarkupPointStyle.Star.value:
					case Module.MarkupPointStyle.Star:
						return Module.MarkupPointStyle.Star;
					case Module.MarkupPointStyle.NotVisible.value:
					case Module.MarkupPointStyle.NotVisible:
						return Module.MarkupPointStyle.NotVisible;
				}
				return Module.MarkupPointStyle.Default;
			}
			function convertIgeMarkup(markerId, engine) {
				let markupData = engine.getMarkup(markerId);
				return {
					id: markupData.id,
					fontHeight: markupData.fontHeight,
					style: {
						colour: markupData.style.colour,
						endPointStyle: getEndPointStyle(markupData.style.endPointStyle),
						fillColour: markupData.style.fillColour,
						flags: markupData.style.flags,
						lineOptions: markupData.style.lineOptions,
						linePatternId: markupData.style.linePatternId,
						lineThickness: markupData.style.lineThickness,
						shape: markupData.style.shape,
						startPointStyle: getEndPointStyle(markupData.style.startPointStyle)
					},
					text: markupData.text,
				};
			}

			service.hexColorToInt = function hexColorToInt(colour) {
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
			};

			service.onShowText = function onShowText(id, scope, engine, text) {
				if (scope.popupOpen) {
					scope.markupTextInstance.close();
					scope.popupOpen = false;
					return;
				}
				scope.markupTextValue = text;
				let inputElement = angular.element('<div/>');
				inputElement.css({
					position: 'absolute',
					left: scope.mousePosition_clientX + 'px',
					top: scope.mousePosition_clientY + 'px',
				});
				angular.element('body').append(inputElement);
				const popupOptions = {
					scope: scope,
					multiPopup: false,
					plainMode: true,
					width: 140,
					hasDefaultWidth: true,
					focusedElement: inputElement,
					template: '<textarea rows="3" style="padding: 5px" id="markupTextInput" class="k-content-frame" data-ng-model="markupTextValue" data-ng-change="markupTextChange(markupTextValue)" data-ng-blur="markupTextBlur()" data-ng-keyup="markupTextKeyUp($event)"></textarea>'
				};
				scope.markupTextInstance = basicsLookupdataPopupService.showPopup(popupOptions);
				scope.markupTextInstance.opened.then(function openCallback(i) {
					$timeout(function () {
						angular.element('#markupTextInput').focus();
					}, 100);
					scope.popupOpen = true;
				});

				scope.markupTextInstance.closed.then(function closeCallback(i) {
					// delete ‘no text markup’ when closed and go next markup
					const lastMarkup = _.last(modelWdeViewerMarkupService.commentMarkups);
					if (lastMarkup && lastMarkup.Description !== null && lastMarkup.Description.length < 1) {
						modelWdeViewerMarkupService.deleteMarkup(engine, lastMarkup);
						let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
						if (modelWdeViewerAnnotationService.activeMarker) {
							engine.createMarkup(modelWdeViewerAnnotationService.activeMarker.markupType, modelWdeViewerAnnotationService.activeMarker.defaultMarkupStyle);
						}
					}
					scope.popupOpen = false;
				});

				scope.markupTextChange = function (value) {
					scope.markupTextValue = value;
				}
				scope.markupTextBlur = function () {
					updateText();
					scope.markupTextInstance.close();
				}
				scope.markupTextKeyUp = function (event) {
					if (event.key === 'Enter') {
						updateText();
						scope.markupTextInstance.close();
					}
				}

				function updateText() {
					if (text === scope.markupTextValue) {
						return;
					}
					let modelWdeViewerAnnotationService = $injector.get('modelWdeViewerAnnotationService');
					modelWdeViewerAnnotationService.updateAnnoMarkerDescription(id, scope.markupTextValue);
					engine.updateMarkupText(id, scope.markupTextValue, modelWdeViewerMarkupService.currentSetting.fontHeight);
					if (modelWdeViewerAnnotationService.activeMarker) {
						engine.createMarkup(modelWdeViewerAnnotationService.activeMarker.markupType, modelWdeViewerAnnotationService.activeMarker.defaultMarkupStyle);
					}
				}
			}
			return service;
		}
	]);

})(angular);
