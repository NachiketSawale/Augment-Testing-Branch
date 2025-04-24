import { Component, inject, Injector, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Circular2 } from '../../model/circular2.class';

@Component({
	selector: 'example-topic-two-a-container',
	templateUrl: './a-container.component.html',
	styleUrls: ['./a-container.component.scss'],
})
export class AContainerComponent extends ContainerBaseComponent implements OnInit {

	public readonly injector = inject(Injector);

	public ngOnInit(): void {
		new Circular2(this.injector);
	}
}
