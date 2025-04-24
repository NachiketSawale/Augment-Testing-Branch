/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScriptComponent } from './script.component';

import {
	ControlContextInjectionToken
} from '../../../domain-controls/model/control-context.interface';
import { FormsModule } from '@angular/forms';
import { IScriptControlContext } from '../../model/script-control-context.interface';
import { CodemirrorLanguageModes } from '../../../model/script/codemirror-language-modes.enum';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('ScriptComponent', () => {
	let component: ScriptComponent;
	let fixture: ComponentFixture<ScriptComponent>;

	beforeEach(async () => {
		const ctlCtx: IScriptControlContext = {
			fieldId: 'ScriptControlText',
			readonly: false,
			validationResults: [],
			editorOptions: {
				languageMode: CodemirrorLanguageModes.JavaScript,
				multiline: false,
				readOnly: false,
				enableLineNumbers: false
			},
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [ScriptComponent],
			providers: [
				{ provide: ControlContextInjectionToken, useValue: ctlCtx }
			]
		}).compileComponents();

		fixture = TestBed.createComponent(ScriptComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
