/*
 * Copyright(c) RIB Software GmbH
 */

import { Node } from '@swimlane/ngx-graph';
import { IWorkflowSVGAttribute } from './workflow-designer-svg-attribute.interface';
import { IWorkflowAction } from '@libs/workflow/interfaces';

/**
 * A wrapper class for adding custom properties extending Node interface of ngx-graph library.
 */
export interface ICustomNode extends Node {
	/**
	 *Description of a node.
	 */
	label: string;
	/**
	 *Contains action details of each node.
	 */
	data: ICustomNodeData;
	/**
	 *Contains custom CSS and layout properties for defining Node on the graph.
	 */
	attribute: IWorkflowSVGAttribute;
	/**
	 *Labels for the edge.
	 */
	labelItems?: string[];
	/**
	 *Maximum depth of child nodes belonging to a  parent node
	 */
	maxChildDepth?: number;
	/**
	 *Custom properties of the child nodes.
	 */
	children?: ICustomNode[];
	/**
	 *Path URL for action icon
	 */
	actionIcon?: string;
	/**
	 * Path URL for warning or error icon.
	 */
	conditionalIcon?: string;
}
/**
 * Captures the Workflow Action data into action parameter.
 */
export interface ICustomNodeData {
	/**
	 * Contains the action details e.g. input and output parameter details.
	 */
	action: IWorkflowAction;
	/**
	 * Shape of the current node
	 */
	shape: string;
	/**
	 *Represents direct child nodes of a parent node.
	 */
	transitionLevel: number;
}
