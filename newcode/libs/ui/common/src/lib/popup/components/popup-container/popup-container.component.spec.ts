import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonPopupContainerComponent } from './popup-container.component';

describe('PopupContainerComponent', () => {
	let component: UiCommonPopupContainerComponent;
	let fixture: ComponentFixture<UiCommonPopupContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UiCommonPopupContainerComponent],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UiCommonPopupContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
