var BOUNCE = 0.7 + Math.random() * 0.2;

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

Item.prototype.setDescription = function(description) {
    this.description = description;
};

Item.prototype.setName = function(name) {
    this.name = name;
};

module.exports = Item;
