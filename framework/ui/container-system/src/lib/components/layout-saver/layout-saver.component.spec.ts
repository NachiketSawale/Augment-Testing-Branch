import { ComponentFixture, TestBed } from '@angular/core/testing';

const data = {
	dialog: {
		modalOptions: {},
		getButtonById: jest.fn().mockReturnValue({ fn: jest.fn().mockReturnValue(undefined), isDisabled: true }),
	},
};
describe('UiContainerSystemLayoutSaverComponent', () => {
	// TODO: replace with actual test cases
	it('should create', () => {
		expect(true).toBeTruthy();
	});

});
