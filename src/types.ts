export type BankStatement = {
  Document: Document
}

export type Document = {
  $: {
    'xmlns': string
    'xmlns:xsi': string
    'xsi:schemaLocation': string
  }
  BkToCstmrStmt: {
    GrpHdr: {
      MsgId: string[]
      CreDtTm: string[]
      MsgRcpt: {
        Id: {
          OrgId: {
            Othr: {
              Id: string[]
              SchmeNm: {
                Cd: string[]
              }[]
            }[]
          }[]
        }[]
      }[]
    }[]
    Stmt: {
      Id: string[]
      ElctrncSeqNb: string[]
      LglSeqNb: string[]
      CreDtTm: string[]
      FrToDt: {
        FrDtTm: string[]
        ToDtTm: string[]
      }[]
      Acct: {
        Id: {
          Othr: {
            Id: string[]
            SchmeNm: {
              Cd: string[]
            }[]
          }[]
        }[]
        Ccy: string[]
        Ownr: {
          Nm: string[]
          Id: {
            OrgId: {
              Othr: {
                Id: string[]
                SchmeNm: {
                  Cd: string[]
                }[]
              }[]
            }[]
          }[]
        }[]
      }[]
      Svcr: {
        FinInstnId: {
          BIC: string[]
        }[]
      }[]
      Bal: {
        Tp: {
          CdOrPrtry: {
            Cd: string[]
          }[]
        }[]
        Amt: {
          _: string
          $: {
            Ccy: string
          }
        }[]
        CdtDbtInd: string[]
        Dt: {
          Dt: string[]
        }[]
      }[]
      TxsSummry: {
        TtlCdtNtries: {
          NbOfNtries: string[]
          Sum: string[]
        }[]
        TtlDbtNtries: {
          NbOfNtries: string[]
          Sum: string[]
        }[]
      }[]
      Ntry: Entry[]
    }[]
  }[]
}

export type Entry = {
  NtryRef: string[]
  Amt: {
    _: string
    $: {
      Ccy: string
    }
  }[]
  CdtDbtInd: string[]
  Sts: string[]
  BookgDt: {
    Dt: {
      _: string[]
    }[]
  }[]
  ValDt: {
    Dt: {
      _: string[]
    }[]
  }[]
  AcctSvcrRef: string[]
  BkTxCd: {
    Domn: {
      Cd: string[]
      Fmly: {
        Cd: string[]
        SubFmlyCd: string[]
      }[]
    }[]
    Prtry: {
      Cd: string[]
      Issr: string[]
    }[]
  }[]
  NtryDtls: {
    TxDtls: {
      Refs: {
        AcctSvcrRef: string[]
        PmtInfId: string[]
      }[]
      AmtDtls: {
        TxAmt: {
          Amt: {
            _: string
            $: {
              Ccy: string
            }
          }[]
        }[]
      }[]
      RmtInf?: {
        Ustrd: string[]
      }[]
      RltdPties: {
        Dbtr: {
          Nm: string[]
        }[]
        Cdtr?: {
          Nm: string[]
        }[]
        CdtrAcct?: {
          Id: {
            Othr: {
              Id: string[]
            }[]
          }[]
        }[]
        CdtrRefInf?: {
          Tp: {
            CdOrPrtry: {
              Cd: string[]
            }[]
          }[]
          Ref: string[]
        }[]
      }[]
    }[]
  }[]
  RltdAgts: {
    DbtrAgt: {
      FinInstnId: {
        BIC: string[]
      }[]
    }[]
    CdtrAgt?: {
      FinInstnId: {
        BIC: string[]
      }[]
    }[]
  }[]
  RmtInf?: {
    Strd: {
      RfrdDocInf: {
        Tp: {
          CdOrPrtry: {
            Cd: string[]
          }[]
        }[]
        Nb: string[]
      }[]
      RfrdDocAmt: {
        RmtdAmt: {
          _: string
          $: {
            Ccy: string
          }
        }[]
      }[]
    }[]
  }[]
}

export type Account = {
  accountNumber?: string | null
  currency?: string | null
  ownerName?: string | null
  balance?: Balance | null
}

export type Balance = {
  amount?: string | null
  currency?: string | null
  date?: string | null
}

export type validFileTypes = 'json' | 'xml'
