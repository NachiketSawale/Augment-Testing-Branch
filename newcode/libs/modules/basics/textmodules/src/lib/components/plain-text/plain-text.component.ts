import {Component} from '@angular/core';
import {BasicsSharedPlainTextExtendComponent} from '@libs/basics/shared';
import {set} from 'lodash';
import {BasicsTextModulesScope} from '../../model/basics-textmodules-scope';
import {BasicsTextModulesTextDataService} from '../../services/text-modules-text-data.service';
import {TextFormatTypes} from '../../model/types/text-format.type';

@Component({
	selector: 'basics-textmodules-plain-text',
	templateUrl: './plain-text.component.html',
	styleUrl: './plain-text.component.scss',
})
export class PlainTextComponent<T extends object> extends BasicsSharedPlainTextExtendComponent<T> {
	private dataService: BasicsTextModulesTextDataService;

	public scope: BasicsTextModulesScope;

	public constructor() {
		super();
		this.dataService = this.entitySelection as unknown as BasicsTextModulesTextDataService;

		this.scope = this.dataService.scope;
	}

	public override ngOnInit() {
		set(this.scope, 'textFormatFk', TextFormatTypes.html);
		set(this.scope, 'contentField', 'TextClob');
		set(this.scope, 'isVariableVisible', true);
		set(this.scope, 'showTableBtn', false);
	}

	public override handleChange(value: string) {
		super.handleChange(value);
	}

	public override setText(value: string) {
		if (this.scope.oldContent) {
			this.scope.oldContent.Content = value;
		}

		this.accessor.setText(this.scope.translation! as T, value);

		this.dataService.setModified(this.scope.translation ?? []);
	}
}
