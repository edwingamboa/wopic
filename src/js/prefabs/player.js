/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Character = require('../prefabs/character');

var Player;
Player = function(level, startingScore) {
    Character.call(this, level, 32, level.game.world.height - 150,
        'character', 250, 500, 100, 0.2, 300);
    this.animations.add('left', [0, 1, 2, 3], 10, true);
    this.animations.add('right', [5, 6, 7, 8], 10, true);
    this.score = startingScore;
};

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

Player.prototype.jump = function() {
    this.body.velocity.y = -350;
};

Player.prototype.crouch = function() {
    this.animations.stop();
    this.frame = 9;
};

Player.prototype.increaseScore = function(increase) {
    this.score += increase;
};

Player.prototype.decreaseScore = function(decrease) {
    this.score += decrease;
};

module.exports = Player;
