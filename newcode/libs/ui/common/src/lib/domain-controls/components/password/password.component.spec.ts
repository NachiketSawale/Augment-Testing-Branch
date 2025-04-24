import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordComponent } from './password.component';
import {
	ControlContextInjectionToken,
	IControlContext
} from '../../model/control-context.interface';
import { FormsModule } from '@angular/forms';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('PasswordComponent', () => {
	let component: PasswordComponent;
	let fixture: ComponentFixture<PasswordComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'Key',
			readonly: false,
			validationResults: [],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [PasswordComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(PasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
