(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
WebFontConfig = {
    google: {
        families: ['Shojumaru']
    }
};

/**
 * Phaser variable game.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(1000, 500, Phaser.AUTO, 'WOPIC');
/**
 * Game Boot state
 * @type {Boot}
 */
var Boot = require('./states/Boot');
/**
 * Game preloader state, it loads all assets.
 * @type {Preloader}
 */
var Preloader = require('./states/Preloader');
/**
 * Main menu state, allows the player start a game.
 * @type {Menu|exports|module.exports}
 */
var Menu = require('./states/Menu');
/**
 * Game Intro, introduces the game backgroudn story to the player.
 * @type {Intro}
 */
var Intro = require('./states/levels/Intro');
/**
 * Level one state.
 * @type {LevelOne|exports|module.exports}
 */
var LevelOne = require('./states/levels/LevelOne');

game.state.add('boot', Boot);
game.state.add('preloader', Preloader);
game.state.add('menu', Menu);
game.state.add('levelOne', LevelOne);
game.state.add('intro', Intro);
game.state.start('boot');

},{"./states/Boot":28,"./states/Menu":29,"./states/Preloader":30,"./states/levels/Intro":31,"./states/levels/LevelOne":33}],2:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Default speed for any character
 * @constant
 * @type {number}
 * @default
 */
var SPEED = 150;
/**
 * Default greatest speed for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_SPEED = 250;
/**
 * Default initial health level for any character
 * @constant
 * @type {number}
 * @default
 */
var INITIAL_HEALTH_LEVEL = 100;
/**
 * Default greatest health level for any character
 * @constant
 * @type {number}
 * @default
 */
var MAX_HEALTH_LEVEL = 100;
/**
 * Default bounce value for any character
 * @constant
 * @type {number}
 * @default
 */
var BOUNCE = 0.2;
/**
 * Default gravity value for aby character.
 * @constant
 * @type {number}
 * @default
 */
var GRAVITY = 300;

/**
 * Handles game characters general behaviour.
 * @class Character
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Character's x coordinate within the world.
 * @param {number} y - Character's y coordinate within the world.
 * @param {string} spriteKey - Key that represents the character sprite.
 * @param {Object} [optionals] - Character's physic properties.
 * @param {Object} [optionals.healthLevel = INITIAL_HEALTH_LEVEL] - Character's
 * initial health level, when it is 100 at the beginning of a level.
 * @param {Object} [optionals.maxHealthLevel = MAX_HEALTH_LEVEL] - Character's
 * greatest health level, use to increase health level till this number.
 * @param {Object} [optionals.speed = SPEED] - Character's speed, is used when
 * he walks.
 * @param {Object} [optionals.maxSpeed = MAX_SPEED] - Character's maximal speed,
 * it is used when he runs.
 */
var Character = function(x, y, spriteKey, optionals) {
    Phaser.Sprite.call(this, level.game, x, y, spriteKey);

    var options = optionals || {};
    this.healthLevel = options.healthLevel || INITIAL_HEALTH_LEVEL;
    this.maxHealthLevel = options.maxHealthLevel || MAX_HEALTH_LEVEL;
    this.speed = options.speed || SPEED;
    this.maxSpeed = options.maxSpeed || MAX_SPEED;

    level.game.physics.arcade.enable(this);
    this.body.bounce.y = options.bounce || BOUNCE;
    this.body.gravity.y = options.gravity || GRAVITY;
    this.body.collideWorldBounds = true;
    this.anchor.setTo(0.5, 0.5);

    this.currentWeaponIndex = 0;

    this.weapons = [];
    this.weaponsKeys = [];
    this.onVehicle = false;
};

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

/**
 * Moves the character in the left direction using normal speed.
 * @method Character.moveLeft
 */
Character.prototype.moveLeft = function() {
    this.body.velocity.x = -this.speed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using normal speed.
 * @method Character.moveRight
 */
Character.prototype.moveRight = function() {
    this.body.velocity.x = this.speed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Moves the character in the left direction using running speed.
 * @method Character.runLeft
 */
Character.prototype.runLeft = function() {
    this.body.velocity.x = -this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('left');
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToLeft();
    }
};

/**
 * Moves the character in the right direction using running speed.
 * @method Character.runRight
 */
Character.prototype.runRight = function() {
    this.body.velocity.x = this.maxSpeed;
    if (!this.onVehicle) {
        this.animations.play('right');
    }else {
        this.frame = this.stopRightFrameIndex;
    }
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.pointToRight();
    }
};

/**
 * Stops the character and its animations.
 * @method Character.stop
 */
Character.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (level.xDirection > 0) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

/**
 * Determines whether the character's current health level is maxHealthLevel (is
 * full) or not.
 * @method Character.fullHealthLevel
 * @returns {boolean} True if player's health level is the greatest, otherwise
 * false.
 */
Character.prototype.fullHealthLevel = function() {
    return this.healthLevel === this.maxHealthLevel;
};

/**
 * Increase the character health level. If after the increasing, the healthLevel
 * is greater than or equal to the maxHealthLevel property, then healthLevel
 * will be maxHealthLevel.
 * @method Character.increaseHealthLevel
 * @param {number} increase - the amount to increase.
 */
Character.prototype.increaseHealthLevel = function(increase) {
    this.healthLevel += increase;
    if (this.healthLevel > this.maxHealthLevel) {
        this.healthLevel = this.maxHealthLevel;
    }
};

/**
 * Decrease the character health level. If after the decreasing, the healthLevel
 * is lees than or equal to 0, then character and its elements will be killed.
 * @method Character.decreaseHealthLevel
 * @param {number} decrease - the amount to decrease.
 */
Character.prototype.decreaseHealthLevel = function(decrease) {
    this.healthLevel -= decrease;
    if (this.healthLevel <= 0) {
        this.killCharacter();
    }
};

/**
 * Kill the character and his elements.
 * @method Character.killCharacter
 */
Character.prototype.killCharacter = function() {
    for (var weaponKey in this.weapons) {
        this.weapons[weaponKey].killWeapon();
    }
    this.kill();
};

/**
 * Set the character health level.
 * @method Character.setHealthLevel
 * @param {number} healthLevel - the new caharacter's healthLevel.
 */
Character.prototype.setHealthLevel = function(healthLevel) {
    this.healthLevel = healthLevel;
};

/**
 * Updates player's current weapon, the old weapon is killed (out of stage) and
 * the new one is shown on screen. If the new one is a weapon that was killed,
 * then it is revived and shown on screen.
 * @method Character.weaponKey
 * @param {string} weaponKey - new current weapon's key
 */
Character.prototype.updateCurrentWeapon = function(weaponKey) {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.kill();
    }
    this.currentWeapon = this.weapons[weaponKey];
    if (!this.currentWeapon.alive) {
        this.currentWeapon.revive();
    }
    level.game.add.existing(this.currentWeapon);
};

/**
 * Changes player's current weapon, to the next one in the weapons array.
 * Updates currentWeaponIndex property.
 * @method Character.nextWeapon
 */
Character.prototype.nextWeapon = function() {
    this.currentWeaponIndex++;
    if (this.currentWeaponIndex === this.weaponsKeys.length) {
        this.currentWeaponIndex = 0;
    }
    this.updateCurrentWeapon(this.weaponsKeys[this.currentWeaponIndex]);
};

/**
 * Add a new weapon to character's weapons.
 * @method Character.addWeapon
 * @param newWeapon {object} The weapon to be added.
 */
Character.prototype.addWeapon = function(newWeapon) {
    if (this.weapons[newWeapon.key] === undefined) {
        this.weaponsKeys.push(newWeapon.key);
    }
    this.weapons[newWeapon.key] = newWeapon;
};

/**
 * Fires the current weapon if it is defined
 * @method Character.fireToXY
 * @param x {number} X coordinate on the point to fire
 * @param y {number} Y coordinate on the point to fire
 */
Character.prototype.fireToXY = function(x, y) {
    this.currentWeapon.fire(x, y);
};

/**
 * Lets to relocate the character on the given coordinates
 * @method Character.relocate
 * @param x {number} X coordinate to be relocated
 * @param y {number} Y coordinate to be relocated
 */
Character.prototype.relocate = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Updates current weapon, so that character can use it.
 * @method Character.useWeapon
 * @param {Weapon} weapon - Weapon to be used by the character.
 */
Character.prototype.useWeapon = function(weapon) {
    if (this.weapons[weapon.key] === undefined) {
        this.addWeapon(weapon);
        this.updateCurrentWeapon(weapon.key);
        if (level.xDirection > 0) {
            this.currentWeapon.pointToRight();
        }else {
            this.currentWeapon.pointToLeft();
        }
    }else {
        //weapon.kill();
        this.weapons[weapon.key].addBullets(weapon.numberOfBullets);
    }
};

/**
 * Allows the character to jump.
 * @method Character.jump
 */
Character.prototype.jump = function() {
    this.body.velocity.y = -350;
};

module.exports = Character;

},{}],3:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
var Character = require('./Character');
var ResourceBar = require('./../util/ResourceBar');

/**
 * Represents the right direction on the screen.
 * @constant
 * @type {number}
 */
var RIGHT_DIRECTION = 1;
/**
 * Represents the left direction on the screen.
 * @constant
 * @type {number}
 */
var LEFT_DIRECTION = -1;

/**
 * Represents an enemy within the game.
 * @class Enemy
 * @extends Character
 * @constructor
 * @param {string} spriteKey - Texture's key for the enemy sprite.
 * @param {number} maxHealthLevel - Greatest health level for this enemy.
 * @param {number} x - Enemy's x coordinate within the game world.
 * @param {number} y - Enemy's y coordinate within the game world.
 * @param {number} minRangeDetection - Lowest distance in which the enemy can
 * detect the player.
 * @param {number} maxRangeDetection - Longest distance in which the enemy can
 * detect the player.
 * @param {number} minRangeAttack - Lowest distance in which the enemy can
 * shoot the player.
 * @param {number} maxRangeAttack - Longest distance in which the enemy can
 * shoot the player.
 */
var Enemy = function(spriteKey,
                     maxHealthLevel,
                     x,
                     y,
                     minRangeDetection,
                     maxRangeDetection,
                     minRangeAttack,
                     maxRangeAttack) {
    var options = {
        healthLevel : maxHealthLevel,
        maxHealthLevel : maxHealthLevel
    };
    Character.call(this, x, y, spriteKey, options);
    this.animations.add('left', [0, 1], 10, true);
    this.animations.add('right', [2, 3], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 2;
    this.rangeDetection = level.game.rnd.integerInRange(minRangeDetection,
        maxRangeDetection);
    this.rangeAttack = level.game.rnd.integerInRange(minRangeAttack,
        maxRangeAttack);
    this.heatlthBar = new ResourceBar(-this.width / 2, -this.height / 2 - 10,
        {width: 40, height: 5});
    this.addChild(this.heatlthBar);
    this.direction = RIGHT_DIRECTION;
};

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;

/**
 * Update animations and current weapon of the enemy.
 * @method Enemy.update
 */
Enemy.prototype.update = function() {
    if (this.body.velocity.x > 0) {
        this.direction = RIGHT_DIRECTION;
        this.animations.play('right');
        this.currentWeapon.pointToRight();
    }else if (this.body.velocity.x < 0) {
        this.direction = LEFT_DIRECTION;
        this.animations.play('left');
        this.currentWeapon.pointToLeft();
    }
    this.currentWeapon.updateCoordinates(this.x, this.y);
};

/**
 * Updates enemy's health level bar.
 * @method Enemy.updateHealthLevel
 */
Enemy.prototype.updateHealthLevel = function() {
    this.heatlthBar.updateResourceBarLevel(this.healthLevel /
        this.maxHealthLevel);
};

/**
 * Kills the character, so that is not visible and functional in the game.
 * @method Enemy.killCharacter
 */
Enemy.prototype.killCharacter = function() {
    this.healthLevel = 0;
    level.player.increaseScore(this.maxHealthLevel * 0.5);
    Character.prototype.killCharacter.call(this);
};

/**
 * Rotates enemies current weapon to  certain direction.
 * @method Enemy.rotateWeapon
 * @param {number} x - X coordinate of a point id the direction, where weapon
 * will be rotate.
 * @param {number} y - Y coordinate of a point id the direction, where weapon
 * will be rotate.
 */
Enemy.prototype.rotateWeapon = function(x, y) {
    this.currentWeapon.rotation =
        level.game.physics.arcade.angleToXY(this, x, y);
};

/**
 * Stops the enemy, its animations an chose the frame to display according to
 * its direction.
 * @method Enemy.stop
 */
Enemy.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.animations.stop();
    if (this.direction === RIGHT_DIRECTION) {
        this.frame = this.stopRightFrameIndex;
    }else {
        this.frame = this.stopLeftFrameIndex;
    }
};

module.exports = Enemy;

},{"./../util/ResourceBar":43,"./Character":2}],4:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var Character = require('./Character');
var Dialog = require('../util/Dialog');

/**
 * Represents a non player character within the game, whom player will interact
 * with.
 * @class NPC
 * @extends Character
 * @constructor
 * @param {number} x - NPC's x coordinate within game world.
 * @param {number} y - NPC's y coordinate within game world.
 * @param {string} key - NPC's texture key.
 * @param {string} message - Message that the NPC will tell to the player.
 */
var NPC = function(x, y, key, message) {
    Character.call(this, x, y, key);
    this.message = message;
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
};

NPC.prototype = Object.create(Character.prototype);
NPC.prototype.constructor = NPC;

NPC.prototype.showMessage = function() {
    var dialog = new Dialog(this.key, this.message);
    level.game.add.existing(dialog);
    dialog.open();
};

module.exports = NPC;

},{"../util/Dialog":35,"./Character":2}],5:[function(require,module,exports){
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Character = require('./Character');
/**
 * Default player speed
 * @constant
 * @type {number}
 */
var SPEED = 250;
/**
 * Default player running speed
 * @constant
 * @type {number}
 */
var MAX_SPEED = 300;
/**
 * Default player gravity
 * @constant
 * @type {number}
 */
var GRAVITY = 300;
/**
 * Default minimum player score, is used at the beginning of the game.
 * @constant
 * @type {number}
 */
var MINIMUM_SCORE = 20;

/**
 * Represents player's character within the game.
 * @class Player
 * @extends Character
 * @constructor
 */
var Player = function() {
    var options = {speed : SPEED, maxSpeed : MAX_SPEED};
    Character.call(this, 200, level.game.world.height - 150,
        'character', options);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 5;
    this.score = MINIMUM_SCORE;
    this.frame = this.stopRightFrameIndex;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * Allows the player to crouch.
 * @method Player.crouch
 */
Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

/**
 * Increases player's score
 * @method Player.increaseScore
 * @param {number} increase - The amount to increase
 */
Player.prototype.increaseScore = function(increase) {
    this.score += increase;
    level.updateScoreText();
};

/**
 * Increases player's score
 * @method Player.decreaseScore
 * @param {number} decrease - The amount to decrease
 */
Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
    level.updateScoreText();
};

/**
 * Updates player health level bar (in the main UI)
 * @method Player.updateHealthLevel
 */
Player.prototype.updateHealthLevel = function() {
    level.updateHealthLevel();
};

/**
 * Updates player's current weapon position.
 * @method Player.update
 */
Player.prototype.update = function() {
    if (this.currentWeapon !== undefined) {
        this.currentWeapon.updateCoordinates(this.x + (level.xDirection * 25),
            this.y + 20);
    }
};

/**
 * Changes player walking and running speeds.
 * @method Player.changeSpeed
 * @param {number} speed - New Player's walking speed.
 * @param {number} maxSpeed - New Player's running speed.
 */
Player.prototype.changeSpeed = function(speed, maxSpeed) {
    this.speed = speed;
    this.maxSpeed = maxSpeed;
};

/**
 * Resets player walking and running speeds to default values.
 * @method Player.resetSpeed
 */
Player.prototype.resetSpeed = function() {
    this.speed = SPEED;
    this.maxSpeed = MAX_SPEED;
};

/**
 * Changes player gravity.
 * @method Player.changeGravity
 * @param {number} gravity - New player gravity.
 */
Player.prototype.changeGravity = function(gravity) {
    this.body.gravity.y = gravity;
};

/**
 * Resets player gravity to default value.
 * @method Player.resetGravity
 */
Player.prototype.resetGravity = function() {
    this.body.gravity.y = GRAVITY;
};

/**
 * Allows the player to buy an item, when he has enough money (score) to do it.
 * @param {Item} item - Item that is intended to be purchased.
 * @returns {boolean} - true if purchase was successful, otherwise false.
 */
Player.prototype.buyItem = function(item) {
    if (this.score >= item.price) {
        this.score -= item.price;
        return true;
    }else {
        return false;
    }
};

module.exports = Player;

},{"./Character":2}],6:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var Revolver = require('../items/weapons/Revolver');

