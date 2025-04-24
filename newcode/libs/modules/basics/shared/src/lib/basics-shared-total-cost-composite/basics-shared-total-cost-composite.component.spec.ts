import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedTotalCostCompositeComponent, COST_TOTAL_OPTIONS_TOKEN } from './basics-shared-total-cost-composite.component';
import { ControlContextInjectionToken, IControlContext, ILookupReadonlyDataService, LookupEvent, UiCommonModule } from '@libs/ui/common';
import { IEntityContext, PropertyType } from '@libs/platform/common';
import { of } from 'rxjs';

describe('BasicsSharedTotalCostCompositeComponent', () => {
	let component: BasicsSharedTotalCostCompositeComponent<object, object>;
	let fixture: ComponentFixture<BasicsSharedTotalCostCompositeComponent<object, object>>;
	let mockLookupOptions: ILookupReadonlyDataService<object, object> & { placeHolder?: string };
	let mockControlContext: IControlContext<PropertyType, object>;

	beforeEach(async () => {
		mockLookupOptions = {
			config: {
				descriptionMember: 'description',
				displayMember: 'display',
			},
			placeHolder: 'placeholder',
		} as ILookupReadonlyDataService<object, object> & { placeHolder?: string };

		mockLookupOptions.getItemByKey = jest.fn().mockReturnValue(of({}));

		mockControlContext = {
			entityContext: {} as IEntityContext<object>,
			value: 100,
		} as IControlContext<PropertyType, object>;

		await TestBed.configureTestingModule({
			imports: [UiCommonModule],
			declarations: [BasicsSharedTotalCostCompositeComponent],
			providers: [
				{ provide: COST_TOTAL_OPTIONS_TOKEN, useValue: mockLookupOptions },
				{ provide: ControlContextInjectionToken, useValue: mockControlContext },
			],
		}).compileComponents();

		fixture = TestBed.createComponent(BasicsSharedTotalCostCompositeComponent);
		component = fixture.componentInstance;
		// TODO: how to fix NG0100
		//fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should return the data service', () => {
		expect(component.dataService).toBe(mockLookupOptions);
	});

	it('should return the context', () => {
		expect(component.context).toBe(mockControlContext.entityContext);
	});

	it('should return the lookup value', () => {
		expect(component.lookupValue).toBe(100);
	});

	it('should update control context value on selected item change', () => {
		const event: LookupEvent<object, object> = { selectedItem: { description: 200 } } as LookupEvent<object, object>;
		component.selectedItemChanged(event);
		expect(mockControlContext.value).toBe(200);
	});

	it('should return the placeholder value if defined', () => {
		expect(component.value).toBe('placeholder');
	});

	it('should return the control context value if placeholder is not defined', () => {
		mockLookupOptions.placeHolder = undefined;
		expect(component.value).toBe(100);
	});

	it('should set the control context value', () => {
		component.value = 300;
		expect(mockControlContext.value).toBe(300);
	});

	it('should return true for readOnly if placeholder is defined', () => {
		expect(component.readOnly).toBeTruthy();
	});

	it('should return false for readOnly if placeholder is not defined', () => {
		mockLookupOptions.placeHolder = undefined;
		expect(component.readOnly).toBeFalsy();
	});
});
