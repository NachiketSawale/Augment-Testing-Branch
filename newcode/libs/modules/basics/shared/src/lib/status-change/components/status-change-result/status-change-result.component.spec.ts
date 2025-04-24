import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedStatusChangeResultComponent } from './status-change-result.component';
import { PlatformTranslateService, TranslatePipe } from '@libs/platform/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StatusChangeResultComponent', () => {
	let component: BasicsSharedStatusChangeResultComponent;
	let fixture: ComponentFixture<BasicsSharedStatusChangeResultComponent>;
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
			declarations: [BasicsSharedStatusChangeResultComponent, TranslatePipe],
			providers: [TranslatePipe, PlatformTranslateService],
		}).compileComponents();

		fixture = TestBed.createComponent(BasicsSharedStatusChangeResultComponent);
		component = fixture.componentInstance;
		component.results = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