/**
 * Texture key for a simple enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'simple_enemy';
/**
 * Greatest health level of a simple enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 4;
/**
 * Lowest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 200;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 700;
/**
 * Lowest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 100;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 300;

/**
 * Represents the weakest enemies of the game.
 * @class SimpleEnemy
 * @extends Enemy
 * @param {number} x - Simple enemy's x coordinate within the game world.
 * @param {number} y - Simple enemy's y coordinate within the game world.
 * @constructor
 */
var SimpleEnemy = function(x, y) {
    Enemy.call(this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK);

    this.useWeapon(new Revolver(this, x, y, true));
};

SimpleEnemy.prototype = Object.create(Enemy.prototype);
SimpleEnemy.prototype.constructor = SimpleEnemy;

module.exports = SimpleEnemy;

},{"../items/weapons/Revolver":26,"./Enemy":3}],7:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Enemy = require('./Enemy');
var MachineGun = require('../items/weapons/MachineGun');

/**
 * Texture key for a strong  enemy
 * @constant
 * @type {string}
 */
var SPRITE_KEY = 'strong_enemy';
/**
 * Greatest health level of a strong enemy
 * @constant
 * @type {number}
 */
var MAX_HEALTH_LEVEL = 150;
/**
 * Lowest distance in which a strong enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can detect the player.
 * @constant
 * @type {number}
 */
var MIN_RANGE_ATTACK = 600;
/**
 * Lowest distance in which a strong enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_DETECTION = 1000;
/**
 * Longest distance in which a simple enemy can shoot the player.
 * @constant
 * @type {number}
 */
var MAX_RANGE_ATTACK = 600;

/**
 * Represents the strongest enemies of the game.
 * @class StrongEnemy
 * @extends Enemy
 * @param {number} x - Strong enemy's x coordinate within the game world.
 * @param {number} y - Strong enemy's y coordinate within the game world.
 * @constructor
 */
var StrongEnemy = function(x, y) {
    Enemy.call(
        this,
        SPRITE_KEY,
        MAX_HEALTH_LEVEL,
        x,
        y,
        MIN_RANGE_DETECTION,
        MAX_RANGE_DETECTION,
        MIN_RANGE_ATTACK,
        MAX_RANGE_ATTACK
    );

    this.useWeapon(new MachineGun(this, x, y, true));
};

StrongEnemy.prototype = Object.create(Enemy.prototype);
StrongEnemy.prototype.constructor = StrongEnemy;

module.exports = StrongEnemy;

},{"../items/weapons/MachineGun":25,"./Enemy":3}],8:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');

/**
 * The number of contexts allowed for this challenge
 * @constant
 * @type {number}
 */
var NUMBER_OF_CONTEXTS = 2;

/**
 * Represents the EnglishChallenge in which the player should associate each
 * word to one context. This is a drag and drop kind of challenge.
 * @class ContextGroups
 * @extends DragAndDropChallenge
 * @constructor
 */
var ContextGroups = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'contexts', 'Contexts', 10,
        dimensions);
};

ContextGroups.prototype = Object.create(DragAndDropChallenge.prototype);
ContextGroups.prototype.constructor = ContextGroups;

/**
 * Create a new challenge to the player.
 * @method ContextGroups.newChallenge
 */
ContextGroups.prototype.newChallenge = function() {
    this.clearChallenge();

    var contextsNames = ['Family', 'House'];
    var words = ['Mother', 'Son', 'Father', 'Living room', 'Dining room',
        'Kitchen'];

    this.contexts = [];
    var optionals = {numberOfColumns: words.length / 2, numberOfRows : 2,
        margin: 5};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    optionals = {numberOfColumns: NUMBER_OF_CONTEXTS, margin: 0};
    var contextsPanels = new GridLayoutPanel('englishChallengePanelBg',
        optionals);

    var i;
    var j;
    var word;
    var wordShade;
    var context;
    var contextTitle;
    this.numberOfWords = words.length / NUMBER_OF_CONTEXTS;
    for (i = 0; i < NUMBER_OF_CONTEXTS; i++) {
        context = new VerticalLayoutPanel('contextBg', 5);
        contextTitle = level.game.make.text(0, 0, contextsNames[i]);
        contextTitle.font = 'Shojumaru';
        contextTitle.fontSize = 20;
        contextTitle.fill = '#0040FF';
        context.addElement(contextTitle);
        this.contexts.push(context);
        contextsPanels.addElement(context);

        for (j = i * (NUMBER_OF_CONTEXTS + 1);
             j < (i + 1) * this.numberOfWords; j++) {
            word = level.game.make.text(0, 0, words[j]);
            //Font style
            word.font = 'Shojumaru';
            word.fontSize = 20;
            word.fill = '#0040FF';
            word.inputEnabled = true;
            word.input.enableDrag(true, true);
            word.events.onDragStop.add(this.dragAndDropControl.fixLocation,
                this.dragAndDropControl);
            word.code = '' + i;
            this.elements.push(word);

            wordShade = new VerticalLayoutPanel('wordBg', 2);
            wordShade.code = '' + i;
            this.destinations.push(wordShade);
            context.addElement(wordShade);
        }
    }

    this.dragAndDropControl.addElementsToSourceRandomly();
    this.mainPanel.addElement(contextsPanels);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ContextGroups.bringItemToTop
 * @param {Phaser.Sprite} item - element that is being dragged by the player
 */
ContextGroups.prototype.bringItemToTop = function(item) {
    if (ContextGroups.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = ContextGroups;

},{"../util/GridLayoutPanel":37,"../util/VerticalLayoutPanel":46,"./dragAndDrop/DragAndDropChallenge":12}],9:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Represents an EnglishChallenge within the game. An EnglishChallenge is used,
 * by the player to increase his/her score in a faster way.
 * @class EnglishChallenge
 * @constructor
 * @param iconKey {string} - Texture's key for the icon of the challenge
 * @param name {string} - Name of the challenge
 * @param score {number} - Score to be increased in case of success.
 */
var EnglishChallenge = function(iconKey, name, score) {
    this.iconKey = iconKey;
    this.name = name;
    this.score = score;
};

EnglishChallenge.prototype.constructor = EnglishChallenge;

/**
 * Increases player score and shows a success message. It is called when player
 * overcome the challenge successfully.
 * @method EnglishChallenge.success
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.success = function(parent) {
    level.increaseScore(this.score);
    level.showSuccessMessage('Well done! You got ' + this.score +
        ' points.', parent);
};

/**
 * Shows a failure message. It is called when player has completed the challenge
 * but in a wrong way.
 * @method EnglishChallenge.failure
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.failure = function(parent) {
    level.showErrorMessage('Sorry! Try Again.', parent);
};

/**
 * Shows a failure message. It is called when player has not completed the
 * challenge.
 * @method EnglishChallenge.incomplete
 * @param {Pahser.Sprite} parent - Current view
 */
EnglishChallenge.prototype.incomplete = function(parent) {
    level.showErrorMessage('The challenge is not complete.', parent);
};

module.exports = EnglishChallenge;

},{}],10:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */

var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var GridLayoutPanel = require('../util/GridLayoutPanel');

/**
 * Represents the EnglishChallenge in which player should match a word with its
 * corresponding image representation. This is a drag and drop challenge.
 * @class ImageWordMatch
 * @extends DragAndDropChallenge
 * @constructor
 */
var ImageWordMatch = function() {
    var dimensions = {numberOfRows: 3};
    DragAndDropChallenge.call(this, 'imageWord', 'Image Match', 10,
        dimensions);
};

ImageWordMatch.prototype = Object.create(DragAndDropChallenge.prototype);
ImageWordMatch.prototype.constructor = ImageWordMatch;

/**
 * Create a new challenge to the player.
 * @method ImageWordMatch.newChallenge
 */
ImageWordMatch.prototype.newChallenge = function() {
    this.clearChallenge();
    var familyKeys = ['mother', 'son', 'daughter'];
    var familyMembersCells = [];

    for (var key in familyKeys) {
        var cell = new VerticalLayoutPanel('imageWordBg');
        var familyMember = level.game.make.sprite(0, 0, familyKeys[key]);
        var shade = new VerticalLayoutPanel('wordBg', 2);
        shade.code = key;

        this.destinations.push(shade);
        cell.addElement(familyMember);
        cell.addElement(shade);

        var label = level.game.make.text(0, 0, familyKeys[key]);
        //Font style
        label.font = 'Shojumaru';
        label.fontSize = 20;
        label.fill = '#0040FF';
        label.inputEnabled = true;
        label.input.enableDrag(true, true);
        //label.events.onDragStart.add(this.bringItemToTop, this);
        label.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        label.code = key;

        familyMembersCells.push(cell);
        this.elements.push(label);
    }

    var optionals = {numberOfColumns: this.elements.length};
    this.source = new GridLayoutPanel('wordsBg', optionals);

    var images = new GridLayoutPanel('englishChallengePanelBg', optionals);

    var familyMemberCell;
    for (familyMemberCell in familyMembersCells) {
        images.addElement(familyMembersCells[familyMemberCell]);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(images);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method ImageWordMatch.bringItemToTop
 * @param {Sprite} element - element that is being dragged by the player
 */
ImageWordMatch.prototype.bringItemToTop = function(element) {
    if (ImageWordMatch.prototype.isPrototypeOf(element.parent)) {
        this.addChild(element);
    }else {
        this.addChild(element.parent.parent);
    }
};

module.exports = ImageWordMatch;

},{"../util/GridLayoutPanel":37,"../util/VerticalLayoutPanel":46,"./dragAndDrop/DragAndDropChallenge":12}],11:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/10/2015.
 */
var GridLayoutPanel = require('../util/GridLayoutPanel');
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var DragAndDropChallenge = require('./dragAndDrop/DragAndDropChallenge');

/**
 * Represents the EnglishChallenge in which player is presented with a set of
 * letters that should be correctly arranged in order to form a word.
 * @class WordUnscramble
 * @extends DragAndDropChallenge
 * @constructor
 */
var WordUnscramble = function() {
    var dimensions = {numberOfRows: 4};
    DragAndDropChallenge.call(this, 'unscramble', 'Unscrambler', 10,
        dimensions);
};

WordUnscramble.prototype = Object.create(DragAndDropChallenge.prototype);
WordUnscramble.prototype.constructor = WordUnscramble;

/**
 * Create a new challenge to the player.
 * @method WordUnscramble.newChallenge
 */
WordUnscramble.prototype.newChallenge = function() {
    this.clearChallenge();
    var word = 'mother';
    var wordImage = level.game.make.sprite(0, 0, 'mother');

    var optionals = {numberOfColumns: word.length, margin: 5};
    var wordFieldAnswer = new GridLayoutPanel('lettersBg', optionals);

    this.source = new GridLayoutPanel('lettersBg', optionals);
    var i;
    var letter;
    var letterShade;
    for (i = 0; i < word.length; i++) {
        letterShade = new VerticalLayoutPanel('letterBg', 2);
        letterShade.code = '' + i;
        this.destinations.push(letterShade);

        wordFieldAnswer.addElement(letterShade);

        letter = level.game.make.text(0, 0, word.charAt(i));
        //Font style
        letter.font = 'Shojumaru';
        letter.fontSize = 20;
        letter.fill = '#0040FF';
        letter.inputEnabled = true;
        letter.input.enableDrag(true, true);
        letter.events.onDragStop.add(this.dragAndDropControl.fixLocation,
            this.dragAndDropControl);
        letter.code = '' + i;
        this.elements.push(letter);
    }

    this.dragAndDropControl.addElementsToSourceRandomly();

    this.mainPanel.addElement(wordImage);
    this.mainPanel.addElement(wordFieldAnswer);
    this.mainPanel.addElement(this.source);
};

/**
 * Brings the element's container to the top. So that, when player drag the
 * element over other containers it is not hidden by them.
 * @method WordUnscramble.bringItemToTop
 * @param {Sprite} item - Element that is being dragged by the player.
 */
WordUnscramble.prototype.bringItemToTop = function(item) {
    if (WordUnscramble.prototype.isPrototypeOf(item.parent)) {
        this.addChild(item);
    }else {
        this.addChild(item.parent.parent);
    }
};

module.exports = WordUnscramble;

},{"../util/GridLayoutPanel":37,"../util/VerticalLayoutPanel":46,"./dragAndDrop/DragAndDropChallenge":12}],12:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayoutPopUp = require('../../util/VerticalLayoutPopUp');
var VerticalLayoutPanel = require('../../util/VerticalLayoutPanel');
var EnglishChallenge = require('../../englishChallenges/EnglishChallenge');
var DragAndDropController = require('./DragAndDropController');
var Button = require('../../util/Button');

/**
 * Represents the UI for an EnglishChallenge that have draggable elements, which
 * need to be arranged in a certain destinations.
 * @class DragAndDropChallenge
 * @extends VerticalLayoutPopUp
 * @constructor
 * @param {string} iconKey - Texture key of the Challenge icon
 * @param {string} challengeName - Challenge name to show in UI.
 * @param {number} score - Score to be increased in case of success.
 */
var DragAndDropChallenge = function(iconKey, challengeName, score) {
    VerticalLayoutPopUp.call(this, 'popUpBg', null, challengeName);
    this.englishChallenge = new EnglishChallenge(
        iconKey,
        challengeName,
        score
    );
    this.destinations = [];
    this.elements = [];
    this.dragAndDropControl = new DragAndDropController(this);
    this.mainPanel = new VerticalLayoutPanel('popUpPanelBg');
    this.addElement(this.mainPanel);
    this.confirmButton = new Button('Confirm', this.confirm, this);
    this.addElement(this.confirmButton);
};

DragAndDropChallenge.prototype = Object.create(VerticalLayoutPopUp.prototype);
DragAndDropChallenge.prototype.constructor = DragAndDropChallenge;

/**
 * Controls whether the Challenge is completed and successfully overcome.
 * messages
 * @method DragAndDropChallenge.confirm
 */
