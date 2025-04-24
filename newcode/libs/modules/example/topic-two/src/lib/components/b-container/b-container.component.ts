import { Component, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-topic-two-b-container',
	templateUrl: './b-container.component.html',
	styleUrls: ['./b-container.component.scss'],
})
export class BContainerComponent extends ContainerBaseComponent implements OnInit {

	public ngOnInit(): void {}
}
