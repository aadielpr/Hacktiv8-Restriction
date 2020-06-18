import fs from 'fs'
import readline, { ReadLine } from 'readline'
import callsite, { CallSite } from 'callsite'
import path from 'path'
console.log([1].concat([2, 3]))

class Restriction {
  rl: ReadLine
  stack: CallSite[]
  functionCalledPath: string
  streamPath: string
  private _rules: string

  constructor(filepath: string) {
    this.stack = callsite()
    this.functionCalledPath = path.dirname(this.stack[1].getFileName())
    this.streamPath = this.functionCalledPath + '/' + filepath
    this._rules = `(.reduce\\()|(.map\\()|(.filter\\()|(.indexOf\\()|(.toLocaleString\\()|(.lastIndexOf\\()|(.reverse\\()|(.reduceRight\\()|(.includes\\()|(.flat\\()|(.flatMap\\()|(.find\\()|(.findIndex\\()|(.fill\\()|(.every\\()|(.copyWithin\\()|(.entries\\()|(.of\\()|(new Set\\()`
    this.rl = this.initReadline()
  }

  set rules(newRules: string[]) {
    let arrayOfNewRules = newRules.map(el => '(.' + el + '\\' + '()')
    let splitedRules = this._rules.split('|')
    this._rules = splitedRules.concat(arrayOfNewRules).join('|')
  }

  get rules() {
    return this._rules.split('|')
  }

  private initReadline() {
    return readline.createInterface({
      input: fs.createReadStream(this.streamPath)
    })
  }

  public readCode(): Promise<string | null> {
    return new Promise(resolve => {
      let lineNumber = 1
      let result: null | string = null
      let pattern = new RegExp(this._rules, 'g')
      this.rl
        .on('line', input => {
          if (pattern.test(input)) {
            result = `${input.trim()}: ${lineNumber}`
            this.rl.close()
            this.rl.removeAllListeners()
          }
          lineNumber += 1
        })
        .on('close', () => resolve(result))
    })
  }
}

export = Restriction
