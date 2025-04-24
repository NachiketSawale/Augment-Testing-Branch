import { Graph, Layout, Edge, Node } from '@swimlane/ngx-graph';
import * as dagre from 'dagre';
import { Orientation } from '../model/custom-dagre-orientation.enum';
import { Alignment } from '../model/custom-dagre-alignment.enum';
import { IDagreSettings } from '../model/custom-dagre-settings.interface';
import { IDagreGraph } from '../model/custom-dagre.interface';
import { IDagreNode } from '../model/custom-dagre-node.interface';

const DEFAULT_EDGE_NAME = '\x00';
const EDGE_KEY_DELIM = '\x01';

/**
 * The WorkflowDesignerCustomLayout serves the purpose of customizing the graph layout settings using custom dagre.
 * dagre library is used by ngx-graph to provide default layout settings for rendering graph.
 *
 * Reference - https://github.com/swimlane/ngx-graph/blob/master/src/docs/demos/components/ngx-graph-custom-curve/customDagreNodesOnly.ts
 */
export class WorkflowDesignerCustomLayout implements Layout {

	public defaultSettings: IDagreSettings = {
		orientation: Orientation.LEFT_TO_RIGHT,
		marginX: 30,
		marginY: 10,
		edgePadding: 100,
		rankPadding: 100,
		nodePadding: 100,
		curveDistance: 20,
		align: Alignment.UP_LEFT,
		multigraph: false,
		compound: true
	};
	public settings: IDagreSettings = {};

	public dagreGraph!: IDagreGraph;
	public dagreNodes!: IDagreNode[];
	public dagreEdges!: Edge[];

	/**
	 * An extension of the Layout interface, this function iterates through each node and edge
	 * Also, customizes the layout positions of nodes.
	 * @param graph
	 * @returns
	 */
	public run(graph: Graph): Graph {
		this.createDagreGraph(graph);
		dagre.layout(this.dagreGraph);

		graph.edgeLabels = this.dagreGraph._edgeLabels;

		for (const dagreNodeId in this.dagreGraph._nodes) {
			const dagreNode = this.dagreGraph._nodes[dagreNodeId];
			const node: Node | undefined = graph.nodes.find(n => n.id === dagreNode.id);
			if (node) {
				node.dimension = {
					width: dagreNode.width,
					height: dagreNode.height
				};
			}
		}
		for (const edge of graph.edges) {
			this.updateEdge(graph, edge);
		}

		return graph;
	}

	/**
	 *Updates an edge in the graph by modifying its object property values.
	 * @param {Graph} graph - contains array of nodes , edges , edge labels etc.
	 * @param {Edge} edge - An object of parameters to be modified.
	 * @returns A new graph with modified object property values.
	 */

	public updateEdge(graph: Graph, edge: Edge): Graph {
		const sourceNode = graph.nodes.find(n => n.id === edge.source);
		const targetNode = graph.nodes.find(n => n.id === edge.target);
		if (sourceNode && targetNode && sourceNode.position && targetNode.position && sourceNode.dimension && targetNode.dimension) {
			const rankAxis: 'x' | 'y' = this.settings.orientation === 'BT' || this.settings.orientation === 'TB' ? 'y' : 'x'; //x
			const orderAxis: 'x' | 'y' = rankAxis === 'y' ? 'x' : 'y'; //y
			const rankDimension = rankAxis === 'y' ? 'height' : 'width'; //width
			// determine new arrow position
			const dir = sourceNode.position[rankAxis] <= targetNode.position[rankAxis] ? -1 : 1;
			let startingPoint = {
				[orderAxis]: sourceNode.position[orderAxis],
				[rankAxis]: sourceNode.position[rankAxis] - dir * ((sourceNode.dimension[rankDimension]) / 2)
			};
			if (sourceNode.data.shape === 'polygon' && targetNode.data.transitionLevel > 0) {
				startingPoint = {
					[orderAxis]: sourceNode.position[orderAxis],
					[rankAxis]: sourceNode.position[rankAxis]
				};
			}
			const endingPoint = {
				[orderAxis]: targetNode.position[orderAxis],
				[rankAxis]: targetNode.position[rankAxis] + dir * (targetNode.dimension[rankDimension] / 2)
			};

			// generate new points
			edge.points = [startingPoint, endingPoint];
		}

		const edgeLabelId = `${edge.source}${EDGE_KEY_DELIM}${edge.target}${EDGE_KEY_DELIM}${DEFAULT_EDGE_NAME}`;
		const matchingEdgeLabel = graph.edgeLabels[edgeLabelId];
		if (matchingEdgeLabel) {
			matchingEdgeLabel.points = edge.points;
		}
		return graph;
	}


	/**
	 * This function is responsible for adjusting the node height, width, position etc and set the edges to define the relation
	 * between the nodes.
	 * @param graph
	 */
	public createDagreGraph(graph: Graph): void {
		const settings = Object.assign({}, this.defaultSettings, this.settings);
		this.dagreGraph = new dagre.graphlib.Graph({ compound: settings.compound, multigraph: settings.multigraph });
		this.dagreGraph.setGraph({
			rankdir: settings.orientation,
			marginx: settings.marginX,
			marginy: settings.marginY,
			edgesep: settings.edgePadding,
			ranksep: settings.rankPadding,
			nodesep: settings.nodePadding,
			align: settings.align,
			acyclicer: settings.acyclicer,
			ranker: settings.ranker,
			compound: settings.compound
		});

		// Default to assigning a new object as a label for each new edge.
		this.dagreGraph.setDefaultEdgeLabel(() => {
			return {
				/* empty */
			};
		});

		this.dagreNodes = graph.nodes.map(n => {
			const node: IDagreNode = Object.assign({}, n);
			if (n.dimension && n.position) {
				node.width = n.dimension.width;
				node.height = n.dimension.height;
				node.x = n.position.x;
				node.y = n.position.y;
			}
			return node;
		});

		this.dagreEdges = graph.edges.map(l => {
			let linkId: number = 1;
			const newLink: Edge = Object.assign({}, l);
			if (!newLink.id) {
				newLink.id = 'a' + linkId.toString();
				linkId++;
			}
			return newLink;
		});

		for (const node of this.dagreNodes) {
			if (!node.width) {
				node.width = 20;
			}
			if (!node.height) {
				node.height = 30;
			}

			// update dagre node
			this.dagreGraph.setNode(node.id, node);
		}

		// update dagre edge
		for (const edge of this.dagreEdges) {
			if (settings.multigraph) {
				this.dagreGraph.setEdge(edge.source, edge.target, edge, edge.id);
			} else {
				this.dagreGraph.setEdge(edge.source, edge.target);
			}
		}
	}
}