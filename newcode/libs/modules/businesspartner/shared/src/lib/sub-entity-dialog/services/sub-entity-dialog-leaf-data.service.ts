import {DataServiceFlatLeaf, IDataServiceOptions} from '@libs/platform/data-access';
import {
	CompleteIdentification,
	IEntityBase,
	IEntityIdentification,
} from '@libs/platform/common';
import {SubEntityDialogHelpService} from '../model/sub-entity-dialog-help-service.class';
import {ISubEntityDialog} from '../model/sub-entity-dialog.interface';

export abstract class BusinesspartnerSharedSubEntityDialogLeafDataService<T extends IEntityBase & IEntityIdentification, PT extends IEntityBase & IEntityIdentification, PU extends CompleteIdentification<PT>>
	extends DataServiceFlatLeaf<T, PT, PU> implements ISubEntityDialog {

	protected helpService;

	protected constructor(dataServiceOptions: IDataServiceOptions<T>) {
		super(dataServiceOptions);
		this.helpService = new SubEntityDialogHelpService(this);

		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			this.loadSubEntities({id: 0, pKey1: parentSelection.Id});
		}
	}

	protected override onLoadSucceeded(loaded: object): T[] {
		const parentSelection = this.getSelectedParent();
		const list = loaded as T[];
		if (parentSelection) {
			this.helpService.setTemporary(parentSelection, list);
		}
		return list;
	}

	public override clearModifications() {
		super.clearModifications();
		this.helpService.clearTemporary();
	}

	public resetLocal() {
		const parentSelection = this.getSelectedParent();
		if (!parentSelection) {
			return;
		}
		const comparer = this.assertComparer();
		this.helpService.resetLocal(parentSelection, comparer.compare);
	}

	public setTemporary() {
		const parentSelection = this.getSelectedParent();
		if (!parentSelection) {
			return;
		}
		const list = this.getList();
		this.helpService.setTemporary(parentSelection, list);
	}
}