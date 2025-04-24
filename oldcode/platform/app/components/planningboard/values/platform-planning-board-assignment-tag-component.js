/* global d3: false */
(function () {
	'use strict';
	angular.module('platform').factory('planningBoardAssignmentTagComponent', ['basicsCustomizeReservationTypeIconService', 'platformStatusIconService', 'basicsCommonDrawingUtilitiesService', 'moment',
		function (basicsCustomizeReservationTypeIconService, platformStatusIconService,basicsCommonDrawingUtilitiesService, moment) {
			// monkey patching
			if (!d3.selection.prototype.parent) {
				d3.selection.prototype.parent = function selectParent() {
					return this.select(function () {
						return this.parentNode;
					});
				};
			}

			const hexColorCache = {}; // key: int (dec), valsue: rgba string

			return {
				assignmentTags: function assignmentTags() {
					// private 'static' stuff (functions and members)
					var calendarScale, supplierScale, mapService, tagConfig, statusIconItems, typeIconItems,
						showSameAssignments, useFilter, calendarDateStart, calendarDateEnd, calendarFrom, calendarTo, clickEvent, dragHandler,
						containerDimensions, supplierScrollValue, getCurrentZoomUnit;
					var marginLeft = 12;
					var tagHeight = 12;
					var tagWidth = 12;
					var tagWidthBig = 20;
					var defaultTagColor = 'rgba(180,180,180)';
					var lastCollisionParts = [];

					let allStatusIconItems = {};

					var _assignmentTags = function (selection) {
						function identify(assignment) {
							return mapService.id(assignment);
						}

						function getYPos(d) {
							const y = supplierScale(d, 'top');

							if (d.hasOwnProperty('top')) {
								return y + d.top;
							}
							return y + 0;
						}

						function parseDecToRgba(dec) {
							if (_.isString(dec) && dec.charAt('0') === '#') {
								dec = dec.substr(1);
							}
							let color = hexColorCache[+dec];

							if (!color) {
								let hexa = dec.toString(16);
								hexa.padStart(6, '0').slice('');
								let r = parseInt(hexa[0] + hexa[1], 16);
								let g = parseInt(hexa[2] + hexa[3], 16);
								let b = parseInt(hexa[4] + hexa[5], 16);
								let a = parseInt(hexa[6] + hexa[7], 16) / 255 || 1;
								color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
								hexColorCache[dec] = color;
							}

							return color;
						}

						function getBackgroundColorByConfig(id, items, decreaseFactor, bgcEntity) {
							let color;
							if (id) {
								if (!bgcEntity) {
									bgcEntity = items.find(sii => sii.Id === id && sii.BackgroundColor);
								}

								if (bgcEntity && bgcEntity.BackgroundColor) {
									let dec = +(bgcEntity.BackgroundColor);
									color = hexColorCache[dec];

									if (!color) {
										let hexa = dec.toString(16);
										hexa = hexa.padStart(6, '0').slice('');
										let r = parseInt(hexa[0] + hexa[1], 16) - decreaseFactor;
										let g = parseInt(hexa[2] + hexa[3], 16) - decreaseFactor;
										let b = parseInt(hexa[4] + hexa[5], 16) - decreaseFactor;
										let a = parseInt(hexa[6] + hexa[7], 16) / 255 || 1;
										color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
										hexColorCache[dec] = color;
									}
								}
							}
							return color;
						}

						function getTagBackgroundColor(item, config) {
							var color;
							switch (config.id) {
								case 'status':
									var status = mapService.status(item);
									if (status) {
										let statusIcon = allStatusIconItems[+status];
										if (statusIcon && statusIcon.BackgroundColor) {
											color = getBackgroundColorByConfig(statusIcon.Id, statusIconItems, 0, statusIcon) || parseDecToRgba(config.color);
										}
									}
									break;
								case 'type':
									var assignmentType = mapService.assignmentType(item);
									if (assignmentType) {
										color = parseDecToRgba(config.color) || getEmptyColor();
									} else {
										color = getEmptyColor();
									}
									break;
								case 'project':
									// black project color if same project
									if (showSameAssignments && item.areRelated) {
										color = 'rgb(0,0,0)';
									} else {
										var headerColor = mapService.headerColor(item);
										color = d3.interpolateRainbow(headerColor);
									}
									break;
								case 'validation':
									if (item.isValid && item.invalidItems.length > 0) {
										color = 'rgb(205,133,25)';
									} else if (item.isValid) {
										color = 'rgb(66,205,25)';
									} else {
										color = 'rgb(201,34,34)';
									}
									break;
								case 'ppsHeader':
									if(mapService.ppsHeaderColor)  {
										var ppsHeaderColor = mapService.ppsHeaderColor(item);
										if(ppsHeaderColor) {
											color = basicsCommonDrawingUtilitiesService.intToRgbColor(ppsHeaderColor);
											color = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.opacity + ')';
										}
										else {
											color = defaultTagColor;
										}
									}
									break;
								default:
									color = parseDecToRgba(config.color) || 'rgba(100,100,100)';
									break;
							}
							return color;
						}

						function getTagIcon(item, config) {
							var icon = '', iconId = 0;
							switch (config.id) {
								case 'status':
									var status = mapService.status(item);
									if (status) {
										let statusIcon = allStatusIconItems[+status];
										if (statusIcon && statusIcon.BackgroundColor) {
											iconId = statusIcon.icon;
										}

										if (iconId) {
											var resStatusIconPath = platformStatusIconService.getImageResById(iconId);
											icon = globals.appBaseUrl + 'cloud.style/content/images/status-icons.svg#' + resStatusIconPath.substr(resStatusIconPath.indexOf(' ') + 1);
										} else {
											icon = false;
										}
									} else {
										icon = false;
									}
									break;
								case 'type':
									var assignmentType = mapService.assignmentType(item);
									if (assignmentType) {
										typeIconItems.forEach(function (tii) {
											if (tii.Id === assignmentType) {
												iconId = tii.icon;
											}
										});

										if (iconId) {
											var resTypeIconPath = basicsCustomizeReservationTypeIconService.getImageResById(iconId);
											icon = globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#' + resTypeIconPath.substr(resTypeIconPath.indexOf('#'));
										} else {
											icon = false;
										}
									} else {
										icon = false;
									}
									break;
								case 'validation':
									if (item.isValid && item.invalidItems.length > 0) {
										icon = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-warning';
									} else if (!item.isValid) {
										icon = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-validation-error';
									} else {
										icon = false;
									}
									break;
								case 'project':
									icon = false;
									break;
								case 'ppsHeader':
									icon = false;
									break;
								default:
									console.warn('No icon defined for: ' + config.id);
									break;
							}

							return icon;
						}

						function getEdgeTagIcon(item, type) {
							var icon = '';
							if (_.isFunction(mapService.isLocked) && mapService.isLocked(item, type)) {
								// lock icon
								icon = globals.appBaseUrl + 'cloud.style/content/images/type-icons.svg#ico-event41';
							} else if (type === 'start') {
								// arrow left icon
								icon = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-rec-previous';
							} else if (type === 'end') {
								// arrrow right icon
								icon = globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-rec-next';
							}

							return icon;
						}

						function getEmptyIcon() {
							return globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-warning';
						}

						function getEmptyColor() {
							return 'rgba(100,100,100, .7)';
						}

						function getAssignmentXWidth(d, calendarToFromDiff) {
							if (!calendarToFromDiff) {
								calendarToFromDiff = calendarScale(d._startDateInMs) - calendarScale(d._endDateInMs);
							}
							return 1 > calendarToFromDiff ? 1 : calendarToFromDiff;
						}

						function getTagWidth(d, tagCount) {
							return tagWidthBig;// (getAssignmentXWidth(d) - marginLeft - marginRight) / tagCount;
						}

						function getTagCount(width, d) {
							// 3 = start + end + tag collection
							// 4 = start + end + tag collection + modified tag
							var reservedTagCounter = d.pBoardModified ? 4 : 3;
							return Math.floor((width - (tagWidth * reservedTagCounter)) / tagWidthBig); // 3 = start + end + tag collection
						}

						selection.raise();

						const calendarDateEndTime =  calendarDateEnd.toDate().getTime();
						const calendarDateStartTime =  calendarDateStart.toDate().getTime();

						const filteredSelection =selection.datum().filter(assignment =>
								supplierScale.verticalIndexObjReadOnly().hasOwnProperty(mapService.supplier(assignment))
								&& (assignment._startDateInMs - calendarDateEndTime <= -3600000 && assignment._endDateInMs - calendarDateStartTime >= 3600000)
							);

						var tags = selection.selectAll('g.tag-items')
							.data(filteredSelection, identify); // todo: filter maintainence

						var newTags = tags.enter()
							.append('g')
							.classed('tag-items', true)
							.on('mousedown', clickEvent);

						var tagClip = newTags.append('clip')
							.attr('id', function (d) {
								return 'clip' + mapService.id(d);
							});

						tagClip.append('rect')
							.attr('width', function (d) {
								return getAssignmentXWidth(d);
							})
							.attr('height', tagHeight)
							.classed('tag-clip', true);

						var changedTags;
						if (useFilter) {
							changedTags = tags.filter(function (d) {
								let s = d3.select(this);
								let dateFormat = mapService.from(s.datum()).creationData().format;
								return mapService.supplier(s.datum()) !== +s.attr('data-supplier') ||
									s.datum()._startDateInMs !== s.attr('data-from') ||
									s.datum()._endDateInMs !== s.attr('data-to');
							});

							if(changedTags.data().length > 0){
								let foundCollisionTags = [];
								changedTags.filter(function(changedTag) {
									const scopeThis = this;
									let collidingTags = tags.filter(tagComponent => {
										if (mapService.id(tagComponent) !== mapService.id(changedTag)) {
											let isColliding = false;
											let wasColliding = false;
											let currentZoomUnit = getCurrentZoomUnit();

											const isSameSupplier = mapService.supplier(tagComponent) === mapService.supplier(changedTag);
											if (isSameSupplier) {
												// is currently colliding
												isColliding = (moment(mapService.from(tagComponent))).startOf(currentZoomUnit).isSameOrBefore((moment(mapService.to(changedTag))).endOf(currentZoomUnit))
												&& (moment(mapService.to(tagComponent))).endOf(currentZoomUnit).isSameOrAfter((moment(mapService.from(changedTag))).startOf(currentZoomUnit));
											}

											if (!isColliding) {
												let s = d3.select(scopeThis);
												const wasSameSupplier = mapService.supplier(tagComponent) === +s.attr('data-supplier');
												if (wasSameSupplier) {
													let dateFormat = mapService.from(s.datum()).creationData().format;
													// was colliding and needs update
													wasColliding = (moment(mapService.from(tagComponent))).startOf(currentZoomUnit).isSameOrBefore(moment(s.attr('data-to')).endOf(currentZoomUnit))
													&& (moment(mapService.to(tagComponent))).endOf(currentZoomUnit).isSameOrAfter(moment(s.attr('data-from')).startOf(currentZoomUnit));
												}
											}

											return isColliding || wasColliding;
										}
										return false;
									});

									if (foundCollisionTags.length === 0) {
										foundCollisionTags = collidingTags;
									} else {
										foundCollisionTags.merge(collidingTags);
									}
								});
								let tagsToUpdateIds = [...changedTags.data().map(t => mapService.id(t)), ...foundCollisionTags.data().map(t => mapService.id(t))];

								changedTags = tags.filter(t => tagsToUpdateIds.includes(mapService.id(t)));
							}
						} else {
							changedTags = tags;
						}

						tags.exit().remove();

						var mergedTags = newTags.merge(changedTags);

						var clips = mergedTags.selectAll('rect.tag-clip');
						clips
							.attr('x', function (d) {
								return calendarScale(d._startDateInMs);
							})
							.attr('y', function (d) {
								return getYPos(d);
							});

						mergedTags
							.attr('data-supplier', function (d) {
								return mapService.supplier(d);
							})
							.attr('data-from', function (d) {
								return d._startDateInMs;
							})
							.attr('data-to', function (d) {
								return d._endDateInMs;
							})
							.attr('data-collision-id', function (d) {
								return d.collisionId;
							})
							.attr('display', function (d) {
								return _.isFunction(mapService.forMaintenance) && !mapService.forMaintenance(d) ? 'block' : 'none';
							})
							.attr('cursor',function(d){
								return (d.selectedFlag)? 'move' : 'pointer';
							});

						mergedTags.classed('disabled', (assignment) => {
							return assignment.Disabled;
						});

						mergedTags.each(function (d) {
							var tagItems = this;
							calendarFrom = calendarScale(d._startDateInMs);
							calendarTo = calendarScale(d._endDateInMs);
							var tagCount = getTagCount(getAssignmentXWidth(d, calendarTo - calendarFrom), d);
							var tagYPos = getYPos(d);
							d3.select(tagItems).call(dragHandler);

							// region tag backgrounds
							if (tagConfig) {
								var tagBackgrounds = d3.select(tagItems).selectAll('rect.tag-item-background')
									.data(tagConfig);

								var newTagBackgrounds = tagBackgrounds.enter()
									.append('rect')
									.attr('height', tagHeight)
									.attr('width', function () {
										return tagWidthBig;// getTagWidth(d, tagConfig.length); // rethink this part with config.length not optimal
									})
									.classed('tag-item tag-item-background', true);

								tagBackgrounds.exit().remove();
								var mergedTagBackgrounds = newTagBackgrounds.merge(tagBackgrounds);
								mergedTagBackgrounds
									.attr('y', tagYPos)
									.attr('x', function (config) {
										return calendarFrom + (tagWidthBig * config.sort) + marginLeft;
									})
									.attr('display', function (config) {
										return (config.sort <= tagCount - 1 && config.visible) ? 'block' : 'none';
									})
									.style('fill', function (config) {
										return getTagBackgroundColor(d, config);
									});
							}
							// endregion

							// region tag icons
							if (tagConfig) {
								// check if icon for the type of current tag should be shown
								var filteredConfig = _.filter(tagConfig, function (conf) {
									if (conf.icon) {
										return conf;
									}
								});

								var tagIcons = d3.select(tagItems).selectAll('image.tag-item-icon')
									.data(filteredConfig);

								var newTagIcons;
								newTagIcons = tagIcons.enter()
									.append('image')
									.attr('height', (tagHeight - 2))
									.attr('width', function () {
										return tagWidthBig - 2;
									})
									.classed('tag-item tag-item-icon', true);

								tagIcons.exit().remove();
								var mergedTagIcons = newTagIcons.merge(tagIcons);
								mergedTagIcons
									.attr('y', tagYPos + 1)
									.attr('x', function (config) {
										return calendarFrom + (tagWidthBig * config.sort) + marginLeft;
									})
									.attr('display', function (config) {
										return (config.sort <= tagCount - 1 && config.visible) ? 'block' : 'none';
									})
									.attr('xlink:href', function (config) {
										var tagIcon = getTagIcon(d, config);
										return tagIcon !== false ? tagIcon : '';
									});
							}
							// endregion

							// region collection tag
							var collectionTags = d3.select(tagItems).selectAll('rect.collection-tag')
								.data([d], identify);

							var newCollectionTags = collectionTags.enter()
								.append('rect')
								.attr('height', tagHeight)
								.attr('width', tagWidth)
								.style('fill', function (d) {
									return 'rgba(210,210,210)';
								})
								.classed('tag-item collection-tag', true);

							collectionTags.exit().remove();
							var mergedCollectionTags = newCollectionTags.merge(collectionTags);

							mergedCollectionTags
								.attr('y', tagYPos)
								.attr('x', function (d) {
									var reservedTagCounter = d.pBoardModified ? 3 : 2;
									return calendarTo - (tagWidth * reservedTagCounter);
								})
								.attr('display', function (d) {
									return tagConfig.length > tagCount ? 'block' : 'none';
								});

							// collection image
							var collectionTagImages = d3.select(tagItems).selectAll('image.collection-image')
								.data([d], identify);

							var newCollectionTagImages = collectionTagImages.enter()
								.append('image')
								.attr('width', function (d) {
									return '12px';
								})
								.attr('height', function (d) {
									return '12px';
								})
								.attr('xlink:href', globals.appBaseUrl + 'cloud.style/content/images/tlb-icons.svg#ico-menu')
								.classed('tag-image collection-image', true);

							collectionTagImages.exit().remove();
							var mergedCollectionTagImages = newCollectionTagImages.merge(collectionTagImages);

							mergedCollectionTagImages
								.attr('y', tagYPos)
								.attr('x', function (d) {
									var reservedTagCounter = d.pBoardModified ? 3 : 2;
									return calendarTo - (tagWidth * reservedTagCounter);
								})
								.attr('display', function (d) {
									return tagConfig.length > tagCount ? 'block' : 'none';
								});
							// endregion

							// region modified tag
							var modifiedTags = d3.select(tagItems).selectAll('rect.modified-tag')
								.data([d], identify);

							var newModifiedTags = modifiedTags.enter()
								.append('rect')
								.attr('height', tagHeight)
								.attr('width', tagWidth)
								.style('fill', function (d) {
									return 'rgb(197, 197, 197)';
								})
								.classed('tag-item modified-tag', true);

							modifiedTags.exit().remove();
							var mergedModifiedTags = newModifiedTags.merge(modifiedTags);

							mergedModifiedTags
								.attr('y', tagYPos)
								.attr('x', function () {
									return calendarTo - (tagWidth * 2);
								})
								.attr('display', function (d) {
									return d.pBoardModified ? 'block' : 'none';
								});

							var modifiedTagTexts = d3.select(tagItems).selectAll('text.modified-tag-text')
								.data([d], identify);

							var newMergedModifiedTagTexts = modifiedTagTexts.enter()
								.append('text')
								.text('*')
								.attr('dx', 1)
								.attr('dy', 20)
								.attr('height', tagHeight)
								.attr('width', tagWidth)
								.attr('font-size', '25px')
								.style('fill', 'red')
								.classed('tag-item tag-text modified-tag-text', true);

							modifiedTagTexts.exit().remove();
							var mergedModifiedTagTexts = newMergedModifiedTagTexts.merge(modifiedTagTexts);

							mergedModifiedTagTexts
								.attr('y', tagYPos)
								.attr('x', function () {
									return calendarTo - (tagWidth * 2);
								})
								.attr('display', function (d) {
									return d.pBoardModified ? 'block' : 'none';
								});
							// endregion

							// region start tag
							var startTags = d3.select(tagItems).selectAll('rect.start-tag')
								.data([d], identify);

							var newStartTags = startTags.enter()
								.append('rect')
								.attr('height', tagHeight)
								.attr('width', tagWidth)
								.style('fill', function (d) {
									return defaultTagColor;
								})
								.classed('tag-item start-tag', true);

							startTags.exit().remove();
							var mergedStartTags = newStartTags.merge(startTags);

							mergedStartTags
								.attr('y', tagYPos)
								.attr('x', function (d) {
									return calendarFrom;
								});

							// start tag image
							var startTagImages = d3.select(tagItems).selectAll('image.start-tag-image')
								.data([d], identify);

							var newStartTagImages = startTagImages.enter()
								.append('image')
								.attr('width', function (d) {
									return '10px';
								})
								.attr('height', function (d) {
									return '10px';
								})
								.attr('xlink:href', function (d) {
									return getEdgeTagIcon(d, 'start');
								})
								.classed('tag-image start-tag-image', true);

							startTagImages.exit().remove();
							var mergedStartTagImages = newStartTagImages.merge(startTagImages);

							mergedStartTagImages
								.attr('x', function (d) {
									return calendarFrom + 1;
								})
								.attr('y', function (d) {
									return getYPos(d) + 1;
								})
								.attr('xlink:href', function (d) {
									return getEdgeTagIcon(d, 'start');
								});
							// endregion

							// region end tag
							var endTags = d3.select(tagItems).selectAll('rect.end-tag')
								.data([d]);

							var newEndTags = endTags.enter()
								.append('rect')
								.attr('height', tagHeight)
								.attr('width', tagWidth)
								.style('fill', function (d) {
									return defaultTagColor;
								})
								.classed('tag-item end-tag', true);

							endTags.exit().remove();
							var mergedEndTags = newEndTags.merge(endTags);

							mergedEndTags
								.attr('y', tagYPos)
								.attr('x', function (d) {
									return calendarTo - tagWidth;
								});

							// end tag images
							var endTagImages = d3.select(tagItems).selectAll('image.end-tag-image')
								.data([d]);

							var newEndTagImages = endTagImages.enter()
								.append('image')
								.attr('width', function (d) {
									return '10px';
								})
								.attr('height', function (d) {
									return '10px';
								})
								.attr('xlink:href', function (d) {
									return getEdgeTagIcon(d, 'end');
								})
								.classed('tag-image end-tag-image', true);

							endTagImages.exit().remove();
							var mergedEndTagImages = newEndTagImages.merge(endTagImages);

							mergedEndTagImages
								.attr('x', function (d) {
									return calendarTo - tagWidth + 1;
								})
								.attr('y', function (d) {
									return tagYPos + 1;
								})
								.attr('xlink:href', function (d) {
									return getEdgeTagIcon(d, 'end');
								});

							// endregion
						});
						// region clip paths
						// add clip path to all new elements
						newTags.selectAll('rect').attr('clip-path', function (d) {
							return 'url(#clip' + d.Id + ')';
						});
						newTags.selectAll('image').attr('clip-path', function (d) {
							return 'url(#clip' + d.Id + ')';
						});
						newTags.selectAll('text').attr('clip-path', function (d) {
							return 'url(#clip' + d.Id + ')';
						});
						// endregion

					};

					// public properties and functions
					_assignmentTags.calendarScale = function (cs) {
						if (!arguments.length) {
							return calendarScale;
						}
						calendarScale = cs;
						return this;
					};

					_assignmentTags.supplierScale = function (rs) {
						if (!arguments.length) {
							return supplierScale;
						}
						supplierScale = rs;
						return this;
					};

					_assignmentTags.mapService = function (service) {
						if (!arguments.length) {
							return mapService;
						}
						mapService = service;
						return this;
					};

					_assignmentTags.tagConfig = function (config) {
						if (!arguments.length) {
							return tagConfig;
						}
						tagConfig = config;
						return this;
					};

					_assignmentTags.statusIconItems = function (sii) {
						if (!arguments.length) {
							return statusIconItems;
						}
						statusIconItems = sii;
						allStatusIconItems = Object.fromEntries(statusIconItems.map(icon => [icon.Id, icon]));
						return this;
					};

					_assignmentTags.typeIconItems = function (tii) {
						if (!arguments.length) {
							return typeIconItems;
						}
						typeIconItems = tii;
						return this;
					};

					_assignmentTags.showSameAssignments = function (bShow) {
						if (!arguments.length) {
							return showSameAssignments;
						}
						showSameAssignments = bShow;
						return this;
					};

					_assignmentTags.useFilter = function (filter) {
						if (!arguments.length) {
							return useFilter;
						}
						useFilter = filter;
						return this;
					};

					_assignmentTags.calendarDateStart = function (cds) {
						if (!arguments.length) {
							return calendarDateStart;
						}
						calendarDateStart = cds;
						return this;
					};

					_assignmentTags.calendarDateEnd = function (cde) {
						if (!arguments.length) {
							return calendarDateEnd;
						}
						calendarDateEnd = cde;
						return this;
					};

					_assignmentTags.clickEvent = function (ch) {
						if (!arguments.length) {
							return clickEvent;
						}
						clickEvent = ch;
						return this;
					};

					_assignmentTags.dragHandler = function (dh) {
						if (!arguments.length) {
							return dragHandler;
						}
						dragHandler = dh;
						return this;
					};

					_assignmentTags.containerDimensions = function (containerDimensionsFn) {
						if (!arguments.length) {
							return containerDimensions;
						}
						containerDimensions = containerDimensionsFn;
						return this;
					};

					_assignmentTags.supplierScrollValue = function (supplierScroll) {
						if (!arguments.length) {
							return supplierScrollValue;
						}
						supplierScrollValue = supplierScroll;
						return this;
					};

					_assignmentTags.getCurrentZoomUnit = function (unitFn) {
						if (!arguments.length) {
							return getCurrentZoomUnit;
						}
						getCurrentZoomUnit = unitFn;
						return this;
					};

					return _assignmentTags;
				}
			};

		}]
	);
})();