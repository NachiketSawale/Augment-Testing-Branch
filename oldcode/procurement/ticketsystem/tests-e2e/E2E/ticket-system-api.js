/**
 * Created by hni on 7/13/2016.
 */
//jshint ignore:start
var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var suite=require('rib-reporters');
var q = require('q');
var kw;
kw = API.createNewAPI();
function setSearchWordForTicketSystemAndSearch(value) {
    suite.logStep('ticketsystem - search ' + value);

    var searchInputElement = element(by.findTicketSystemElement(MAPPING.TICKET_SYSTEM.SEARCH_CONDITION));
    searchInputElement.click();
    browser.sleep(2000);
    searchInputElement.clear();
    searchInputElement.sendKeys(value);
    element(by.findTicketSystemElement(MAPPING.TICKET_SYSTEM.SEARCH_BUTTON)).click();
}
function checkSearchResultInSearchUI() {
    var searchResult;
    searchResult = element.all(by.findTicketSystemElement(MAPPING.TICKET_SYSTEM.SEARCH_RESULT));
    suite.logStep('ticketsystem -search- check Search ');
    return searchResult.count();
}

function checkSearchResultInCartItemUI() {
    var searchResult;
        searchResult = element.all(by.findTicketSystemElement(MAPPING.TICKET_SYSTEM.CART_ITEM_RESULT));
    suite.logStep('ticketsystem - -cart item check Search ');
    return searchResult.count();
}

function setQuantityForSearchUIByInput(resultIndex, quantity) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantity(resultIndex, MAPPING.TICKET_SYSTEM.QUANTITY_INPUT));
    suite.logStep('ticketsystem-search - check Search by input');
    quantityAddOrDecrease.click();
    browser.sleep(2000);
    quantityAddOrDecrease.element(by.css('input[type="text"]')).clear();
    quantityAddOrDecrease.element(by.css('input[type="text"]')).sendKeys(quantity);
}
function setQuantityForCartItemUIByInput(resultIndex, quantity) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantityInCartItemContainer(resultIndex, MAPPING.TICKET_SYSTEM.QUANTITY_INPUT));
    suite.logStep('ticketsystem --cart item check Search by input');
    quantityAddOrDecrease.click();
    browser.sleep(2000);
    quantityAddOrDecrease.element(by.css('input[type="text"]')).clear();
    quantityAddOrDecrease.element(by.css('input[type="text"]')).sendKeys(quantity);
}

function setQuantityForSearchUIByButton(resultIndex, buttonMapping) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantity(resultIndex, buttonMapping));
    suite.logStep('ticketsystem - add Quantity by click button: ' + buttonMapping);
    quantityAddOrDecrease.click();
}
function setQuantityForCartItemUIByButton(resultIndex, buttonMapping) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantityInCartItemContainer(resultIndex, buttonMapping));
    suite.logStep('ticketsystem - add Quantity by click button: ' + buttonMapping);
    quantityAddOrDecrease.click();
}


function checkQuantityForSearchUI(resultIndex, quantity) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantity(resultIndex, MAPPING.TICKET_SYSTEM.QUANTITY_INPUT));
    suite.logStep('ticket System ' + 'search :' + 'check quantity');
    quantityAddOrDecrease.click();
    browser.sleep(2000);
    var quantityText = quantityAddOrDecrease.element(by.css('input[data-ng-show="!editing"]'));
    quantityText.getAttribute('value').then(function (attr) {
        expect(attr).toBe(quantity);
    });
}
function checkQuantityForCartItemUI(resultIndex, quantity) {
    var quantityAddOrDecrease;
    quantityAddOrDecrease = element(by.addOrDecreaseOrInoutItemQuantityInCartItemContainer(resultIndex, MAPPING.TICKET_SYSTEM.QUANTITY_INPUT));
    suite.logStep('ticket System ' + 'Cart Item' + 'check quantity');
    quantityAddOrDecrease.click();
    browser.sleep(2000);
    var quantityText = quantityAddOrDecrease.element(by.css('input[data-ng-show="!editing"]'));
    quantityText.getAttribute('value').then(function (attr) {
        expect(attr).toBe(quantity);
    });
}
function checkCartItemForTicketSystem() {
    suite.logStep('ticket System -cart item :check cart item quantity');
    var cartItem = element(by.findTicketSystemElement(MAPPING.TICKET_SYSTEM.CART_ITEM_COUNT));
    return cartItem.getText();
}


