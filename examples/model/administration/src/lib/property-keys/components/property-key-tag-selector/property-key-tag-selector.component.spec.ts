/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { ControlContextInjectionToken, IControlContext } from '@libs/ui/common';
import { PropertyKeyTagSelectorComponent } from './property-key-tag-selector.component';

describe('PropertyKeyTagSelectorComponent', () => {
	let component: PropertyKeyTagSelectorComponent;
	let fixture: ComponentFixture<PropertyKeyTagSelectorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [PropertyKeyTagSelectorComponent, TranslatePipe],
			providers: [TranslatePipe, PlatformTranslateService, {
				provide: ControlContextInjectionToken,
				useValue: <IControlContext>{
					value: [1, 2],
					readonly: false,
					fieldId: 'tagIds',
					validationResults: [],
					entityContext: {
						entity: {},
						indexInSet: 0,
						totalCount: 1
					}
				}
			}]
		}).compileComponents();

		fixture = TestBed.createComponent(PropertyKeyTagSelectorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
