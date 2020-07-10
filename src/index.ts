import fs from 'fs'
import readline, { ReadLine } from 'readline'
import callsite, { CallSite } from 'callsite'
import path from 'path'

class Restriction {
  rl: ReadLine
  stack: CallSite[]
  functionCalledPath: string
  streamPath: string
  _rules: string

  constructor(filepath: string) {
    this.stack = callsite()
    this.functionCalledPath = path.dirname(this.stack[1].getFileName())
    this.streamPath = this.functionCalledPath + '/' + filepath
    this._rules = `(\\.reduce\\()|(\\.map\\()|(\\.filter\\()|(\\.indexOf\\()|(\\.toLocaleString\\()|(\\.lastIndexOf\\()|(\\.reverse\\()|(\\.reduceRight\\()|(\\.includes\\()|(\\.flat\\()|(\\.flatMap\\()|(\\.find\\()|(\\.findIndex\\()|(\\.fill\\()|(\\.every\\()|(\\.copyWithin\\()|(\\.entries\\()|(\\bof\\b)|(new Set\\()`
    this.rl = this.initReadline()
  }

  set rules(newRules: string[]) {
    let mappingRules = newRules.map(el => {
      if (!this.checkNewRules(el)) {
        throw new Error(`${el} is not an array constructor function`)
      }
      return '(.' + el + '\\' + '()'
    })
    let currentRules = this._rules.split('|')
    this._rules = currentRules.concat(mappingRules).join('|')
  }

  get rules(): string[] {
    return this._rules.split('|')
  }

  private initReadline(): ReadLine {
    return readline.createInterface({
      input: fs.createReadStream(this.streamPath)
    })
  }

  private checkNewRules(rules: any): boolean {
    if (Array.prototype[rules]) {
      return true
    }
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

