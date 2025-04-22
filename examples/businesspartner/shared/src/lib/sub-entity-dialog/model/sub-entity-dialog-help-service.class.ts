import { IEntityBase, IEntityIdentification} from '@libs/platform/common';
import {cloneDeep} from 'lodash';
import {IEntityModification, IEntityList, IEntityDelete} from '@libs/platform/data-access';

export class SubEntityDialogHelpService<T extends IEntityBase & IEntityIdentification> {
	public modified: { [key: number]: T[] } = {}; // {parentId: T[]}
	public deleted: { [key: number]: T[] } = {};
	public originalList: { [key: number]: T[] | undefined | null } = {};

	public constructor(protected dataService: IEntityList<T> & IEntityModification<T> & IEntityDelete<T>) {
	}

	public resetLocal(selectedParent: IEntityIdentification, compareFn: (e: T, i: T) => number) {
		const parentKey = selectedParent.Id;
		const tempDeleted = this.deleted[parentKey];
		const tempModified = this.modified[parentKey];
		const localList = this.dataService.getList();
		const tempList: T[] = [];
		if (this.originalList[parentKey]) {
			this.originalList[parentKey]?.forEach(item => {
				const data = localList.find(e => compareFn(e, item) === 0);
				if (data) {
					tempList.push(Object.assign(data, item));
					return;
				}

				const mod = tempModified.find(e => compareFn(e, item) === 0);
				if (mod) {
					tempList.push(Object.assign(mod, item));
					return;
				}

				tempList.push(item);
			});
		}

		this.dataService.setList(tempList);
		this.dataService.clearModifications();
		this.dataService.setModified(tempModified);
		this.dataService.setDeleted(tempDeleted);
	}

	public setTemporary(selectedParent: IEntityIdentification, list: T[]) {
		const parentKey = selectedParent.Id;
		this.originalList[parentKey] = cloneDeep(list);
		this.modified[parentKey] = [...this.dataService.getModified()];
		this.deleted[parentKey] = [...this.dataService.getDeleted()];
	}

	public clearTemporary() {
		this.originalList = {};
		this.modified = {};
		this.deleted = {};
	}
}