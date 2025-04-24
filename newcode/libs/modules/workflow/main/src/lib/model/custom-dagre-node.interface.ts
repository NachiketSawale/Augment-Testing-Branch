import { Node } from '@swimlane/ngx-graph';
/**
 *IDagreNode captures the additional properties received from elements during run time.
 */
export interface IDagreNode extends Node {
	width?: number,
	height?: number,
	x?: number,
	y?: number
}
