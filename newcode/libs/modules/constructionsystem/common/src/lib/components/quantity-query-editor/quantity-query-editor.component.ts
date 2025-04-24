/*
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Tag } from '@lezer/highlight';

import { QUANTITY_QUERY_EDITOR_SERVICE_TOKEN } from '../../service/quantity-query-editor/quantity-query-editor.service';
import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { createQuantityQueryParser } from '../../service/quantity-query-editor/stream-parser.service';
import { IQueryEditorState } from '../../model/entities/quantity-query-editor/query-editor-state.interface';
import { RibFunctionTag } from '../../model/enums/quantity-query-editor/rib-function-tag.enum';
import { Compartment, EditorState } from '@codemirror/state';

@Component({
	selector: 'constructionsystem-common-quantity-query-editor',
	templateUrl: './quantity-query-editor.component.html',
	styleUrls: ['./quantity-query-editor.component.scss'],
	standalone: true,
})
export class QuantityQueryEditorComponent extends ContainerBaseComponent implements AfterViewInit {
	public readonly quantityQueryEditorService = inject(QUANTITY_QUERY_EDITOR_SERVICE_TOKEN);
	public readonly languageMenuService = this.quantityQueryEditorService.languageMenuService;

	@ViewChild('editorContainer', { static: true })
	public editorContainer!: ElementRef;
	public editor?: EditorView;
	private readonly highLightStyle: HighlightStyle;
	private readonly ribTags: { [name: string]: Tag | readonly Tag[] };

	public constructor() {
		super();
		this.languageMenuService.addLanguageButton(this.uiAddOns.toolbar);
		this.quantityQueryEditorService.parameterSelectionChanged();
		this.ribTags = this.defineCustomizeTag();
		this.highLightStyle = this.defineCustomizeHighLight();
	}

	public ngAfterViewInit() {
		this.quantityQueryEditorService.getDefaultLanguageCode().then((lan) => {
			this.quantityQueryEditorService.setRibFunctionsXMLAndUom(null, lan).then((data) => {
				const readOnlyCompartment = new Compartment();
				this.editor = new EditorView({
					doc: '// Start Code:',
					parent: this.editorContainer.nativeElement,
					extensions: [
						basicSetup,
						syntaxHighlighting(this.highLightStyle),
						StreamLanguage.define<IQueryEditorState>(createQuantityQueryParser(this.quantityQueryEditorService, this.ribTags)),
						readOnlyCompartment.of(EditorState.readOnly.of(false)),
						javascript({ typescript: true }),
					],
				});
				this.quantityQueryEditorService.editor = this.editor;
				this.quantityQueryEditorService.readOnlyCompartment = readOnlyCompartment;
			});
		});
	}

	private defineCustomizeTag() {
		return {
			functionName: Tag.define(),
			parameterName: Tag.define(),
			parameterValue: Tag.define(),
			operator: Tag.define(),
			assignOperator: Tag.define(),
			parameterValueSeperator: Tag.define(),
			startParameterValueQuoto: Tag.define(),
			endParameterValueQuoto: Tag.define(),
			number: Tag.define(),
			string: Tag.define(),
			blankSpace: Tag.define(),
		};
	}

	private defineCustomizeHighLight() {
		return HighlightStyle.define([
			{ tag: this.ribTags[RibFunctionTag.FunctionName], class: 'cm-quantity-query-functionName' },
			{ tag: this.ribTags[RibFunctionTag.ParameterName], class: 'cm-quantity-query-parameterName' },
			{ tag: this.ribTags[RibFunctionTag.ParameterValue], class: 'cm-quantity-query-parameterValue' },
			{ tag: this.ribTags[RibFunctionTag.Operator], class: 'cm-quantity-query-operator' },
			{ tag: this.ribTags[RibFunctionTag.AssignOperator], class: 'cm-quantity-query-assignOperator' },
			{
				tag: this.ribTags[RibFunctionTag.ParameterValueSeperator],
				class: 'cm-quantity-query-parameterValueSeperator',
			},
			{
				tag: this.ribTags[RibFunctionTag.StartParameterValueQuoto],
				class: 'cm-quantity-query-startParameterValueQuoto',
			},
			{
				tag: this.ribTags[RibFunctionTag.EndParameterValueQuoto],
				class: 'cm-quantity-query-endParameterValueQuoto',
			},
			{ tag: this.ribTags[RibFunctionTag.Number], class: 'cm-quantity-query-number' },
			{ tag: this.ribTags[RibFunctionTag.String], class: 'cm-quantity-query-string' },
			{ tag: this.ribTags[RibFunctionTag.BlankSpace], class: 'cm-quantity-query-blankSpace' },
		]);
	}
}
