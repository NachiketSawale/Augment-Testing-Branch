/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { Component, OnInit } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';

@Component({
	selector: 'example-container-layout-demo-photo',
	templateUrl: './clerk-photo.component.html',
	styleUrls: ['./clerk-photo.component.scss'],
})
export class BasicsClerkPhotoComponent extends ContainerBaseComponent implements OnInit {

	public ngOnInit(): void {}
}
