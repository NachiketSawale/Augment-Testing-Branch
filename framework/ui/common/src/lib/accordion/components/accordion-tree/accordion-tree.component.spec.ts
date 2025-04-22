import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiCommonAccordionTreeComponent } from './accordion-tree.component';

describe('AccordionTreeComponent', () => {
	let component: UiCommonAccordionTreeComponent;
	let fixture: ComponentFixture<UiCommonAccordionTreeComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ UiCommonAccordionTreeComponent ]
		})
			.compileComponents();

		fixture = TestBed.createComponent(UiCommonAccordionTreeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
