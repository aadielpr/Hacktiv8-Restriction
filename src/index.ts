import fs from 'fs'
import readline, { ReadLine } from 'readline'
import callsite, { CallSite } from 'callsite'
import path from 'path'

class Restriction {
  rl: ReadLine
  stack: CallSite[]
  functionCalledPath: string
  streamPath: string
  private _rules: string[]

  constructor(filepath: string) {
    this.stack = callsite()
    this.functionCalledPath = path.dirname(this.stack[1].getFileName())
    this.streamPath = this.functionCalledPath + '/' + filepath
    this._rules = Object.getOwnPropertyNames(Array.prototype).filter(
      el =>
        ![
          'push',
          'shift',
          'unshift',
          'pop',
          'splice',
          'slice',
          'split'
        ].includes(el)
    )
    this.rl = this.initReadline()
  }

  set rules(newRules: string[]) {
    const isRule = this.checkNewRules(newRules)
    if (isRule) {
      throw new Error(`${isRule} is not javascript method`)
    }
    this._rules.concat(newRules)
  }

  get rules(): string[] {
    return this._rules
  }

  set popRules(oldRules: string[]) {
    let mappingRules = oldRules.map(el => '(\\.' + el + '\\' + '()')
    let currentRules = this._rules.split('|')
    this._rules = currentRules
      .filter(el => !mappingRules.includes(el))
      .join('|')
  }

  private initReadline(): ReadLine {
    return readline.createInterface({
      input: fs.createReadStream(this.streamPath)
    })
  }

  private checkNewRules(rules: any[]): boolean {
    rules.forEach(el => {
      if (Array.prototype[el] || String.prototype[el]) {
        return el
      }
    })
    return false
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
// console.log(Object.getOwnPropertyNames(Math))