DragAndDropChallenge.prototype.confirm = function() {
    if (this.dragAndDropControl.emptyDestinations()) {
        this.englishChallenge.incomplete(this);
        return;
    }
    if (!this.dragAndDropControl.elementsInCorrectDestination()) {
        this.englishChallenge.failure(this);
        return;
    }
    this.englishChallenge.success();
    this.close();
};

/**
 * Clear all the containers and elements of the challenge, so that a new
 * challenge can be created.
 * @method DragAndDropChallenge.
 */
DragAndDropChallenge.prototype.clearChallenge = function() {
    if (this.mainPanel.children.length > 0) {
        this.mainPanel.removeAllElements();
    }
    if (this.elements.length > 0) {
        this.elements.splice(0, this.elements.length);
    }
    if (this.destinations.length > 0) {
        this.destinations.splice(0, this.destinations.length);
    }
};

module.exports = DragAndDropChallenge;

},{"../../englishChallenges/EnglishChallenge":9,"../../util/Button":34,"../../util/VerticalLayoutPanel":46,"../../util/VerticalLayoutPopUp":47,"./DragAndDropController":13}],13:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */
var Utilities = require('../../util/Utilities');

/**
 * Controls draggable elements that are dropped in some destinations.
 * @class DragAndDropController
 * @constructor
 * @param {Phaser.Sprite} container - Sprite tha contains the draggable
 * elements, their initial location (source) and their possible destinations.
 */
var DragAndDropController = function(container) {
    this.container = container;
};

DragAndDropController.prototype.constructor = DragAndDropController;

/**
 * Adds a draggable element to a destination.
 * @method DragAndDropController.addToADestination
 * @param {Phaser.Sprite} element - element to be added.
 * @param {string} destinationIndex - index (key) to of the destination, where
 * the element will be added.
 */
DragAndDropController.prototype.addToADestination = function(element,
                                                             destinationIndex) {
    this.container.destinations[destinationIndex].restartPosition();
    this.container.destinations[destinationIndex].addElement(element);
};

/**
 * Controls where to locate an element after it is dropped by the player.
 * @method DragAndDropController.fixLocation
 * @param {Phaser.Sprite} element - Dropped element to locate
 */
DragAndDropController.prototype.fixLocation = function(element) {
    var key;
    for (key in this.container.destinations) {
        if (element.overlap(this.container.destinations[key]) &&
            this.container.destinations[key].children.length === 0) {
            this.addToADestination(element, key);
            return;
        }
    }
    this.returnElementToSource(element);
};

/**
 * Determines whether all the destinations have the correct element as children.
 * @method DragAndDropController.elementsInCorrectDestination
 * @returns {boolean} - true if elements are correctly arranged, otherwise
 * false.
 */
DragAndDropController.prototype.elementsInCorrectDestination = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0].code !==
            this.container.destinations[key].code) {
            return false;
        }
    }
    return true;
};

/**
 * Determines whether any destination is empty.
 * @method DragAndDropController.emptyDestinations
 * @returns {boolean} - true if any destination is empty, otherwise false
 */
DragAndDropController.prototype.emptyDestinations = function() {
    var key;
    for (key in this.container.destinations) {
        if (this.container.destinations[key].children[0] === undefined) {
            return true;
        }
    }
    return false;
};

/**
 * Locates an element within its source container.
 * @method DragAndDropController.returnElementToSource
 * @param {Phaser.Sprite} element - element to relocate.
 */
DragAndDropController.prototype.returnElementToSource = function(element) {
    element.x = element.sourceX;
    element.y = element.sourceY;
    this.container.source.addChild(element);
};

/**
 * Add every element to the source but in a random order.
 * @method DragAndDropController.addElementsToSourceRandomly
 */
DragAndDropController.prototype.addElementsToSourceRandomly = function() {
    var utils = new Utilities();
    var rdmIndexes = utils.randomIndexesArray(this.container.elements.length);
    var index;
    for (index in rdmIndexes) {
        this.container.source.addElement(
            this.container.elements[rdmIndexes[index]]);
        this.container.elements[rdmIndexes[index]].sourceX =
            this.container.elements[rdmIndexes[index]].x;
        this.container.elements[rdmIndexes[index]].sourceY =
            this.container.elements[rdmIndexes[index]].y;
    }
};
module.exports = DragAndDropController;

},{"../../util/Utilities":44}],14:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */
var PopUp = require('../../util/PopUp');
var GridLayoutPanel = require('../../util/GridLayoutPanel');
var MenuItem = require('./MenuItem');
var WordUnscramble = require('../WordUnscramble');
var ContextGroups = require('../ContextGroups');
var ImageWordMatch = require('../ImageWordMatch');

/**
 * Menu UI that allows accessing to all the EnglishChallenges.
 * @class EnglishChallengesMenu
 * @extends PopUp
 * @constructor
 */
var EnglishChallengesMenu = function() {
    PopUp.call(this, 'popUpBg', null, 'English Challenges');
    var dimensions = {numberOfRows: 2, numberOfColumns: 4};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 80;
    this.addChild(this.panel);
    this.createGames();
};

EnglishChallengesMenu.prototype = Object.create(PopUp.prototype);
EnglishChallengesMenu.prototype.constructor = EnglishChallengesMenu;

/**
 * Creates the menu, it adds an icon for every EnglishChallenge, so the player
 * can access them.
 * @method EnglishChallengesMenu.createGames
 */
EnglishChallengesMenu.prototype.createGames = function() {
    var challenges = [];
    challenges.push(new WordUnscramble());
    challenges.push(new ContextGroups());
    challenges.push(new ImageWordMatch());
    var i;
    for (i in challenges) {
        this.panel.addElement(new MenuItem(challenges[i], this));
        level.game.add.existing(challenges[i]);
    }
};

module.exports = EnglishChallengesMenu;

},{"../../util/GridLayoutPanel":37,"../../util/PopUp":42,"../ContextGroups":8,"../ImageWordMatch":10,"../WordUnscramble":11,"./MenuItem":15}],15:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var ItemGroupView = require('../../items/ItemGroupView');

/**
 * Represents a challenge within the EnglishChallengesMenu.
 * @class MenuItem
 * @extends ItemGroupView
 * @constructor
 * @param {EnglishChallenge} challenge - Challenge that can be accessed through
 * this item.
 * @param {PopUp} parentView - PopUp that contains this item.
 */
var MenuItem = function(challenge, parentView) {
    ItemGroupView.call(this, challenge.englishChallenge.iconKey, 'Play',
        parentView);

    this.challenge = challenge;
    this.updateScoreText();
    this.setTitle(challenge.englishChallenge.name);
    //this.setDescription(challenge.englishChallenge.description);
};

MenuItem.prototype = Object.create(ItemGroupView.prototype);
MenuItem.prototype.constructor = MenuItem;

/**
 * Called when the play button is clicked. It close the menu (PopUp), creates
 * a new challenge and displays it to the player.
 * @method MenuItem.buttonAction
 */
MenuItem.prototype.buttonAction = function() {
    this.parentView.close();
    this.challenge.newChallenge();
    this.challenge.open();
};

/**
 * Updates the text that shows the number of points that player can get, after
 * completing the challenge.
 * @method MenuItem.updateScoreText
 */
MenuItem.prototype.updateScoreText = function() {
    this.setAuxText('+ $' + this.challenge.englishChallenge.score);
};

module.exports = MenuItem;


},{"../../items/ItemGroupView":18}],16:[function(require,module,exports){
var Item = require('./Item');

/**
 * Rate use to calculate health pack prize, based on maxIncreasing value.
 * @constant
 * @type {number}
 */
var PRICE_INCREASE_RATE = 2;
/**
 * HealthPack's gravity value.
 * @constant
 * @type {number}
 */
var GRAVITY = 100;

/**
 * Represents a health pack that player can use to increase his/her current
 * health level.
 * @class HealthPack
 * @extends Item
 * @constructor
 * @param {number} x - HealthPack's x coordinate within the game world.
 * @param {number} y - HealthPack's y coordinate within the game world.
 * @param {number} maxIncreasing - Greatest value to increase when player uses
 * this HealthPack.
 */
var HealthPack = function(x, y, maxIncreasing) {
    Item.call(this, x, y, 'healthPack' + maxIncreasing,
        maxIncreasing * PRICE_INCREASE_RATE);
    this.body.gravity.y = GRAVITY;
    this.maxIncreasing = maxIncreasing;
    this.name = 'Health Pack';
    this.description = '+ ' + maxIncreasing + ' Health Level';
    this.category = 'healthPacks';
};

HealthPack.prototype = Object.create(Item.prototype);
HealthPack.prototype.constructor = HealthPack;

/**
 * Kills the this item whn player picks it up.
 * @method HealthPack.pickUp
 */
HealthPack.prototype.pickUp = function() {
    this.kill();
};

/**
 * Add this HealthPack to the game so that the player can pick it up.
 * @method HealthPack.use
 */
HealthPack.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    this.x = level.player.x;
    this.y = 50;
    level.addHealthPack(this);
};

module.exports = HealthPack;

},{"./Item":17}],17:[function(require,module,exports){
/**
 * Bounce value for an Item
 * @constant
 * @type {number}
 */
var BOUNCE = 0.7 + Math.random() * 0.2;

/**
 * Represents item that player can pick up an store it in inventory.
 * @class Item
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Item's x coordinate within the world.
 * @param {number} y - Item's y coordinate within the world.
 * @param {string} key - Item texture's key.
 * @param {number} price - Price to purchase or buy this item.
 */
var Item = function(x, y, key, price) {
    Phaser.Sprite.call(this, level.game, x, y, key);
    this.anchor.set(0.5, 0.5);
    level.game.physics.arcade.enable(this);
    this.body.bounce.y = BOUNCE;
    this.body.collideWorldBounds = true;
    this.level = level;
    this.price = price;
    this.name = '';
    this.description = '';
};

Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype.constructor = Item;

/**
 * Sets the text description for this item.
 * @method Item.setDescription
 * @param {string} description - Text describing this item.
 */
Item.prototype.setDescription = function(description) {
    this.description = description;
};

/**
 * Sets Item's name.
 * @method Item.setName
 * @param {string} name - Item name.
 */
Item.prototype.setName = function(name) {
    this.name = name;
};

module.exports = Item;

},{}],18:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var VerticalLayoutPanel = require('../util/VerticalLayoutPanel');
var Button = require('../util/Button');

/**
 * View for an item in a menu of items.
 * @class ItemGroupView
 * @extends VerticalLayoutPanel
 * @constructor
 * @param {string} iconKey - Texture's key for the item icon.
 * @param {string} buttonText - Text to show on the action button.
 * @param {ItemsPopUp} parentView - View on which the ItemGroupView will be
 * displayed.
 */
var ItemGroupView = function(iconKey, buttonText, parentView) {
    VerticalLayoutPanel.call(this, 'itemGroupBg', 2);

    this.icon = level.game.make.sprite(0, 0, iconKey);

    this.auxText = level.game.make.text(this.icon.width - 5, this.icon.height,
        '');
    this.auxText.font = 'Arial';
    this.auxText.fontSize = 20;
    this.auxText.fill = '#FFFF99';
    this.auxText.stroke = '#000000';
    this.auxText.strokeThickness = 2;
    this.auxText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 5);
    this.auxText.anchor.set(1, 0.8);

    this.icon.addChild(this.auxText);

    this.title = level.game.make.text(0, 0, 'Title');
    this.title.font = 'Arial';
    this.title.fontSize = 20;
    this.title.fill = '#0040FF';

    this.description = level.game.make.text(0, 0, 'Des 1 \n Des 2');
    this.description.font = 'Arial';
    this.description.fontSize = 12;
    this.description.fill = '#000000';

    this.button = new Button(buttonText, this.buttonAction, this);

    this.addElement(this.title);
    this.addElement(this.icon);
    this.addElement(this.description);
    this.addElement(this.button);
    this.parentView = parentView;
};

ItemGroupView.prototype = Object.create(VerticalLayoutPanel.prototype);
ItemGroupView.prototype.constructor = ItemGroupView;

/**
 * Action to be performed when the button action is clicked.
 * @method ItemGroupView.buttonAction
 */
ItemGroupView.prototype.buttonAction = function() {};

/**
 * Sets the description text to be displayed to the player.
 * @method ItemGroupView.setDescription
 * @param {string} description - Text that describes the item.
 */
ItemGroupView.prototype.setDescription = function(description) {
    this.description.text = description;
    this.description.x = this.width / 2 - this.description.width / 2;
};

/**
 * Sets the items title to be displayed to the player.
 * @method ItemGroupView.setTitle
 * @param {string} title - Item title.
 */
ItemGroupView.prototype.setTitle = function(title) {
    this.title.text = title;
    this.title.x = this.width / 2 - this.title.width / 2;

};

/**
 * Sets the auxiliary or secondary text.
 * @method ItemGroupView.setAuxText
 * @param {string} auxText - Auxiliary or secondary text of this view.
 */
ItemGroupView.prototype.setAuxText = function(auxText) {
    this.auxText.text = auxText;
};

module.exports = ItemGroupView;

},{"../util/Button":34,"../util/VerticalLayoutPanel":46}],19:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 19/10/2015.
 */

var PopUp = require('../util/PopUp');
var GridLayoutPanel = require('../util/GridLayoutPanel');
var Button = require('../util/Button');
var HealthPack = require('./HealthPack');
var Revolver = require('./weapons/Revolver');

/**
 * View that contains a menu of items, grouped by category.
 * @class ItemsPopUp
 * @extends PopUp
 * @constructor
 * @param {Object[]} tabsLabels - Items categories names.
 * @param {Object[]} categories - Items categories (code Names).
 * @param {string} title - This view's title.
 */
var ItemsPopUp = function(tabsLabels, categories, title) {
    PopUp.call(this, 'popUpBg', null, title);

    this.items = [];
    var i;
    var tab;
    var x = 20;
    for (i = 0; i < tabsLabels.length; i++) {
        tab = new Button(tabsLabels[i], this.showTab, this, 'tabBg');
        tab.category = categories[i];
        tab.x = x;
        tab.y = 58;
        x += tab.width + 2;
        this.addChild(tab);
        this.items[categories[i]] = [];
    }

    var dimensions = {numberOfColumns: 4, numberOfRows: 2};
    this.panel = new GridLayoutPanel('popUpPanelBg', dimensions);
    this.panel.x = 20;
    this.panel.y = 100;
    this.createItemGroups();
    this.fillPanel(categories[0]);
    this.addChild(this.panel);
};

ItemsPopUp.prototype = Object.create(PopUp.prototype);
ItemsPopUp.prototype.constructor = ItemsPopUp;

/**
 * Displays a tab's content, before that it cleans the current content.
 * @method ItemsPopUp.showTab
 * @param {Button} tab - Button that represents a tab on the view.
 */
ItemsPopUp.prototype.showTab = function(tab) {
    var key;
    for (key in this.panel.children) {
        this.panel.children[key].kill();
    }
    this.panel.removeAllElements();
    this.fillPanel(tab.category);
};

/**
 * Fills the main panel with the items that belongs to a category.
 * @method ItemsPopUp.fillPanel
 * @param {string} category - Categories code name or key.
 */
ItemsPopUp.prototype.fillPanel = function(category) {
    var key;
    for (key in this.items[category]) {
        if (!this.items[category][key].alive) {
            this.items[category][key].revive();
        }
        this.panel.addElement(this.items[category][key]);
    }
};

