import Restriction from './src/index'

const checkRestriction = new Restriction('src/index.ts')
console.log(checkRestriction.rules)
checkRestriction.rules = ['concat', 'splice', 'opop']
console.log(checkRestriction.rules)

checkRestriction.readCode().then(result => console.log(result))
