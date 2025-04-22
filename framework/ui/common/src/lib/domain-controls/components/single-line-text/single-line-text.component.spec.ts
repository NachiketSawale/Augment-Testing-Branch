import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleLineTextComponent } from './single-line-text.component';
import {
	ControlContextInjectionToken,
	IControlContext
} from '../../../domain-controls/model/control-context.interface';
import { FormsModule } from '@angular/forms';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('SingleLineTextComponent', () => {
	let component: SingleLineTextComponent;
	let fixture: ComponentFixture<SingleLineTextComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'SingleLineText',
			readonly: false,
			validationResults: [],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [SingleLineTextComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(SingleLineTextComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
