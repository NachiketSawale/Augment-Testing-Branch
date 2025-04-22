/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ControlContextInjectionToken, IControlContext } from '../../model/control-context.interface';

import { TranslationComponent } from './translation.component';

describe('TranslationComponent', () => {
	let component: TranslationComponent;
	let fixture: ComponentFixture<TranslationComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'Translation',
			readonly: false,
			validationResults: [],
			entityContext:{totalCount:3}
		};
		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [TranslationComponent],
			providers: [{ provide: ControlContextInjectionToken, useValue: ctlCtx }],
		}).compileComponents();

		fixture = TestBed.createComponent(TranslationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
