/*
 * Copyright(c) RIB Software GmbH
 */

import { Component } from '@angular/core';
import { IFilterScriptEditorOption } from '../../models/interfaces/filter-script-editor-option.interface';
import { FilterScriptDefProvider } from '../../models/filter-script-def-provider';

@Component({
  selector: 'ui-common-filter-script-editor-test',
  templateUrl: './filter-script-editor-test.component.html',
  styleUrls: ['./filter-script-editor-test.component.css']
})
export class UiCommonFilterScriptEditorTestComponent {
  public doc: string = '[Code] == "1001"';
  public option: IFilterScriptEditorOption = {
    defProvider : new FilterScriptDefProvider()
  };
}
