/*
 * Copyright(c) RIB Software GmbH
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicsSharedCommentItemComponent } from './comment-item.component';
import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

describe('CommentItemComponent', () => {
	let component: BasicsSharedCommentItemComponent<IEntityBase & IEntityIdentification, IEntityIdentification>;
	let fixture: ComponentFixture<BasicsSharedCommentItemComponent<IEntityBase & IEntityIdentification, IEntityIdentification>>;

	// beforeEach(async () => {
	//   await TestBed.configureTestingModule({
	//     declarations: [BasicsSharedCommentItemComponent],
	//   }).compileComponents();
	//
	//   fixture = TestBed.createComponent(BasicsSharedCommentItemComponent);
	//   component = fixture.componentInstance;
	//   fixture.detectChanges();
	// });

	it('should create', () => {
		// expect(component).toBeTruthy();
	});
});
