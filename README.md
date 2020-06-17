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

<p>Hacktiv8 Restriction is a library for checking restriction rules in hacktiv8 students code</p>

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
const checkRestriction = require('hacktiv8-restriction')
// checking index.js script for restriction rules

// promise
checkRestriction('index.js').then(result => console.log(result)) // arrayOfNumbers.map(el => el * 2) : 3

// async / await
async function checkStudentRestriction() {
  const result = await checkRestriction('index.js')
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
checkRestriction('../js/index.js').then(result => console.log(result)) // arrayOfNumbers.map(el => el * 2) : 3
```

It will return null (if it didntt found) or string (line of code and line number) value

This package will detect all of following function below:

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
