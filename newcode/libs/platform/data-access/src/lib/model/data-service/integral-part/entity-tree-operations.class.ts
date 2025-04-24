/*
 * Copyright(c) RIB Software GmbH
 */


import {IEntityTree} from '../interface/entity-tree.interface';
import { IEntityTreeOperations } from '../interface/entity-tree-operations.interface';
import { IEntitySelection } from '../interface/entity-selection.interface';
import { IEntityModification } from '../interface/entity-modification.interface';


export class EntityTreeOperations<T extends object> implements IEntityTreeOperations<T> {
	public constructor(
		protected entityTree: IEntityTree<T>,
		protected entityModification: IEntityModification<T>,
		protected entitySelection: IEntitySelection<T>,
		public onTreeParentChanged: (entity: T, newParent: T | null) => void) {
	}

	public indent(): void {
		const entities = this.entitySelection.getSelection();
		entities.forEach((entity) => {
			const newParent = this.getNewIndentParent(entity);
			if (newParent) {
				this.changeTreeParent(entity, newParent);
			}
		});
	}

	private getNewIndentParent(entity: T): T | null {
		const oldParent = this.entityTree.parentOf(entity);
		const children = oldParent ? this.entityTree.childrenOf(oldParent) : this.entityTree.getList();
		const index = children.indexOf(entity);

		return index > 0 ? children[index - 1] : null;
	}

	public canIndent(): boolean {
		const entities = this.entitySelection.getSelection();
		return entities.length > 0 && entities.every(e => this.getNewIndentParent(e) !== null);
	}

	public outdent(): void {
		const entities = this.entitySelection.getSelection();
		entities.forEach((entity) => {
			let newParent: T | null = null;
			const oldParent = this.entityTree.parentOf(entity);
			if (oldParent) {
				newParent = this.entityTree.parentOf(oldParent);
				this.changeTreeParent(entity, newParent);
			}
		});
	}

	public canOutdent(): boolean {
		const entities = this.entitySelection.getSelection();
		return entities.length > 0 && entities.every(e => this.entityTree.parentOf(e) !== null);
	}

	private changeTreeParent(entity: T, newParent: T | null){
		this.entityTree.remove(entity);
		this.entityTree.appendTo(entity, newParent);
		this.onTreeParentChanged(entity, newParent); // Execute callback func from data service
		this.entityModification.setModified(entity);
	}
}