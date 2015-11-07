function getId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function(c) {
		var now = Date.now();
        var r = (now + Math.random() * 16) % 16 | 0;
        now = Math.floor(now / 16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      }
    );
}

function cookies() {
  return function(req, res, next) {
    if (req.cookies.id === undefined) {
      res.cookie('id', getId(), {});
      next();
    } else {
      req.db.get(
        "select * from sessions join users on users.id = sessions.user_id where sessions.id='" 
        + req.cookies.id + "'",
        function(err, row) {
          if (!err && row) {
            req.user = row;
          }

          next();
        }
      );
    }
  }
}

module.exports = cookies;
