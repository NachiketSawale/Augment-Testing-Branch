import {Directive, ElementRef, inject, OnInit} from '@angular/core';
import * as d3 from 'd3';
import { get, toNumber } from 'lodash';
import {PlatformConfigurationService} from '@libs/platform/common';
import * as $ from 'jquery';
import { IBpRelationType, IRelation, IRelationChartData, IRelationLink, IRelationNode } from '@libs/businesspartner/interfaces';

export interface IRelationChartOptions {
	r: number,
	linkDistance: number,
	scale: number,
	moveTrans: [number, number],
	relationArrows: ((relation: IRelation, source: IRelationNode, target: IRelationNode) => string) | null,
	text: object,
}

export interface IRelationChartStyleOptions {
	strokeWidthNode: string,
	strokeWidthLink: string,
	strokeText: string,
	strokeLink: string,
	strokeNodes: { selected: string, link: string, default: string },
	fillNodes: { selected: string, link: string, default: string }
}

export interface IRelationChartDisplayOptions {
	width: number,
	height: number,
	trans: (noFit?: boolean) => [number, number],
	toTransform: (noFit?: boolean) => string,
}

export interface IRelationOptions extends IRelationChartOptions, IRelationChartStyleOptions, IRelationChartDisplayOptions {

}

export interface IRelationChartContainer {
	simulation: d3.Simulation<IRelationNode, undefined>,
	panel: d3.Selection<SVGGElement, unknown, null, undefined>,
	// tick: simulation.tick,
	// stop: simulation.stop,
	// start: simulation.restart,
	// drag: simulation.drag,
	// nodes: simulation.nodes,
	// links: simulation.links,
	// select: select,
	// selectAll: selectAll
}

@Directive({
	selector: '[businessPartnerMainRelationChart]'
})
export class BusinessPartnerRelationChartDirective implements OnInit {

	private element!: HTMLElement;
	private rootElement!: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	private configService = inject(PlatformConfigurationService);

	private readonly defaultOptions: IRelationChartOptions = {
		r: 20,
		linkDistance: 100,
		scale: 1,
		moveTrans: [0, 0],
		relationArrows: null,
		text: {}
	};
	private readonly styleOptions: IRelationChartStyleOptions = {
		strokeWidthNode: '3px', strokeWidthLink: '3px', strokeText: 'black', strokeLink: '#999999',
		// .bg-green-4 .bg-green-6
		strokeNodes: {selected: '#439346', link: '#7EC480', default: '#D2D2D2'},
		// .bg-green-5 .bg-green-8
		fillNodes: {selected: '#4fab52', link: '#AFDAB0', default: '#E6E6E6'}
	};

	private options!: IRelationOptions;

	private nodes: IRelationNode[] = [];
	private data?: IRelationChartData;
	private extendOptions?: object;

	public constructor(private elementRef: ElementRef) {
	}

	public ngOnInit(): void {
		this.element = <HTMLElement>this.elementRef.nativeElement;
		const currentSize = this.getParentContainerSize();
		this.options = {
			width: currentSize.width, // get parent container width
			height: currentSize.height, // get parent container height
			trans: (noFit?: boolean) => {
				const currNode = (!noFit && (this.nodes.find(e => e.selected) || this.nodes.find(e => e.isMain))) || {
					x: 0,
					y: 0
				};
				const transOption = [(1 - this.options.scale) * (currNode.x ?? 0) || 0, (1 - this.options.scale) * (currNode.y ?? 0) || 0];
				return [this.options.moveTrans[0] + transOption[0], this.options.moveTrans[1] + transOption[1]];
			},
			toTransform: (noFit?: boolean) => {
				return 'translate(' + this.options.trans(noFit) + ')' + ' scale(' + this.options.scale + ')';
			},
			...this.defaultOptions, ...this.styleOptions
		};
	}

