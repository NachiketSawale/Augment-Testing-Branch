import * as dagre from 'dagre';
import { Node } from '@swimlane/ngx-graph';

/**
 * ICustomDagre interface provides  custom properties needed for graph settings.
 */
export interface IDagreGraph extends dagre.graphlib.Graph {
	_children?: object,
	_nodes?: IExtendedDagreGraphNode,
	_edgeLabels?: object
}
/**
 * Adds the properties of Custom Dagre Graph Nodes as key-value pair.
 */
interface IExtendedDagreGraphNode {
	[key: string]: IDagreGraphNode
}

/**
 * IDagreGraphNode interface extends the node interface of ngx-graph by adding custom properties.
 * This serves the purpose of adjusting the node positions and orientation of the nodes on layout.
 */
interface IDagreGraphNode extends Node {
	width: number,
	height: number,
	x: number,
	y: number,
	id: string
}
