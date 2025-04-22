/** * Node for to-do item */
import {TreeNodeBase} from './TreeNodeBase';

export class TreeNode extends TreeNodeBase {
	public children?: TreeNode[];
}