	public refresh(data: IRelationChartData, extendOptions: object) {// (relation: IRelation, source: IRelationNode, target: IRelationNode) => string) {
		this.data = data || this.data;
		this.extendOptions = extendOptions || this.extendOptions;
		this.options = {...this.options, ...extendOptions};
		if (this.data && this.options) {
			this.render(this.data, this.element);
			// for display the layout immediately after directive data loaded.
			setTimeout(() => {
				this.nodes.forEach((node) => {
					node.fixed = true;
				});
				this.showAll();
			}, 500);
		}
	}

	private links: IRelationLink<IRelationNode>[] = [];
	private container?: IRelationChartContainer;
	private relationTypes: IBpRelationType[] = [];
	private zoom?: d3.ZoomBehavior<SVGSVGElement, unknown>;

	private render(data: IRelationChartData, element: HTMLElement) {
		if (this.container) {
			this.container.simulation.stop();
		}

		this.nodes = data.nodes;
		this.links = data.links;
		this.relationTypes = data.relationTypes;
		this.zoom = d3.zoom();
		this.container = this.renderContainer(element);
		// scope.refreshD3 = refreshD3;
		this.container.simulation.on('tick', () => {
			this.tickLinks();
			this.tickNodes();
		});

		this.renderRectangle(data);
		this.renderDefs();
		this.renderLinks();
		this.renderNodes();

		this.addEventToD3(this.element);

		return this.container;
	}

