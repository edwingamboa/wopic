/**
 * Created by Edwin Gamboa on 19/11/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');
var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var ClueItem = require('../../items/ClueItem');
var Wife = require('../../character/Wife');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 8;

/**
 * Manages LevelThree.
 * @class LevelThree
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Phaser Game object.
 */
var LevelThree = function(game) {
    Level.call(this, game);
};

LevelThree.prototype = Object.create(Level.prototype);
LevelThree.prototype.constructor = LevelThree;

/**
 * Creates level one specific objects and elements.
 * @method LevelThree.create
 */
LevelThree.prototype.create = function() {
    Level.prototype.create.call(this);
    this.game.stage.backgroundColor = '#09061F';
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.lastGoalAimed = false;
    this.addEnemies();
    this.addWife();
    this.addObjects();
    this.addPlaces();
    this.addMachineGun(600, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(2000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(4000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, this.GROUND_HEIGHT - 40, false);
    this.addMachineGun(7000, this.GROUND_HEIGHT - 40, false);
    var heathPacksDistance = this.WORLD_WIDTH / 4;
    this.addHealthPack(new HealthPack(heathPacksDistance, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 2, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 3, 10, 5, this));
};

/**
 * Add ClueItems, InteractiveCar and InteractiveHouses for this level.
 * @method LevelThree.addObjects
 */
LevelThree.prototype.addObjects = function() {
    var dialog = new VerticalLayoutPopUp('mediumPopUpBg', null,
        'Our daughter\'s drawing');
    var momSisterIcon = level.game.make.sprite(0, 0, 'sisterMomBig');
    var message = 'We are closer to our children!';
    var dialogText = level.game.make.text(0, 0, message);
    dialogText.font = 'Arial';
    dialogText.fontSize = 20;
    dialogText.fill = '#000000';
    dialogText.align = 'center';
    dialog.addElement(momSisterIcon);
    dialog.addElement(dialogText);
    var systerMomDrawing = new ClueItem(300, this.GROUND_HEIGHT - 30,
        'sisterMom', dialog, 'My Family', 'Daughter\'s drawing.', 'family');
    this.addVocabularyItem(systerMomDrawing);

    this.addCar(3.7 * this.checkPointsDistance, 'taxi');
};

/**
 * Adds character's wife to the level scene.
 * @method LevelThree.addWife
 */
LevelThree.prototype.addWife = function() {
    this.wife = new Wife(this.player.x - this.player.width,
        this.GROUND_HEIGHT - 50);
    this.addPlayerCharacter(this.wife);
};

/**
 * Adds this level enemies.
 * @method LevelThree.addEnemies
 */
LevelThree.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.75;
    this.addStrongestEnemy(this.WORLD_WIDTH - 100);
    var numberOfEnemies = 2;
    var numberOfStrongEnemies = 3;
    var i;
    var j;
    for (i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (j = 0; j < numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x);
        }
        for (j = 0; j < numberOfStrongEnemies; j++) {
            x += 50;
            this.addStrongEnemy(x);
        }
        numberOfEnemies ++;
        x += this.checkPointsDistance;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelThree.addPlaces
 */
LevelThree.prototype.addPlaces = function() {
    var housesKeys = ['yellowHouse', 'greenHouse', 'orangeHouse', 'whiteHouse'];
    var placesKeys = ['policeStation', 'fireStation', 'superMarket', 'hotel'];
    var placesNames = ['Police Station', 'Fire Station', 'Super Market',
        'Hotel'];
    var x = this.WORLD_WIDTH / (placesKeys.length + 2);
    var i;
    var houseIndex = 0;
    var place;
    var leftHouse;
    for (i = 0; i < placesKeys.length; i++) {
        if (houseIndex >= housesKeys.length) {
            houseIndex = 0;
        }
        place = this.addStaticBuilding(x * (i + 1), placesKeys[i]);
        this.addNeighbors(place, housesKeys[houseIndex],
            housesKeys[houseIndex + 1]);

        houseIndex += 2;
        this.addNameBoard(place.x - 60, placesNames[i] + ' Street');
    }
};

/**
 * Lets the player to play second level.
 * @method LevelThree.nextLevel
 */
LevelThree.prototype.nextLevel = function() {
    if (this.wife === undefined) {
        this.wife.moveRight();
        /*}else if (!this.metWife) {
         this.game.physics.arcade.moveToXY(
         this.wife,
         this.player.x,
         this.player.y); */
    }else if (this.wife.hadContactWithPlayer && this.activePopUps === 0) {
        this.game.state.start('intro');
        //level = this.game.state.states.levelThree;
    }
};

/**
 * Determines whether the player has won
 * @returns {boolean}
 */
LevelThree.prototype.playerWins = function() {
    return this.lastGoalAimed;
};

module.exports = LevelThree;
