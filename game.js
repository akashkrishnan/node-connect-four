module.exports = Game;

function Game(Board, P1, P2) {
  this.Board = Board;
  this.players = [P1, P2];
  this.started = false;
}

Game.prototype.start = function (done) {
  if (this.started) done();
  else {
    var Game = this;
    Game.started = Game;
    (function nextPlayer() {
      var cp = Game.Board.currentPlayer;
      if (cp) {
        done(Game.Board);
        Game.players[cp - 1].getMove(Game.Board.clone(), function (move, done) {
          if (cp == Game.Board.currentPlayer) {
            Game.Board.makeMove(move, function (err) {
              done(err, Game.Board.clone());
              if (!err) setTimeout(nextPlayer, 0);
            });
          } else done(new Error('Invalid move. Not your turn.'), Game.Board.clone());
        });
      } else done();
    })();
  }
};
