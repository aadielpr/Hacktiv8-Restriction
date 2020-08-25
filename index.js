const Restriction = require('./dist/index.js')

const checkRestriction = new Restriction('index.js')

checkRestriction.rules = ['push']
console.log(checkRestriction.rules)
checkRestriction.popRules = ['reverse']
console.log(checkRestriction.rules)
