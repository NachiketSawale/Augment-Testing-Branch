import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextEditorComponent } from './text-editor.component';
import { HttpClientModule } from '@angular/common/http';



class ResizeObserverMock{
  public observe(){}
  public unobserve(){}
  public disconnect(){}
}


global.ResizeObserver=ResizeObserverMock;

describe('TextEditorComponent', () => {
  
  // TODO: replace with actual test cases
  // it('is successful', () => {
  //   expect(true).toBeTruthy();
  // });
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientModule],
      declarations: [TextEditorComponent],
      providers:[]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
   

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