/**
 * Creates all items views.
 * @method ItemsPopUp.createItemGroups
 */
ItemsPopUp.prototype.createItemGroups = function() {
    var revolverItem = new Revolver(0, 0, false);
    this.addItem(revolverItem);
    var healthPackItem = new HealthPack(0, 0, 5);
    this.addItem(healthPackItem);
    healthPackItem = new HealthPack(0, 0, 20);
    this.addItem(healthPackItem);
};

module.exports = ItemsPopUp;

},{"../util/Button":34,"../util/GridLayoutPanel":37,"../util/PopUp":42,"./HealthPack":16,"./weapons/Revolver":26}],20:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var InventoryItem = require ('./InventoryItem');

/**
 * Ui and control for the game Inventory.
 * @class Inventory
 * @extends ItemsPopUp
 * @constructor
 */
var Inventory = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Objects'];
    var categories = ['weapons', 'healthPacks', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Inventory');
};

Inventory.prototype = Object.create(ItemsPopUp.prototype);
Inventory.prototype.constructor = Inventory;

/**
 * Adds a new item to the inventory to be displayed for the player.
 * @method Inventory.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Inventory.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new InventoryItem(item, this);
    }
    this.items[item.category][item.key].amountAvailable ++;
    this.items[item.category][item.key].updateAmountAvailableText();
};

module.exports = Inventory;

},{"../ItemsPopUp":19,"./InventoryItem":21}],21:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View an inventory item.
 * @class InventoryItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Inventory} parentView - View on which the item will be displayed.
 */
var InventoryItem = function(item, parentView) {
    ItemGroupView.call(this, item.key + 'Icon', 'Use', parentView);

    this.item = item;
    this.amountAvailable = 0;
    this.updateAmountAvailableText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

InventoryItem.prototype = Object.create(ItemGroupView.prototype);
InventoryItem.prototype.constructor = InventoryItem;

/**
 * Allows the player to use this item.
 * @method InventoryItem.buttonAction
 */
InventoryItem.prototype.buttonAction = function() {
    if (this.amountAvailable > 0) {
        this.item.use();
        this.amountAvailable --;
        this.updateAmountAvailableText();
        this.parentView.close();
    }else {
        level.showErrorMessage('You do not have more of this item.',
            this.parent);
    }
};

/**
 * Updates the remaining amount of this item.
 * @method InventoryItem.updateAmountAvailableText
 */
InventoryItem.prototype.updateAmountAvailableText = function() {
    this.setAuxText('x ' + this.amountAvailable);
};

module.exports = InventoryItem;

},{"../ItemGroupView":18}],22:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var ItemsPopUp = require('../ItemsPopUp');
var StoreItem = require ('./StoreItem');

/**
 * View and control of the game store
 * @class Store
 * @extends StoreItem
 * @constructor
 */
var Store = function() {
    var tabsLabels = ['Weapons', 'Health Packs', 'Objects'];
    var categories = ['weapons', 'healthPacks', 'objects'];
    ItemsPopUp.call(this, tabsLabels, categories, 'Store');

    this.cash = level.game.make.text(this.width - 20, 58,
        'Cash: $ ' + level.player.score);
    this.cash.font = 'Shojumaru';
    this.cash.fontSize = 20;
    this.cash.fill = '#FFFFFF';
    this.cash.anchor.set(1, 0);
    this.addChild(this.cash);
};

Store.prototype = Object.create(ItemsPopUp.prototype);
Store.prototype.constructor = Store;

/**
 * Add an item to the store to be displayed for the user.
 * @method Store.addItem
 * @param {Item} item - Item to be added to the inventory.
 */
Store.prototype.addItem = function(item) {
    if (this.items[item.category][item.key] === undefined) {
        this.items[item.category][item.key] = new StoreItem(item, this);
    }
};

module.exports = Store;

},{"../ItemsPopUp":19,"./StoreItem":23}],23:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 17/07/2015.
 */
var ItemGroupView = require('../ItemGroupView');

/**
 * View for a Store item.
 * @class StoreItem
 * @extends ItemGroupView
 * @constructor
 * @param {Item} item - Item to be displayed by this class.
 * @param {Store} parentView - View on which the item will be displayed.
 */
var StoreItem = function(item, parentView) {
    ItemGroupView.call(this, item.key + 'Icon', 'Buy', parentView);
    this.item = item;
    this.updatePriceText();
    this.setTitle(this.item.name);
    this.setDescription(this.item.description);
};

StoreItem.prototype = Object.create(ItemGroupView.prototype);
StoreItem.prototype.constructor = StoreItem;

/**
 * Updates the price of the item to be displayed.
 * @method StoreItem.updatePriceText
 */
StoreItem.prototype.updatePriceText = function() {
    this.setAuxText('$ ' + this.item.price);
};

/**
 * Allows the player to buy this item.
 * @method StoreItem.buttonAction
 */
StoreItem.prototype.buttonAction = function() {
    var successfulPurchase = level.player.buyItem(this.item);
    if (successfulPurchase) {
        this.item.use();
        level.updateScoreText();
        level.showSuccessMessage('Successful Purchase!', this.parent);
    }else {
        level.showErrorMessage('Not enough money.', this.parent);
    }
};

module.exports = StoreItem;

},{"../ItemGroupView":18}],24:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/07/2015.
 */

/**
 * Controls a bullet from a weapon.
 * @class Bullet
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} power - Damage that can cause this bullet.
 * @param {string} imageKey - Texture's key of this bullet.
 */
var Bullet = function(power, imageKey) {
    Phaser.Sprite.call(this, level.game, 0, 0, imageKey);
    this.power = power;

    level.game.physics.arcade.enable(this);
    this.anchor.setTo(0, 0.5);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

module.exports = Bullet;

},{}],25:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NUMBER_OF_BULLETS = 30;
/**
 * Texture's key for this weapon.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_KEY = 'machineGun';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_KEY = 'bullet2';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_SPEED = 700;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_FIRE_RATE = 100;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var MACHINE_GUN_BULLET_POWER = 10;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 100;

/**
 * Represents a MachineGun, which is a  kind of a Weapon.
 * @class MachineGun
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var MachineGun = function(x, y, infinite) {
    Weapon.call(
        this,
        x,
        y,
        MACHINE_GUN_NUMBER_OF_BULLETS,
        MACHINE_GUN_KEY,
        MACHINE_GUN_BULLET_KEY,
        MACHINE_GUN_NEXT_FIRE,
        MACHINE_GUN_BULLET_SPEED,
        MACHINE_GUN_FIRE_RATE,
        MACHINE_GUN_BULLET_POWER,
        infinite,
        PRICE
    );
    this.name = 'Machine Gun';
};

MachineGun.prototype = Object.create(Weapon.prototype);
MachineGun.prototype.constructor = MachineGun;

module.exports = MachineGun;

},{"./Weapon":27}],26:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 23/07/2015.
 */
var Weapon = require('./Weapon');

/**
 * Default number of bullets for this weapon.
 * @constant
 * @type {number}
 */
var REVOLVER_NUMBER_OF_BULLETS = 20;
/**
 * Texture's key for this weapon
 * @constant
 * @type {number}
 */
var REVOLVER_KEY = 'revolver';
/**
 * Texture's key for this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_KEY = 'bullet1';
/**
 * The time player is allowed to shoot again.
 * @constant
 * @type {number}
 */
var REVOLVER_NEXT_FIRE = 1;
/**
 * This weapon bullets' speed
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_SPEED = 400;
/**
 * Rate at which this weapon fires, the lower the number, the higher the firing
 * rate.
 * @constant
 * @type {number}
 */
var REVOLVER_FIRE_RATE = 250;
/**
 * Damage that can cause this weapon bullets.
 * @constant
 * @type {number}
 */
var REVOLVER_BULLET_POWER = 1;
/**
 * The price that this weapon costs.
 * @constant
 * @type {number}
 */
var PRICE = 20;

/**
 * Represents a Revolver, which is a  kind of a Weapon.
 * @class Revolver
 * @extends Weapon
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 */
var Revolver = function(x, y, inifinite) {
    Weapon.call(
        this,
        x,
        y,
        REVOLVER_NUMBER_OF_BULLETS,
        REVOLVER_KEY,
        REVOLVER_BULLET_KEY,
        REVOLVER_NEXT_FIRE,
        REVOLVER_BULLET_SPEED,
        REVOLVER_FIRE_RATE,
        REVOLVER_BULLET_POWER,
        inifinite,
        PRICE
    );
    this.name = 'Revolver';
};

Revolver.prototype = Object.create(Weapon.prototype);
Revolver.prototype.constructor = Revolver;

module.exports = Revolver;

},{"./Weapon":27}],27:[function(require,module,exports){
var Item = require('../Item');
var Bullet = require('./Bullet');

/**
 * The key of the frame to be displayed when weapon should point to right.
 * @constant
 * @type {number}
 */
var RIGHT_KEY = 0;
/**
 * The key of the frame to be displayed when weapon should point to left.
 * @constant
 * @type {number}
 */
var LEFT_KEY = 1;

/**
 * Represents a game weapon for characters.
 * @class Weapon
 * @extends Item
 * @constructor
 * @param {number} x - Weapon's x coordinate within the game world.
 * @param {number} y - Weapon's y coordinate within the game world.
 * @param {number} numberOfBullets - Number of bullets for this weapon.
 * @param {string} weaponKey - Texture's key for this weapon.
 * @param {string} bulletKey - Texture's key for this weapon bullets.
 * @param {number} nextFire - The time player is allowed to shoot again.
 * @param {number} bulletSpeed - This weapon bullets' speed
 * @param {number} fireRate - Rate at which this weapon fires, the lower the
 * number, the higher the firing rate.
 * @param {number} power - Damage that can cause this weapon bullets.
 * @param {boolean} infinite - Indicates weather this weapon has infinite
 * bullets or not.
 * @param {number} price - The price that this weapon costs.
 */
var Weapon = function(x,
                      y,
                      numberOfBullets,
                      weaponKey,
                      bulletKey,
                      nextFire,
                      bulletSpeed,
                      fireRate,
                      power,
                      infinite,
                      price) {
    Item.call(this, x, y, weaponKey, price);

    this.anchor.set(0.5, 0);

    this.numberOfBullets = numberOfBullets;
    this.power = power;
    this.bullets = level.game.add.group();

    for (var i = 0; i < this.numberOfBullets; i++) {
        this.bullets.add(new Bullet(power, bulletKey));
    }

    this.nextFire = nextFire;
    this.bulletSpeed = bulletSpeed;
    this.fireRate = fireRate;
    this.infinite = infinite;
    this.description = 'Damage: ' + this.power +
        '\nAmmo: ' + this.numberOfBullets;
    this.category = 'weapons';
};

Weapon.prototype = Object.create(Item.prototype);
Weapon.prototype.constructor = Weapon;

/**
 * Allows the character to shoot or fire this weapon
 * @method Weapon.fire
 * @param {number} toX - X coordinate of the point to fire to.
 * @param {number} toY - Y coordinate of the point to fire to.
 */
Weapon.prototype.fire = function(toX, toY) {
    var finalToY = toY || this.y;
    if (level.game.time.time > this.nextFire &&
        (this.infinite || this.numberOfBullets > 0)) {
        this.currentBullet = this.bullets.getFirstExists(false);
        if (this.currentBullet) {
            this.currentBullet.reset(this.x, this.y);
            this.currentBullet.rotation =
                level.game.physics.arcade.angleToXY(this.currentBullet,
                toX, finalToY);
            this.currentBullet.body.velocity.x =
                Math.cos(this.currentBullet.rotation) * this.bulletSpeed;
            this.currentBullet.body.velocity.y =
                Math.sin(this.currentBullet.rotation) * this.bulletSpeed;
            this.nextFire = level.game.time.time + this.fireRate;
            this.numberOfBullets--;
        }
    }
};

/**
 * Relocates this weapon within the game world.
 * @method Weapon.updateCoordinates
 * @param {number} x - X coordinate of the new position.
 * @param {number} y - Y  coordinate of the new position.
 */
Weapon.prototype.updateCoordinates = function(x, y) {
    this.x = x;
    this.y = y;
};

/**
 * Allows the character to use this weapon.
 * @method Weapon.use
 */
Weapon.prototype.use = function() {
    if (!this.alive) {
        this.revive();
    }
    level.player.useWeapon(this);
    level.updateAmmoText();
};

/**
 * Add bullets to the weapon.
 * @method Weapon.addBullets
 * @param {number} amount - Number of bullets to be added.
 */
Weapon.prototype.addBullets = function(amount) {
    this.numberOfBullets += amount;
};

/**
 * Kills this weapon so that it is not more accessible within the game.
 * @method Weapon.killWeapon
 */
Weapon.prototype.killWeapon = function() {
    this.bullets.removeAll();
    this.kill();
};

/**
 * Points the weapon to the right.
 * @method Weapon.pointToRight
 */
Weapon.prototype.pointToRight = function() {
    this.frame = RIGHT_KEY;
};

/**
 * Points the weapon to the left.
 * @method Weapon.pointToLeft
 */
Weapon.prototype.pointToLeft = function() {
    this.frame = LEFT_KEY;
};

module.exports = Weapon;

},{"../Item":17,"./Bullet":24}],28:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 07/07/2015.
 */

/**
 * Phaser state to boot game.
 * @class Boot
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Boot = function(game) {};

/**
 * Loads assets for preload screen.
 * @method Boot.preload
 */
Boot.prototype.preload = function() {
    this.load.image('loading', 'assets/images/loading.png');
    this.load.image('load_progress_bar_dark',
        'assets/images/progress_bar_bg.png');
    this.load.image('load_progress_bar',
        'assets/images/progress_bar_fg.png');
};

/**
 * Starts preloader state.
 * @method Boot.create
 */
Boot.prototype.create = function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preloader');
};

module.exports = Boot;

},{}],29:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Game main menu. It allows the player to start a new game.
 * @class Menu
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Menu = function(game) {};

/**
 * Creates the buttons for the menu items.
 * @method Menu.create
 */
Menu.prototype.create = function() {
    var newGame = this.game.add.text(this.game.camera.width / 2,
            this.game.camera.height / 2, 'New Game');
    //Font style
    newGame.font = 'Arial';
    newGame.fontSize = 50;
    newGame.fontWeight = 'bold';
    newGame.fill = '#0040FF';
    newGame.anchor.set(0.5);
    newGame.inputEnabled = true;
    newGame.events.onInputDown.add(this.newGame, this);
};

/**
 * Starts a new game.
 * @method Menu.newGame
 */
Menu.prototype.newGame = function() {
    this.game.state.start('levelOneIntro');
};

module.exports = Menu;

},{}],30:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 08/07/2015.
 */
/**
 * Phaser state to load all assets.
 * @class Preloader
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Preloader = function(game) {
    this.ready = false;
};

/**
 * Manages this state behavior.
 * @method Preloader.preload
 */
Preloader.prototype.preload = function() {
    this.displayLoadScreen();
    this.loadAssets();
};

/**
 * Displays loading bar while assets load.
 * @method Preloader.displayLoadScreen
 */
