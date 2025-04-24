import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchValidationComponent } from './material-search-validation.component';
import {MATERIAL_SEARCH_VALIDATIONS} from '../../model/interfaces/material-search-validation.interface';

describe('MaterialSearchValidationComponent', () => {
	let component: BasicsSharedMaterialSearchValidationComponent;
	let fixture: ComponentFixture<BasicsSharedMaterialSearchValidationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BasicsSharedMaterialSearchValidationComponent],
			providers: [{provide: MATERIAL_SEARCH_VALIDATIONS, useValue: []}]
		}).compileComponents();

		fixture = TestBed.createComponent(BasicsSharedMaterialSearchValidationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
