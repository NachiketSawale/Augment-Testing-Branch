import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UiCommonPopupTestComponent } from './popup-test.component';
import { UiCommonPopupContainerComponent } from '../popup-container/popup-container.component';

describe('PopupTestComponent', () => {
	let component: UiCommonPopupTestComponent;
	let fixture: ComponentFixture<UiCommonPopupTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonPopupTestComponent,UiCommonPopupContainerComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiCommonPopupTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