Preloader.prototype.displayLoadScreen = function() {
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    this.loading = this.game.add.sprite(centerX, centerY - 20, 'loading');
    this.loading.anchor.setTo(0.5, 0.5);

    this.barBg = this.game.add.sprite(centerX, centerY + 40,
        'load_progress_bar_dark');
    this.barBg.anchor.setTo(0.5, 0.5);

    this.bar = this.game.add.sprite(centerX - 192, centerY + 40,
        'load_progress_bar');
    this.bar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.bar);

    // onLoadComplete is dispatched when the final file in the load queue
    // has been loaded/failed. addOnce adds that function as a callback,
    // but only to fire once.
    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
};

/**
 * Loads game assets.
 * @method Preloader.loadAssets
 */
Preloader.prototype.loadAssets = function() {
    //Menu assets
    //Level assets
    this.game.load.image('worldBg', 'assets/images/worldBg.png');
    this.game.load.image('ground', 'assets/images/platform.png');
    this.game.load.image('healthPack5', 'assets/images/healthPack5.png');
    this.game.load.image('healthPack20', 'assets/images/healthPack20.png');
    this.game.load.image('healthPack50', 'assets/images/healthPack50.png');
    this.game.load.image('inventory_button', 'assets/images/inventory.png');
    this.game.load.image('storeButton', 'assets/images/store.png');
    this.game.load.image('popUpBg',
        'assets/images/popUpBg.png');
    this.game.load.image('close', 'assets/images/close.png');
    this.game.load.image('itemGroupBg', 'assets/images/itemGroupBg.png');
    this.game.load.image('dialogBg', 'assets/images/dialogBg.png');
    this.game.load.image('errorIcon', 'assets/images/errorIcon.png');
    this.game.load.image('successIcon', 'assets/images/successIcon.png');

    this.game.load.spritesheet('character', 'assets/sprites/character.png',
        64, 96);
    this.game.load.spritesheet('npc', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('friend', 'assets/sprites/npc.png',
        64, 96);
    this.game.load.spritesheet('simple_enemy',
        'assets/sprites/simple_enemy.png', 64, 64);
    this.game.load.spritesheet('strong_enemy',
        'assets/sprites/strong_enemy.png', 64, 64);
    this.game.load.spritesheet('jeep', 'assets/sprites/jeep.png', 219.5,
        150);
    this.game.load.spritesheet('revolver', 'assets/sprites/revolver.png',
        30, 16);
    this.game.load.spritesheet('machineGun',
        'assets/sprites/machineGun.png', 60, 42);

    var i;
    for (i = 1; i <= 2; i++) {
        this.game.load.image('bullet' + i, 'assets/images/bullet' + i +
            '.png');
    }
    this.game.load.image('simpleWeapon',
        'assets/images/revolver.png');
    this.game.load.image('strongWeapon',
        'assets/images/machineGun.png');
    this.game.load.image('house', 'assets/images/house.png');
    this.game.load.image('openDoor', 'assets/images/openDoor.png');
    this.game.load.image('working', 'assets/images/working.png');
    this.game.load.image('addCashButton', 'assets/images/addCash.png');
    this.game.load.image('button', 'assets/images/button.png');
    this.game.load.image('mother', 'assets/images/mother.png');
    this.game.load.image('father', 'assets/images/father.png');
    this.game.load.image('daughter', 'assets/images/daughter.png');
    this.game.load.image('son', 'assets/images/son.png');

    this.game.load.image('lettersBg', 'assets/images/lettersBg.png');
    this.game.load.image('wordsBg', 'assets/images/wordsBg.png');
    this.game.load.image('wordBg', 'assets/images/wordBg.png');
    this.game.load.image('letterBg', 'assets/images/letterBg.png');
    this.game.load.image('transparent', 'assets/images/transparent.png');
    this.game.load.image('healthBarBackground',
        'assets/images/healthBarBackground.png');
    this.game.load.image('healthBar', 'assets/images/healthBar.png');

    this.game.load.image('healthPack5Icon',
        'assets/icons/healthPack5Icon.png');
    this.game.load.image('healthPack20Icon',
        'assets/icons/healthPack20Icon.png');
    this.game.load.image('revolverIcon', 'assets/icons/revolverIcon.png');
    this.game.load.image('unscramble', 'assets/icons/unscramble.png');
    this.game.load.image('contexts', 'assets/icons/contexts.png');
    this.game.load.image('imageWord', 'assets/icons/imageWord.png');
    this.game.load.image('popUpPanelBg',
        'assets/images/popUpPanelBg.png');
    this.game.load.image('tabBg', 'assets/images/tabBg.png');
    this.game.load.image('contextBg', 'assets/images/contextBg.png');

    this.game.load.image('englishChallengePanelBg',
        'assets/images/englishChallengePanelBg.png');
    this.game.load.image('imageWordBg', 'assets/images/imageWordBg.png');

    this.game.load.image('bookStore', 'assets/images/vocabulary/bookStore.png');
    this.game.load.image('playground',
        'assets/images/vocabulary/playground.png');
    this.game.load.image('zoo', 'assets/images/vocabulary/zoo.png');
    this.game.load.image('orangeHouse',
        'assets/images/vocabulary/orangeHouse.png');
    this.game.load.image('greenHouse',
        'assets/images/vocabulary/greenHouse.png');
    this.game.load.image('whiteHouse',
        'assets/images/vocabulary/whiteHouse.png');
    this.game.load.image('yellowHouse',
        'assets/images/vocabulary/yellowHouse.png');
    this.game.load.image('redHouse',
        'assets/images/vocabulary/redHouse.png');
    this.game.load.image('blueHouse',
        'assets/images/vocabulary/blueHouse.png');
    this.game.load.image('gasStation',
        'assets/images/vocabulary/gasStation.png');
    this.game.load.image('nameBoard',
        'assets/images/vocabulary/nameBoard.png');

    this.game.load.image('comicBg', 'assets/images/comics/comicBg.png');
    var key;
    for (i = 1; i <= 7; i++) {
        key = 'intro' + i;
        this.game.load.image(key, 'assets/images/comics/' + key + '.png');
    }

    this.game.load.script('webfont',
        '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
};

/**
 * Starts menu state.
 * @method Preloader.update
 */
Preloader.prototype.update = function() {
    if (!!this.ready) {
        //this.game.state.start('menu');
        this.game.state.start('intro');
        level = this.game.state.states.levelOne;
    }
};

/**
 * Indicates that assets are already load.
 * @method Preloader.onLoadComplete
 */
Preloader.prototype.onLoadComplete = function() {
    this.ready = true;
};

module.exports = Preloader;

},{}],31:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */

var Button = require('../../util/Button');

/**
 * Number seconds to wait before changing the comic image or frame.
 * @constant
 * @type {number}
 */
var SECONDS_BETWEEN_FRAMES = 8;
/**
 * Number of images that contains this comic.
 * @constant
 * @type {number}
 */
var NUMBER_OF_COMIC_IMAGES = 7;
/**
 * Time in seconds to wait before showing a new word.
 * @type {number}
 */
var WORD_DELAY = 300;

/**
 * Manages Game Intro, in which is presented background game story.
 * @class Intro
 * @constructor
 * @param {Phaser.Game} game - Phaser Game object.
 */
var Intro = function(game) {};

/**
 * Creates the comic for the intro and a button to continue.
 * @method Intro.create
 */
Intro.prototype.create = function() {
    var centerX = this.game.camera.width / 2;
    var centerY = this.game.camera.height / 2;

    this.background = this.game.add.sprite(centerX, centerY,
        'comicBg');
    this.background.anchor.set(0.5, 0.7);

    this.changeComicImage('intro1');
    this.currentImage = 1;

    var continueButton = new Button('Continue', this.continue, this);
    continueButton.x = this.game.camera.width - 250;
    continueButton.y = this.game.camera.height - 60;
    this.game.add.existing(continueButton);

    this.game.time.events.repeat(Phaser.Timer.SECOND * SECONDS_BETWEEN_FRAMES,
        NUMBER_OF_COMIC_IMAGES, this.updateComic, this);

    this.scripts = [
        'Edwar gets home',
        'He parks his car and gets into his house',
        'Now he wants to eat something',
        'Edwar finds a piece of paper',
        'Someone kidnapped his family und he is now angry',
        'He needs a weapon to defend himself',
        'He will rescue his family, but that can be dangerous'
    ];
    this.comicText = this.game.add.text(100, 450, '',
        {font: '20px Arial', fill: '#FFFFFF'});
    this.game.add.existing(this.comicText);
    this.showScript(0);
};

/**
 * Allows the player to start level one.
 * @method Intro.continue
 */
Intro.prototype.continue = function() {
    this.game.state.start('levelOne');
};

/**
 * Updates the image to be showed, in order to show the whole intro story. This
 * method is called every SECONDS_BETWEEN_FRAMES.
 * @method Intro.updateComic
 */
Intro.prototype.updateComic = function() {
    if (this.currentImage < NUMBER_OF_COMIC_IMAGES) {
        this.currentImage ++;
        this.changeComicImage('intro' + this.currentImage);
        this.showScript(this.currentImage - 1);
    }else {
        this.continue();
    }
};

/**
 * Changes the current image of the comic.
 * @method Intro.changeComicImage
 * @param {string} imageKey - New images' texture key.
 */
Intro.prototype.changeComicImage = function(imageKey) {
    var image = this.game.make.sprite(0, 0, imageKey);
    image.anchor.set(0.5, 0.5);
    if (this.background.children.length > 0) {
        this.background.removeChildren();
    }
    this.background.addChild(image);

};

/**
 * Shows the script that corresponds to an index in this.scripts array.
 * @method Intro.showScript
 * @param {number} index - Index of the script to be showed.
 */
Intro.prototype.showScript = function(index) {
    this.wordIndex = 0;
    this.comicText.text = '';
    this.line = this.scripts[index].split(' ');
    this.game.time.events.repeat(WORD_DELAY, this.line.length, this.nextWord,
        this);

};

/**
 * Adds a new word to the script showed on screen.
 * @method Intro.nextWord
 */
Intro.prototype.nextWord = function() {
    this.comicText.text = this.comicText.text.concat(this.line[this.wordIndex] +
        ' ');
    this.wordIndex++;
};

module.exports = Intro;

},{"../../util/Button":34}],32:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/06/2015.
 */
var Inventory = require('../../items/inventory/Inventory');
var Store = require('../../items/store/Store');
var HealthPack = require('../../items/HealthPack');
var Player = require('../../character/Player');
var Revolver = require('../../items/weapons/Revolver');
var MachineGun = require('../../items/weapons/MachineGun');
var SimpleEnemy = require('../../character/SimpleEnemy');
var StrongEnemy = require('../../character/StrongEnemy');
var NPC = require('../../character/NPC');
var PopUp = require('../../util/PopUp');
var InteractiveCar = require ('../../worldElements/InteractiveCar');
var Dialog = require('../../util/Dialog');
var EnglishChallengesMenu =
    require('../../englishChallenges/menu/EnglishChallengesMenu');
var ResourceBar = require('../../util/ResourceBar');
var NameBoard = require('../../worldElements/NameBoard');

/**
 * Represents a game level.
 * @class Level
 * @constructor
 * @param {Phaser.Game} game - Phaser game object.
 */
var Level = function(game) {
    this.game = game;
};

Level.prototype.constructor = Level;

/**
 * Sets world background and size.
 * @method Level.preload
 */
Level.prototype.preload = function() {
    this.game.stage.backgroundColor = '#C7D2FC';

    this.WORLD_WIDTH = 8000;
    this.WORLD_HEIGHT = 500;
    this.GROUND_HEIGHT = this.WORLD_HEIGHT - 100;
};

/**
 * Create all basic game elements, i.e. Palyer, ground, inventory, store, items,
 * characters, etc.
 * @method Level.create
 */
Level.prototype.create = function() {
    this.game.world.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    this.backgroundImage = this.game.add.tileSprite(0, 0, this.WORLD_WIDTH,
        400, 'worldBg');
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.gameObjects = [];
    this.activePopUps = 0;
    this.xDirection = 1;

    this.createBackObjectsGroup();
    this.createHealthPacksGroup();
    this.createCarsGroup();
    this.createNpcsGroup();
    this.createEnemiesGroup();
    this.addPlayer();
    this.createWeaponsGroup();
    this.addPlatforms();
    this.addTexts();
    this.addHealthBar();
    this.addControls();
    this.addCamera();
    this.createInventory();
    this.createEnglishChallengesMenu();
    this.createStore();
};

/**
 * Updates the enemies, the they behave and display.
 * @method Level.updateEnemies
 */
Level.prototype.updateEnemies = function() {
    var i;
    for (i = 0; i < this.enemies.children.length; i++) {
        var enemy = this.enemies.children[i];
        for (var enemyWeaponKey in enemy.weapons) {
            this.game.physics.arcade.overlap(
                this.player,
                enemy.weapons[enemyWeaponKey].bullets,
                this.bulletHitCharacter,
                null,
                this);
        }
        var distanceEnemyPlayer = this.game.physics.arcade.distanceBetween(
            this.player, enemy);
        if (distanceEnemyPlayer <= enemy.rangeAttack) {
            enemy.stop();
            enemy.fireToXY(this.player.x, this.player.y);
        }else if (distanceEnemyPlayer <= enemy.rangeDetection) {
            this.game.physics.arcade.moveToXY(
                enemy,
                this.player.x + enemy.rangeAttack,
                enemy.y);
            enemy.rotateWeapon(this.player.x, this.player.y);
        }
    }
};

/**
 * Updates the non player characters, the they behave and display.
 * @method Level.updateNpcs
 */
Level.prototype.updateNpcs = function() {
    for (var i = 0; i < this.npcs.children.length; i++) {
        var npc = this.npcs.children[i];

        var distanceNpcPlayer = this.game.physics.arcade.distanceBetween(
            this.player, npc);
        if (distanceNpcPlayer <= npc.width) {
            npc.showMessage();
            if (this.player.x < npc.x) {
                this.player.x += 2 * npc.width;
            } else {
                this.player.x -= 2 * npc.width;
            }

        }
    }
};

/**
 * Deals with characters updating, collisions and overlaps. Moreover it deals
 * with game input.
 * @method Level.update
 */
Level.prototype.update = function() {
    //Collisions
    this.updateEnemies();
    this.updateNpcs();

    this.game.physics.arcade.collide(this.gameObjects, this.platforms);
    this.game.physics.arcade.collide(this.player, this.enemies);
    this.game.physics.arcade.overlap(this.player, this.healthPacks,
        this.collectHealthPack, null, this);
    this.game.physics.arcade.overlap(this.player, this.weapons,
        this.collectWeapon, null, this);
    this.game.physics.arcade.overlap(this.cars, this.enemies,
        this.crashEnemy, null, this);

    for (var playerWeaponKey in this.player.weapons) {
        this.game.physics.arcade.overlap(
            this.enemies,
            this.player.weapons[playerWeaponKey].bullets,
            this.bulletHitCharacter,
            null,
            this
        );
    }

    this.game.physics.arcade.overlap(this.player, this.healthPacks,
        this.collectHealthPack, null, this);

    if (this.cursors.left.isDown) {
        this.xDirection = -1;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.player.runLeft();
        } else {
            this.player.moveLeft();
        }
    } else if (this.cursors.right.isDown) {
        this.xDirection = 1;
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.X)) {
            this.player.runRight();
        } else {
            this.player.moveRight();
        }
    } else {
        this.player.stop();
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        this.player.jump();
    }
    if (this.cursors.up.isDown && this.player.body.touching.down) {
        //this.player.crouch();
    }
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        this.player.fireToXY(this.player.x + (100 * this.xDirection));
        //  Add and update the score
        this.updateAmmoText();
    }
};

