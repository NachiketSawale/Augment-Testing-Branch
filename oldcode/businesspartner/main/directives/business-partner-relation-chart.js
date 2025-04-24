// eslint-disable-next-line no-redeclare
/* global angular,d3,globals,$ */
(function (angular) {
	'use strict';
	// var module = angular.module('businesspartner.main');

	angular.module('businesspartner.main').directive('businessPartnerRelationChart',
		['_', '$timeout', '$rootScope', function (_, $timeout, $rootScope) {

			var defaultOptions = {
				r: 20,
				linkDistance: 100,
				scale: 1,
				moveTrans: [0, 0],
				relationArrows: null,
				text: {}
			};
			var styleOptions = {
				strokeWidthNode: '3px', strokeWidthLink: '3px', strokeText: 'black', strokeLink: '#999999',
				// .bg-green-4 .bg-green-6
				strokeNodes: {selected: '#439346', link: '#7EC480', default: '#D2D2D2'},
				// .bg-green-5 .bg-green-8
				fillNodes: {selected: '#4fab52', link: '#AFDAB0', default: '#E6E6E6'}
			};

			return {
				restrict: 'A',
				scope: '=',
				link: function (scope, element) {
					scope.options = angular.extend({
						width: parseInt(element.closest('#ui-layout-east').width()) * 0.8, // get parent container width
						height: element.closest('.subview-content').height(), // get parent container height
						trans: function (noFit) {
							var currNode = (!noFit && (_.find(scope.nodes, {selected: true}) || _.find(scope.nodes, {isMain: true}))) || {
								x: 0,
								y: 0
							};
							var transOption = [(1 - scope.options.scale) * currNode.x || 0, (1 - scope.options.scale) * currNode.y || 0];
							return [scope.options.moveTrans[0] + transOption[0], scope.options.moveTrans[1] + transOption[1]];
						},
						toTransform: function (noFit) {
							return 'translate(' + scope.options.trans(noFit) + ')' + ' scale(' + scope.options.scale + ')';
						}
					}, defaultOptions, styleOptions);

					scope.refreshD3 = _.noop;

					scope.refresh = function (data, extendOptions) {
						scope.data = data ? data : scope.data;
						scope.extendOptions = extendOptions ? extendOptions : scope.extendOptions;
						scope.options = angular.extend(scope.options, extendOptions);
						if (scope.data && scope.options) {
							render(scope, scope.data, element);
							// for display the layout immediately after directive data loaded.
							$timeout(function () {
								angular.forEach(scope.nodes, function (node) {
									node.fixed = true;
								});
								scope.showAll();
							}, 500);
						}
					};

					scope.selected = function (node, extendOptions) {
						var currentNode = _.find(scope.nodes, {selected: true});
						angular.forEach(scope.nodes, function (i) {
							i.selected = false;
						});
						if (node) {
							if ('selected' in node) {
								currentNode = node;
							} else {
								currentNode = _.find(scope.nodes, node);
							}
						}
						(currentNode || {}).selected = true;
						return currentNode && angular.extend(currentNode, extendOptions);
					};

					scope.central = function () {
						scope.refreshD3(function (options) {
							var currentNode = scope.selected({isMain: true});
							if (currentNode) {
								var vector = {
									x: scope.options.width / 2 - currentNode.x,
									y: scope.options.height / 2 - currentNode.y
								};
								angular.forEach(scope.nodes, function (node) {
									node.x = node.x + vector.x;
									node.y = node.y + vector.y;
									node.px = node.px + vector.x;
									node.py = node.py + vector.y;
									node.fixed = true;
								});
							}
							options.scale = 1.0;
							options.moveTrans = [0, 0];
						}, true);
					};

					scope.showAll = function () {
						scope.refreshD3(function (options) {
							var currentNode = scope.selected({isMain: true});
							if (currentNode) {
								var vector = {
									x: options.width / 2 - currentNode.x,
									y: options.height / 2 - currentNode.y
								};
								var range = getRange(options, vector, scope.rootElement.selectAll('.node,.text'));
								angular.forEach(scope.nodes, function (node) {
									node.x = node.x + vector.x;
									node.y = node.y + vector.y;
									node.px = node.px + vector.x;
									node.py = node.py + vector.y;
									node.fixed = true;
								});
								options.scale = Math.min(
									Math.min(options.width / 2 / (options.width / 2 - range.left + options.r), options.width / 2 / (range.right - options.width / 2 + options.r)),
									Math.min(options.height / 2 / (options.height / 2 - range.top + options.r), options.height / 2 / (range.bottom - options.height / 2 + options.r))
								);
							}
							options.moveTrans = [0, 0];
						}, true);

						function getRange(options, vector, elements) {
							var range = {left: 0, right: options.width, top: 0, bottom: options.height};
							elements.each(function (node) {
								var textNode = $(this).find('.text');
								var nodeRange = {
									left: node.x - textNode.width() / 2,
									right: node.x + textNode.width() / 2,
									top: node.y,
									bottom: node.y + parseFloat(textNode.attr('dy') || '0') + textNode.height()
								};
								if (range.left > nodeRange.left) {
									range.left = nodeRange.left;
								}
								if (range.right < nodeRange.right) {
									range.right = nodeRange.right;
								}
								if (range.top > nodeRange.top) {
									range.top = nodeRange.top;
								}
								if (range.bottom < nodeRange.bottom) {
									range.bottom = nodeRange.bottom;
								}
							});
							return {
								left: range.left + vector.x,
								right: range.right + vector.x,
								top: range.top + vector.y,
								bottom: range.bottom + vector.y
							};
						}
					};
					scope.zoomIn = function () {
						scope.refreshD3(function (options) {
							options.scale = options.scale * Math.pow(2, 120 * 0.002);
						});
					};
					scope.zoomOut = function () {
						scope.refreshD3(function (options) {
							options.scale = options.scale * Math.pow(2, -120 * 0.002);
						});
					};

					var callback = function () {
						scope.refreshD3(function (options) {
							options.width = element.closest('#ui-layout-east').width(); // get parent container width
							options.height = element.closest('.subview-content').height(); // get parent container height
						});
					};

					var deregisterStepChanged;
					if (_.isFunction(scope.onContentResized)) {
						scope.onContentResized(callback);
					} else {
						deregisterStepChanged = $rootScope.$on('stepChanged', function () {
							callback();
							scope.refresh();
						});
					}

					scope.$watch('triggerUpdateEvent', function () {
						if (scope.triggerUpdateEvent) {
							scope.triggerUpdateEvent.register(resized);
						}
					});

					function resized() {
						scope.refreshD3(function (options) {
							options.width = element.closest('#ui-layout-east').width(); // get parent container width
							options.height = element.closest('.subview-content').height(); // get parent container height
						});
					}

					scope.$on('$destroy', function () {
						if (scope.triggerUpdateEvent) {
							scope.triggerUpdateEvent.unregister(resized);
						}
						if (deregisterStepChanged) {
							deregisterStepChanged();
						}
					});
				}
			};

			function render(scope, data, element) {
				element = element[0];
				if (scope.container) {
					scope.container.stop();
				}

				scope.nodes = data.nodes;
				scope.links = data.links;
				scope.relationTypes = data.relationTypes;
				scope.zoom = d3.zoom();
				scope.container = renderContainer(scope, element);
				scope.refreshD3 = refreshD3;
				scope.container.simulation.on('tick', function () {
					tickLinks(scope);
					tickNodes(scope);
				});

				renderRectangle(data);
				renderDefs(scope);
				renderLinks(scope);
				renderNodes(scope);
				renderInfo(scope, data.showInfo);

				addEventToD3(scope);

				return scope.container;

				function refreshD3(changeFun) {
					scope.container.stop();
					changeFun(scope.options);
					scope.rootElement.attr('width', scope.options.width).attr('height', scope.options.height);
					scope.container.panel.select('rect').attr('width', scope.options.width).attr('height', scope.options.height);
					scope.container.simulation.force('positionX', d3.forceX().x(function () {
						return scope.options.width;
					}));
					scope.container.simulation.force('positionY', d3.forceY().y(function () {
						return scope.options.height;
					}));
					scope.container.simulation.force('center', d3.forceCenter(scope.options.width / 2, scope.options.height / 2));
					d3.zoomTransform(scope.container.panel.node()).translate(scope.options.trans());
					d3.zoomTransform(scope.container.panel.node()).scale(scope.options.scale);
					scope.container.panel.attr('transform', scope.options.toTransform());
				}
			}

			function renderRectangle(data) {

				d3.select('.rectangle').remove();
				d3.select('#rectangle-all').append('svg').attr('width', '300').attr('height', '200').classed('rectangle', true);
				var i = 0;
				_.forEach(data.relationTypes, function (list) {
					d3.select('.rectangle').append('rect').attr('x', 10).attr('y', 10 + i * 20).attr('width', 30).attr('height', 14).attr('fill', list.Color['background-color']);/* .fill('yellow') */
					d3.select('.rectangle').append('text').attr('x', 45).attr('y', 22 + i * 20).text(list.DescriptionInfo.Translated);
					var height = d3.select('.rectangle').attr('height');
					if (height < 20 + i * 20) {
						height = parseInt(height) + 50;
						d3.select('.rectangle').attr('height', height);
					}
					i++;
				});
			}

			function addEventToD3(scope) {
				var moveData = {can: false, event: null, target: null};

				scope.rootElement.call(scope.zoom.scaleExtent([0.2, 10]).on('zoom', function rescale() {
					if (scope.options.scale !== d3.event.transform.k) {
						scope.refreshD3(function (options) {
							options.scale = d3.event.transform.k;
						});
					}
				}))
					.on('mousedown', function () {
						if (!$(d3.event.target).is('.node-content')) {
							moveData.target = d3.event.target;
							this.style.cursor = 'move';
						} else {
							moveData.target = null;
							this.style.cursor = 'pointer';
						}
					}).on('mouseup', function () {
						moveData.target = null;
						this.style.cursor = 'auto';
					}).on('mousemove', function () {
						if (moveData.event && moveData.target) {
							scope.refreshD3(function (options) {
								options.moveTrans = [
									options.moveTrans[0] + (d3.event.clientX - moveData.event.clientX),
									options.moveTrans[1] + (d3.event.clientY - moveData.event.clientY)
								];
							});
						}
						moveData.event = d3.event;
					});
			}

			function renderContainer(scope, element) {
				// noinspection JSUnresolvedFunction
				var simulation = d3.forceSimulation()
					.velocityDecay(0.6)
					.force('link', d3.forceLink()
						.id(function (d) {
							return d.id;
						})
						.distance(function () {
							return scope.options.linkDistance;
						})
						.strength(function () {
							return 1;
						}))
					.force('charge', d3.forceManyBody().strength(function () {
						return -900;
					}))
					.force('gravity', d3.forceManyBody().strength(function () {
						return 0.03;
					}))
					.force('center', d3.forceCenter(scope.options.width / 2, scope.options.height / 2))
					.force('positionX', d3.forceX().x(function () {
						return scope.options.width;
					}))
					.force('positionY', d3.forceY().y(function () {
						return scope.options.height;
					}));

				if ($('.bp-relation-container', element).length) {
					$('.bp-relation-container', element).remove();
				}

				scope.rootElement = d3.select(element)
					.append('svg').classed('bp-relation-container', true).attr('width', scope.options.width).attr('height', scope.options.height)
					.attr('pointer-events', 'all');

				var panel = scope.rootElement.append('svg:g').on('dblclick.zoom', null).attr('transform', scope.options.toTransform());

				panel.append('svg:rect').attr('width', scope.options.width).attr('height', scope.options.height).attr('dx', 0).attr('dy', 0).attr('fill', 'white');

				simulation.force('link').links(scope.links);
				// add node data
				simulation.nodes(scope.nodes);

				return {
					simulation: simulation,
					panel: panel,
					tick: simulation.tick,
					stop: simulation.stop,
					start: simulation.restart,
					drag: simulation.drag,
					nodes: simulation.nodes,
					links: simulation.links,
					select: select,
					selectAll: selectAll
				};

				function select(node) {
					return d3.select(element).select(node);
				}

				function selectAll(node) {
					return d3.select(element).selectAll(node);
				}
			}

			function renderInfo(scope, showInfo) {
				if (!showInfo) {
					return;
				}
				var relationTypes = [];// 'relationType'
				angular.forEach(scope.links, function (link) {
					if (link.relationType && !_.some(relationTypes, function (i) {
						return i.id === link.relationType.id;
					})) {
						relationTypes.push(link.relationType);
					}
				});
				if (showInfo !== true) {
					var infoElement = scope.rootElement.append('svg:g').attr('class', 'relation-type-info-panel');
					angular.forEach(relationTypes, function (relationType, index) {
						var g = infoElement.append('svg:g').attr('class', 'relation-type-info');
						g.append('rect').attr('fill', relationType.color).attr('x', 10).attr('y', 25 * index).attr('width', 25).attr('height', 20);
						g.append('text').attr('x', 40).attr('y', 25 * (0.5 + index)).attr('stroke', relationType.color)
							.text(relationType.name);
					});
				}
				var relations = scope.container.panel.selectAll('.relation').data(scope.links)
					.enter().append('g')
					.classed('relation_element', true)
					.append('path')
					.attr('class', 'relation')
					.attr('fill', 'none');

				addTooltip(scope, relations);
			}

			function renderDefs(scope) {
				var imageNodes = _.filter(scope.nodes, function (node) {
					return !!node.image;
				});
				var pattern = scope.container.panel.append('defs').selectAll('pattern').data(imageNodes).enter().append('pattern').attr('x', -scope.options.r).attr('y', -scope.options.r)
					.attr('height', scope.options.r * 2).attr('width', scope.options.r * 2).attr('patternUnits', 'userSpaceOnUse').attr('id', function (d) {
						return 'relation-img' + d.Id;
					});
				pattern.append('image')
					.attr('height', scope.options.r * 2)
					.attr('width', scope.options.r * 2)
					.attr('xlink:href', function (d) {
						return d.image;
					});
			}

			function renderLinks(scope) {
				var link = scope.container.panel.selectAll('.link').data(scope.links).enter()
					.append('g').classed('link_element', true);

				link.append('line')
					.attr('class', 'link')
					.attr('stroke-width', scope.options.strokeWidthLink)
					.attr('stroke', scope.options.strokeLink);
			}

			function renderNodes(scope) {
				if (scope.nodes.length === 0) {
					return;
				}

				scope.selected({isMain: true}, {
					x: scope.options.width / 2,
					y: scope.options.height / 2,
					fixed: true
				});

				// append nodes
				var dragEvent = dragFunction(scope);
				var nodeElements = scope.container.panel.selectAll('.node').data(scope.nodes)
					.enter().append('g').classed('node', true)
					.classed('node_element', true)
					.attr('id', function (node) {
						return 'node_' + node.Id;
					})
					.on('mousedown', function (node) {
						scope.selected(node);
					})
					.call(d3.drag()
						.on('start', dragEvent.dragstart).on('drag', dragEvent.drag).on('end', dragEvent.dragend));

				// append circle to node (background and image)
				nodeElements.filter(function (node) {
					return node.dataType === 'businessPartner';
				}).append('circle').classed('node-content', true).attr('stroke-width', scope.options.strokeWidthNode).attr('r', scope.options.r);

				nodeElements.filter(function (node) {
					return node.dataType === 'subsidiary';
				}).append('circle').classed('node-content', true).attr('stroke-width', scope.options.strokeWidthNode).attr('r', scope.options.r - 5);

				nodeElements.filter(function (node) {
					return node.image;
				}).append('circle').classed('node-content', true).classed('is-image', true)
					.attr('stroke-width', scope.options.strokeWidthNode).attr('r', scope.options.r);

				// append text to node
				nodeElements.append('text')
					.attr('dx', 2 - scope.options.r)
					.attr('dy', scope.options.r + 12)
					.attr('class', 'text')
					.attr('stroke', scope.options.strokeText)
					.text(function (d) {
						return d.name || '';
					});

				addTooltip(scope, nodeElements, 2000);
			}

			function addTooltip(scope, elements, interval) {
				return elements.on('mouseover', function (node) {
					node.showTooltip = true;
					$timeout(function () {
						scope.container.panel.selectAll('.node_tooltip').remove();
						if (node.showTooltip && node.info) {
							createTooltip(scope, node, {
								x: node.x + scope.options.r,
								y: node.y
							});
						}
					}, interval || 0);
				}).on('mouseout', function (node) {
					node.showTooltip = false;
					scope.container.panel.selectAll('.node_tooltip').remove();
				});

				function createTooltip(scope, node, position) {
					var index = 0, width = 0, fontSize = 14;
					var tooltip = scope.container.panel.append('g')
						.attr('class', 'node_tooltip')
						.attr('x', position.x)
						.attr('y', position.y);
					var rect = tooltip.append('rect')
						.attr('fill', '#999999')
						.attr('x', position.x)
						.attr('y', position.y);

					angular.forEach(angular.isString(node.info) ? {'': node.info} : node.info, function (val, pro) {
						var text = (pro ? (pro + '  :   ') : '') + val;
						tooltip.append('text')
							.attr('style', 'font-size:' + fontSize + 'px;fill:#ffffff;')
							.attr('x', position.x + 2)
							.attr('y', position.y + 14 + index * (1.3 * fontSize))
							.text(text);
						index = index + 1;
						width = Math.max(width, text.length * 0.42 * fontSize);
					});
					rect.attr('width', width + 4)
						.attr('height', index * (1.3 * fontSize) + 6);
				}
			}

			function dragFunction(scope) {
				return {
					dragstart: dragstart,
					drag: drag,
					dragend: dragend
				};

				function isParentNode(excepted) {
					var result = false;
					scope.links.forEach(function (link) {
						if (link.target === excepted) {
							result = true;
							return false;// break;
						}
					});
					return result;
				}

				function dragstart(excepted) {
					if (!excepted) {
						return;
					}
					if (!d3.event.active) {
						scope.container.simulation.alphaTarget(0.3).restart();

					}
					scope.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = true;
							node.fx = null;
							node.fy = null;
						}
					});
					scope.links.forEach(function (link) {
						if (link.target === excepted && !isParentNode(link.source)) {
							link.source.fixed = false;
						}
					});
				}

				function drag(excepted) {
					excepted.fx = d3.event.x;
					excepted.fy = d3.event.y;
					scope.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = false;
						}
					});
				}

				function dragend(excepted) {
					if (!d3.event.active) {
						scope.container.simulation.alphaTarget(0);

					}
					scope.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = true;
						}
					});
					scope.container.stop();
				}
			}

			function setSelectedNodeType(scope) {
				var currentNode = _.find(scope.nodes, {selected: true});
				var selectNodeLink = _.filter(scope.links, function (l) {
					return l.target.selected || l.source.selected;
				});

				_.forEach(selectNodeLink, function (link) {
					var relationType = _.find(scope.relationTypes, {'Id': link.relationType.id});
					var colorTypeId = link.relationType.id;
					if (link.source !== currentNode && relationType.OppositeDescriptionInfo.Translated !== relationType.DescriptionInfo.Translated) {
						colorTypeId = -colorTypeId;
					}
					link.colorTypeId = colorTypeId;
				});
			}

			function tickLinks(scope) {

				setSelectedNodeType(scope);
				scope.container.selectAll('.link')
					.attr('x1', function (d) {
						return d.source.x || 0;
					}).attr('y1', function (d) {
						return d.source.y || 0;
					}).attr('x2', function (d) {
						return d.target.x || 0;
					}).attr('y2', function (d) {
						return d.target.y || 0;
					});

				scope.container.selectAll('.relation')
					.attr('cx', function (d) {
						return (d.source.x + d.target.x) / 2;
					})
					.attr('cy', function (d) {
						return (d.source.y + d.target.y) / 2;
					})
					.attr('d', function (d) {
						return angular.isFunction(scope.options.relationArrows) && scope.options.relationArrows(d.relation, d.source, d.target) || '';
					})
					.attr('fill', function (d) {
						return (d.relationType || {}).color || 'none';
					});

				var selectNodeLink = _.filter(scope.links, function (l) {
					return l.target.selected || l.source.selected;
				});

				scope.container.selectAll('.link_element line').attr('stroke', function (link) {
					if (_.some(selectNodeLink, function (l) {
						return l === link;
					})) {
						var list = _.find(scope.relationTypes, {'Id': link.colorTypeId});

						return list ? list.Color['background-color'] : scope.options.strokeLink;
					}
					return scope.options.strokeLink;
				});
			}

			function tickNodes(scope) {
				var selectNodeLink = _.filter(scope.links, function (l) {
					return l.target.selected || l.source.selected;
				});

				scope.container.selectAll('.node_element').attr('transform', function (d) {
					return 'translate(' + d.x + ', ' + d.y + ')';
				}).classed('selected', function (node) {
					return node.selected;
				});

				scope.container.selectAll('.node_element circle').attr('stroke', function (node) {
					if (node.selected) {
						return scope.options.strokeNodes.selected;// .bg-green-4
					} else if (_.some(selectNodeLink, function (l) {
						return l.target === node || l.source === node;
					})) {
						return scope.options.strokeNodes.link;// .bg-green-6
					} else {
						return scope.options.strokeNodes.default;
					}
				}).attr('fill', function (node) {
					if ($(this).is('.is-image')) {
						// rei@7.3.2016 globals.appBaseUrl requreid because of image might not be display when <base href="/Cloud5D/v1/client/"> href not similar to appBaseUrl
						return 'url(' + globals.appBaseUrl + '#relation-img' + node.Id + ')';
					} else if (node.selected) {
						return scope.options.fillNodes.selected;// .bg-green-5
					} else if (_.some(selectNodeLink, function (l) {
						return l.target === node || l.source === node;
					})) {
						return scope.options.fillNodes.link;// .bg-green-8
					} else {
						return scope.options.fillNodes.default;
					}
				});

				scope.container.selectAll('.node_element .text').attr('dx', function (/* d */) {
					var width = this.offsetWidth ? this.offsetWidth : this.clientWidth;
					return -width / 2;
				});
			}

		}]);

})(angular);