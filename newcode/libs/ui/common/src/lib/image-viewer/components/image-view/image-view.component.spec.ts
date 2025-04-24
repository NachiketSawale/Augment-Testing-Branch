import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageViewComponent } from './image-view.component';

describe('ImageViewerComponent test', () => {
	let component: ImageViewComponent;
	let fixture: ComponentFixture<ImageViewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ImageViewComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ImageViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should test imageData ', () => {
		component.isMultiple = true;
		expect(component).toBeTruthy();
	});
	it('test selectImage', () => {
		component.selectImage(1);
		expect(component.selectedIndex).toBe(1);
	});

	it('test onPrevious', () => {
		component.items = ['sdf', 'dfsafsadfsd'];
		component.selectedIndex = 1;
		component.onPrevious();
		expect(component.selectedIndex).toBe(0);
	});

	it('test onPrevious else', () => {
		component.items = ['sdf', 'dfsafsadfsd'];
		component.selectedIndex = 1;
		component.onPrevious();
		expect(component.selectedIndex).toBe(0);
	});

	it('test onNext', () => {
		component.items = ['sdf', 'dfsafsadfsd'];
		component.selectedIndex = 0;
		component.onNext();
		expect(component.selectedIndex).toBe(1);
	});
});
