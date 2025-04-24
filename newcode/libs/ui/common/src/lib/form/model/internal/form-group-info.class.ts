import { IFormGroup } from '../form-group.interface';
import { FormComponent } from '../../components/form/form.component';
import { FormRowInfo } from './form-row-info.class';

export class FormGroupInfo<T extends object> {
	public constructor(
		public readonly group: IFormGroup | null,
		public readonly owner: FormComponent<T>
	) {
	}

	public getFormRows() : FormRowInfo<T>[] {
		if (this.group) {
			return this.owner.getFormRowsByGroup(this.group.groupId);
		}

		return this.owner.getAllFormRows();
	}
}