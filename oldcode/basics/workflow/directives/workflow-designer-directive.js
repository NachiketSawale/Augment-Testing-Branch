(function (angular) {
	/* global d3, $ */
	'use strict';

	/**
	 * @ngdoc directive
	 * @name basics:workflow:workflowDesignerContainer
	 * @element div
	 * @restrict A
	 * @description
	 * Workflow-Designer Module
	 * @example
	 <doc:example>
	 <doc:source>
	 <div data-workflow-designer-container data-selected-item="item.current" data-workflow="data.workflow" on-resize="onContentResized"></div>
	 </doc:source>
	 </doc:example>
	 */
	angular.module('basics.workflow').directive('workflowDesignerContainer',
		['basicsWorkflowTemplateService', 'platformModuleStateService', 'basicsWorkflowActionType', '_', 'math', 'actionParamValidatorFactory', 'parameterValidatorFactory', 'basicsWorkflowActionValidationUtilService', 'platformModalService', '$rootScope',
			function (basicsWorkflowTemplateService, platformModuleStateService, basicsWorkflowActionType, _, math, actionParamValidatorFactory, parameterValidatorFactory, util, platformModalService, $rootScope) {

				return {
					restrict: 'A',
					scope: {
						workflow: '=',
						selectedItem: '=',
						onResize: '='
					},
					link: linkFct
				};

				function linkFct(scope, element) {

					var state = platformModuleStateService.state('basics.workflow');
					var _ = util._;

					var setY = 20;
					var yTotal = 0;
					var xTotal = 0;

					// create svg-main-html-code
					var svgContainer = d3.select(element[0]).append('svg')
						.classed('workflow_designer', true)
						.append('g');

					var designerDOM = $('.workflow_designer');
					var designerParentDOM = designerDOM.parent();
					var designerHasData = false;

					// region designer scaling/zoom

					designerDOM.css('-webkit-transform-origin: 0 0');
					var scale = 1.0;
					var designerWidth;
					var designerHeight;

					// register designer scaling
					scope.onResize(scaleDesigner);

					designerDOM.mousewheel(function (event, delta) {
						if (designerHasData) {
							scale = math.round(scale * 10) / 10;
							var offSetX = event.offsetX;
							var offSetY = event.offsetY;

							if (delta > 0 && scale < 3) {
								scale += 0.1;
							}

							if (delta < 0 && scale > 0.2) {
								scale -= 0.1;
							}

							scaleDesigner(offSetX, offSetY);
							event.preventDefault();
						}
					});

					function scaleDesigner(offSetX, offSetY) {
						if (designerHasData) {
							scale = math.round(scale * 10) / 10;
							// thickness of the horizontal scroll bar
							var xScrollBarThickness = 0;
							// thickness of the vertical scroll bar
							var yScrollBarThickness = 0;

							// reduce the canvas vertical size by the scroll horizontal bar thickness
							if (designerWidth * scale > designerParentDOM.width()) {
								xScrollBarThickness = 20;
							}

							// reduce the canvas horizontal size by the scroll vertical bar thickness
							if (designerHeight * scale > designerParentDOM.height()) {
								yScrollBarThickness = 20;
							}

							svgContainer.node().setAttribute('transform', `scale(${scale})`);
							var newWidth = math.floor(math.max(designerParentDOM.width() - yScrollBarThickness, designerWidth * scale));
							var newHeight = math.floor(math.max(designerParentDOM.height() - xScrollBarThickness, designerHeight * scale));
							var scrollPixelsToLeft;
							var scrollPixelsToRight;

							if (offSetX && offSetY) {
								var pixelsToLeft = designerParentDOM.scrollLeft();
								var pixelsToTop = designerParentDOM.scrollTop();

								var relativeXPos = offSetX - pixelsToLeft;
								var relativeYPos = offSetY - pixelsToTop;
								// console.log(relativeXPos + ', ' + relativeYPos);

								scrollPixelsToLeft = newWidth * offSetX / designerDOM.width() - relativeXPos;
								scrollPixelsToRight = newHeight * offSetY / designerDOM.height() - relativeYPos;

								designerParentDOM.scrollLeft(scrollPixelsToLeft);
								designerParentDOM.scrollTop(scrollPixelsToRight);
							}

							designerDOM.width(newWidth).height(newHeight);
						}
					}

					// endregion

					// region designer drag

					var currentXPos, currentYPos, pixelsToTop, pixelsToLeft, dragging;

					designerDOM.mousedown(function (event) {
						if (designerHasData) {
							event.preventDefault();
							dragging = true;
							currentXPos = event.pageX;
							currentYPos = event.pageY;
							pixelsToTop = designerParentDOM.scrollTop();
							pixelsToLeft = designerParentDOM.scrollLeft();
							designerDOM.css('cursor', 'grabbing');
						}
					});

					designerDOM.mousemove(function (event) {
						if (dragging) {
							var newXPos = event.pageX;
							var newYPos = event.pageY;

							designerParentDOM.scrollLeft(pixelsToLeft - newXPos + currentXPos);
							designerParentDOM.scrollTop(pixelsToTop - newYPos + currentYPos);
						}
					});

					designerDOM.mouseup(function () {
						if (designerHasData) {
							dragging = false;
							designerDOM.css('cursor', 'grab');
						}
					});

					designerParentDOM.mouseleave(function () {
						if (designerHasData) {
							dragging = false;
							designerDOM.css('cursor', 'grab');
						}
					});

					// endregion

					function editWorkflowJsonData(workflowAction, xLevel, yLevel) {

						if (angular.isDefined(workflowAction)) {
							var xCoordinate = 180;
							var yCoordinate = 188;
							// startnode -> !.workflowAction
							var elementData = workflowAction.workflowAction ? workflowAction.workflowAction : workflowAction;

							getSVGElement(workflowAction, elementData, xLevel, yLevel);

							// next 'child'-Element shifts by 180px to the right
							xLevel += xCoordinate;

							if (elementData.transitions && elementData.transitions.length) {
								for (var i = 0; i < elementData.transitions.length; i++) {

									// ohne merken == keine transitions zu childs(unter Elemenente). 'decision node'
									if ((elementData.transitions.length > 1) && (i === 0)) {
										elementData.level = xLevel - xCoordinate;
									}

									setY = ((i * yCoordinate) + yLevel);

									if (setY <= yTotal) {
										// 188 -> next y-wert
										setY = yTotal + yCoordinate;
									}

									// first thing: draw line. Curved or straight line -> branch in for
									var moreThenOneElem = (i > 0);
									var xStartPosition = xLevel - xCoordinate;
									var yStartPosition = yLevel + 92; // +92 -> y-position on bottom

									// moreThenOneElem == curvedline, has childs elements(decision node)
									var inputParameters = {
										x: xStartPosition,
										y: moreThenOneElem ? yStartPosition : yLevel,
										editCurvedLine: moreThenOneElem,
										childIndex: moreThenOneElem ? i - 1 : 0,
										_parentX: moreThenOneElem ? elementData.level : xLevel
									};

									setLineArrow(inputParameters);

									// drawing transition rect. black box with white font
									if (elementData.transitions[i].parameter) {
										var xPositionForTransitionRect = xLevel - 45;
										setTransitionsRect(elementData.transitions[i].parameter, elementData.transitions[i].description, xPositionForTransitionRect, setY, elementData.transitions[i].id);
									}

									if (elementData.transitions[i] !== null) {
										editWorkflowJsonData(elementData.transitions[i], xLevel, setY);
									}
								}
								yTotal = setY;

								if (xLevel > xTotal) {
									xTotal = xLevel;
								}
							}
						}
					}

					function getSVGElement(svgtype, childElement, x, y) {
						if (childElement.actionTypeId === basicsWorkflowActionType.decision.id) {
							setDecision(childElement, x, y, svgtype.id);
						} else {
							setRectAction(childElement, x, y, svgtype.id);
						}
					}

					function removeSVGChildsInDOM() {
						svgContainer.selectAll('*').remove();
					}

					function getElementCSSClass(typeId) {
						if (typeId) {
							return basicsWorkflowActionType.getById(typeId).designerCss;
						}
					}

					function setRectAction(type, x, y, id) {

						var grect = svgContainer.append('g')
							.attr('id', id)
							.classed('groupWrapper ' + getElementCSSClass(type.actionTypeId) + ' child' + type.id, true)
							.on('click', workflowClicked);

						var rect = grect.append('rect')
							.classed('workflowItem ' + getElementCSSClass(type.actionTypeId), true)
							.attr('x', x)
							.attr('y', y)
							.attr('width', 125)
							.attr('height', 73);

						if (type.actionTypeId === 1 || type.actionTypeId === 2) {
							rect.attr('rx', 40).attr('ry', 40);
						}

						setActionImage(x, y, type.actionTypeId, grect);
						setActionWarningImage(x, y, type, grect);

						// styling for rect-text
						var textwidth = 125;
						var textheight = 74;
						var inputParameters = {
							elem: 'rect',
							parentElem: grect,
							description: type.description,
							x: x,
							y: y,
							width: textwidth,
							height: textheight
						};
						setSVGText(inputParameters);
					}

					function setTransitionsRect(param, desc, x, y, id) {

						// am soll später des rect automatisch an Text anpassen.
						var grect = svgContainer.append('g')
							.on('click', workflowClicked)
							.classed('transitionGroup', true)
							.attr('id', id);

						grect.append('rect')
							.classed('workflowItem transition', true)
							.attr('x', x)
							.attr('y', y)
							.attr('width', 26)
							.attr('height', 80)
							.on('mouseover', onMouseOver)
							.on('mouseout', onMouseOut);

						function onMouseOver() {
							if (!desc || desc.length === 0) {
								return;
							}

							var toolTipGroup = d3.select('svg.workflow_designer')
								.append('g')
								.classed('tooltip', true)
								.style('opacity', 1);

							toolTipGroup
								.append('rect')
								.attr('x', x - 30)
								.attr('y', y + 92)
								.attr('width', 125)
								.attr('height', 50)
								.styles({
									'fill': 'lightyellow',
									'stroke': 'darkgray'
								})
								.transition().style('opacity', 1);

							// styling for rect-text
							var textwidth = 125;
							var textheight = 50;
							var inputParameters = {
								elem: 'text',
								parentElem: toolTipGroup,
								description: desc,
								x: x - 30,
								y: y + 92,
								width: textwidth,
								height: textheight
							};
							setSVGText(inputParameters);
						}

						function onMouseOut() {
							d3.selectAll('g.tooltip')
								.transition().style('opacity', 0).remove();
						}

						// Problem: Text lass sich nicht beim ersten automatisch vertical zentrieren. Wenn der Textlänge < 6
						var yPosition = (param.length < 6) ? (y + 5) : (y + 7);
						var yPositionForRotate = yPosition + 8;
						var rotateValue = 270;
						var xPositionForTextInRect = 25;

						grect.append('text')
							.attr('x', x)
							.attr('y', yPosition)
							.text(param)
							.attr('transform', 'rotate(' + rotateValue + ' ' + (x + xPositionForTextInRect) + ', ' + yPositionForRotate + ')');
					}

					function setDecision(type, x, y, id) {
						var grect = svgContainer.append('g')
							.on('click', workflowClicked)
							.attr('id', id)
							.classed('groupWrapper ' + getElementCSSClass(type.actionTypeId) + ' child' + type.id, true);

						var startXPosition = x + 7;
						var startAndThirdYPosition = y + 36;
						// decision width: 112. Highest Position is in the middle from start-x and third-x(horizontal x-positions) -> 56
						var secondBottomTopXPosition = startXPosition + 56;
						// -20 because: is higher then rect-elements
						var secondTopYPositions = y - 20;
						// 112 -> decision-element-width. And parallel to first x position
						var thirdXPosition = startXPosition + 112;
						// y-length from decision element
						var bottomYPosition = y + 92;

						grect.append('path')
							.classed('workflowItem', true)
							.attr('stroke-width', 3)
							.attr('d', 'M ' + startXPosition + ' ' + startAndThirdYPosition + ' L ' + secondBottomTopXPosition + ' ' + secondTopYPositions + ' L ' + thirdXPosition + ' ' + startAndThirdYPosition + ' L ' + secondBottomTopXPosition + ' ' + bottomYPosition + ' z');

						// styling for decision text. Another form, another position and sizing.
						var textwidth = 100;
						var textheight = 54;
						var inputParameters = {
							elem: 'decision',
							parentElem: grect,
							description: type.description,
							x: x + 10,
							y: y + 10,
							width: textwidth,
							height: textheight
						};
						setSVGText(inputParameters);
					}

					/*
					 Placed text in decision or in rect-node. Difference in parameters.elem.
					 Multiple lines divided into tspan-tags.
					 */
					function setSVGText(parameters) {
						var startXPosSVGText = parameters.x + (parameters.width / 2);
						var startYPosSVGText = parameters.y + (parameters.height / 2) + 2;
						var textInRectMaxWidth = (parameters.elem === 'decision') ? 80 : 110;

						var textTag = parameters.parentElem.append('text')
							.attr('x', startXPosSVGText)
							.attr('y', startYPosSVGText);

						/*
						 Text width is needed: Add sporadic the text in text-svg, get width of this and empty text again
						 */
						var textTagWidth = textTag.text(parameters.description).node().getComputedTextLength();
						textTag.text('');

						// if text in svg-text longer then rect
						if (textTagWidth > textInRectMaxWidth) {
							// for e.g. double spaces
							var words = parameters.description.match(/[^\\'"\s]+/g).reverse(),
								word,
								line = [],
								tspanDyValue = -7,
								tspanCount = 0;

							var tspan = textTag.append('tspan')
								.classed('firstTSpan', true);

							// repeat until it is empty
							while (words.length > 0) { // jshint ignore:line
								word = words.pop();
								line.push(word);
								tspan.text(line.join(' '));

								// getWidth text up now
								var tspanSize = tspan.node().getComputedTextLength();

								if (tspanSize > textInRectMaxWidth) {
									if (line.length < 2 && line.toString().indexOf(' ') < 0) {
										// text is long but without a space --> Split text in rows
										var _accepted;
										_accepted = line.toString().substring(0, 17) + '-';
										tspan.text(_accepted);
										setSVGTextAttributes();
										word = line.toString().substring(17);
									} else {
										line.pop();
										// add line content with a space in svg-text
										tspan.text(line.join(' '));
										setSVGTextAttributes();
									}

									line = [];
									/*
									 e.g .: 'word' is the last item in 'array'. Then no longer bounces in the 'while' loop.
									 The last word will not be issued
									 */
									words.push(word);
									tspanCount++;
								}
							}
							// first tspan get a dy-value. reduce distance to the top
							parameters.parentElem.select('tspan.firstTSpan').attr('dy', (tspanDyValue * tspanCount) + 'px');
						} else {
							textTag.append('tspan').text(parameters.description);
						}

						function setSVGTextAttributes() {
							tspan = textTag.append('tspan')
								.attr('dy', '15px')
								.attr('x', startXPosSVGText);
						}
					}

					function setLineArrow(parameters) {
						if ((parameters._parentX <= parameters.x) && (parameters.x !== 0) && (parameters.editCurvedLine)) {

							var curvedStartPosition = setY - 46;
							var curvedTopEndPosition = curvedStartPosition + 82;
							var arrowStartPosition = curvedTopEndPosition - 5;
							var arrowBottomPosition = curvedTopEndPosition + 5;

							var curveBeginXPosition = parameters._parentX + 56 + 7;
							var curveEndXPosition = parameters._parentX + 56 + 111;
							var curveArrowTopXPosition = curveEndXPosition + 10;

							svgContainer.append('path')
								.attr('style', 'fill:none;stroke:black;stroke-width:3px;')
								.attr('d', 'M ' + curveBeginXPosition + ',' + parameters.y + 'L ' + curveBeginXPosition + ',' + curvedStartPosition + ' q -5,87 60,82 L ' + curveEndXPosition + ' ' + curvedTopEndPosition);

							// arrow: start x/y --> x+10/y+5 --> x/y+10
							svgContainer.append('path')
								.attr('style', 'fill:black')
								.attr('d', 'M ' + curveEndXPosition + ' ' + arrowStartPosition + ' L ' + curveArrowTopXPosition + ' ' + curvedTopEndPosition + ' L ' + curveEndXPosition + ' ' + arrowBottomPosition + ' z');

						} else {
							// 128 -> start x-position from a svg-element + width(127) -> new Position
							var startLinePositionX = parameters.x + 128;
							// 40 -> line-length
							var endLinePositionX = startLinePositionX + 40;
							// 37 -> middle x position from svg-element
							var lineYPosition = parameters.y + 37;
							var arrowYTopPosition = lineYPosition - 5;
							var arrowYBottomPosition = lineYPosition + 5;
							var arrowXRightPosition = endLinePositionX + 10;

							// drawing line
							svgContainer.append('path')
								.attr('style', 'fill:none;stroke:black;stroke-width:3px;')
								.attr('d', 'M ' + startLinePositionX + ' ' + lineYPosition + ' L ' + endLinePositionX + ' ' + lineYPosition);

							// drawing arrow
							svgContainer.append('path')
								.attr('style', 'fill:black')
								.attr('d', 'M ' + endLinePositionX + ' ' + arrowYTopPosition + ' L ' + arrowXRightPosition + ' ' + lineYPosition + ' L ' + endLinePositionX + ' ' + arrowYBottomPosition + ' Z');
						}
					}

					function setActionImage(x, y, type, groupSVGElement) {

						if (!type) {
							return;
						}

						var _image = basicsWorkflowActionType.getById(type).image;

						if (_image !== '') {
							groupSVGElement.append('image')
								.attr('xlink:href', _image)
								.attr('height', '31')
								.attr('width', '31')
								.attr('x', (x - 15))
								.attr('y', (y - 15));
						}
					}

					function setActionWarningImage(x, y, action, groupSVGElement) {
						if (!action || util.isStartOrEnd(action)) {
							return;
						}

						const evaluation = actionParamValidatorFactory.actionParamValidator(action);

						if (evaluation.paramsChanged || evaluation.actionMissing) {
							let icon;
							if (evaluation.paramsChanged) {
								icon = basicsWorkflowActionType.getById(action.actionTypeId).warningIcon;
							} else if (evaluation.actionMissing) {
								icon = basicsWorkflowActionType.getById(action.actionTypeId).errorIcon;
							}

							if (icon !== '') {
								groupSVGElement.append('image')
									.on('click', function () {
										onWarningImageClick(evaluation, action);
									})
									.attr('xlink:href', icon)
									.attr('height', '31')
									.attr('width', '31')
									.attr('x', (x + 110))
									.attr('y', (y - 15))
									.on('mouseover', function () {
										d3.select(this).style('cursor', 'pointer');
									})
									.append('svg:title').text(evaluation.message);
							}
							if (evaluation.actionMissing) {
								drawNotAvailableIcon(x, y, groupSVGElement);
							}
						}
					}

					function onWarningImageClick(evaluation, action) {
						if (!state.selectedTemplateVersion.IsReadOnly) {
							let dialogMsg;
							if (evaluation.paramsChanged) {
								dialogMsg = 'basics.workflow.modalDialogs.validateCurrentAction';
							} else if (evaluation.actionMissing) {
								dialogMsg = 'basics.workflow.modalDialogs.deleteCurrentActionFromWorkflow';
							}
							platformModalService.showYesNoDialog(util.translate(dialogMsg) + ' ' + action.description, '', 'yes').then(function (result) {
								if (result.yes) {
									if (evaluation.paramsChanged) {
										parameterValidatorFactory.parameterValidator(action);
										$rootScope.$emit('workflow:actionRepaired');
									} else if (evaluation.actionMissing) {
										basicsWorkflowTemplateService.deleteElement(action, state.selectedTemplateVersion);
									}
								}
							});
						}
					}

					function drawNotAvailableIcon(x, y, groupSVGElement) {
						groupSVGElement.append('line')
							.style('stroke', 'red')
							.attr('x1', x + 10)
							.attr('y1', y + 10)
							.attr('x2', x + 125)
							.attr('y2', y + 73);

						groupSVGElement.append('line')
							.style('stroke', 'red')
							.attr('x1', x)
							.attr('y1', y + 73)
							.attr('x2', x + 115)
							.attr('y2', y + 10);

					}

					function checkSVGCurrentSize() {
						// -20 -> x begins at 10. And may be vertical-scroll
						var selector = $('.workflowDesignerContainer');
						var containerWidth = selector.width();
						var containerHeight = selector.height();

						/*
						 yTotal == the last top-y-position from a svg-tag
						 +20 --> padding top and bottom
						 73 -> height by rect-element
						 */
						designerHeight = yTotal + 20 + 73;

						/*
						 xTotal = maximum x-position. x-position from left side from svg-element
						 +125 -> width by rect-element.
						 +100 padding-right
						 */
						designerWidth = xTotal + 125 + 100;

						designerDOM.width(math.max(containerWidth, designerWidth)).height(math.max(containerHeight, designerHeight));
					}

					function workflowClicked() {
						removeSelectStyle();
						selectedElementStyle(d3.select(this));
						scope.$apply();
					}

					function removeSelectStyle() {
						// remove selected css-class in svg container
						svgContainer.selectAll('g.selected').classed('selected', false);
					}

					function setSelectedItem(element) {

						var elementId = angular.isString(element) ? element : element.attr('id');
						var elementData = basicsWorkflowTemplateService.getElemForAddTransition(state.selectedTemplateVersion.WorkflowAction, elementId);

						/*
						 click transition-Rect --> no Toolbar Selection allowed
						 actionTypId = 1 -> is a start node, and start node don't exist a workflowAction
						 */
						if ((elementData.actionTypeId === 1) || (element.attr('class') === 'transitionGroup')) {
							scope.selectedItem = elementData;
						} else {
							scope.selectedItem = elementData.workflowAction;
						}
					}

					function selectedElementStyle(elem) {
						if (elem) {

							setSelectedItem(elem);

							// add class for the selected elements
							elem.classed('selected', true);

							var splited = elem.attr('class').split(' ');

							var childCss;

							_.find(splited, function (item) {
								if (_.startsWith(item, 'child')) {
									childCss = item;
								}
							});

							processSelectedSVGElement(childCss); // jshint ignore:line
						}
					}

					/*
					 after add new element -> new element get the selection function.
					 Advantage -> user can quickly insert new elements without click an element before.
					 */

					// need?
					function selectLastElement() {
						if (basicsWorkflowTemplateService.getLastElement()) {
							selectedElementStyle(d3.select('g[id=\'' + basicsWorkflowTemplateService.getLastElement().id + '\']')); // jshint ignore:line
						}
					}

					function processSelectedSVGElement(selector) {
						var elem = d3.select('.' + selector);
						elem.classed('selected', true);
						var domElem = document.getElementsByClassName(selector)[0];
						if (domElem && domElem.scrollIntoView) {
							domElem.scrollIntoView({
								behavior: 'smooth',
								block: 'center',
								inline: 'center'
							});
						}
					}

					var alreadyProcessedTemplateId;

					scope.$watch(function () {
						return scope.selectedItem;
					}, function (newVal) {
						if (newVal) {
							removeSelectStyle();
							processSelectedSVGElement('child' + newVal.id);
						}
					});

					scope.$watch(function () {
							return scope.workflow;
						},
						function (newValue) {
							// delete all svg items
							removeSVGChildsInDOM();

							// new init
							yTotal = 0;
							xTotal = 0;

							if (angular.isDefined(newValue) && newValue !== null &&
								angular.isDefined(newValue.WorkflowAction) && newValue.WorkflowAction !== null) {
								editWorkflowJsonData(newValue.WorkflowAction, 10, 30);
							}

							// check svg-size
							checkSVGCurrentSize();

							// check: need??
							selectLastElement();

							if (scope.selectedItem && scope.selectedItem !== null) {
								processSelectedSVGElement('child' + scope.selectedItem.id);
							}

							if (newValue) {
								designerHasData = true;
								designerDOM.css('cursor', 'grab');

								// designer default settings
								if (alreadyProcessedTemplateId !== newValue.Id) {
									scale = 1.0;
									designerParentDOM.scrollLeft(0);
									designerParentDOM.scrollTop(0);
									alreadyProcessedTemplateId = newValue.Id;
								}

								scaleDesigner();
							}

						}, true);
				}
			}]);
})(angular);
