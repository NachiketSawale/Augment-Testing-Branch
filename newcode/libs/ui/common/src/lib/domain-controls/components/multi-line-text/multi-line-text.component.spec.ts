import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineTextComponent } from './multi-line-text.component';
import {
	ControlContextInjectionToken,
	IControlContext
} from '../../../domain-controls/model/control-context.interface';
import { FormsModule } from '@angular/forms';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('MultiLineTextComponent', () => {
	let component: MultiLineTextComponent;
	let fixture: ComponentFixture<MultiLineTextComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'MultiLineText',
			readonly: false,
			validationResults: [],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [MultiLineTextComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(MultiLineTextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
