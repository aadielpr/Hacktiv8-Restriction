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
          'split',
          'concat'
        ].includes(el)
    )

    this.rl = this.initReadline()
  }

  set rules(newRules: string[]) {
    this.checkNewRules(newRules)
    this._rules = this._rules.concat(newRules)
  }

  get rules(): string[] {
    return this._rules
  }

  set popRules(oldRules: string[]) {
    this._rules = this._rules.filter(el => !oldRules.includes(el))
  }

  private initReadline(): ReadLine {
    return readline.createInterface({
      input: fs.createReadStream(this.streamPath)
    })
  }

  private checkNewRules(rules: any[]): void {
    const mathMethods = Object.getOwnPropertyNames(Math)
    rules.forEach(el => {
      if (
        !Array.prototype[el] &&
        !String.prototype[el] &&
        mathMethods.indexOf(el) === -1
      ) {
        throw new Error(`${el} is not javascript method`)
      }
    })
    const alreadyHas = this._rules.find(el => rules.includes(el))
    if (alreadyHas) {
      throw new Error(`${alreadyHas} already available in rules`)
    }
  }

  private rulesToRegexFormat(): string {
    const regexFormat = this._rules.map(el => '(\\.' + el + '\\' + '()')
    regexFormat.push('(new Set\\()')
    return regexFormat.join('|')
  }

  public readCode(): Promise<string | null> {
    return new Promise(resolve => {
      let lineNumber = 1
      let result: null | string = null
      let rulesRegexFormat = this.rulesToRegexFormat()
      let pattern = new RegExp(rulesRegexFormat, 'g')
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
