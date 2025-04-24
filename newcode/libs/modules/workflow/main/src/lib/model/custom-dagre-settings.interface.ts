import { Orientation } from './custom-dagre-orientation.enum';
import { Alignment } from './custom-dagre-alignment.enum';

/**
 * DagreSettings interface provides an extensibility to customize the graph.
 */
export interface IDagreSettings {
	orientation?: Orientation;
	marginX?: number;
	marginY?: number;
	edgePadding?: number;
	rankPadding?: number;
	nodePadding?: number;
	align?: Alignment;
	acyclicer?: 'greedy' | undefined;
	ranker?: 'network-simplex' | 'tight-tree' | 'longest-path';
	multigraph?: boolean;
	compound?: boolean;
	curveDistance?: number;
}

