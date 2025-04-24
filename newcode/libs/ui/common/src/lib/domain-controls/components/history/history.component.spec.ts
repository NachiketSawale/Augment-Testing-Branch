import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HistoryComponent } from './history.component';
import {
	ControlContextInjectionToken,
	IControlContext
} from '../../model/control-context.interface';
import { FormsModule } from '@angular/forms';
import {IEntityContext, MinimalEntityContext} from '@libs/platform/common';

describe('HistoryComponent', () => {
	let component: HistoryComponent;
	let fixture: ComponentFixture<HistoryComponent>;

	beforeEach(async () => {
		const ctlCtx: IControlContext = {
			fieldId: 'Code',
			readonly: false,
			validationResults: [],
			get entityContext(): IEntityContext<object> {
				return new MinimalEntityContext();
			}
		};

		await TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [HistoryComponent],
			providers: [
				{provide: ControlContextInjectionToken, useValue: ctlCtx}
			]
		}).compileComponents();

		fixture = TestBed.createComponent(HistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
