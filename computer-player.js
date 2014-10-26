module.exports = ComputerPlayer;

var ss = 0;

function ComputerPlayer(depth) {
  this.depth = depth;
}

ComputerPlayer.prototype.getMove = function (Board, done) {
  alphaBetaSearch(Board, this.depth, function (err, move) {
    if (err) console.log(err);
    else {
      done(move, function (err, Board) {
        if (err) console.log(err);
      });
    }
  });
};

function alphaBetaSearch(Board, d, done) {
  var v = -Infinity;
  var moves = Board.getValidMoves();
  var m = moves[0];
  (function nextMove(i) {
    if (i < moves.length) {
      Board.makeMove(moves[i], function (err) {
        if (err) done(err);
        else {
          nextTurn(Board, d - 1, -Infinity, Infinity, function (err, nv) {
            if (err) done(err);
            else {
              Board.undoMove(function (err) {
                if (err) done(err);
                else {
                  if (-nv > v) {
                    v = -nv;
                    m = moves[i];
                  }
                  if (++ss % 1000 == 0) {
                    setTimeout(function () {
                      nextMove(++i);
                    }, 0);
                  } else nextMove(++i);
                }
              });
            }
          });
        }
      });
    } else done(null, m);
  })(0);
}

function nextTurn(Board, d, a, b, done) {
  if (Board.currentPlayer && d > 0) {
    var v = -Infinity;
    var moves = Board.getValidMoves();
    (function nextMove(i) {
      if (i < moves.length) {
        Board.makeMove(moves[i], function (err) {
          if (err) done(err);
          else {
            nextTurn(Board, d - 1, -b, -a, function (err, nv) {
              if (err) done(err);
              else {
                Board.undoMove(function (err) {
                  if (err) done(err);
                  else {
                    v = Math.max(v, -nv);
                    a = Math.max(a, v);
                    if (v >= b) done(null, v);
                    else {
                      if (++ss % 1000 == 0) {
                        setTimeout(function () {
                          nextMove(++i);
                        }, 0);
                      } else nextMove(++i);
                    }
                  }
                });
              }
            });
          }
        });
      } else done(null, v);
    })(0);
  } else done(null, Board.score());
}
