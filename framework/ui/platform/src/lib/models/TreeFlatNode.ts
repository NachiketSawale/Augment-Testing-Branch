/** Flat to-do item node with expandable and level information */
import { TreeNodeBase } from './TreeNodeBase';

export class TreeFlatNode extends TreeNodeBase {
	public level?: number;
	public expandable?: boolean;
}