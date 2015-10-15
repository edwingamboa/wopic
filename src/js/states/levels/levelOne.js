/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');

var CHECK_POINT_X_ONE;
var CHECK_POINTS_DISTANCE;

var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    CHECK_POINT_X_ONE = this.game.camera.width * 1.7;
    CHECK_POINTS_DISTANCE = this.game.camera.width + 200;
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addRevolver(2000, 400, false);
    this.addRevolver(2000, 400, false);
    //this.player.bringToTop();
};

LevelOne.prototype.addObjects = function() {
    var gunsStore = new InteractiveHouse(
        CHECK_POINT_X_ONE + 1.5 * CHECK_POINTS_DISTANCE,
        this.GROUND_HEIGHT,
        'house'
    );
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    var friendsHouse = new InteractiveHouse(
        CHECK_POINT_X_ONE + 5 * CHECK_POINTS_DISTANCE,
        this.GROUND_HEIGHT,
        'house'
    );
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);

    this.addCar(CHECK_POINT_X_ONE + 3 * CHECK_POINTS_DISTANCE, 'jeep');
};

LevelOne.prototype.addNPCs = function() {
    this.addNPC(this.game.camera.width / 2, 'npc', 'comic1');
    this.addNPC(CHECK_POINT_X_ONE + CHECK_POINTS_DISTANCE, 'friend', 'comic2');
};

LevelOne.prototype.addEnemies = function() {
    var x = CHECK_POINT_X_ONE;
    var y = 350;
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 5; j++) {
            x += 30;
            this.addSimpleEnemy(x, y);
        }
        x += 2 * CHECK_POINTS_DISTANCE;
    }
};

module.exports = LevelOne;
