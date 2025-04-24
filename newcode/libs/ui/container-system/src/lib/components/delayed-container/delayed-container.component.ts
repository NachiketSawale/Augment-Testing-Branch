import { Component } from '@angular/core';
import { ContainerBaseComponent } from '../container-base/container-base.component';

@Component({
	selector: 'ui-container-system-delayed-container',
	templateUrl: './delayed-container.component.html',
	styleUrls: ['./delayed-container.component.scss'],
})
export class DelayedContainerComponent extends ContainerBaseComponent {}