/**
 * Adds palyer health bar to the game scene.
 * @method Level.addHealthBar
 */
Level.prototype.addHealthBar = function() {
    var x = this.healthLevelText.x + this.healthLevelText.width;
    var y = this.healthLevelText.y;
    this.healthBar = new ResourceBar(x, y);
    this.addObject(this.healthBar);
    this.healthBar.fixedToCamera = true;
};

/**
 * Creates a Phaser group to manage enemies.
 * @method Level.createBackObjectsGroup
 */
Level.prototype.createBackObjectsGroup = function() {
    this.backObjects = this.game.add.group();
};

/**
 * Creates a Phaser group to manage enemies.
 * @method Level.createEnemiesGroup
 */
Level.prototype.createEnemiesGroup = function() {
    this.enemies = this.game.add.group();
    this.gameObjects.push(this.enemies);
};

/**
 * Creates a Phaser group to manage non player characters.
 * @method Level.createNpcsGroup
 */
Level.prototype.createNpcsGroup = function() {
    this.npcs = this.game.add.group();
    this.gameObjects.push(this.npcs);
};

/**
 * Creates a Phaser group to manage interactive cars.
 * @method Level.createCarsGroup
 */
Level.prototype.createCarsGroup = function() {
    this.cars = this.game.add.group();
    this.gameObjects.push(this.cars);
};

/**
 * Adds a new SimpleEnemy to enemies group.
 * @method Level.addSimpleEnemy
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
Level.prototype.addSimpleEnemy = function(x) {
    this.enemies.add(new SimpleEnemy(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds a new StrongEnemy to enemies group.
 * @method Level.addStrongEnemy
 * @param {number} x - X coordinate within the world where the enemy should
 * appear.
 */
Level.prototype.addStrongEnemy = function(x) {
    this.enemies.add(new StrongEnemy(x, this.GROUND_HEIGHT - 100));
};

/**
 * Adds a new non player character to npcs group.
 * @method Level.addNPC
 * @param {number} x - X coordinate within the world where the character should
 * appear.
 * @param {string} key - NPC texture key.
 * @param {string} comicKey - Texture key of the comic that represents the
 * interaction between this NPC and the player.
 */
Level.prototype.addNPC = function(x, key, comicKey) {
    this.npcs.add(new NPC(x, this.GROUND_HEIGHT - 100, key, comicKey));
};

/**
 * Adds a new InteractiveCar to enemies group.
 * @method Level.addCar
 * @param {number} x - X coordinate within the world where the car should
 * appear.
 * @param {string} key - Car texture key.
 */
Level.prototype.addCar = function(x, key) {
    this.cars.add(new InteractiveCar(x, this.GROUND_HEIGHT, key));
};

/**
 * Adds the ground to the game world.
 * @method Level.addPlatforms
 */
Level.prototype.addPlatforms = function() {
    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.ground = this.platforms.create(0, this.GROUND_HEIGHT, 'ground');
    var yScale = 100 / this.ground.height;
    var xScale = this.WORLD_WIDTH / this.ground.width;
    this.ground.scale.setTo(xScale, yScale);
    this.ground.body.immovable = true;

    /*
    this.ledge = this.platforms.create(400, 300, 'ground');
    this.ledge.body.immovable = true;
    this.ledge = this.platforms.create(-150, 200, 'ground');
    this.ledge.body.immovable = true;
    */
};

/**
 * Adds a new object (Sprite) to the world.
 * @method Level.addObject
 * @param {Phaser.Sprite} object - Object to be added.
 */
Level.prototype.addObject = function(object) {
    this.backObjects.add(object);
};

/**
 * Adds the player to the game world.
 * @method Level.addPlayer
 */
Level.prototype.addPlayer = function() {
    this.player = new Player(this);
    this.game.add.existing(this.player);
    this.gameObjects.push(this.player);
    this.player.useWeapon(new Revolver(700, 100, false));
};

/**
 * Adds score, ammo and health level text to the game scene.
 * @method Level.addTexts
 */
Level.prototype.addTexts = function() {
    //The score
    this.scoreText = this.game.add.text(this.game.camera.width - 300, 16,
        'Score: ' + this.player.score, {fontSize: '32px', fill: '#000'});
    this.scoreText.fixedToCamera = true;

    //The ammo
    this.ammoText = this.game.add.text(this.game.camera.width - 300,
        this.game.camera.height - 50,
        'Ammo: ' + this.player.currentWeapon.numberOfBullets,
        {
            fontSize: '32px',
            fill: '#000'
        });
    this.ammoText.fixedToCamera = true;

    //The health level
    this.healthLevelText = this.game.add.text(16, 16, 'Health: ',
        {fontSize: '32px', fill: '#000'});
    this.healthLevelText.fixedToCamera = true;
};

/**
 * Add input to the game.
 * @method Level.addControls
 */
Level.prototype.addControls = function() {
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    this.changeKey.onDown.add(this.player.nextWeapon, this.player);
};

/**
 * Adds a camera to the game, it will follow player.
 * @method Level.addCamera
 */
Level.prototype.addCamera = function() {
    this.game.renderer.renderSession.roundPixels = true;
    this.game.camera.follow(this.player);
};

/**
 * Creates a Phaser group to manage health packs.
 * @method Level.createHealthPacksGroup
 */
Level.prototype.createHealthPacksGroup = function() {
    this.healthPacks = this.game.add.group();
    this.gameObjects.push(this.healthPacks);
};

/**
 * Creates a Phaser group to manage health packs.
 * @method Level.createWeaponsGroup
 */
Level.prototype.createWeaponsGroup = function() {
    this.weapons = this.game.add.group();
    this.gameObjects.push(this.weapons);
};

/**
 * Creates the game inventory and a button to access it.
 * @method Level.createInventory
 */
Level.prototype.createInventory = function() {
    this.inventory = new Inventory(this);
    this.game.add.existing(this.inventory);

    this.inventoryButton = this.game.add.button(50,
        this.game.camera.height - 30, 'inventory_button',
        this.inventory.open, this.inventory);
    this.inventoryButton.anchor.setTo(0.5, 0.5);
    this.inventoryButton.fixedToCamera = true;
    this.inventoryButton.input.priorityID = 1;
};

/**
 * Creates the English challenges menu and a button to access it.
 * @method Level.createEnglishChallengesMenu
 */
Level.prototype.createEnglishChallengesMenu = function() {
    this.englishChallengeMenu = new EnglishChallengesMenu();
    this.game.add.existing(this.englishChallengeMenu);

    this.addCashButton = this.game.add.button(170,
        this.game.camera.height - 30, 'addCashButton',
        this.englishChallengeMenu.open, this.englishChallengeMenu);
    this.addCashButton.anchor.setTo(0.5, 0.5);
    this.addCashButton.fixedToCamera = true;
    this.addCashButton.input.priorityID = 1;
};

/**
 * Creates the game Store and a button to access it.
 * @method Level.createStore
 */
Level.prototype.createStore = function() {
    this.store = new Store(this);
    this.game.add.existing(this.store);

    this.storeButton = this.game.add.button(110,
        this.game.camera.height - 30, 'storeButton',
        this.store.open, this.store);
    this.storeButton.anchor.setTo(0.5, 0.5);
    this.storeButton.fixedToCamera = true;
    this.storeButton.input.priorityID = 1;
};

/**
 * Decrease the health level of character that was impacted with a bullet.
 * @method Level.bulletHitCharacter
 * @param {Character} character - Character that was impacted.
 * @param {Bullet} bullet - Bullet that impacts the character.
 */
Level.prototype.bulletHitCharacter = function(character, bullet) {
    character.decreaseHealthLevel(bullet.power);
    character.updateHealthLevel();
    bullet.kill();
};

/**
 * Allows the player to pick uo a weapon and use it.
 * @method Level.collectWeapon
 * @param {Player} player - Game main player.
 * @param {Weapon} weapon - Weapon to be picked up.
 */
Level.prototype.collectWeapon = function(player, weapon) {
    this.weapons.remove(weapon);
    this.player.useWeapon(weapon);
    this.updateAmmoText();
};

/**
 * Controls when a car crash an Enemy.
 * @method Level.crashEnemy
 * @param {InteractiveCar} car - Car that crashes the enemy.
 * @param {Enemy} enemy - Enemy who is crashed.
 */
Level.prototype.crashEnemy = function(car, enemy) {
    if (!car.isStopped()) {
        enemy.killCharacter();
    }
};

/**
 * Allows the player to pick up a HealthPack.
 * @method Level.collectHealthPack
 * @param {Player} player - Game main player.
 * @param {HealthPack} healthPack - HealthPack to be picked up.
 */
Level.prototype.collectHealthPack = function(player, healthPack) {
    if (!this.player.fullHealthLevel()) {
        this.increaseHealthLevel(healthPack.maxIncreasing);
    } else {
        this.inventory.addItem(healthPack);
    }
    healthPack.pickUp();
};

/**
 * Updates current player's avialbele ammo text.
 * @method Level.updateAmmoText
 */
Level.prototype.updateAmmoText = function() {
    this.ammoText.text = 'Ammo: ' +
        this.player.currentWeapon.numberOfBullets;
};

/**
 * Updates current player's score.
 * @method Level.updateScoreText
 */
Level.prototype.updateScoreText = function() {
    this.scoreText.text = 'Score: ' + this.player.score;
};

/**
 * Updates current player's health leel bar and text.
 * @method Level.updateHealthLevel
 */
Level.prototype.updateHealthLevel = function() {
    if (this.player.healthLevel <= 0) {
        this.game.state.start('menu');
    }
    this.healthLevelText.text = 'Health: ' + this.player.healthLevel;
    this.healthBar.updateResourceBarLevel(this.player.healthLevel /
        this.player.maxHealthLevel);
};

/**
 * Increases player's health level.
 * @method Level.increaseHealthLevel
 * @param {number} increase - The amount to be increased.
 */
Level.prototype.increaseHealthLevel = function(increase) {
    this.player.increaseHealthLevel(increase);
    this.updateHealthLevel();
};

/**
 * Increases player's score.
 * @method Level.increaseScore
 * @param {number} increase - The amount to be increased.
 */
Level.prototype.increaseScore = function(increase) {
    this.player.increaseScore(increase);
    this.updateScoreText();
};

/**
 * Adds a HealthPack to healthPacks group.
 * @method Level.addHealthPack
 * @param {HealthPack} healthPack - HealthPack to be added.
 */
Level.prototype.addHealthPack = function(healthPack) {
    this.healthPacks.add(healthPack);
};

/**
 * Adds a new Revolver to weapons group.
 * @method Level.addRevolver
 * @param {number} x - X coordinate within the world where the Revolver should
 * appear.
 * @param {number} y - Y coordinate within the world where the Revolver should
 * appear.
 * @param {boolean} infiniteAmmo - Indicates whether the revolver has or no
 * infinite ammo.
 */
Level.prototype.addRevolver = function(x, y, infiniteAmmo) {
    this.weapons.add(new Revolver(x, y, infiniteAmmo));
};

/**
 * Adds a new MachineGun to weapons group.
 * @method Level.addMachineGun
 * @param {number} x - X coordinate within the world where the MachineGun should
 * appear.
 * @param {number} y - Y coordinate within the world where the MachineGun should
 * appear.
 * @param {boolean} infiniteAmmo - Indicates whether the MachineGun has or no
 * infinite ammo.
 */
Level.prototype.addMachineGun = function(x, y, infiniteAmmo) {
    this.weapons.add(new MachineGun(x, y, infiniteAmmo));
};

/**
 * Pauses the current game.
 * @method Level.pause
 */
Level.prototype.pause = function() {
    this.game.physics.arcade.isPaused = true;
};

/**
 * Resumes the game when it has been paused.
 * @method Level.resume
 */
Level.prototype.resume = function() {
    this.game.physics.arcade.isPaused = false;
};

/**
 * Shows a Dialog with an error message.
 * @method Level.showErrorMessage
 * @param {string} errorMessage - Message to be showed.
 * @param {PopUp} [parent] - PopUp that shows the message.
 */
Level.prototype.showErrorMessage = function(errorMessage, parent) {
    var errorDialog = new Dialog('errorIcon', errorMessage, parent);
    this.game.add.existing(errorDialog);
    errorDialog.open();
};

/**
 * Shows a Dialog with a success message.
 * @method Level.showSuccessMessage
 * @param {string} successMessage - Message to be showed.
 * @param {PopUp} [parent] - PopUp that shows the message.
 */
Level.prototype.showSuccessMessage = function(successMessage, parent) {
    var successDialog = new Dialog('successIcon', successMessage, parent);
    this.game.add.existing(successDialog);
    successDialog.open();
};

/**
 * Adds a new static building (player can not interact with it) to the game
 * scene.
 * @method Level.prototype.addStaticBuilding
 * @param {number} x - X coordinate within the world where the building should
 * appear.
 * @param {string} key - Bulding texture key.
 * @returns {Phaser.Sprite} - Added building
 */
Level.prototype.addStaticBuilding = function(x, key) {
    var building = level.game.make.sprite(x, this.GROUND_HEIGHT, key);
    building.anchor.set(0, 1);
    this.addObject(building);
    return building;
};

/**
 * Adds two neighbors to a certain building, one on its left and the other one
 * on its right.
 * @method Level.addNeighbors
 * @param {Phaser.Sprite} building - Building, which will have the neighbors.
 * @param {string} leftKey - Left neighbor texture key.
 * @param {string} rightKey - Right neighbor texture key.
 */
Level.prototype.addNeighbors = function(building, leftKey, rightKey) {
    var leftHouse = this.addStaticBuilding(0, leftKey);
    leftHouse.x = building.x - leftHouse.width;
    this.addStaticBuilding(building.x + building.width, rightKey);
};

/**
 * Adds a new NameBoard, typically for a certain place or street.
 * @method Level.addNameBoard
 * @param {number} x - X coordinate within the world, where the board should
 * appear.
 * @param {string} text - Text to be showed on the board.
 */
Level.prototype.addNameBoard = function(x, text) {
    var board;
    board = new NameBoard(x, this.GROUND_HEIGHT, text);
    this.addObject(board);

};

module.exports = Level;

},{"../../character/NPC":4,"../../character/Player":5,"../../character/SimpleEnemy":6,"../../character/StrongEnemy":7,"../../englishChallenges/menu/EnglishChallengesMenu":14,"../../items/HealthPack":16,"../../items/inventory/Inventory":20,"../../items/store/Store":22,"../../items/weapons/MachineGun":25,"../../items/weapons/Revolver":26,"../../util/Dialog":35,"../../util/PopUp":42,"../../util/ResourceBar":43,"../../worldElements/InteractiveCar":48,"../../worldElements/NameBoard":50}],33:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 22/07/2015.
 */
var Level = require ('../levels/Level');
var InteractiveHouse = require ('../../worldElements/InteractiveHouse');
var HealthPack = require('../../items/HealthPack');
var Dialog = require('../../util/Dialog');

/**
 * Number of fights that player will have during this level.
 * @type {number}
 */
var NUMBER_OF_FIGHTING_POINTS = 5;
/**
 * Number of places form vocabulary for this level.
 * @type {number}
 */
var NUMBER_OF_PLACES = 4;
/**
 * Number of houses player should visit during this level.
 * @type {number}
 */
