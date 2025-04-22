import { NgModel } from '@angular/forms';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs/operators';
import { Directive, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Directive({
  selector: '[ngModel][uiDebounceChanged]'
})
export class DebounceChangeDirective implements OnDestroy {
  @Output()
  public ngModelChangeDebounce = new EventEmitter<unknown>();
  @Input()
  public ngModelChangeDebounceTime = 500; // optional, 500 default

  private subscription: Subscription;

  public ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public constructor(private ngModel: NgModel) {
    const model = this.ngModel;
    const viewToModelUpdate = model.viewToModelUpdate;
    let currentValue: unknown = null;

    model.viewToModelUpdate = (value: unknown) => {
      currentValue = value;
    };

    this.subscription = this.ngModel.control.valueChanges
      .pipe(
        skip(1), // skip initial value
        distinctUntilChanged(),
        debounceTime(this.ngModelChangeDebounceTime))
      .subscribe((value) => {
        const old = model.viewToModelUpdate;

        model.viewToModelUpdate = viewToModelUpdate;
        model.viewToModelUpdate(currentValue);
        model.viewToModelUpdate = old;

        this.ngModelChangeDebounce.emit(value);
      });
  }
}