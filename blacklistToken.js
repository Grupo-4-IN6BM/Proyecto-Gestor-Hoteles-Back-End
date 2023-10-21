const blacklist = new Set();

function blacklistToken(token) {
  blacklist.add(token);
}

function isTokenBlacklisted(token) {
  return blacklist.has(token);
}

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
};