var NUMBER_OF_HOUSES = 2;

/**
 * Manages LevelOne.
 * @class LevelOne
 * @constructor
 * @extends Level
 * @param {Phaser.Game} game - Pahser Game object.
 */
var LevelOne = function(game) {
    Level.call(this, game);
};

LevelOne.prototype = Object.create(Level.prototype);
LevelOne.prototype.constructor = LevelOne;

/**
 * Creates level one specific objects and elements.
 * @method LevelOne.create
 */
LevelOne.prototype.create = function() {
    Level.prototype.create.call(this);
    this.firstCheckPointX = this.game.camera.width * 1.5;
    this.checkPointsDistance = this.WORLD_WIDTH /
        (NUMBER_OF_FIGHTING_POINTS + 1);
    this.addNPCs();
    this.addEnemies();
    this.addObjects();
    this.addPlaces();
    this.addRevolver(3000, this.GROUND_HEIGHT - 40, false);
    this.addRevolver(6000, 350, false);
    var heathPacksDistance = this.WORLD_WIDTH / 4;
    this.addHealthPack(new HealthPack(heathPacksDistance, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 2, 10, 5, this));
    this.addHealthPack(new HealthPack(heathPacksDistance * 3, 10, 5, this));
};

/**
 * Add InteractiveCar and InteractiveHouses for this level.
 * @method LevelOne.addObjects
 */
LevelOne.prototype.addObjects = function() {
    var playerHouse = this.addStaticBuilding(5, 'orangeHouse');

    var house = this.addStaticBuilding(500, 'whiteHouse');
    this.addNeighbors(house, 'greenHouse', 'yellowHouse');

    var dialog = new Dialog('storeButton', 'Use the store to buy a weapon.');
    var gunsStore = new InteractiveHouse(this.firstCheckPointX * 1.4,
        this.GROUND_HEIGHT, 'redHouse', dialog);
    gunsStore.anchor.set(0, 1);
    this.addObject(gunsStore);

    dialog = new Dialog('storeButton', 'Use the store to buy a weapon.');
    var friendsHouse = new InteractiveHouse(5 * this.checkPointsDistance,
        this.GROUND_HEIGHT, 'blueHouse', dialog);
    friendsHouse.anchor.set(0, 1);
    this.addObject(friendsHouse);
    this.addNeighbors(friendsHouse, 'orangeHouse', 'yellowHouse');

    this.addCar(3.7 * this.checkPointsDistance, 'jeep');
};

/**
 * Adds level one non player characters.
 * @method LevelOne.addNPCs
 */
LevelOne.prototype.addNPCs = function() {
    var message = 'I know that you are looking for \nyour family.' +
        '\nI can help you.' +
        '\n\nGo to the blue house after the Zoo,' +
        '\nmaybe your family is there.';
    this.addNPC(this.game.camera.width / 2, 'npc', message);
    message = 'Hi my friend!.' +
        '\n\nGo to the red House before the' +
        '\nPlayground, \nthere you can buy a new weapon.';
    this.addNPC(this.firstCheckPointX * 1.2, 'friend', message);
};

/**
 * Adds this level enemies.
 * @method LevelOne.addEnemies
 */
LevelOne.prototype.addEnemies = function() {
    var x = this.firstCheckPointX * 0.75;
    var y = level.WORLD_HEIGHT - 200;
    var numberOfEnemies = 3;
    for (var i = 0; i < NUMBER_OF_FIGHTING_POINTS; i++) {
        for (var j = 0; j < numberOfEnemies; j++) {
            x += 50;
            this.addSimpleEnemy(x, y);
        }
        numberOfEnemies ++;
        x += this.checkPointsDistance;
    }
};

/**
 * Adds city places from vocabulary that corresponds to this level.
 * @method LevelOne.addPlaces
 */
LevelOne.prototype.addPlaces = function() {
    var housesKeys = ['whiteHouse', 'greenHouse', 'yellowHouse', 'orangeHouse'];
    var placesKeys = ['bookStore', 'playground', 'gasStation', 'zoo'];
    var placesNames = ['Book Store', 'Playground', 'Gas Station', 'Zoo'];
    var x = level.WORLD_WIDTH / (NUMBER_OF_PLACES + 2);
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

module.exports = LevelOne;

},{"../../items/HealthPack":16,"../../util/Dialog":35,"../../worldElements/InteractiveHouse":49,"../levels/Level":32}],34:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 10/10/2015.
 */

/**
 * Represents a Button for the views.
 * @class Button
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} text - Buttons label.
 * @param {function} action - Action to be carried out when button is clicked.
 * @param {Phaser.Sprite} parent - View that contains this button.
 * @param {string} buttonKey - Button's texture key.
 */
var Button = function(text, action, parent, buttonKey) {
    var key = buttonKey || 'button';
    Phaser.Sprite.call(this, level.game, 0, 0, key);

    this.text = level.game.make.text(this.width / 2, this.height / 2, text);
    this.text.anchor.set(0.5, 0.5);
    this.text.font = 'Shojumaru';
    this.text.fontSize = 18;
    this.text.fill = '#FFFFFF';

    this.inputEnabled = true;
    this.events.onInputDown.add(action, parent);

    var scale = (this.text.width + 20) / this.width;
    this.scale.x = scale;
    this.addChild(this.text);
    this.text.scale.x = 1 / scale;
};

Button.prototype = Object.create(Phaser.Sprite.prototype);
Button.prototype.constructor = Button;

module.exports = Button;

},{}],35:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
var HorizontalLayoutPopUp = require('./HorizontalLayoutPopUp');

/**
 * View for a Dialog.
 * @class Dialog
 * @extends PopUp
 * @constructor
 * @param {string} iconKey - Background texture key.
 * @param {string} text - Text to be through the dialog.
 * @param {PopUp} [parent = null] - View that generates the Dialog.
 */
var Dialog = function(iconKey, text, parent) {
    HorizontalLayoutPopUp.call(this, 'dialogBg', parent, null, 20);

    this.icon = level.game.make.sprite(0, 0, iconKey);
    var scale;
    if (this.icon.width > 100) {
        scale = this.icon.width / 100;
    }else {
        scale = 100 / this.icon.width;
    }
    this.icon.scale.setTo(scale, scale);

    this.message = level.game.make.text(0, 0, '');
    this.message.font = 'Arial';
    this.message.fontSize = 20;
    this.message.fill = '#000000';
    this.message.text = text;

    this.addElement(this.icon);
    this.addElement(this.message);
};

Dialog.prototype = Object.create(HorizontalLayoutPopUp.prototype);
Dialog.prototype.constructor = Dialog;

/**
 * Sets the text to be diaplayed through this dialog.
 * @method Dialog.setText
 * @param text
 */
Dialog.prototype.setText = function(text) {
    this.message.text = text;
};

module.exports = Dialog;

},{"./HorizontalLayoutPopUp":41}],36:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * The margin between the cells if the grid.
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Represents a grid with a fixed number of rows and columns. All the cells have
 * the same height and width.
 * @class GridLayout
 * @constructor
 * @param {number} numberOfColumns - Number of columns for the grid.
 * @param {number} numberOfRows - Number of rows for the grid.
 * @param {Sprite} container - Container in which elements are added
 * @param {number} xOrigin - X coordinate where the grid starts
 * @param {number} yOrigin - Y coordinate where the grid starts
 * @param {number} margin - Space between elements, optional.

 */
var GridLayout = function(numberOfColumns, numberOfRows, xOrigin, yOrigin,
                          container, margin) {
    this.currentRow = 0;
    this.currentColumn = 0;
    this.numberOfColumns = numberOfColumns;
    this.numberOfRows = numberOfRows;
    this.margin = margin || MARGIN;
    if (numberOfColumns === 1 && numberOfRows === 1) {
        this.xOrigin = 0;
        this.yOrigin = 0;
    } else {
        this.xOrigin = this.margin + xOrigin;
        this.yOrigin = this.margin + yOrigin;
    }
    this.rowWidth = (container.width - xOrigin - this.margin * 2) /
        this.numberOfColumns;
    this.rowHeight = (container.height - yOrigin - this.margin * 2) /
        this.numberOfRows;
    this.container = container;
};

GridLayout.prototype.constructor = GridLayout;

/**
 * Adds an element to the container on the next possible cell of the grid.
 * @method GridLayout.addElement
 * @param element {Sprite} Element to be added to the container
 */
GridLayout.prototype.addElement = function(element) {
    if (this.currentColumn >= this.numberOfColumns) {
        this.currentColumn = 0;
        this.currentRow++;
        if (this.currentRow === this.numberOfRows) {
            return;
        }
    }
    var xCentered = (this.rowWidth / 2) - (element.width / 2);
    element.x = this.xOrigin + (this.rowWidth) *
        this.currentColumn + xCentered;
    var yCentered = this.yOrigin + (this.rowHeight / 2) - (element.height / 2);
    element.y = (this.rowHeight) *
        this.currentRow + yCentered;

    this.container.addChild(element);
    this.currentColumn ++;
};

/**
 * Restarts the indexes, currentRow and currentColumn.
 * @method GridLayout.restartIndexes
 */
GridLayout.prototype.restartIndexes = function() {
    this.currentColumn = 0;
    this.currentRow = 0;
};

module.exports = GridLayout;

},{}],37:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var GridLayout = require('./GridLayout');

/**
 * Lowest number of columns for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_COLUMNS = 1;
/**
 * Lowest number of rows for this Panel
 * @constant
 * @default
 * @type {number}
 */
var NUMBER_OF_ROWS = 1;

/**
 * Represents a Panel that uses a GridLayout to arrange its elements.
 * @class GridLayoutPanel
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {Object} [optionals.x] - X coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.y] - Y coordinate for the Panel within its parent
 * view.
 * @param {Object} [optionals.numberOfColumns] - Number of columns for the
 * panel.
 * @param {Object} [optionals.numberOfRows] - Number of rows for the panel.
 */
var GridLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.numberOfColumns = ops.numberOfColumns || NUMBER_OF_COLUMNS;
    this.numberOfRows = ops.numberOfRows || NUMBER_OF_ROWS;

    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0, 0,
        this, ops.margin);
};

GridLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
GridLayoutPanel.prototype.constructor = GridLayoutPanel;

/**
 * Add an element to the panel.
 * @method GridLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element ot be added to the panel.
 */
GridLayoutPanel.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 * @method GridLayoutPanel.removeAllElements
 */
GridLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.grid.restartIndexes();
};

module.exports = GridLayoutPanel;

},{"./GridLayout":36}],38:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var GridLayout = require('./GridLayout');

/**
 * Minimum number of columns for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_COLUMNS = 1;
/**
 * Minimum number of rows for this container
 * @constant
 * @type {number}
 */
var MIN_NUMBER_OF_ROWS = 1;

/**
 * Represents a PopUpLayout that contains a grid layout to arrange its elements.
 * @class GridLayoutPopUp
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Texture's key of the background
 * @param {string} title - Name or title of the PopUp.
 * @param {Object} [dimensions.numberOfColumns] - Number of columns for the
 * PopUp.
 * @param {Object} [dimensions.numberOfRows] - Number of rows for the PopUp.
 * @param {Phaser.Sprite} parent - View or Sprite that opened this PopUp.
 */
var GridLayoutPopUp = function(backgroundKey, title, dimensions, parent) {
    PopUp.call(this, backgroundKey, parent, title);
    this.currentRow = 0;
    this.currentColumn = 0;

    var dims = dimensions || {};
    this.numberOfColumns = dims.numberOfColumns || MIN_NUMBER_OF_COLUMNS;
    this.numberOfRows = dims.numberOfRows || MIN_NUMBER_OF_ROWS;
    this.grid = new GridLayout(this.numberOfColumns, this.numberOfRows, 0,
        this.title.height + this.title.y, this, dims.margin);

};

GridLayoutPopUp.prototype = Object.create(PopUp.prototype);
GridLayoutPopUp.prototype.constructor = GridLayoutPopUp;

/**
 * Add an element to the container in the next possible cell of the grid.
 * @method GridLayoutPopUp.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
GridLayoutPopUp.prototype.addElement = function(element) {
    this.grid.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method GridLayoutPopUp.restartPositions
 */
GridLayoutPopUp.prototype.restartPositions = function() {
    this.grid.restartsIndexes();
};

module.exports = GridLayoutPopUp;

},{"./GridLayout":36,"./PopUp":42}],39:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */

/**
 * Default value for the margin between elements.
 * @constant
 * @default
 * @type {number}
 */
var MARGIN = 10;

/**
 * Controls an HorizontalLayout for a view, so that it arranged elements
 * horizontally, one after another, centered on y axis.
 * @class HorizontalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - View on which elements are added and
 * arranged.
 * @param {number} [margin = MARGIN] - Margin between elements.
 */
var HorizontalLayout = function(parent, margin) {
    this.margin = margin || MARGIN;
    this.currentX = this.margin;
    this.parent = parent;
};

HorizontalLayout.prototype.constructor = HorizontalLayout;

/**
 * Add an element horizontally, after the last one (if any), centered on y axis.
 * @method HorizontalLayout.addElement
 * @param {Phaser.Sprite} element - Element to be added to the view.
 */
HorizontalLayout.prototype.addElement = function(element) {
    element.x = this.currentX;
    this.currentX += element.width + this.margin ;
    element.y = this.parent.height / 2 - element.height / 2;

    this.parent.addChild(element);
};

/**
 * Restarts the position of x to the first one, so that new element will be
 * added in first position.
 * @method HorizontalLayout.restartPosition
 */
HorizontalLayout.prototype.restartPosition = function() {
    this.currentX = this.margin;
};

module.exports = HorizontalLayout;

},{}],40:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

var HorizontalLayout = require('./HorizontalLayout');
/**
 * Represents a panel that has a HorizontalLayout to arrange its elements.
 * @class HorizontalLayoutPanel
 * @extends Phaser.Sprite
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {Object} [optionals.x = 0] - X coordinate for the panel within its
 * parent view.
 * @param {Object} [optionals.y = 0] - Y coordinate for the panel within its
 * parent view.
 * @constructor
 */
var HorizontalLayoutPanel = function(backgroundKey, optionals) {
    var ops = optionals || [];
    var x = ops.x || 0;
    var y = ops.y || 0;
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.layout = new HorizontalLayout(this);
};

HorizontalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
HorizontalLayoutPanel.prototype.constructor = HorizontalLayoutPanel;

/**
 * Adds an element to the Panel horizontally.
 * @method HorizontalLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element to be added to the panel.
 */
HorizontalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

module.exports = HorizontalLayoutPanel;

},{"./HorizontalLayout":39}],41:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 11/10/2015.
 */
var PopUp = require('./PopUp');
var Horizontalayout = require('./HorizontalLayout');

/**
 * Represents a PopUp that arranges its elements using an HorizontalLayout.
 * @class HorizontalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} parent - View that creates this PopUp.
 * @param {string} title - PopUp title.
 * @param {number} margin - Margin between elements.
 */
var HorizontalLayoutPopUP = function(backgroundKey, parent, title, margin) {
    PopUp.call(this, backgroundKey, parent, title);
    this.layout = new Horizontalayout(this, margin);
};

HorizontalLayoutPopUP.prototype = Object.create(PopUp.prototype);
HorizontalLayoutPopUP.prototype.constructor = HorizontalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method HorizontalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added.
 */
HorizontalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method HorizontalLayoutPopUP.restartPositions
 */
HorizontalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = HorizontalLayoutPopUP;


},{"./HorizontalLayout":39,"./PopUp":42}],42:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 16/07/2015.
 */
/**
 * Represents a pop up window.
 * @class PopUp
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Background texture key.
 * @param {PopUP} [parent] - View that creates this PopUP.
 * @param {string} [title] - PopUp title.
 */
var PopUp = function(backgroundKey, parent, title) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);

    this.xCenter = this.width / 2;
    this.yCenter = this.height / 2;

    this.x = level.game.camera.width / 2 - this.xCenter;
    this.y = level.game.camera.height / 2 - this.yCenter;

    this.closeButton = level.game.make.sprite(this.width - 5, 5, 'close');
    this.closeButton.anchor.set(1, 0);
    this.closeButton.inputEnabled = true;
    this.closeButton.input.priorityID = 2;
    this.closeButton.events.onInputDown.add(this.close, this);

    if (title !== undefined) {
        this.title = level.game.make.text(this.xCenter, 10, title);
        this.title.font = 'Shojumaru';
        this.title.fontSize = 30;
        this.title.fill = '#FFFFFF';
        this.title.anchor.set(0.5, 0);
        this.addChild(this.title);
    }
    this.addChild(this.closeButton);

    this.fixedToCamera = true;
    this.visible = false;

    if (parent === undefined) {
        this.withoutParent = true;
    }else {
        this.withoutParent = false;
        this.parent = parent;
    }
};

PopUp.prototype = Object.create(Phaser.Sprite.prototype);
PopUp.prototype.constructor = PopUp;

/**
 * Closes or disposes this PopUp window.
 * @method PopUp.close
 */
PopUp.prototype.close = function() {
    this.visible = false;
    level.activePopUps --;
    if (level.activePopUps === 0) {
        level.resume();
    }
    this.kill();
};

/**
 * Opens or displays this PopUp window.
 * @method PopUp.open
 */
PopUp.prototype.open = function() {
    if (!this.alive) {
        this.revive();
    }if (level.activePopUps === 0) {
        level.pause();
    }
    level.activePopUps ++;
    this.bringToTop();
    this.visible = true;
};

/**
 * Remove all the elements that contains the PopUp
 * @method PopUp.removeAllElements
 */
PopUp.prototype.removeAllElements = function() {
    var index = 1;
    if (this.title !== undefined) {
        index = 2;
    }
    this.removeChildren(index);
    this.restartPositions();
};

module.exports = PopUp;

},{}],43:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 15/10/2015.
 */

/**
 * Bar that shows the remaining part of a resource, for example a HealthBar.
 * @class ResourceBar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - X coordinate of the bar.
 * @param {number} y - Y coordinate of the bar.
 * @param {Object} [size.width] - Bar width.
 * @param {Object} [size.height] - Bar height.
 */
var ResourceBar = function(x, y, size) {
    Phaser.Sprite.call(this, level.game, x, y, 'healthBarBackground');
    this.bar = level.game.make.sprite(0, 0, 'healthBar');
    var sizeOps = size || [];
    if (sizeOps.width !== undefined && sizeOps.height !== undefined) {
        this.width =  sizeOps.width;
        this.height =  sizeOps.height;
    }
    this.addChild(this.bar);
};

ResourceBar.prototype = Object.create(Phaser.Sprite.prototype);
ResourceBar.prototype.constructor = ResourceBar;

/**
 * Updates the current level of the bar.
 * @method ResourceBar.updateResourceBarLevel
 * @param {number} barLevel - Number between 0 (0%) and 1 (100%), that
 * represents the bar current level.
 */
ResourceBar.prototype.updateResourceBarLevel = function(barLevel) {
    this.bar.scale.x = barLevel;
};

module.exports = ResourceBar;

},{}],44:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

/**
 * Tha class Utilities contains different functions or utilities that are useful
 * within other classes.
 * @class Utilities
 * @constructor
 */
var Utilities = function() {};

/**
 * Returns a list with random indexes for an array of length = size.
 * @method Utilities.randomIndexesArray
 * @param {number} size - Array's length.
 * @returns {number[]} Array containing the random indexes.
 */
Utilities.prototype.randomIndexesArray = function(size) {
    var randomIndex;
    var randomIndexes = [];
    var indexes = [];
    var  i;
    for (i = 0; i < size; i++) {
        indexes.push(i);
    }
    for (i = 0; i < size; i++) {
        randomIndex = level.game.rnd.integerInRange(0, indexes.length - 1);
        randomIndexes.push(indexes[randomIndex]);
        indexes.splice(randomIndex, 1);
    }
    return randomIndexes;
};

module.exports = Utilities;

},{}],45:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */
/**
 * Margin to hold between elements
 * @constant
 * @type {number}
 */
var MARGIN = 10;

/**
 * Allow control for a Vertical Layout Sprite.
 * @class VerticalLayout
 * @constructor
 * @param {Phaser.Sprite} parent - Sprite that contains the layout.
 * @param {number} margin - Margin or space between elements, optional.
 * @param {number} [yOrigin] - Where layout should start adding elements.
 */
var VerticalLayout = function(parent, margin, yOrigin) {
    var y = yOrigin || 0;
    this.margin = margin || MARGIN;
    this.currentY = this.margin + y;
    this.parent = parent;
};

VerticalLayout.prototype.constructor = VerticalLayout;

/**
 * Adds a element as a child to the parent Sprite, is add the elment vercially
 * bellow the last element and centered on x axis.
 * @method VerticalLayout.addElement
 * @param {Phaser.Sprite} element Element to be added to the Sprite
 */
VerticalLayout.prototype.addElement = function(element) {
    element.y = this.currentY;
    this.currentY += element.height + this.margin;
    element.x = this.parent.width / 2 - element.width / 2;

    this.parent.addChild(element);
};

/**
 * Restart the position of y, so that the next element is added at the first
 * position.
 * @method VerticalLayout.restartPosition
 */
VerticalLayout.prototype.restartPosition = function() {
    this.currentY = this.margin;
};

module.exports = VerticalLayout;

},{}],46:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 13/10/2015.
 */

var VerticalLayout = require('./VerticalLayout');

/**
 * Represents a panel that has a VerticalLayout to arrange its elements.
 * @class VerticalLayoutPanel
 * @extends Phaser.Sprite
 * @constructor
 * @param {string} backgroundKey - Texture's key for panel's background
 * @param {number} margin - Margin or space between elements, optional
 * @param {number} yOrigin - Where layout should start adding elements,
 * optional.
 */
var VerticalLayoutPanel = function(backgroundKey, margin, yOrigin) {
    Phaser.Sprite.call(this, level.game, 0, 0, backgroundKey);
    this.layout = new VerticalLayout(this, margin, yOrigin);
};

VerticalLayoutPanel.prototype = Object.create(Phaser.Sprite.prototype);
VerticalLayoutPanel.prototype.constructor = VerticalLayoutPanel;

/**
 * Adds an element to the Panel vertically.
 * @method VerticalLayoutPanel.addElement
 * @param {Phaser.Sprite} element - Element to be added.
 */
VerticalLayoutPanel.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Remove all the elements that contains the panel
 * @method VerticalLayoutPanel.removeAllElements
 */
VerticalLayoutPanel.prototype.removeAllElements = function() {
    this.removeChildren();
    this.layout.restartPosition();
};

/**
 * Restarts the positions of x and y to the origin.
 * @method VerticalLayoutPanel.restartPosition
 */
VerticalLayoutPanel.prototype.restartPosition = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPanel;


},{"./VerticalLayout":45}],47:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 21/10/2015.
 */
var PopUp = require('./PopUp');
var VerticalLayout = require('./VerticalLayout');

/**
 * PopUp view that uses a VerticalLayout to arrange its elements.
 * @class VerticalLayoutPopUP
 * @extends PopUp
 * @constructor
 * @param {string} backgroundKey - Background texture's key.
 * @param {PopUp} [parent] - View that creates this PopUp.
 * @param {string} title - Title for this PopUp.
 */
var VerticalLayoutPopUP = function(backgroundKey, parent, title) {
    PopUp.call(this, backgroundKey, parent, title);
    var yOrigin = this.title.y + this.title.height || 0;
    this.layout = new VerticalLayout(this, null, yOrigin);
};

VerticalLayoutPopUP.prototype = Object.create(PopUp.prototype);
VerticalLayoutPopUP.prototype.constructor = VerticalLayoutPopUP;

/**
 * Adds an element to the PopUp.
 * @method VerticalLayoutPopUP.addElement
 * @param {Phaser.Sprite} element - Element to be added to the PopUp.
 */
VerticalLayoutPopUP.prototype.addElement = function(element) {
    this.layout.addElement(element);
};

/**
 * Restarts the positions x and y to the origin, so that next elements will be
 * added in the first position.
 * @method VerticalLayoutPopUP.restartPositions
 */
VerticalLayoutPopUP.prototype.restartPositions = function() {
    this.layout.restartPosition();
};

module.exports = VerticalLayoutPopUP;

},{"./PopUp":42,"./VerticalLayout":45}],48:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var PopUp = require('../util/PopUp');
var ResourceBar = require('../util/ResourceBar');

/**
 * Default car speed.
 * @constant
 * @type {number}
 */
var DEFAULT_CAR_SPEED = 400;
/**
 * Default greatest car speed.
 * @constant
 * @type {number}
 */
var DEFAULT_CAR_MAX_SPEED = 500;
/**
 * Car gravity.
 * @constant
 * @type {number}
 */
var CAR_GRAVITY = 30000;
/**
 * Longest distance that car can go.
 * @constant
 * @type {number}
 */
var MAX_DISTANCE = 400;

/**
 * Represents a car, which player can interact with.
 * @class InteractiveCar
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - Car x coordinate within the world.
 * @param {number} y - Car y coordinate within the world.
 * @param {string} backgroundKey - Car texture key.
 */
var InteractiveCar = function(x, y, backgroundKey) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);

    this.anchor.set(0, 0);

    this.getOnButton = level.game.make.sprite(this.width / 2,
        -this.height, 'openDoor');
    this.getOnButton.anchor.set(0.5);
    this.getOnButton.inputEnabled = true;
    this.getOnButton.input.priorityID = 2;
    this.getOnButton.events.onInputDown.add(this.getOn, this);

    this.addChild(this.getOnButton);

    level.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    this.anchor.set(0.5, 1);
    this.animations.add('left', [0], 10, true);
    this.animations.add('right', [1], 10, true);
    this.occupied = false;
    this.stopLeftFrameIndex = 0;
    this.stopRightFrameIndex = 1;
    this.remainingGas = MAX_DISTANCE;
    this.maxDistance = MAX_DISTANCE;

    this.gasBar = new ResourceBar(-this.width / 2, -this.height - 10,
        {width: 80, height: 8});
    this.addChild(this.gasBar);
};

InteractiveCar.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveCar.prototype.constructor = InteractiveCar;

/**
 * Allows the player to get on the car.
 * @method InteractiveCar.getOn
 */
InteractiveCar.prototype.getOn = function() {
    level.player.onVehicle = true;
    level.player.relocate(this.x, this.y - 100);
    level.player.changeSpeed(DEFAULT_CAR_SPEED, DEFAULT_CAR_MAX_SPEED);
    level.player.changeGravity(CAR_GRAVITY);
    this.occupied = true;
};

/**
 * Allows the player to get off the car.
 * @method InteractiveCar.getOff
 */
InteractiveCar.prototype.getOff = function() {
    this.stop();
    level.player.onVehicle = false;
    level.player.relocate(this.x + 100, this.y - 100);
    level.player.resetSpeed();
    level.player.resetGravity();
    this.occupied = false;
};

/**
 * Updates car current state, animations and traveled distance, to stop it when
 * it has traveled the longest possible distance.
 * @method InteractiveCar.update
 */
InteractiveCar.prototype.update = function() {
    if (this.occupied) {
        this.body.velocity.x = level.player.body.velocity.x;
        if (this.body.velocity.x < 0) {
            this.animations.play('left');
            this.remainingGas --;
        }else if (this.body.velocity.x > 0) {
            this.animations.play('right');
            this.remainingGas --;
        }else if (level.direction > 0) {
            this.frame = this.stopRightFrameIndex;
        }else if (level.direction < 0) {
            this.frame = this.stopLeftFrameIndex;
        }
        if (this.remainingGas <= 0) {
            this.getOff();
        }
        this.gasBar.updateResourceBarLevel(this.remainingGas /
            this.maxDistance);
    }
};

/**
 * Determines whether the car is stopped or not.
 * @method InteractiveCar.isStopped
 * @returns {boolean} - True if car speed = 0, otherwise false.
 */
InteractiveCar.prototype.isStopped = function() {
    return this.body.velocity.x === 0;
};

/**
 * Stops the car, making speed = 0.
 * @method InteractiveCar.stop
 */
InteractiveCar.prototype.stop = function() {
    this.body.velocity.x = 0;
};

module.exports = InteractiveCar;

},{"../util/PopUp":42,"../util/ResourceBar":43}],49:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 29/08/2015.
 */
var Store = require('../items/store/Store');
var Button = require('../util/Button');

/**
 * Represents a House, which player can interact with.
 * @class InteractiveHouse
 * @extends Phaser.Sprite
 * @constructor
 * @param {number} x - House x coordinate within the world.
 * @param {number} y - House y coordinate within the world.
 * @param {string} backgroundKey - House texture key.
 * @param {PopUp} dialog - Dialog to be displayed when player interact with
 * the house.
 */
var InteractiveHouse = function(x, y, backgroundKey, dialog) {
    Phaser.Sprite.call(this, level.game, x, y, backgroundKey);
    this.openDoorButton = new Button ('Get in', this.openActivity, this);
    this.openDoorButton.x = (this.width - this.openDoorButton.width) / 2;
    this.openDoorButton.y = -this.height + 50;

    this.dialog = dialog;
    level.game.add.existing(this.dialog);

    this.addChild(this.openDoorButton);
};

InteractiveHouse.prototype = Object.create(Phaser.Sprite.prototype);
InteractiveHouse.prototype.constructor = InteractiveHouse;

/**
 * Displays this house dialog
 * @method InteractiveHouse.openActivity
 */
InteractiveHouse.prototype.openActivity = function() {
    this.dialog.open();
};

module.exports = InteractiveHouse;

},{"../items/store/Store":22,"../util/Button":34}],50:[function(require,module,exports){
/**
 * Created by Edwin Gamboa on 25/10/2015.
 */

/**
 * Represents a board for streets and city places names.
 * @class NameBoard
 * @extends Phaser.Sprite
 * @param {number} x - Board x coordinate within the world.
 * @param {number} y - Board y coordinate within the world.
 * @param {string} name - Text to be showed on the Board.
 * @constructor
 */
var NameBoard = function(x, y, name) {
    Phaser.Sprite.call(this, level.game, x, y, 'nameBoard');
    this.anchor.set(0.5, 1);

    this.message = level.game.make.text(0, -this.height + 10, name);
    this.message.font = 'Arial';
    this.message.fontSize = 16;
    this.message.fill = '#FFFFFF';
    this.message.anchor.set(0.5, 0);

    this.addChild(this.message);
};

NameBoard.prototype = Object.create(Phaser.Sprite.prototype);
NameBoard.prototype.constructor = NameBoard;

module.exports = NameBoard;

},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50]);
