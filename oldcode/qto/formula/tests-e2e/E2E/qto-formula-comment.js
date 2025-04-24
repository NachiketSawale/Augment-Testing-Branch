/**
 * Created by hni on 2015/8/18.
 */

// eslint-disable-next-line strict
'use strict';

var API = require('framework').api;
var QTOFMAPPING = require('./qto-formula-mapping');
var QTOFDATA = require('./qto-formula-data');

// eslint-disable-next-line strict
describe('qto formula Comment container test', function () {

	let kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test  choose a rubric and formula', function () {
		kw.openAdministrationModule('QTO Formula');
		kw.selectLayout(0,'Layout 1');
		kw.chooseContainerForOneLayout(0,'Quantity takeoff Rubric');
		kw.chooseContainerForOneLayout(2,'Formula');
		kw.clickLayoutOk();
		kw.selectGrid(QTOFMAPPING.rubricCategoryGrid).then(function () {
			kw.selectGridRowWithFreeRowIndex(0);
			kw.selectGrid(QTOFMAPPING.formulaGrid).then(function () {
				kw.selectGridRowByAssignCode(QTOFDATA.UOM.FORMULA_CODE);
			});
		});
	});
	it('test the Comment container works,click the refresh and it will load data', function () {
		kw.maxContainerLayout(1, 'QTO Comment');
		kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('Comment load data successfully');
		});
	});
	it('test  add and delete button are working ', function () {
		kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add root record button works');
			});
		});
		kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test  save and search are working', function () {
		kw.selectGrid(QTOFMAPPING.commentGrid);
		kw.clickAdd();
		kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('Code',QTOFDATA.COMMENT.TEST_SAVE_SEARCH_CASE.CODE);
			kw.modifyCellValueByColumnName('Comments',QTOFDATA.COMMENT.TEST_SAVE_SEARCH_CASE.COMMENTS);
			kw.shiftAwayCursor('Code');
			kw.clickSave();
			kw.shiftAwayCursor('Comments');
			kw.selectGrid(QTOFMAPPING.commentGrid).count().then(function (count) {
				expect(count).toBe(afteradd+1);
				console.log('save and search button are working');
				kw.selectGridRowByAssignCode(QTOFDATA.COMMENT.TEST_SAVE_SEARCH_CASE.CODE);
				kw.clickDelete();
				kw.clickSave();
			});
		});

	});
});