function clickEmptyOrSubmitButtonForTicketSystem(EmptyOrSubmitButtonMapping) {
    suite.logStep('ticket System -cart item :click button:' + EmptyOrSubmitButtonMapping);
    var EmptyOrSubmitButton = element(by.findTicketSystemElement(EmptyOrSubmitButtonMapping));
    EmptyOrSubmitButton.click();
}

function findSubmitPopUpElement(labelType, labelName) {
    var popUpElement;
    var cellInput;
    if (labelType === 'remark') {
        popUpElement = MAPPING.VALIDATION.REMARK;
    }
    else if (labelType === 'dialog') {
        popUpElement = MAPPING.VALIDATION.DIALOG;
    }
    else if (labelType === 'button') {
        popUpElement = MAPPING.VALIDATION.DIALOG_BUTTON;
    }
    cellInput = element(by.getAddValidationCellByLabelName(labelName, popUpElement));
    return cellInput;
}

function searchValueInDialogUI(searchInput) {
    var inputGroup = element(by.getDialogInputGroup(MAPPING.DIALOG.INPUT_GROUP.SEARCH_INPUT));
    inputGroup.clear();
    inputGroup.sendKeys(searchInput);
    element(by.getDialogInputGroup(MAPPING.DIALOG.INPUT_GROUP.SEARCH_BUTTON)).click();
    element(by.getLookupCellByOptions(MAPPING.DIALOG.DIALOG_RECORD, searchInput)).click();
    element(by.getLookupCellByOptions(MAPPING.DIALOG.DIALOG_COMMIT, 'OK')).click();
}

function findValidationFieldBYLabelName(labelType, labelName) {
    var cellInput = findSubmitPopUpElement(labelType, labelName);
    cellInput.click();
    sleep();
}

function setInputValueForTicketSystemSubmitDialog(labelType, labelName, cellValue) {
    suite.logStep('set value to input field:' + labelName + ':' + cellValue);
    var cellInput = findSubmitPopUpElement(labelType, labelName);
    cellInput.click();
    sleep();
    cellInput.clear();
    cellInput.sendKeys(cellValue);
}

function setDialogValueByButtonForTicketSystemSubmitDialog(labelType, labelName, searchInput) {
    suite.logStep('set value to dialog field:' + labelName + ':' + searchInput);
    var cellButton = findSubmitPopUpElement(labelType, labelName);
    cellButton.click();
    searchValueInDialogUI(searchInput);
}

function getReqCodeFromXX(text) {
    var arr = text.split(':');
    if (arr.length > 1) {
        return arr[1];
    }
    return null;
}

function getReqCodeFromTicketSystem() {
    var code;
    code = kw.getReqCde();
    return code;
}
function getReqCodeAfterSubmitFromTicketSystem() {
    suite.logStep('get req code after submit successfully from ticket System');
    var findReqCode = by.findTicketSystemReqCode();
    var defer = q.defer();
    element(findReqCode).getText().then(function (text) {
        var reqCode = text.split(':')[1];
        kw.setReqCode(reqCode);
        defer.resolve(reqCode);
    });
    return defer.promise;
}



module.exports = {
    setSearchWordForTicketSystemAndSearch: setSearchWordForTicketSystemAndSearch,
    checkSearchResultInSearchUI: checkSearchResultInSearchUI,
    checkSearchResultInCartItemUI: checkSearchResultInCartItemUI,
    setQuantityForSearchUIByButton: setQuantityForSearchUIByButton,
    setQuantityForCartItemUIByButton: setQuantityForCartItemUIByButton,
    checkQuantityForSearchUI: checkQuantityForSearchUI,
    checkQuantityForCartItemUI: checkQuantityForCartItemUI,
    setQuantityForSearchUIByInput: setQuantityForSearchUIByInput,
    setQuantityForCartItemUIByInput: setQuantityForCartItemUIByInput,
    checkCartItemForTicketSystem: checkCartItemForTicketSystem,
    clickEmptyOrSubmitButtonForTicketSystem: clickEmptyOrSubmitButtonForTicketSystem,
    getReqCodeAfterSubmitFromTicketSystem: getReqCodeAfterSubmitFromTicketSystem,
    getReqCodeFromTicketSystem:getReqCodeFromTicketSystem
};
//jshint ignore:end