	private refreshD3(changeFun: (options: IRelationOptions) => void) {
		if (!this.container) {
			return;
		}
		this.container.simulation.stop();
		changeFun(this.options);
		this.rootElement.attr('width', this.options.width).attr('height', this.options.height);
		this.container.panel.select('rect').attr('width', this.options.width).attr('height', this.options.height);
		this.container.simulation.force('positionX', d3.forceX().x(() => {
			return this.options.width;
		}));
		this.container.simulation.force('positionY', d3.forceY().y(() => {
			return this.options.height;
		}));
		this.container.simulation.force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2));
		const node = this.container.panel.node();
		if (node) {
			const pos = this.options.trans();
			d3.zoomTransform(node).translate(pos[0], pos[1]);
			d3.zoomTransform(node).scale(this.options.scale);
		}
		this.container.panel.attr('transform', this.options.toTransform());
	}

	private renderContainer(element: HTMLElement) {
		// noinspection JSUnresolvedFunction
		const forceLink = d3.forceLink()
			.id((d) => {
				const temp = d as unknown as IRelationNode;
				return temp.Id;
			})
			.distance(() => {
				return this.options.linkDistance;
			})
			.strength(() => {
				return 1;
			});
		const simulation = d3.forceSimulation<IRelationNode>()
			.velocityDecay(0.6)
			.force('link', forceLink)
			.force('charge', d3.forceManyBody().strength(() => {
				return -900;
			}))
			.force('gravity', d3.forceManyBody().strength(() => {
				return 0.03;
			}))
			.force('center', d3.forceCenter(this.options.width / 2, this.options.height / 2))
			.force('positionX', d3.forceX().x(() => {
				return this.options.width;
			}))
			.force('positionY', d3.forceY().y(() => {
				return this.options.height;
			}));

		if (this.element.querySelector('.bp-relation-container')) {
			this.element.querySelector('.bp-relation-container')?.remove();
		}

		// this.rootElement = d3.select(element);
		const rootElement = d3.select(element);
		const svgEle = rootElement.append('svg').classed('bp-relation-container', true)
			.attr('width', this.options.width).attr('height', this.options.height)
			.attr('pointer-events', 'all');
		this.rootElement = svgEle;
		const panel = svgEle.append('g')
			.on('dblclick.zoom', null).attr('transform', this.options.toTransform());

		panel.append('svg:rect').attr('width', this.options.width).attr('height', this.options.height)
			.attr('dx', 0).attr('dy', 0).attr('fill', 'white');

		// const forceLink = simulation.force('link')
		forceLink.links(this.links); // .links(this.links);
		// add node data
		simulation.nodes(this.nodes);
		return {
			simulation: simulation,
			panel: panel,
		};
	}

	private select(node: string) {
		return d3.select(this.element).select(node);
	}

	private selectAll(node: string) {
		return d3.select(this.element).selectAll(node);
	}

	private renderRectangle(data: IRelationChartData) {

		d3.select('.rectangle').remove();
		d3.select('#rectangle-all').append('svg').attr('width', '300').attr('height', '200')
			.classed('rectangle', true);
		let i = 0;
		data.relationTypes.forEach((item) => {
			const rectElement = d3.select('.rectangle').append('rect')
				.attr('x', 10).attr('y', 10 + i * 20).attr('width', 30)
				.attr('height', 14);
			const color = get(item.Color, 'background-color');
			if (color) {
				rectElement.attr('fill', color);/* .fill('yellow') */
			}
			d3.select('.rectangle').append('text').attr('x', 45).attr('y', 22 + i * 20)
				.text(item.DescriptionInfo?.Translated ?? null);
			const heightStr = d3.select('.rectangle').attr('height');
			let height = toNumber(heightStr);
			if (height < 20 + i * 20) {
				height = height + 50;
				d3.select('.rectangle').attr('height', height);
			}
			i++;
		});
	}

	private addEventToD3(element: HTMLElement) {
		const moveData: {
			can: boolean,
			event: { clientX: number, clientY: number } | null,
			target: unknown
		} = {
			can: false,
			event: null,
			target: null
		};

		if (this.zoom) {

			this.rootElement.call(this.zoom?.scaleExtent([0.2, 10]).on('zoom', (event) => {
				if (this.options.scale !== event.transform.k) {
					this.refreshD3((options: IRelationOptions) => {
						options.scale = event.transform.k;
					});
				}
			}))
				.on('mousedown', function (event) {
					if (!$(event.target)?.is('.node-content')) {
						moveData.target = event.target;
						this.style.cursor = 'move';
					} else {
						moveData.target = null;
						this.style.cursor = 'pointer';
					}
				}).on('mouseup', function () {
					moveData.target = null;
					this.style.cursor = 'auto';
				}).on('mousemove', (event) => {
					if (moveData.event && moveData.target) {
						this.refreshD3((options: IRelationOptions) => {
							options.moveTrans = [
								options.moveTrans[0] + (event.clientX - (moveData.event?.clientX ?? 0)),
								options.moveTrans[1] + (event.clientY - (moveData.event?.clientY ?? 0))
							];
						});
					}
					moveData.event = event;
				});
		}
	}

	private renderDefs() {
		const imageNodes = this.nodes.filter((node) => {
			return !!node.image;
		});
		const pattern = this.container?.panel.append('defs').selectAll('pattern')
			.data(imageNodes).enter().append('pattern').attr('x', -this.options.r).attr('y', -this.options.r)
			.attr('height', this.options.r * 2).attr('width', this.options.r * 2).attr('patternUnits', 'userSpaceOnUse')
			.attr('id', (d) => {
				return 'relation-img' + d.Id;
			});
		pattern?.append('image')
			.attr('height', this.options.r * 2)
			.attr('width', this.options.r * 2)
			.attr('xlink:href', (d) => {
				return d.image ?? '';
			});
	}

	private renderLinks() {
		const link = this.container?.panel.selectAll('.link').data(this.links).enter()
			.append('g').classed('link_element', true);

		link?.append('line')
			.attr('class', 'link')
			.attr('stroke-width', this.options.strokeWidthLink)
			.attr('stroke', this.options.strokeLink);
	}

	private renderNodes() {
		if (this.nodes.length === 0) {
			return;
		}

		const node = this.setSelected();
		if (node) {
			node.x = this.options.width / 2;
			node.y = this.options.height / 2;
			node.fixed = true;
		}

		// append nodes
		const nodeElements = this.container?.panel
			.selectAll('.node').data(this.nodes)
			.enter().append('g').classed('node', true)
			.classed('node_element', true)
			.attr('id', (node) => {
				return 'node_' + node.Id;
			})
			.on('mousedown', (event, node) => {
				this.setSelected(node);
			})
			.call(d3.drag<SVGGElement, IRelationNode>() // todo chi: do it later
				.on('start', (event: DragEvent, excepted?: IRelationNode) => {
					if (!excepted) {
						return;
					}
					const active = get(event, 'active', 0) as number;
					if (active === 0) {
						this.container?.simulation.alphaTarget(0.3).restart();
					}
					this.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = true;
							node.fx = null;
							node.fy = null;
						}
					});
					this.links.forEach((link) => {
						if (link.target === excepted && !this.isParentNode(link.source)) {
							link.source.fixed = false;
						}
					});
				})
				.on('drag', (event: DragEvent, excepted: IRelationNode) => {
					excepted.fx = event.x;
					excepted.fy = event.y;
					this.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = false;
						}
					});
				})
				.on('end', (event: DragEvent, excepted: IRelationNode) => {
					const active = get(event, 'active', 0) as number;
					if (active === 0) {
						this.container?.simulation.alphaTarget(0);
					}
					this.nodes.forEach(function (node) {
						if (excepted !== node) {
							node.fixed = true;
						}
					});
					this.container?.simulation.stop();
				}));

		// append circle to node (background and image)
		nodeElements?.filter((node) => {
			return node.dataType === 'businessPartner';
		}).append('circle').classed('node-content', true).attr('stroke-width', this.options.strokeWidthNode)
			.attr('r', this.options.r);

		nodeElements?.filter((node) => {
			return node.dataType === 'subsidiary';
		}).append('circle').classed('node-content', true).attr('stroke-width', this.options.strokeWidthNode)
			.attr('r', this.options.r - 5);

		nodeElements?.filter((node) => {
			return !!node.image;
		}).append('circle').classed('node-content', true).classed('is-image', true)
			.attr('stroke-width', this.options.strokeWidthNode).attr('r', this.options.r);

		// append text to node
		nodeElements?.append('text')
			.attr('dx', 2 - this.options.r)
			.attr('dy', this.options.r + 12)
			.attr('class', 'text')
			.attr('stroke', this.options.strokeText)
			.text(function (d) {
				return d.name ?? '';
			});

		if (nodeElements) {
			this.addTooltipToNode(nodeElements, 2000);
		}
	}

	private addTooltipToNode(elements: d3.Selection<SVGGElement, IRelationNode, SVGGElement, undefined>,
					   interval?: number) {
		elements.on('mouseover', (event, data) => {
			data.showTooltip = true;
			setTimeout(() => {
				this.container?.panel.selectAll('.node_tooltip').remove();

				if (data.showTooltip && data.info) {
					this.createTooltip(data, {
						x: (data.x ?? 0) + this.options.r,
						y: (data.y ?? 0)
					});
				}
			}, interval ?? 0);
		});
		elements.on('mouseout', (event, data) => {
			data.showTooltip = false;
			this.container?.panel.selectAll('.node_tooltip').remove();
		});
	}

	private createTooltip(node: IRelationNode, position: {x: number, y: number}) {
		let index = 0, width = 0;
		const fontSize = 14;
		const tooltip = this.container?.panel.append('g')
			.attr('class', 'node_tooltip')
			.attr('x', position.x)
			.attr('y', position.y);
		const rect = tooltip?.append('rect')
			.attr('fill', '#999999')
			.attr('x', position.x)
			.attr('y', position.y);

		Object.entries(node.info).forEach(([infoKey, infoValue]) => {
			const text = (infoKey ? (infoKey + '  :   ') : '') + infoValue;
			tooltip?.append('text')
				.attr('style', 'font-size:' + fontSize + 'px;fill:#ffffff;')
				.attr('x', position.x + 2)
				.attr('y', position.y + 14 + index * (1.3 * fontSize))
				.text(text);
			index = index + 1;
			width = Math.max(width, text.length * 0.42 * fontSize);
		});

		rect?.attr('width', width + 4)
			.attr('height', index * (1.3 * fontSize) + 6);
	}

	private isParentNode(excepted: IRelationNode) {
		return !!this.links.find((link) => {
			return link.target === excepted;
		});
	}

	private setSelectedNodeType() {
		const currentNode = this.nodes.find(e => e.selected);
		const selectNodeLink = this.links.filter((l) => {
			return l.target.selected || l.source.selected;
		});

		selectNodeLink.forEach((link) => {
			const relationType = this.relationTypes.find(e=> e.Id === link.relationType.id);
			let colorTypeId = link.relationType.id;
			if (link.source !== currentNode && relationType && relationType.OppositeDescriptionInfo?.Translated !== relationType.DescriptionInfo?.Translated) {
				colorTypeId = -colorTypeId;
			}
			link.colorTypeId = colorTypeId;
		});
	}

	public central() {
		this.refreshD3((options: IRelationOptions) => {
			const currentNode = this.setSelected();
			if (currentNode) {
				const vector = {
					x: this.options.width / 2 - (currentNode.x ?? 0),
					y: this.options.height / 2 - (currentNode.y ?? 0)
				};
				this.nodes.forEach((node) => {
					node.x = (node.x ?? 0) + vector.x;
					node.y = (node.y ?? 0) + vector.y;
					node.px = (node.px ?? 0) + vector.x;
					node.py = (node.py ?? 0) + vector.y;
					node.fixed = true;
				});
			}
			options.scale = 1.0;
			options.moveTrans = [0, 0];
		});
	}

	public showAll() {
		this.refreshD3((options: IRelationOptions) => {
			const currentNode = this.setSelected();
			if (currentNode) {
				const vector = {
					x: options.width / 2 - (currentNode?.x ?? 0),
					y: options.height / 2 - (currentNode?.y ?? 0)
				};
				const range = this.getRange(options, vector, this.rootElement.selectAll('.node,.text'));

				this.nodes.forEach((node) => {
					node.x = (node.x ?? 0) + vector.x;
					node.y = (node.y ?? 0) + vector.y;
					node.px = (node.px ?? 0) + vector.x;
					node.py = (node.py ?? 0) + vector.y;
					node.fixed = true;
				});
				options.scale = Math.min(
					Math.min(options.width / 2 / (options.width / 2 - range.left + options.r), options.width / 2 / (range.right - options.width / 2 + options.r)),
					Math.min(options.height / 2 / (options.height / 2 - range.top + options.r), options.height / 2 / (range.bottom - options.height / 2 + options.r))
				);
			}
			options.moveTrans = [0, 0];
		});
	}

	public zoomIn() {
		this.refreshD3((options) => {
			options.scale = options.scale * Math.pow(2, 120 * 0.002);
		});
	}
	public zoomOut() {
		this.refreshD3((options) => {
			options.scale = options.scale * Math.pow(2, -120 * 0.002);
		});
	}

	public resized() {
		this.refreshD3((options) => {
			const currentSize = this.getParentContainerSize();
			options.width = currentSize.width;
			options.height = currentSize.height;
		});
	}

	private getRange(options: IRelationOptions, vector: {x: number, y: number}, elements: d3.Selection<d3.BaseType, IRelationNode, SVGSVGElement, unknown>) {
		const range = {left: 0, right: options.width, top: 0, bottom: options.height};
		elements.each(function (node) {

			const textNode = (this instanceof Element) ? $(this)?.find('.text') : undefined; //d3.select(this)?.select('.text');
			const nodeRange = {
				left: (node.x ?? 0) - (textNode?.width() ?? 0) / 2,
				right: (node.x ?? 0) + (textNode?.width() ?? 0) / 2,
				top: node.y,
				bottom: (node.y ?? 0) + parseFloat(textNode?.attr('dy') ?? '0') + (textNode?.height() ?? 0)
			};
			if (range.left > nodeRange.left) {
				range.left = nodeRange.left;
			}
			if (range.right < nodeRange.right) {
				range.right = nodeRange.right;
			}
			if (range.top > (nodeRange.top || 0)) {
				range.top = nodeRange.top ?? 0;
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

	private tickLinks() {

		this.setSelectedNodeType();
		this.selectAll('.link')
			.attr('x1', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return temp.source?.x ?? 0;
			}).attr('y1', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return temp.source?.y ?? 0;
			}).attr('x2', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return temp.target?.x ?? 0;
			}).attr('y2', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return temp.target?.y ?? 0;
			});

		this.selectAll('.relation')
			.attr('cx', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return ((temp.source?.x ?? 0) + (temp.target?.x ?? 0)) / 2;
			})
			.attr('cy', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return ((temp.source?.y ?? 0) + (temp.target?.y ?? 0)) / 2;
			})
			.attr('d', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				if (this.options.relationArrows) {
					return this.options.relationArrows(temp.relation, temp.source, temp.target);
				}
				return '';
			})
			.attr('fill', (d) => {
				const temp = d as IRelationLink<IRelationNode>;
				return temp.relationType?.color || 'none';
			});

		const selectNodeLink = this.links.filter((l) => {
			return l.target.selected || l.source.selected;
		});

		this.selectAll('.link_element line').attr('stroke', (link) => {
			const temp = link as IRelationLink<IRelationNode>;
			if (selectNodeLink.some((l) => {
				return l === temp;
			})) {
				const list = this.relationTypes.find(e => e.Id === temp.colorTypeId);

				return list ? get(list.Color, 'background-color') ?? '' : this.options.strokeLink;
			}
			return this.options.strokeLink;
		});
	}

	private tickNodes() {
		const selectNodeLink = this.links.filter((l) => {
			return l.target.selected || l.source.selected;
		});
		const configService = this.configService;
		const options = this.options;
		this.selectAll('.node_element').attr('transform', (d) => {
			const temp = d as IRelationNode;
			return 'translate(' + (temp.x ?? 0) + ', ' + (temp.y ?? 0) + ')';
		}).classed('selected', (node) => {
			const temp = node as IRelationNode;
			return !!temp.selected;
		});

		this.selectAll('.node_element circle').attr('stroke', (node) => {
			const temp = node as IRelationNode;
			if (temp.selected) {
				return this.options.strokeNodes.selected;// .bg-green-4
			} else if (selectNodeLink.some((l) => {
				return l.target === node || l.source === node;
			})) {
				return this.options.strokeNodes.link;// .bg-green-6
			} else {
				return this.options.strokeNodes.default;
			}
		}).attr('fill', function (node, ) {
			const temp = node as IRelationNode;
			if ((this instanceof Element) && $(this)?.is('.is-image')) {
				// rei@7.3.2016 globals.appBaseUrl requreid because of image might not be display when <base href="/Cloud5D/v1/client/"> href not similar to appBaseUrl
				return 'url(' + configService.appBaseUrl + '#relation-img' + temp.Id + ')';
			} else if (temp.selected) {
				return options.fillNodes.selected;// .bg-green-5
			} else if (selectNodeLink.some((l) => {
				return l.target === node || l.source === node;
			})) {
				return options.fillNodes.link;// .bg-green-8
			} else {
				return options.fillNodes.default;
			}
		});

		this.selectAll('.node_element .text').attr('dx', function (/* d */) {
			const currentElement = this as HTMLElement;
			const width = currentElement.offsetWidth ? currentElement.offsetWidth : currentElement.clientWidth;
			return -width / 2;
		});
	}

	private setSelected(node?: IRelationNode) {
		if (!node) {
			node = this.nodes.find((node) => {
				return node.isMain;
			});
		}
		this.nodes.forEach((item) => {
			item.selected = false;
		});

		if (node) {
			node.selected = true;
		}
		return node;
	}

	private getParentContainerSize() {
		return {
			width: this.element?.closest('#ui-layout-east')?.clientWidth ?? 0, // get parent container width
			height: this.element?.closest('#ui-layout-east')?.clientHeight ?? 0 // get parent container height
		};
	}

	// todo chi: in function getRange, (this instanceof HTMLElement) ? $(this)?.find('.text') return undefined
	// todo chi: generic step wizard, if the step changed or bp is changed. it should resize. does this feature need?
}