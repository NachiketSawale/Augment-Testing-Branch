import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorRulerComponent } from './text-editor-ruler.component';
import { TextEditorComponent } from '../text-editor/text-editor.component';

describe('TextEditorRulerComponent', () => {
	let component: TextEditorRulerComponent;
	let fixture: ComponentFixture<TextEditorRulerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TextEditorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TextEditorRulerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
