/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { linter, lintGutter, Diagnostic } from '@codemirror/lint';
import { autocompletion } from '@codemirror/autocomplete';
import { StreamLanguage } from '@codemirror/language';
import { IFilterScriptState } from '../../models/interfaces/filter-script-state.interface';
import { FilterScriptLintValidator } from '../../services/filter-script-lint-validator.service';
import { highlightSelectionMatches } from '@codemirror/search';
import { filterScriptAutoCompletion } from '../../services/filter-script-autocomplete.service';
import { filterScriptHintTooltip} from '../../services/filter-script-hint-tooltip.service';
import { createFilterScriptParser } from '../../services/filter-script-parser-factory.service';
import { IFilterScriptEditorOption } from '../../models/interfaces/filter-script-editor-option.interface';
import { FilterScriptDefOptions } from '../../models/interfaces/filter-script-def-options.interface';

/**
 * Selection Statement Script editor component
 */

@Component({
  selector: 'ui-common-filter-script-editor',
  templateUrl: './filter-script-editor.component.html',
  styleUrls: ['./filter-script-editor.component.css']
})
export class UiCommonFilterScriptEditorComponent implements AfterViewInit {
  private scriptText: string;
  @Input()
  public set model(value: string) {
    if (this.scriptText != value) {
      this.scriptText = value;
      if (this.view) {
        this.updateDoc(value);
      }
    }
  }

  public get model() {
    return this.scriptText;
  }

  @Output() 
  public modelChange = new EventEmitter<string>();

  private view ?: EditorView;
  private state ?: EditorState;

  /**
   * options
   */
  @Input()
  public option?: IFilterScriptEditorOption;

  public constructor(private el: ElementRef) {
    this.scriptText = '';
  }

  public ngAfterViewInit() {
    this.option?.defProvider?.getDefs().subscribe((defs) => {
      this.state = EditorState.create({
        doc: this.model,
        extensions: [
          basicSetup,
          StreamLanguage.define<IFilterScriptState>(createFilterScriptParser(defs)),
          lineNumbers(),
          lintGutter(),
          keymap.of(defaultKeymap),
          autocompletion({
            override: [
              filterScriptAutoCompletion(defs)
            ]
          }),
          highlightSelectionMatches({
            highlightWordAroundCursor: true
          }),
          this.createFilterScriptLinter(defs),
          filterScriptHintTooltip(defs),
          EditorView.updateListener.of(v => {
            if (v.docChanged) {
              this.scriptText = v.state.doc.toString();
              this.modelChange.emit(this.scriptText);
            }
          })
        ]
      });

      this.view = new EditorView({
        state: this.state,
        parent: this.el.nativeElement
      });
    });
  }

  private updateDoc(text: string) {
    if(this.view){
      const transaction = this.view.state.update({ changes: { from: 0, to: this.view.state.doc.toString().length, insert: text } });
      this.view.dispatch(transaction);
    }
  }

  private createFilterScriptLinter(defs : FilterScriptDefOptions){
    return linter(view => {
      const diagnostics: Diagnostic[] = [];
      const errors = new FilterScriptLintValidator(view, defs).checkFilterScript();
      if (errors?.length) {
        errors.forEach(function (error) {
          diagnostics.push({
            from: error.from,
            to: error.to,
            severity: error.severity,
            message: error.reason ? error.reason : error.raw
          });
        });
      }
      return diagnostics;
    });
  }
}
