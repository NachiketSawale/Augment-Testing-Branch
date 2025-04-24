import { UiCommonLookupContentPipe } from './lookup-content.pipe';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlatformConfigurationService } from '@libs/platform/common';

describe('LookupContentPipe', () => {

	let pipe: UiCommonLookupContentPipe<object, object>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports:[HttpClientTestingModule],
			declarations: [],
			providers:[UiCommonLookupContentPipe, PlatformConfigurationService]
		}).compileComponents();
		pipe = TestBed.inject(UiCommonLookupContentPipe);
	});

	it('create an instance', () => {

		expect(pipe).toBeTruthy();
	});
});
