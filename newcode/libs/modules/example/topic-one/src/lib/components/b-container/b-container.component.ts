import { Component, OnInit } from '@angular/core';
import { PropertyType } from '@libs/platform/common';
import { FieldType } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-topic-one-b-container',
	templateUrl: './b-container.component.html',
	styleUrls: ['./b-container.component.scss'],
})
export class BContainerComponent extends ContainerBaseComponent implements OnInit {
	public startDate: Date = new Date();
	public readonly fieldType = FieldType;

	public ngOnInit(): void {}

	public updateOccurrence(newValue: PropertyType ) {
		console.log('Value changed to:', newValue);
		// Handle the value change here
	}
}
