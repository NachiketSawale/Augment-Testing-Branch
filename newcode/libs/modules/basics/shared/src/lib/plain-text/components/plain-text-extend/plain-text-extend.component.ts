import {Component} from '@angular/core';
import {BasicsSharedPlainTextContainerComponent} from '../plain-text-container/plain-text-container.component';
import * as _ from 'lodash';


@Component({
	selector: 'basics-shared-plain-text-extend',
	templateUrl: './plain-text-extend.component.html',
	styleUrl: './plain-text-extend.component.scss',
})
export class BasicsSharedPlainTextExtendComponent<T extends object> extends BasicsSharedPlainTextContainerComponent<T> {
	public parentService?: object;
	private S_ParentService = 'ParentService';

	public constructor() {
		super();

		this.parentService = _.get(this.entitySelection, this.S_ParentService);
	}

	public override handleChange(value: string) {
		if (this.parentService) {
			this.setParentModified();
		}

		this.setText(value);
	}

	public setText(value: string) {
		super.handleChange(value);
	}

	public setParentModified() {
		const selections = _.map(this.parentService, _.method('getSelection')).filter(e => e !== undefined);
		if (selections && selections.length > 0) {
			_.map(this.parentService, _.method('setModified', selections[0]));
		}
	}

	public override ngOnInit() {
		super.ngOnInit();
	}
}
