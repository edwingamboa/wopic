/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var GridLayoutPopUp = require('../../util/GridLayoutPopUp');
var InventoryItem = require ('./InventoryItem');
var HealthPack = require('../HealthPack');
var Revolver = require('../weapons/Revolver');

var Inventory = function() {
    var dimensions = {numberOfColumns: 5, numberOfRows: 2};
    GridLayoutPopUp.call(this, 'inventory_background', 'Inventory', dimensions);

    this.healthPacks = [];
    this.items = [];
    this.createItemGroups();
};

Inventory.prototype = Object.create(GridLayoutPopUp.prototype);
Inventory.prototype.constructor = Inventory;

Inventory.prototype.addHealthPack = function(healthPack) {
    if (healthPack.maxIncreasing == 5) {
        this.healthPack5Group.amountAvailable ++;
        this.healthPack5Group.updateAmountAvailableText();
    }else if (healthPack.maxIncreasing == 20) {
        this.healthPacks[1]++;
    }else {
        this.healthPacks[2]++;
    }
};

Inventory.prototype.addItem = function(item) {
    if (this.items[item.key].item === undefined) {
        this.items[item.key].setItem(item);
    }
    this.items[item.key].amountAvailable ++;
    this.items[item.key].updateAmountAvailableText();
};

Inventory.prototype.createItemGroups = function() {
    var healthPackItem = new HealthPack(0, 0, 5);
    this.items.healthPack5 = new InventoryItem(healthPackItem, this);
    this.addElement(this.items.healthPack5);

    var revolverItem = new Revolver(0, 0, false);
    this.items.simpleWeapon = new InventoryItem(revolverItem, this);
    this.addElement(this.items.simpleWeapon);
};

Inventory.prototype.showHealthPacks = function() {
    //TODO
};

module.exports = Inventory;
