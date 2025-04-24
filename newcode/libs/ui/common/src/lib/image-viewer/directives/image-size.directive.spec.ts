/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {PlatformModuleManagerService} from '@libs/platform/common';

import { ImageSizeDirective } from './image-size.directive';


@Component({
	selector: 'ui-common-test',
	template: '<ui-common-image-view> <img #container src="#" uiImageViewerImageSize alt="" /> </ui-common-image-view>',
	styles: [],
})
class ImageSizeDirectiveTestComponent {
	public constructor(public platformModuleManagerService: PlatformModuleManagerService) {}
}
describe('Test ImageSizeDirective', () => {
	let component: ImageSizeDirectiveTestComponent;
	let fixture: ComponentFixture<ImageSizeDirectiveTestComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ImageSizeDirectiveTestComponent, ImageSizeDirective],
			imports: [HttpClientModule],
		}).compileComponents();

		fixture = TestBed.createComponent(ImageSizeDirectiveTestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should test directive', () => {
		component.platformModuleManagerService.isResize$.next(true);
	});
});
