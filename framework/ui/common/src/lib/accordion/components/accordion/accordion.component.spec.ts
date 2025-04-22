
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAccordion } from '@angular/material/expansion';

import { UiCommonAccordionComponent } from './accordion.component';
import { UiCommonAccordionTreeComponent } from '../accordion-tree/accordion-tree.component';

describe('AccordionComponent', () => {
	let component: UiCommonAccordionComponent;
	let fixture: ComponentFixture<UiCommonAccordionComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ MatAccordion ],
			declarations: [UiCommonAccordionComponent, UiCommonAccordionTreeComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(UiCommonAccordionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
