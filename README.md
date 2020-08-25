<div align="center">
<h1>Hacktiv8 Restriction</h1>

<a href="https://hacktiv8.com/">
  <img
    height="80"
    width="80"
    alt="hacktiv8"
    src="https://i2.wp.com/d3g5ywftkpzr0e.cloudfront.net/wp-content/uploads/2020/01/16161919/hacktiv8.png?fit=300%2C300&ssl=1"
  />
</a>

<p>Hacktiv8 Restriction is a library for checking restriction rules in hacktiv8 student's code</p>

[Visit Us](https://hacktiv8.com/)

<br />
</div>

## Installation:

```bash
$ npm install hacktiv8-restriction
```

## Usage:

index.js

```js
function myFunction() {
  let arrayOfNumbers = [1, 2, 3, 4, 5]
  return arrayOfNumbers.map(el => el * 2) // line number 3
}
```

checkRestriction.js

```js
const Restriction = require('hacktiv8-restriction')
// checking index.js script for restriction rules
// init
const checkRestriction = new Restriction('index.js')

// promise
checkRestriction.readCode().then(result => console.log(result)) // arrayOfNumbers.map(el => el * 2) : 3

// async / await
async function checkStudentRestriction() {
  const result = await checkRestriction.readCode()
  return result // arrayOfNumbers.map(el => el * 2) : 3
}
```

js/index.js

```js
function myFunction() {
  let arrayOfNumbers = [1, 2, 3, 4, 5]
  return arrayOfNumbers.map(el => el * 2) // line number 3
}
```

src/checkRestriction.js

```js
const checkRestriction = new Restriction('../js/index.js')

checkRestriction.readCode().then(result => console.log(result)) // arrayOfNumbers.map(el => el * 2) : 3
```

It will return null (if it didn't found) or string (line of code and line number) value

This package will detect all of following function below (default):

```js
  .map()
  .reduce()
  .filter()
  .indexOf()
  .toLocaleString()
  .lastIndexOf()
  .reverse()
  .reduceRight()
  .includes()
  .flat()
  .flatMap()
  .find()
  .findIndex()
  .fill()
  .every()
  .copyWithin()
  .entries()
  .of()
  new Set()

```

You can add new syntax to the restriction rules:

```js
checkRestriction.rules = ['concat', 'split', 'ceil', 'min'] // now package will check the concat and split syntax too

checkRestriction.readCode().then(result => console.log(result))
```

To remove your syntax from restriction rules:

```js
checkRestriction.popRules = ['map', 'filter'] // now package will check the concat and split syntax too

checkRestriction.readCode().then(result => console.log(result))
```
