/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { ScriptDefService } from '../../services/script-def.service';
import { IScriptEditorOptions } from '../../model/interfaces/script-editor-options.interface';

@Component({
	selector: 'ui-common-script-editor-test',
	templateUrl: './script-editor-test.component.html',
	styleUrls: ['./script-editor-test.component.scss'],
})
export class UiCommonScriptEditorTestComponent {
	public doc: string = '// codemirrow6';

	public config: IScriptEditorOptions;

	public readonly = false;

	private readonly defService = inject(ScriptDefService);

	public constructor() {
		this.config = {
			defProvider: this.defService
		};
	}


	public test() {
		this.doc = '// codemirrow6';
	}
}
