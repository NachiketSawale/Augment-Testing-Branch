import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedMaterialSearchCollapseComponent } from './material-search-collapse.component';
import {PlatformCommonModule} from '@libs/platform/common';
import {HttpClientModule} from '@angular/common/http';

describe('MaterialSearchCollapseComponent', () => {
	let component: BasicsSharedMaterialSearchCollapseComponent;
	let fixture: ComponentFixture<BasicsSharedMaterialSearchCollapseComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BasicsSharedMaterialSearchCollapseComponent],
			imports: [PlatformCommonModule, HttpClientModule]
		}).compileComponents();

		fixture = TestBed.createComponent(BasicsSharedMaterialSearchCollapseComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
